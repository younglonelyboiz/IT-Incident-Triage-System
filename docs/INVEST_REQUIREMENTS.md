# INVEST Requirements — IT Incident Triage System
**Trạng thái thiết kế:** TARGET V1 (Tinh gọn cho Project cá nhân 2–3 tuần)

---

### Bảng kiểm tra tiêu chuẩn INVEST

| Nguyên tắc | Áp dụng trong Backlog này |
| :--- | :--- |
| **Independent** | Mỗi story tạo ra kết quả chạy độc lập, kiểm thử được ngay mà không phụ thuộc chéo. |
| **Negotiable** | Giao diện và công nghệ linh hoạt (FastAPI/Express, SQLite/Postgres), tập trung giữ đúng logic lõi. |
| **Valuable** | Thể hiện rõ nét kỹ năng **Backend Engineering (Queue, State Machine)** kết hợp **AI Engineering (NLP/LLM, Human-in-the-loop)**. |
| **Estimable** | Phạm vi cực kỳ rõ ràng, mỗi story tốn từ 1–2 ngày công làm việc. |
| **Small** | Chỉ gồm **7 stories cốt lõi** cho MVP, vừa vặn hoàn thành trong 2 tuần. |
| **Testable** | Tiêu chí nghiệm thu (Acceptance Criteria) viết theo điều kiện kỹ thuật đo lường được. |

---

### Giai đoạn 1: Core MVP (7 Stories — Hoàn thành trong 2 tuần)
*Mục tiêu: Đạt được một hệ sinh thái hoàn chỉnh khép kín: Tạo ticket → Đẩy Queue → AI Triage nền → Gợi ý P1-P4 → Kỹ thuật viên xem danh sách & duyệt/ghi đè → Xử lý lỗi retry.*

| ID | User story | Giá trị mang lại | Phụ thuộc | Tiêu chí nghiệm thu (Acceptance Criteria) |
| :--- | :--- | :--- | :--- | :--- |
| **US01** | Là người dùng, tôi muốn đăng nhập để truy cập an toàn vào hệ thống. | Xác thực & phân quyền | DB User | **AC-UC01:** Cấp JWT token; phân quyền 2 role cơ bản: `User` (chỉ tạo/xem ticket của mình) và `Support` (xem/xử lý toàn bộ). |
| **US02** | Là End-user, tôi muốn tạo ticket sự cố (tiêu đề, mô tả) để báo cáo lỗi lên hệ thống. | Tiếp nhận sự cố | US01 | **AC-UC02:** Validate bắt buộc tiêu đề/mô tả; sinh mã `INC-xxxx`; lưu trạng thái `PENDING_TRIAGE`; đẩy task vào background queue. |
| **US03** | Là IT Support, tôi muốn xem danh sách ticket có lọc theo trạng thái và mức ưu tiên để quản lý công việc. | Tối ưu công việc | US01, US02 | **AC-UC03:** Phân trang danh sách; lọc theo trạng thái (`PENDING_TRIAGE`, `TRIAGED`, `RESOLVED`) và độ ưu tiên (`P1`–`P4`). |
| **US04** | Là hệ thống, tôi muốn worker nền tự động phân loại danh mục sự cố bằng AI để phân luồng tự động. | AI Triage nền | US02 | **AC-UC04:** Background worker nhận job từ queue; phân loại ra danh mục (Hardware, Network, Software...); lưu kết quả và confidence score. |
| **US05** | Là hệ thống, tôi muốn AI trích xuất Impact/Urgency để backend tính ra độ ưu tiên P1–P4 theo ma trận ITIL. | Định mức ưu tiên khách quan | US02 | **AC-UC05:** AI bóc tách Impact & Urgency; Backend Rule map ra P1–P4; tự động gắn cờ cảnh báo nổi bật nếu là P1. |
| **US06** | Là IT Support, tôi muốn duyệt kết quả của AI hoặc tự sửa lại mức ưu tiên (kèm lý do) để con người giữ quyền quyết định. | Kiểm soát con người (HITL) | US04, US05 | **AC-UC06:** 1-click chấp thuận đề xuất AI; cho phép chọn lại P1–P4 kèm nhập lý do; lưu cờ `is_human_override = true` vào DB. |
| **US07** | Là Backend Service, tôi muốn tự động retry 3 lần khi AI lỗi và chuyển sang trạng thái thủ công nếu quá số lần để không mất ticket. | Chống lỗi hệ thống (Resilience) | US02, US04 | **AC-UC07:** Thử lại tối đa 3 lần kèm backoff khi LLM timeout/lỗi; nếu hỏng hoàn toàn chuyển sang `MANUAL_TRIAGE_REQUIRED`, gán `Priority: UNASSIGNED`. |

