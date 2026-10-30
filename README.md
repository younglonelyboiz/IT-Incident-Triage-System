# IT Incident Triage System

Hệ thống ứng dụng AI để tự động phân loại, đánh giá mức độ ưu tiên của ticket sự cố CNTT, phát hiện thông tin còn thiếu và hỗ trợ kỹ thuật viên xử lý nhanh chóng dưới sự giám sát của con người (Human-in-the-loop). Hệ thống kết hợp quản lý sự cố, hàng đợi xử lý nền, phân quyền theo vai trò và kiểm duyệt thông minh.

---

## 1. Phân tích đề bài Top-Down (Research)

Hệ thống được tiếp cận và nghiên cứu theo mô hình **Top-Down**, xuất phát từ bài toán thực tế của các trung tâm vận hành công nghệ thông tin (IT Operations & Service Desk) theo chuẩn **ITIL v4**:
- **Bối cảnh & Vấn đề tồn tại:** Khi xảy ra sự cố, người dùng thường báo cáo mơ hồ hoặc phân loại sai độ ưu tiên (thổi phồng mức độ khẩn cấp). Đội ngũ IT L1 mất thời gian chỉ để đọc, phân loại thủ công và hỏi lại thông tin cơ bản.
- **Giải pháp AI Triage & Grounded RAG:** Ứng dụng mô hình ngôn ngữ lớn kết hợp cơ sở tri thức kỹ thuật số để:
  1. *Tự động phân loại danh mục & phát hiện thông tin còn thiếu (Missing Info Detection).*
  2. *Gợi ý giải pháp tự khắc phục tức thì cho người dùng (AI Deflection) giúp giảm tải số lượng ticket tạo mới.*
  3. *Tính toán độ ưu tiên ITIL (P1–P4) minh bạch dựa trên ma trận Tác động × Khẩn cấp.*
  4. *Đảm bảo tính chịu lỗi với hàng đợi Dead-Letter Queue (DLQ) và giám sát con người (Human-in-the-loop).*

### Sơ đồ tư duy & Cấu trúc sản phẩm (Product Mind Map)

![Product Mind Map](docs/images/mindmap.png)

Chi tiết cấu trúc phạm vi, tính năng và phân tích nghiên cứu xem tại:
* [01-SCOPE.md](docs/01-SCOPE.md)
* [02-FEATURES.md](docs/02-FEATURES.md)

---

## 2. Use Case Diagram & User Stories INVEST

### 2.1 Sơ đồ Use Case Tổng thể (Use Case Diagram)

```mermaid
graph TD
    User(["End-user"])
    Support(["IT Support"])
    Admin(["Admin"])
    Worker(["System Worker"])

    Admin -.->|kế thừa| Support

    UC01["UC01: Đăng nhập & Xác thực"]
    UC02["UC02: Tạo ticket & AI Deflection"]
    UC03["UC03: Xem & lọc danh sách Workbench"]
    UC04["UC04: AI phân tích & trích xuất ngữ nghĩa"]
    UC05["UC05: Tính toán ưu tiên ma trận ITIL"]
    UC06["UC06: Duyệt / Ghi đè AI (HITL)"]
    UC07["UC07: Phục hồi lỗi Queue & Retry DLQ"]
    UC08["UC08: Grounded RAG (Runbook & Sự cố tương tự)"]
    UC09["UC09: Giám sát Dashboard & SLA"]

    User --> UC01
    User --> UC02
    User --> UC03

    Support --> UC01
    Support --> UC03
    Support --> UC06
    Support --> UC08

    Admin --> UC01
    Admin --> UC03
    Admin --> UC06
    Admin --> UC08
    Admin --> UC09

    Worker --> UC04
    Worker --> UC05
    Worker --> UC07
```

Mô tả chi tiết các tác nhân, kịch bản luồng chính, luồng ngoại lệ, chính sách thử lại và ma trận 3×3 xem tại:
* [03-USE_CASES.md](docs/03-USE_CASES.md)

### 2.2 Danh mục User Stories & Kiểm định Chuẩn INVEST

