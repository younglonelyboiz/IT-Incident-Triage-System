# C4_ARCHITECTURE — IT Incident Triage System
**Design status:** VALIDATED & APPROVED (C1 Context, C2 Container, C3 Component)

Tài liệu thiết kế kiến trúc hệ thống theo mô hình **C4 Model** (Context, Container, Component), trực quan hóa bằng Mermaid flowchart chuẩn C4 với cú pháp trực quan, phân rã ranh giới hệ thống, tầng thực thi và component nội bộ.

---

## II. CẤP ĐỘ 1: C1 — SYSTEM CONTEXT

### C1 — System Context

```mermaid
flowchart LR
    enduser(["End-User"])
    itsupport(["IT Support (L1/L2)"])
    admin(["Administrator"])

    subgraph boundary[" "]
        system["IT Incident Triage System<br/><i>[Software System]</i><br/>Tự động tiếp nhận, phân loại danh mục sự cố,<br/>tính toán độ ưu tiên ITIL (P1–P4), gợi ý Runbook,<br/>và hỗ trợ phê duyệt Human-in-the-Loop"]
    end

    gemini[("Gemini LLM API<br/><i>[External System]</i><br/>Trích xuất ngữ nghĩa sự cố,<br/>phát hiện missing info & gợi ý RAG")]

    enduser -- "báo sự cố, nhận gợi ý tự sửa lỗi, theo dõi tiến độ" --> system
    itsupport -- "xem Workbench, 1-click Approve hoặc Override (HITL)" --> system
    admin -- "giám sát SLA compliance, MTTR và AI Observability" --> system
    system -- "gửi prompt & schema, nhận JSON trích xuất" --> gemini

    style system fill:#1168bd,color:#fff
```

### Bảng đặc tả giao tiếp C1:
* **End-User $\leftrightarrow$ IT Incident Triage System:** Giao tiếp qua Web Browser, cung cấp Self-Service Portal (báo lỗi, nhận AI Deflection giải pháp tức thì, xem tiến độ xử lý).
* **IT Support $\leftrightarrow$ IT Incident Triage System:** Tiếp nhận hàng đợi sự cố trên Workbench, xem bằng chứng và lập luận AI, thực hiện phê duyệt (1-click Approve) hoặc ghi đè (Override có lý do).
* **Admin $\leftrightarrow$ IT Incident Triage System:** Giám sát dashboard SLA, MTTR và các chỉ số AI Observability.
* **IT Incident Triage System $\leftrightarrow$ Gemini LLM API:** Giao thức HTTPS REST API, trích xuất cấu trúc văn bản sự cố theo định dạng JSON Schema định sẵn.

---

## III. CẤP ĐỘ 2: C2 — CONTAINER

### C2 — Container

```mermaid
flowchart TD
    users(["End-User /<br/>IT Support /<br/>Administrator"])
    gemini[("Gemini LLM API<br/><i>[External System]</i><br/>Mô hình ngôn ngữ lớn<br/>trích xuất ngữ nghĩa & RAG")]

    subgraph boundary["IT Incident Triage System [Software System Boundary]"]
        subgraph presentation["Presentation"]
            frontend["Web Frontend<br/><i>[Container: React 19 + Vite]</i><br/>UI, routing, incident forms, bàn làm việc Workbench,<br/>HITL approval controls, và SLA dashboard"]
        end

        subgraph application["Application"]
            backend["Backend API & Task Worker<br/><i>[Container: FastAPI (Python 3.12)]</i><br/>Xác thực JWT, RBAC, Incident State Machine,<br/>ITIL matrix rule engine, và BackgroundTasks runner"]
        end

        subgraph data["Data"]
            db[("PostgreSQL 16<br/><i>[Container: Database]</i><br/>Users, incidents, runbooks,<br/>audit logs, và bảng task_queue")]
        end
    end

    users --> frontend
    frontend -- "REST / HTTPS / JSON (JWT)" --> backend
    backend -- "SQL / PostgreSQL protocol (asyncpg)" --> db
    backend -- "HTTPS / REST API (Pydantic Schema)" --> gemini

    style frontend fill:#1168bd,color:#fff
    style backend fill:#1168bd,color:#fff
    style db fill:#1168bd,color:#fff
```

### Đặc tính kỹ thuật của các Container:
1. **Web Frontend:**
   * **Công nghệ:** React 19, TypeScript, Vite, Tailwind CSS v4, Lucide React, Recharts.
   * **Trách nhiệm:** Trực quan hóa toàn bộ trải nghiệm người dùng, điều hướng theo vai trò (Role-based views), gọi REST API.
