# Use Case Diagram — IT Incident Triage System
**Design status:** TARGET V1 (Core MVP)

---

### I. SƠ ĐỒ USE CASE TỔNG THỂ

```mermaid
graph TD
    User([" End-user"])
    Support([" IT Support"])
    Admin([" Admin"])
    Worker([" System Worker"])
    LLM([" AI / LLM"])

    Admin -.->|inherits| Support

    UC01["UC01: Đăng nhập"]
    UC02["UC02: Tạo ticket"]
    UC03["UC03: Xem & lọc danh sách"]
    UC04["UC04: AI phân loại danh mục"]
    UC05["UC05: Đề xuất ưu tiên ITIL"]
    UC06["UC06: Duyệt / Ghi đè AI"]
    UC07["UC07: Retry & Dead-Letter Queue"]

    User --> UC01
    User --> UC02
    User --> UC03
    Support --> UC01
    Support --> UC03
    Support --> UC06
    Worker --> UC04
    Worker --> UC05
    Worker --> UC07
    UC04 --> LLM
    UC05 --> LLM

    UC02 -.->|trigger enqueue| UC04
    UC04 -.->|include| UC05
    UC05 -.->|notify review| UC06
    UC04 -.->|on failure| UC07
    UC05 -.->|on failure| UC07
```

---

### II. BẢNG QUAN HỆ & GIẢI THÍCH LIÊN KẾT

| Từ | Đến | Loại quan hệ | Ý nghĩa |
| :--- | :--- | :---: | :--- |
| **Admin** | **IT Support** | Generalization | Admin sở hữu toàn bộ quyền của IT Support. |
| **End-user** | UC01, UC02, UC03 | Association | Tạo ticket và theo dõi ticket của chính mình. |
| **IT Support** | UC01, UC03, UC06 | Association | Xem toàn bộ ticket và duyệt/ghi đè đề xuất AI. |
| **Background Worker** | UC04, UC05, UC07 | Association | Thực thi phân loại NLP, ma trận ITIL và retry. |
| UC04, UC05 | **LLM Service** | External Service | Worker giao tiếp với LLM để phân tích ngữ nghĩa. |
| **UC02** | **UC04** | `<<trigger>>` | Tạo ticket thành công → enqueue tác vụ phân loại. |
| **UC04** | **UC05** | `<<include>>` | Phân loại danh mục luôn kèm tính Priority P1–P4. |
| UC04 / UC05 | **UC07** | `<<on failure>>` | Gọi AI lỗi (timeout, 429) → kích hoạt retry/DLQ. |
| **UC05** | **UC06** | Dependency | Kết quả AI là đề xuất, chờ con người thẩm định. |