Backlog phiên bản cốt lõi (V1 Core MVP) gồm **7 User Stories** trọng tâm, bao quát từ tiếp nhận, xử lý nền đến kiểm duyệt con người:
* `US01`: Xác thực và quản lý phiên (Authentication)
* `US02`: Tiếp nhận và tạo ticket sự cố (Ticket Intake)
* `US03`: Bàn làm việc & bộ lọc danh sách (Workbench & Filters)
* `US04`: AI phân loại danh mục sự cố (AI Category Triage)
* `US05`: Đề xuất độ ưu tiên theo ma trận ITIL (Rule-based Priority P1–P4)
* `US06`: Con người duyệt hoặc ghi đè kết quả AI (Human-in-the-loop Override)
* `US07`: Xử lý lỗi retry & hàng đợi dự phòng (Queue Retry & Fallback)

Trước khi sẵn sàng phát triển, mỗi User Story đều được kiểm định nghiêm ngặt theo tiêu chí INVEST:

| Tiêu chí | Ý nghĩa trong hệ thống IT Incident Triage |
| :--- | :--- |
| **Independent (Độc lập)** | Mỗi story tạo ra một tính năng hoàn chỉnh, chỉ phụ thuộc vào điều kiện tiên quyết tối thiểu. |
| **Negotiable (Thương lượng)** | Giao diện và giải pháp công nghệ linh hoạt, giữ nguyên mục tiêu và quyền hạn nghiệp vụ. |
| **Valuable (Có giá trị)** | Mỗi story đều mang lại lợi ích đo lường được cho người dùng hoặc hiệu suất vận hành IT. |
| **Estimable (Ước lượng được)** | Đầu vào, đầu ra, vai trò, phụ thuộc và các kịch bản lỗi đều được tài liệu hóa rõ ràng. |
| **Small (Vừa vặn)** | Mỗi story tập trung vào một năng lực cốt lõi, dễ dàng chia nhỏ thành tác vụ API, DB, UI và Test. |
| **Testable (Kiểm thử được)** | Mọi story đều ánh xạ tới tiêu chí nghiệm thu quan sát được, có metric đo lường và kịch bản lỗi cụ thể. |

Chi tiết toàn bộ bảng phân kỳ Product Backlog (MVP, V2, V3) xem tại [INVEST Requirements](docs/INVEST_REQUIREMENTS.md).

### 2.3 Phân quyền người dùng (Roles & Permissions)

| Quyền hạn / Khả năng | Admin | IT Support | End-user | System Worker |
| :--- | :---: | :---: | :---: | :---: |
| Đăng nhập & quản lý phiên | Có | Có | Có | Không |
| Tạo ticket sự cố mới | Có | Có | Có | Không |
| Xem danh sách ticket | Toàn bộ | Toàn bộ | Chỉ của mình | Không |
| Tự động phân loại danh mục (AI) | Không | Không | Không | Có |
| Tính toán ưu tiên P1–P4 (Rule Matrix) | Không | Không | Không | Có |
| Duyệt đề xuất AI (1-Click Approve) | Có | Có | Không | Không |
| Ghi đè mức ưu tiên kèm lý do (Override) | Có | Có | Không | Không |
| Xử lý retry lỗi nền & Dead-Letter Queue | Không | Không | Không | Có |

> **Lưu ý:** Backend bắt buộc phải thực thi kiểm tra quyền (RBAC) và chính sách "chỉ xem ticket của mình" ở tầng API/DB; việc ẩn hiện nút trên giao diện người dùng chỉ nhằm tối ưu trải nghiệm UI/UX.

---

## 3. Information Architecture & Phân Quyền Màn Hình (Role-to-Screen)

### 3.1 Sơ đồ Phân quyền Vai trò tới Màn hình (Role-to-Screen Mapping)

```mermaid
graph LR
    subgraph Roles["Các Vai Trò"]
        EU[" End-User"]
        IT[" IT Support (L1/L2)"]
        AD[" Admin"]
    end

    subgraph Screens["Màn Hình Hệ Thống"]
        S_LOGIN["/login<br/>Đăng nhập & Chuyển vai trò Demo"]
        S_MY["/my-tickets<br/>Sự cố của tôi"]
        S_NEW["/tickets/new<br/>Báo sự cố & AI Deflection"]
        S_WORK["/tickets<br/>Bàn làm việc Triage & KPI"]
        S_DETAIL["/tickets/:id<br/>Chi tiết sự cố, Runbook & HITL"]
        S_DASH["/dashboard<br/>Giám sát SLA & AI Observability"]
    end

    EU --> S_LOGIN
    EU --> S_MY
    EU --> S_NEW
    EU --> S_DETAIL

    IT --> S_LOGIN
    IT --> S_WORK
    IT --> S_NEW
    IT --> S_DETAIL

    AD --> S_LOGIN
    AD --> S_WORK
    AD --> S_NEW
    AD --> S_DETAIL
    AD --> S_DASH
```