2. **Backend API & Task Worker:**
   * **Công nghệ:** Python 3.12, FastAPI, Pydantic v2, Uvicorn.
   * **Trách nhiệm:** Cung cấp API tiếp nhận ticket siêu nhanh ($< 200\text{ms}$), kích hoạt `BackgroundTasks` xử lý phân loại ngầm, đối soát ma trận ITIL cứng, quản lý retry/DLQ và ghi log kiểm toán.
3. **PostgreSQL Database:**
   * **Công nghệ:** PostgreSQL 16.
   * **Trách nhiệm:** Lưu trữ bền vững dữ liệu quan hệ, lịch sử thay đổi trạng thái (Audit Trail), và điều phối trạng thái nhiệm vụ ngầm (ACID persistence).
4. **Gemini LLM API:**
   * **Trách nhiệm:** Cung cấp dịch vụ mô hình ngôn ngữ lớn để trích xuất ngữ nghĩa và tìm kiếm giải pháp RAG.

---

## IV. CẤP ĐỘ 3: C3 — COMPONENT (BACKEND API & TASK WORKER)

### C3 — Component

```mermaid
flowchart TB
    subgraph rt["FastAPI Backend & Worker [Container]"]
        direction TB
        api["HTTP API & Routers<br/><i>[Component: FastAPI Controllers]</i><br/>Auth, Ticket, Deflection, and<br/>Dashboard REST endpoints"]
        identity["Identity & Access<br/><i>[Component]</i><br/>JWT authentication, session/token, RBAC,<br/>and own-ticket policy"]
        state_machine["Incident State Machine<br/><i>[Component]</i><br/>Incident lifecycle, strict transitions,<br/>and SLA deadline calculation"]
        queue["Queue Dispatcher & Task Runner<br/><i>[Component]</i><br/>BackgroundTasks queue, retry backoff,<br/>and DLQ fallback handling"]
        ai_triage["AI Semantic Extractor<br/><i>[Component]</i><br/>Category, impact, urgency parsing,<br/>and missing info detection"]
        rule_engine["ITIL Priority Matrix<br/><i>[Component]</i><br/>Deterministic 3×3 matrix engine<br/>computing P1–P4 priorities"]
        rag["Grounded RAG & Deflection<br/><i>[Component]</i><br/>Runbook SOP lookup, FAQ deflection,<br/>and similar incident search"]
        audit["Audit Log<br/><i>[Component]</i><br/>Records business actions, transitions,<br/>and HITL override reasons"]
        persistence["Persistence<br/><i>[Component]</i><br/>Async repositories, task_queue state,<br/>and SQL transaction mapping"]
    end

    web["Web Frontend<br/><i>[Container: React 19 + Vite]</i>"]
    db[("PostgreSQL<br/><i>[Container: Database]</i>")]
    ai[("Gemini LLM API<br/><i>[External Service]</i>")]

    web --> api
    api --> identity
    api --> state_machine
    api --> queue
    api --> rag
    queue --> ai_triage
    ai_triage -.->|"prompt & Pydantic schema"| ai
    ai_triage --> rule_engine
    rule_engine --> queue
    queue --> state_machine
    identity --> persistence
    state_machine --> persistence
    rag --> persistence
    state_machine -.->|"lifecycle events"| audit
    queue -.->|"retry & DLQ events"| audit
    api -.->|"human override events"| audit
    audit --> persistence
    persistence --> db

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

### Bảng phân nhiệm chi tiết từng Component:

| Component | Phân loại | Công nghệ | Nhiệm vụ chính |
|:---|:---|:---|:---|
| **HTTP API & Routers** | Interface | FastAPI APIRouter | Điểm tiếp nhận request từ Web Frontend; điều phối luồng tới các component nghiệp vụ; trả về response chuẩn hóa JSON. |
| **Identity & Access** | Security | `python-jose`, `passlib` | Xác thực đăng nhập, mã hóa mật khẩu, kiểm tra quyền hạn (Role-based Access Control) cho từng API endpoint. |
| **Incident State Machine** | Domain Core | Pure Python Class | Quản trị vòng đời sự cố, đảm bảo các bước chuyển đổi trạng thái hợp lệ, ngăn chặn thao tác nhảy cóc. |
| **Queue Dispatcher & Runner** | Asynchronous | FastAPI `BackgroundTasks` | Tiếp nhận ticket ID, gọi AI Triage ngầm, theo dõi số lần thử lại (tối đa 3 lần với exponential backoff), đẩy sang DLQ (`MANUAL_TRIAGE_REQUIRED`) nếu lỗi. |
| **AI Semantic Extractor** | AI Integration | `google-genai`, Pydantic v2 | Đóng gói Prompt hệ thống, ép kiểu phản hồi của LLM vào Schema nghiêm ngặt (`category`, `impact`, `urgency`, `missing_info`). |
| **ITIL Priority Matrix** | Business Logic | Pure Deterministic Code | Ánh xạ ma trận cứng $3 \times 3$ giữa Tác động (Impact) và Mức khẩn cấp (Urgency) để xác định độ ưu tiên P1–P4. |
| **Grounded RAG & Deflection** | Knowledge Service | Domain Service + PostgreSQL FTS | Tìm kiếm văn bản Runbook tương ứng với sự cố và truy xuất top các sự cố tương tự trong quá khứ. |
| **Data Access & Audit Repo** | Data Persistence | SQLAlchemy 2.0 (Async) | Quản lý kết nối PostgreSQL qua `asyncpg`, thực thi CRUD và tự động ghi log vào bảng `audit_logs` khi có hành động duyệt HITL. |

---

## V. LUỒNG DỮ LIỆU & KHẢ NĂNG CHỊU LỖI (DATA FLOW & FAULT TOLERANCE)

### Sơ đồ tuần tự: Tiếp nhận, Triage ngầm và Phê duyệt HITL

```mermaid
sequenceDiagram
    autonumber
    actor User as End-User / IT Support
    participant API as HTTP API & Routers
    participant Queue as Queue Dispatcher
    participant DB as PostgreSQL
    participant AI as Gemini LLM API
    participant Rule as ITIL Rule Engine

    Note over User,API: 1. Tiếp nhận Ticket tức thì (< 200ms)
    User->>API: POST /api/tickets (Tiêu đề, Mô tả, Thiết bị)
    API->>DB: INSERT ticket (Status: PENDING_TRIAGE)
    API->>Queue: Kích hoạt BackgroundTask (ticket_id)
    API-->>User: 201 Created (Trả về ticket ngay lập tức)

    Note over Queue,AI: 2. Xử lý Triage Ngầm & Retry Exponential Backoff
    Queue->>DB: Cập nhật task status = PROCESSING (attempt = 1)
    Queue->>AI: Gửi Prompt + Pydantic Schema
    alt Gọi AI thành công
        AI-->>Queue: Trả về JSON (Category, Impact, Urgency, Missing Info)
        Queue->>Rule: Đối chiếu Impact x Urgency
        Rule-->>Queue: Trả về mức ưu tiên P1–P4
        Queue->>DB: UPDATE ticket (Status: AI_SUGGESTED, Priority, AI Reasoning)
    else Gọi AI thất bại / Timeout (Thử lại tối đa 3 lần: 1s, 2s, 4s)
        Queue->>DB: Tăng attempt count, ghi nhận mã lỗi
        alt Quá 3 lần thử lại thất bại (Cơ chế Dead-Letter Queue - DLQ)
            Queue->>DB: UPDATE ticket (Status: MANUAL_TRIAGE_REQUIRED, is_dlq = true)
        end
    end

    Note over User,DB: 3. Phê Duyệt / Ghi Đè (Human-in-the-Loop)
    User->>API: PATCH /api/tickets/{id}/review (Approve hoặc Override kèm lý do)
    API->>DB: UPDATE ticket (Status: TRIAGED, is_human_override = true/false)
    API->>DB: INSERT Audit Log (Ghi nhận danh tính người duyệt & thời điểm)
```

---

## VI. BẢO MẬT & PHÂN QUYỀN (SECURITY & RBAC)

| Vai trò | Phạm vi dữ liệu xem | Thao tác được phép |
|:---|:---|:---|
| **End-User** | Chỉ xem ticket do chính mình tạo | Tạo ticket mới, xem gợi ý Deflection, xem tiến độ ticket của mình. |
| **IT Support (L1/L2)** | Xem toàn bộ ticket trong hệ thống | Bàn làm việc Workbench, duyệt AI (Approve), ghi đè độ ưu tiên (Override kèm lý do), cập nhật tiến độ (In Progress / Resolved). |
| **Admin** | Toàn quyền trên toàn bộ dữ liệu | Xem Observability Dashboard, cấu hình hệ thống, quản lý người dùng, xem toàn bộ Audit Logs. |
