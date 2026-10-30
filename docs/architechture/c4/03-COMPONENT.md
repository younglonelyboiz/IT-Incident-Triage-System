# 03-COMPONENT — Component Diagram (C3)
**Architecture Level:** C4 Level 3 (Components)  
**Container:** Backend API & Task Worker (FastAPI Application)  
**Status:** VALIDATED & APPROVED

Tài liệu bóc tách chi tiết các module/component phần mềm bên trong container **Backend API & Task Worker**, phân định ranh giới trách nhiệm và phương thức giao tiếp giữa các thành phần.

---

## I. SƠ ĐỒ COMPONENT TỔNG THỂ (C3 DIAGRAM)

```mermaid
flowchart TB
    subgraph Container["FastAPI Backend & Task Worker [Container]"]
        direction TB

        api["<b>HTTP API & Routers</b><br/><i>[Component: FastAPI Routers]</i><br/>Tiếp nhận request Auth, Ticket, Deflection,<br/>Review HITL và Analytics Dashboard"]

        identity["<b>Identity & Access</b><br/><i>[Component: Security]</i><br/>Xác thực JWT, mã hóa bcrypt,<br/>kiểm tra quyền hạn RBAC & own-ticket policy"]

        state_machine["<b>Incident State Machine</b><br/><i>[Component: Domain Core]</i><br/>Quản trị vòng đời sự cố, đảm bảo bước chuyển<br/>trạng thái hợp lệ, tính SLA deadline"]

        queue["<b>Queue Dispatcher & Task Runner</b><br/><i>[Component: Async Worker]</i><br/>FastAPI BackgroundTasks, cơ chế thử lại<br/>Exponential Backoff (2s, 6s) & Dead-Letter Queue"]

        ai_triage["<b>AI Semantic Extractor</b><br/><i>[Component: AI Integration]</i><br/>Đóng gói prompt, gọi Gemini API,<br/>ép kiểu Pydantic v2 & phát hiện Missing Info"]

        rule_engine["<b>ITIL Priority Matrix</b><br/><i>[Component: Business Logic]</i><br/>Mã nguồn tất định (Deterministic 3x3)<br/>quy đổi Impact x Urgency ra P1–P4"]

        rag["<b>Grounded RAG & Deflection</b><br/><i>[Component: Knowledge Service]</i><br/>Tra cứu Runbook SOP, tìm kiếm FAQ deflection<br/>và truy xuất các sự cố tương tự trong quá khứ"]

        audit["<b>Audit Log Service</b><br/><i>[Component: Audit Trail]</i><br/>Ghi vết mọi thay đổi trạng thái, danh tính người duyệt<br/>và lý do ghi đè (Human Override Reason)"]

        persistence["<b>Data Persistence & Repos</b><br/><i>[Component: Data Access]</i><br/>SQLAlchemy 2.0 Async, repository pattern,<br/>quản trị transaction & task_queue"]
    end

    web["Web Frontend<br/><i>[Container: React 19]</i>"]
    db[("PostgreSQL 16<br/><i>[Container: Database]</i>")]
    gemini[("Gemini LLM API<br/><i>[External Service]</i>")]

    web -->|HTTP REST / JSON| api
    api --> identity
    api --> state_machine
    api --> queue
    api --> rag
    queue --> ai_triage
    ai_triage -.->|HTTPS / Pydantic Schema| gemini
    ai_triage --> rule_engine
    rule_engine --> queue
    queue --> state_machine
    identity --> persistence
    state_machine --> persistence
    rag --> persistence
    state_machine -.->|Ghi nhận event| audit
    queue -.->|Ghi nhận lỗi DLQ| audit
    api -.->|Ghi nhận Override HITL| audit
    audit --> persistence
    persistence -->|Async SQL / asyncpg| db

    style api fill:#1168bd,color:#fff
    style identity fill:#1168bd,color:#fff
    style state_machine fill:#0b4f9e,color:#fff
    style queue fill:#1168bd,color:#fff
    style ai_triage fill:#1168bd,color:#fff
    style rule_engine fill:#1168bd,color:#fff
    style rag fill:#1168bd,color:#fff
    style audit fill:#1168bd,color:#fff
    style persistence fill:#1168bd,color:#fff
```

---

## II. BẢNG PHÂN NHIỆM CHI TIẾT TỪNG COMPONENT

