# 01-SCOPE — IT Incident Triage System

Tài liệu xác định ranh giới phạm vi triển khai của hệ thống, phân định rõ phần cốt lõi cần làm (In-Scope) và phần chủ động cắt giảm (Out-of-Scope) để đảm bảo chiều sâu kỹ thuật mà không bị dàn trải.

---

## I. MỤC TIÊU CỐT LÕI
Xây dựng hệ thống quản lý và định tuyến sự cố IT thông minh, kết hợp giữa tính tin cậy của **Kỹ thuật phần mềm (SE: Queue, State Machine, Fault Tolerance)** và năng lực tự động hóa của **AI Engineering (Deterministic Triage, Grounded RAG, Self-Service Deflection)**.

---

## II. IN-SCOPE (PHẠM VI THỰC HIỆN)

### 1. Quản lý truy cập & Định danh (Authentication & RBAC)
* Cấp quyền hạn và không gian làm việc theo 3 vai trò: `END_USER`, `IT_SUPPORT`, `ADMIN`.
* Xác thực chuẩn JWT.

### 2. Vòng đời sự cố ITIL (Incident Lifecycle & State Machine)
* Quản lý nghiêm ngặt các chuyển trạng thái: `PENDING_TRIAGE` $\rightarrow$ `AI_SUGGESTED` / `MANUAL_TRIAGE_REQUIRED` $\rightarrow$ `TRIAGED` $\rightarrow$ `IN_PROGRESS` $\rightarrow$ `RESOLVED` $\rightarrow$ `CLOSED`.
* Lưu vết lịch sử thay đổi (Audit Logging & Timeline).

### 3. Hệ thống Hàng đợi & Khả năng chịu lỗi (Queue & Fault Tolerance)
* Xử lý bất đồng bộ qua Background Queue Worker, đảm bảo thời gian phản hồi API nhận ticket $< 200\text{ms}$.
* Cơ chế tự động thử lại (Retry with Exponential Backoff tối đa 3 lần) khi AI service timeout/lỗi.
* Dead-Letter Queue (DLQ) tự động chuyển ticket sang trạng thái xử lý thủ công (`MANUAL_TRIAGE_REQUIRED`) khi quá số lần thử.

### 4. Deterministic AI & Ma trận Ưu tiên ITIL
* AI trích xuất cấu trúc ngữ nghĩa (Category, Impact, Urgency, Missing Info) với Schema kiểm soát chặt chẽ (Pydantic).
* Rule Engine backend đối chiếu ma trận ITIL 3×3 cứng để quyết định mức ưu tiên P1–P4 (không để AI tự ý suy diễn mức độ khẩn cấp).

### 5. Kiểm soát con người (Human-in-the-Loop - HITL)
* Cho phép Kỹ thuật viên 1-click chấp thuận hoặc ghi đè (Override) phân loại của AI kèm lý do bắt buộc.
* Ghi nhận cờ `is_human_override` để đo lường độ chính xác và phục vụ tinh chỉnh hệ thống.

### 6. Grounded RAG & Self-Service Deflection
* **AI Deflection (Cho End-user):** Gợi ý cách tự khắc phục nhanh từ Runbook/FAQ ngay khi đang gõ mô tả để giảm tải ticket phát sinh.
* **Grounded RAG (Cho IT Support):** Truy xuất Top 3 sự cố tương tự trong quá khứ và tài liệu Runbook chuẩn có trích dẫn nguồn khi xem chi tiết ticket.

### 7. Quản lý cam kết dịch vụ (SLA) & Observability Dashboard
* Tính toán deadline và đếm ngược SLA theo mức P1–P4; cảnh báo trực quan nguy cơ trễ hạn.
* Dashboard giám sát: Thống kê số lượng theo P1–P4, tỷ lệ Deflection thành công, tỷ lệ Human Override theo danh mục, MTTR.

---

## III. OUT-OF-SCOPE (NẰM NGOÀI PHẠM VI)

* **Không xây dựng Chatbot đối thoại mở đa lượt:** Tránh nguy cơ ảo giác (hallucination) và mất kiểm soát kịch bản hội thoại.
* **Không tích hợp SSO/LDAP thực tế:** Sử dụng JWT và bộ dữ liệu seed mẫu nội bộ để tập trung 100% vào logic lõi.
* **Không tích hợp tổng đài gọi thoại / SMS Gateway:** Cảnh báo P1 chỉ kích hoạt hiển thị trực quan nổi bật trên UI hệ thống.
* **Không hỗ trợ kiến trúc Multi-Tenant phức tạp:** Tập trung tối ưu cho quy mô vận hành của một tổ chức/doanh nghiệp.