---

### Giai đoạn 2: V2 (Mở rộng sau khi xong Core MVP — Tuần 3+)
*Bổ sung các tính năng nâng cấp trải nghiệm quản lý và vận hành:*

| ID | User story | Giá trị mang lại | Phụ thuộc | Tiêu chí nghiệm thu (Acceptance Criteria) |
| :--- | :--- | :--- | :--- | :--- |
| **US08** | Là IT Support, tôi muốn cập nhật trạng thái vòng đời ticket (`TRIAGED` → `IN_PROGRESS` → `RESOLVED`) kèm giải pháp. | Minh bạch tiến độ | US03, US06 | **AC-UC08:** Chặn chuyển trạng thái sai quy tắc; bắt buộc nhập tóm tắt giải pháp khi Resolve. |
| **US09** | Là IT Support, tôi muốn tìm kiếm ticket theo từ khóa (tiêu đề, mã ticket) để tra cứu nhanh. | Tra cứu nhanh | US03 | **AC-UC09:** Tìm kiếm nhanh theo mã hoặc tiêu đề; trả kết quả dưới 300ms. |
| **US10** | Là IT Support, tôi muốn AI chỉ ra thông tin còn thiếu (log, mã lỗi) và tạo sẵn mẫu tin nhắn hỏi người dùng. | Giảm trễ trao đổi | US04 | **AC-UC10:** Đánh giá độ đầy đủ; cảnh báo thiếu chi tiết kỹ thuật; gợi ý sẵn 1 đoạn chat hỏi lại. |
| **US11** | Là IT Support, tôi muốn xem dòng thời gian (timeline) và audit log để biết ai đã sửa đổi gì trên ticket. | Lịch sử & kiểm toán | US06, US08 | **AC-UC11:** Hiển thị tuần tự các mốc: Người tạo → AI phân loại → Kỹ thuật viên duyệt/ghi đè → Giải quyết. |
| **US12** | Là IT Manager, tôi muốn tính thời hạn phản hồi/xử lý (SLA) theo mức P1–P4 và đồng hồ đếm ngược. | Kiểm soát cam kết SLA | US05, US06 | **AC-UC12:** Thiết lập deadline theo priority (P1: 2h, P2: 4h...); hiển thị thời gian còn lại trên giao diện. |
| **US13** | Là IT Manager, tôi muốn xem Dashboard tổng quan (tổng số ticket, phân bố P1–P4, tỷ lệ AI triage). | Giám sát hiệu suất | US03, US04 | **AC-UC13:** Thẻ KPI đối chiếu khớp với số lượng thực tế trong cơ sở dữ liệu. |

---

### Giai đoạn 3: V3 (Nâng cấp RAG & Chuyên sâu)
*Triển khai khi dự án muốn mở rộng thêm điểm nhấn RAG:*

| ID | User story | Giá trị mang lại | Phụ thuộc | Tiêu chí nghiệm thu (Acceptance Criteria) |
| :--- | :--- | :--- | :--- | :--- |
| **US14** | Là IT Support, tôi muốn tìm kiếm các sự cố tương tự trong quá khứ kèm cách sửa đã thành công. | Tăng tốc sửa lỗi | US08 | **AC-UC14:** Vector search trên tập ticket đã đóng; trả về top 3 giải pháp có độ tương đồng cao. |
| **US15** | Là IT Support, tôi muốn RAG tự động truy xuất tài liệu Runbook/SOP nội bộ và gợi ý các bước kiểm tra tiếp theo. | Quy chuẩn hóa thao tác | US04, Vector DB | **AC-UC15:** Đề xuất quy trình chuẩn phù hợp với sự cố; hiển thị checklist kiểm tra kèm trích dẫn nguồn. |