| Tên Component | Phân loại | Công nghệ / Thư viện | Nhiệm vụ chính & Ranh giới trách nhiệm |
|:---|:---|:---|:---|
| **1. HTTP API & Routers** | Presentation Interface | `fastapi.APIRouter` | Tiếp nhận và định tuyến các request từ Web Frontend; kiểm tra tính hợp lệ dữ liệu đầu vào thông qua Pydantic schemas; trả về response JSON chuẩn hóa và mã lỗi RFC 7807. |
| **2. Identity & Access** | Security & Auth | `python-jose`, `passlib[bcrypt]` | Cấp phát và giải mã JWT token; kiểm tra quyền hạn tài khoản theo ma trận RBAC (`END_USER`, `IT_SUPPORT`, `ADMIN`); thực thi chính sách bảo mật dữ liệu "chỉ xem ticket của chính mình" đối với End-User. |
| **3. Incident State Machine** | Domain Core Logic | Pure Python Class | Kiểm soát chặt chẽ trạng thái vòng đời sự cố (ngăn chặn thao tác nhảy cóc); tự động tính toán thời hạn SLA phản hồi và xử lý theo chuẩn ITIL; yêu cầu bắt buộc nhập tóm tắt giải pháp khi chuyển sang `RESOLVED`. |
| **4. Queue Dispatcher & Task Runner** | Asynchronous Processing | FastAPI `BackgroundTasks` | Tiếp nhận ticket ID ngay sau khi tạo, khởi chạy tác vụ gọi AI ngầm; điều phối số lần thử lại (tối đa 3 lần với Exponential Backoff); tự động đưa vào Dead-Letter Queue (`MANUAL_TRIAGE_REQUIRED`) nếu lỗi kéo dài. |
| **5. AI Semantic Extractor** | AI Integration Service | `google-genai`, Pydantic v2 | Đóng gói Prompt hệ thống; gọi Gemini API với cấu trúc ép kiểu nghiêm ngặt để bóc tách: Danh mục, Tác động (Impact), Khẩn cấp (Urgency), Độ tin cậy (Confidence Score), và Phát hiện thông tin kỹ thuật còn thiếu (`missing_info`). |
| **6. ITIL Priority Matrix** | Business Rules Engine | Pure Python (Deterministic) | Thực thi ma trận cứng $3 \times 3$ giữa Tác động và Khẩn cấp để xác định mức ưu tiên P1–P4; tự động bật cờ cảnh báo `is_critical` nếu là P1. Tuyệt đối không để LLM tự do đoán mò mức độ ưu tiên. |
| **7. Grounded RAG & Deflection** | Knowledge Service | Domain Service + PostgreSQL FTS | Tìm kiếm bài viết FAQ/Runbook hỗ trợ người dùng tự khắc phục (Deflection) và truy xuất top 3 sự cố tương tự trong quá khứ đã được giải quyết kèm quy trình Runbook nội bộ phục vụ kỹ thuật viên L1/L2. |
| **8. Audit Log Service** | Observability & Audit Trail | Python Service | Tự động ghi lại lịch sử mọi hành động nghiệp vụ vào bảng `audit_logs`: người thực hiện, thời điểm, trạng thái cũ/mới, kết quả AI đề xuất, và lý do ghi đè của con người (`override_reason`). |
| **9. Data Persistence & Repositories** | Data Access Layer | SQLAlchemy 2.0 (Async), `asyncpg` | Quản lý kết nối connection pool tới PostgreSQL; triển khai mẫu thiết kế Repository Pattern cho các thực thể; quản lý transaction phân tán và theo dõi tiến trình hàng đợi trong bảng `task_queue`. |

---

## III. MA TRẬN TƯƠNG TÁC GIỮA CÁC COMPONENT (INTER-COMPONENT FLOW)

### 1. Luồng tiếp nhận sự cố & Triage nền (< 200ms)
```
Client Request 
   ↳ [HTTP API & Routers]
        ↳ Kiểm tra schema & phân quyền [Identity & Access]
        ↳ Lưu ticket (Status: PENDING_TRIAGE) [Persistence]
        ↳ Kích hoạt BackgroundTask [Queue Dispatcher]
        ↳ Trả về response 201 Created cho Client (< 200ms)
             ⋮ (Chạy nền)
             ↳ [Queue Dispatcher] gọi [AI Semantic Extractor]
                  ↳ Gọi Gemini API -> Trả về JSON (Category, Impact, Urgency)
                  ↳ Gọi [ITIL Priority Matrix] đối chiếu -> Ra P1-P4
                  ↳ Gọi [Incident State Machine] -> Cập nhật Status: AI_SUGGESTED
                  ↳ Lưu kết quả AI vào DB [Persistence]
```

### 2. Luồng thẩm định Human-in-the-Loop (HITL)
```
IT Support Click [Approve / Override]
   ↳ [HTTP API & Routers]
        ↳ Kiểm tra role IT_SUPPORT [Identity & Access]
        ↳ Gọi [Incident State Machine] xác nhận chuyển sang TRIAGED
        ↳ Ghi nhận vào [Audit Log Service] (kèm override_reason nếu sửa kết quả AI)
        ↳ Lưu bản ghi incident_reviews [Persistence]
        ↳ Trả về response 200 OK cho Web Frontend
```