### 3.2 Bảng Ma trận Màn hình theo Vai trò

| Tuyến đường (Route) | Tên màn hình | Chức năng chính | End-User | IT Support | Admin |
| :--- | :--- | :--- | :---: | :---: | :---: |
| `/login` | Đăng nhập | Xác thực tài khoản & Chọn nhanh vai trò demo | Có | Có | Có |
| `/my-tickets` | Sự cố của tôi | Theo dõi tiến độ & thời gian SLA sự cố cá nhân | Có | Không | Có |
| `/tickets/new` | Báo sự cố mới | Nhập lỗi & AI gợi ý giải pháp tự khắc phục (Deflection) | Có | Có | Có |
| `/tickets` | Bàn làm việc Triage | Quản lý hàng đợi, 3 thẻ KPI Strip, lọc sự cố đa chiều | Không | Có | Có |
| `/tickets/:id` | Chi tiết sự cố | Ma trận ITIL, Grounded Runbook và Phê duyệt HITL | Chỉ xem | Xử lý | Toàn quyền |
| `/dashboard` | Bảng điều khiển | Báo cáo SLA, MTTR và chỉ số AI Engineering | Không | Không | Có |

*Chi tiết kiến trúc thông tin:* [04-INFORMATION_ARCHITECTURE.md](./docs/04-INFORMATION_ARCHITECTURE.md)

---

## 4. Giao diện Người dùng & Trải nghiệm (UI/UX)


#### Happy Case 1: Đăng nhập & Chọn nhanh vai trò (Demo Switcher)
> Card đăng nhập tối giản, hỗ trợ chọn nhanh 1-click giữa các vai trò End-User, IT Support và Admin để nghiệm thu.

![Happy Case 1 - Đăng nhập](./docs/uxui_screenshots/happy_01_login.png)

---

#### Happy Case 2: Bàn làm việc Kỹ thuật viên (Incident Workbench)
> Hàng đợi sự cố ITIL, 3 thẻ KPI Strip, đồng hồ đếm ngược SLA và thanh độ tin cậy AI màu xanh nhạt dịu mắt.

![Happy Case 2 - Incident Workbench](./docs/uxui_screenshots/happy_02_workbench.png)

---

#### Happy Case 3: Chi tiết Sự cố & Phê duyệt Human-in-the-Loop (AI Triage & HITL)
> Ma trận Tác động × Khẩn cấp ITIL 3×3, lập luận AI, checklist Runbook SOP chuẩn hóa và nút phê duyệt/ghi đè.

![Happy Case 3 - Chi tiết sự cố & HITL](./docs/uxui_screenshots/happy_03_ticket_detail.png)

---

#### Happy Case 4: Người dùng Báo lỗi & AI Tự giải quyết (Self-service Deflection)
> Người dùng gõ mô tả lỗi → AI đối soát RAG gợi ý giải pháp tự khắc phục tức thì giúp giảm tải L1.

![Happy Case 4 - AI Deflection](./docs/uxui_screenshots/happy_04_self_service_deflection.png)

---

#### Happy Case 5: Dashboard Giám sát Vận hành & Đo lường AI Engineering (AI Observability)
> 4 chỉ số SLA/MTTR cốt lõi, biểu đồ trực quan và đo lường tỷ lệ Deflection (38.5%), Human Override rate.

![Happy Case 5 - Admin Dashboard](./docs/uxui_screenshots/happy_05_admin_dashboard.png)

---

#### Happy Case 6: Cổng thông tin Người dùng Cuối (My Incidents Portal)
> Nhân viên theo dõi tiến độ và SLA đếm ngược các ticket do chính mình tạo.

![Happy Case 6 - My Incidents Portal](./docs/uxui_screenshots/happy_06_my_tickets.png)

---

*Chi tiết toàn bộ báo cáo thiết kế:* [UXUI_DESIGN_REPORT.md](./docs/UXUI_DESIGN_REPORT.md)

---

