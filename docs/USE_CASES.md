# Actors, Roles & Use Cases — IT Incident Triage System
**Design status:** TARGET V1 (Core MVP)

---

### Actors / Roles

| Role | Display name in UI | Mô tả quyền hạn cốt lõi |
| :--- | :--- | :--- |
| **ADMIN** | Administrator | Toàn quyền cấu hình hệ thống, quản lý người dùng và giám sát toàn bộ sự cố. |
| **IT_SUPPORT** | IT Support Specialist | Xem toàn bộ ticket, duyệt/ghi đè kết quả phân loại của AI và thực hiện xử lý sự cố. |
| **END_USER** | Employee / End-user | Tạo ticket báo cáo sự cố và chỉ xem/theo dõi các ticket do chính mình tạo. |
| **SYSTEM** | Background Worker | Tác nhân hệ thống ngầm: Xử lý queue, gọi AI NLP/LLM, chạy Rule Engine và retry lỗi. |

---

### Use Cases Matrix (Phân quyền Use Case theo Role)

| Use Case ID | Use Case Name | ADMIN | IT_SUPPORT | END_USER | SYSTEM |
| :--- | :--- | :---: | :---: | :---: | :---: |
| **UC01** | Đăng nhập hệ thống | ✅ | ✅ | ✅ | ❌ |
| **UC02** | Tạo ticket báo cáo sự cố | ✅ | ✅ | ✅ | ❌ |
| **UC03** | Xem & lọc danh sách ticket | ✅ (Tất cả) | ✅ (Tất cả) | ✅ (Chỉ của mình) | ❌ |
| **UC04** | Tự động phân loại danh mục qua AI | ❌ | ❌ | ❌ | ✅ |
| **UC05** | Đề xuất mức ưu tiên theo ma trận quy tắc | ❌ | ❌ | ❌ | ✅ |
| **UC06** | Duyệt hoặc ghi đè kết quả AI (HITL) | ✅ | ✅ | ❌ | ❌ |
| **UC07** | Phục hồi & dự phòng lỗi AI Worker | ❌ | ❌ | ❌ | ✅ |

---

### Business Rules: Ma trận Priority 3 × 3 (Impact × Urgency)

| Impact \ Urgency | HIGH | MEDIUM | LOW |
| :--- | :---: | :---: | :---: |
| **HIGH** | **P1 (Critical)** | **P2 (High)** | **P3 (Medium)** |
| **MEDIUM** | **P2 (High)** | **P3 (Medium)** | **P4 (Low)** |
| **LOW** | **P3 (Medium)** | **P4 (Low)** | **P4 (Low)** |

* **Trạng thái vòng đời ticket:** `PENDING_TRIAGE` → `AI_SUGGESTED` → `TRIAGED` (hoặc `MANUAL_TRIAGE_REQUIRED` nếu lỗi).
* **Tách biệt trường dữ liệu:**
  * Đề xuất của AI: `ai_category`, `ai_confidence_score`, `ai_suggested_priority`
  * Quyết định chính thức: `final_category`, `final_priority`, `is_human_override`, `override_reason`

---

### Use Case Specifications (Đặc tả ngắn gọn)

#### UC01: Đăng nhập hệ thống
* **Tác nhân:** ADMIN, IT_SUPPORT, END_USER
* **Luồng chính:** Người dùng nhập email/mật khẩu → Hệ thống xác thực → Cấp JWT token kèm Role tương ứng → Điều hướng theo vai trò (ADMIN/IT_SUPPORT vào Ticket Workbench, END_USER vào My Tickets).
* **Ngoại lệ:** Sai thông tin trả về 401; sai quá 5 lần khóa tạm 15 phút.

#### UC02: Tạo ticket sự cố
* **Tác nhân:** END_USER (hoặc ADMIN, IT_SUPPORT tạo hộ)
* **Luồng chính:** Nhập tiêu đề, mô tả → Validate dữ liệu → Lưu DB PostgreSQL (`status = PENDING_TRIAGE`) → Enqueue task nền vào Queue → Trả về mã định danh `INC-xxxx`.
* **Ngoại lệ:** Thiếu thông tin báo lỗi 422; nếu queue lỗi có worker định kỳ quét ticket kẹt `PENDING_TRIAGE` để re-enqueue an toàn.

#### UC03: Xem & lọc danh sách ticket
* **Tác nhân:** ADMIN, IT_SUPPORT, END_USER
* **Luồng chính:** Client gửi request kèm tham số lọc/phân trang → Áp dụng scope (END_USER chỉ xem ticket của mình; ADMIN/IT_SUPPORT xem tất cả) → Sắp xếp ưu tiên `P1` → `P4` và thời gian tạo mới nhất (`created_at DESC`).
* **Ngoại lệ:** Không tìm thấy bản ghi nào trả về mảng rỗng `[]`.

#### UC04: Tự động phân loại danh mục qua AI
* **Tác nhân:** SYSTEM (AI Background Worker)
* **Luồng chính:** Worker lấy task từ queue → Gọi AI phân tích tiêu đề & mô tả → Xác định danh mục (`Hardware`, `Network`, `Software`...) kèm `confidence_score` (0.0–1.0) → Chuyển sang UC05.
* **Ngoại lệ:** Gặp lỗi mạng hoặc timeout khi gọi AI → Kích hoạt retry tại UC07.

#### UC05: Đề xuất mức ưu tiên theo ma trận quy tắc
* **Tác nhân:** SYSTEM (AI Worker + Priority Rule Engine)
* **Luồng chính:** Worker gọi AI bóc tách `Impact` & `Urgency` (HIGH/MEDIUM/LOW) → Rule Engine backend tra ma trận 3×3 tính ra `ai_suggested_priority` (P1–P4) → Lưu DB, đổi trạng thái sang `AI_SUGGESTED` (chưa phải final).
* **Ngoại lệ:** Nếu ra P1, gắn cờ cảnh báo khẩn cấp `is_critical = true`.

#### UC06: Duyệt hoặc ghi đè kết quả AI (HITL)
* **Tác nhân:** IT_SUPPORT, ADMIN
* **Kịch bản A (Chấp thuận):** Support xem đề xuất AI → Nhấn "Chấp nhận" → Hệ thống chốt `final_priority = ai_suggested_priority`, `status = TRIAGED`, `is_human_override = false`.
* **Kịch bản B (Ghi đè):** Support chọn lại mức ưu tiên khác → Bắt buộc nhập lý do → Hệ thống cập nhật `final_priority` mới, `status = TRIAGED`, `is_human_override = true`, lưu `override_reason`.

#### UC07: Phục hồi & dự phòng lỗi AI Worker
* **Tác nhân:** SYSTEM (Worker / Queue), IT_SUPPORT
* **Chính sách:** Thử tối đa 3 lần (lần đầu + 2 lần retry có Exponential Backoff 2s, 6s); chỉ retry lỗi mạng/timeout/429/504; không retry lỗi dữ liệu sai.
* **Luồng chính (Tự phục hồi):** Lần 1 lỗi → Chờ backoff → Thử lại lần 2 thành công → Tiếp tục luồng bình thường.
* **Ngoại lệ (Quá 3 lần thử):** Chuyển task vào Dead-Letter Queue (DLQ) → Đổi ticket sang `MANUAL_TRIAGE_REQUIRED` với `final_priority = UNASSIGNED` → Hiển thị cảnh báo để IT Support xử lý thủ công.