## 5. Kiến trúc Hệ thống (C4 Model Architecture)

Hệ thống được thiết kế theo mô hình **C4 Model** chuẩn hóa toàn diện 4 cấp độ (Simon Brown Architecture):
* **C1: System Context Diagram** — Ranh giới hệ thống, 3 nhóm tác nhân (`End-User`, `IT Support`, `Admin`) và kết nối `Gemini LLM API`.
* **C2: Container Diagram** — Phân rã kiến trúc tinh gọn (KISS / YAGNI): SPA Frontend (React), Backend API & Task Worker (FastAPI), Primary Database (PostgreSQL) và không phụ thuộc Redis.
* **C3: Component Diagram** — Bóc tách chi tiết 9 module nội bộ của Backend API: State Machine, Queue Dispatcher & Task Runner (BackgroundTasks + DLQ fallback), AI Semantic Extractor, ITIL Priority Matrix Engine và Grounded RAG.
* **C4: Code & State Machine Diagram** — Thiết kế cấu trúc mã nguồn, quy tắc chuyển đổi trạng thái vòng đời sự cố và cơ chế retry DLQ *(Đang triển khai)*.

### 5.1 C1 — System Context Diagram

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

---

### 5.2 C2 — Container Diagram

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

---

### 5.3 C3 — Component Diagram (Backend API & Task Worker)

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

---


*Chi tiết toàn bộ đặc tả kiến trúc 4 cấp độ:*
* [c4-architechture/README.md](./docs/architechture/c4-architechture/README.md) — Tổng quan thư mục kiến trúc C4 Model
* [01-CONTEXT.md](./docs/architechture/c4-architechture/01-CONTEXT.md) — C1: System Context, Personas & User Journeys
* [02-CONTAINER.md](./docs/architechture/c4-architechture/02-CONTAINER.md) — C2: Web Frontend, Backend API & Worker, PostgreSQL 16
* [03-COMPONENT.md](./docs/architechture/c4-architechture/03-COMPONENT.md) — C3: 9 Components nội bộ trong FastAPI Backend & Worker
* [04-CODE.md](./docs/architechture/c4-architechture/04-CODE.md) — C4: Thiết kế Class Python, Pydantic Schemas, State Machine & DLQ Runner *(Đang triển khai)*

---

## 6. Thiết kế Cơ sở Dữ liệu (Database Design & ERD)

Cơ sở dữ liệu được thiết kế trên nền tảng **PostgreSQL 16**, chuẩn hóa **3NF**, tách bạch giữa thông tin sự cố nghiệp vụ, kết quả AI phân loại, lịch sử thẩm định con người (HITL) và kiểm toán (Audit Trail).

### 6.1 Sơ đồ Thực thể Quan hệ (Mermaid Entity Relationship Diagram - ERD)

```mermaid
erDiagram
    users ||--o{ incidents : reports
    users o|--o{ incidents : assigned_to
    users ||--o{ incident_reviews : reviews
    users o|--o{ incident_status_history : changes
    users o|--o{ audit_logs : performs

    incidents ||--o{ ai_triage_results : receives
    incidents ||--o{ incident_reviews : has
    incidents ||--o{ incident_status_history : tracks
    incidents ||--o{ task_queue : enqueues
    incidents ||--o{ audit_logs : generates

    ai_triage_results ||--o{ incident_reviews : reviewed_by

    users {
        uuid id PK
        varchar email UK
        varchar full_name
        varchar hashed_password
        user_role role
        boolean is_active
        timestamptz created_at
        timestamptz updated_at
    }

    incidents {
        uuid id PK
        varchar incident_number UK
        uuid reporter_id FK
        uuid assignee_id FK
        varchar title
        text description
        varchar affected_service
        incident_status status
        itil_priority priority
        impact_level impact
        urgency_level urgency
        varchar category
        timestamptz sla_response_deadline
        timestamptz sla_resolution_deadline
        timestamptz resolved_at
        timestamptz created_at
        timestamptz updated_at
    }

    ai_triage_results {
        uuid id PK
        uuid incident_id FK
        varchar suggested_category
        impact_level suggested_impact
        urgency_level suggested_urgency
        itil_priority suggested_priority
        numeric confidence_score
        text reasoning
        jsonb missing_info
        varchar model_name
        timestamptz created_at
    }

    incident_reviews {
        uuid id PK
        uuid incident_id FK
        uuid reviewer_id FK
        uuid ai_triage_result_id FK
        boolean accepted_ai_suggestion
        varchar final_category
        itil_priority final_priority
        text override_reason
        timestamptz reviewed_at
    }

    incident_status_history {
        uuid id PK
        uuid incident_id FK
        uuid changed_by FK
        incident_status old_status
        incident_status new_status
        text note
        timestamptz created_at
    }

    task_queue {
        uuid id PK
        uuid incident_id FK
        varchar task_type
        queue_task_status status
        int attempts
        int max_attempts
        text error_message
        timestamptz next_run_at
        timestamptz created_at
        timestamptz updated_at
    }

    audit_logs {
        uuid id PK
        uuid incident_id FK
        uuid actor_id FK
        varchar action
        jsonb old_state
        jsonb new_state
        text notes
        timestamptz created_at
    }
```

*Chi tiết toàn bộ đặc tả lược đồ CSDL, DBML, Indexing & Data Retention:* [DATABASE_DESIGN.md](./docs/architechture/DATABASE_DESIGN.md)

---

## 7. Đặc tả Giao tiếp API (OpenAPI 3.1 Specification)

Toàn bộ hệ thống giao tiếp giữa **Web Frontend (React)** và **Backend API (FastAPI)** được chuẩn hóa theo chuẩn **OpenAPI 3.1.0** (RESTful, JWT Bearer Token, RBAC Scope, và RFC 7807 Error Envelope).


### 7.1 Ma trận Nhóm Endpoints Cốt lõi

| Nhóm chức năng | Phương thức & Tuyến đường (Route) | Quyền hạn (RBAC) | Nhiệm vụ chính |
| :--- | :--- | :---: | :--- |
| **Xác thực (Auth)** | `POST /api/v1/auth/login`<br/>`GET /api/v1/auth/me`<br/>`POST /api/v1/auth/logout` | Public<br/>Authenticated<br/>Authenticated | Cấp JWT Token, kiểm tra phiên làm việc và đăng xuất. |
| **Gợi ý tự sửa (Deflection)** | `POST /api/v1/deflection/suggest`<br/>`POST /api/v1/deflection/feedback` | Authenticated<br/>Authenticated | RAG tìm FAQ/Runbook khi người dùng gõ mô tả; ghi nhận self-service thành công. |
| **Quản lý sự cố (Incidents)** | `POST /api/v1/incidents`<br/>`GET /api/v1/incidents`<br/>`GET /api/v1/incidents/{id}`<br/>`PATCH /api/v1/incidents/{id}/status` | Authenticated<br/>Authenticated<br/>Authenticated<br/>IT Support, Admin | Tiếp nhận ticket (< 200ms) kích hoạt worker; lọc danh sách; xem chi tiết; chuyển trạng thái vòng đời. |
| **Con người thẩm định (HITL)** | `POST /api/v1/incidents/{id}/review` | IT Support, Admin | 1-Click Approve hoặc Override AI Triage (bắt buộc nhập lý do). |
| **Tri thức & RAG (Knowledge)** | `GET /api/v1/knowledge/similar`<br/>`GET /api/v1/knowledge/runbooks` | IT Support, Admin | Truy xuất top 3 sự cố tương tự trong quá khứ và tài liệu Runbook/SOP kèm Checklist. |
| **Giám sát (Observability)** | `GET /api/v1/analytics/dashboard` | IT Support, Admin | Thống kê vận hành (SLA, MTTR, P1–P4) & AI Engineering metrics (Deflection, Override rate). |
| **Hạ tầng (Health & Tasks)** | `GET /api/v1/health`<br/>`GET /api/v1/tasks/{incident_id}` | Public<br/>Authenticated | Healthcheck phụ thuộc (PostgreSQL, Gemini API); kiểm tra trạng thái background task. |

*Tài liệu đặc tả chi tiết:*
* [OPENAPI_SPECIFICATION.md](./docs/architechture/OPENAPI_SPECIFICATION.md) — Chi tiết schema JSON, Request/Response mẫu, mã lỗi và quy tắc nghiệp vụ.
* [openapi.yaml](./docs/api/openapi.yaml) — File OpenAPI 3.1 YAML hoàn chỉnh, sẵn sàng import vào Swagger UI, Postman hoặc Redoc.

