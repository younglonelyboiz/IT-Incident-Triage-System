# 05 — Đặc tả Thiết kế UX/UI
**Hệ thống Quản lý & Định tuyến Sự cố IT**
> Tổng hợp từ: Phiên Brainstorming + Phân tích skill UI/UX Pro Max  
> Trạng thái: **ĐÃ XÁC NHẬN** — Sẵn sàng triển khai  
> Stack: React + Vite + shadcn/ui + Tailwind CSS

---

## I. HỆ THỐNG THIẾT KẾ (DESIGN SYSTEM)

### 1.1 Phong cách Giao diện

**Phong cách:** Kết hợp — "Bảng điều khiển mật độ cao" + "Tối giản & Swiss Style"

| Thuộc tính | Quyết định | Lý do |
|---|---|---|
| Chế độ màu | Light mode (mặc định) | Dễ đọc, chuẩn ITSM chuyên nghiệp (tham chiếu Jira/ServiceNow) |
| Mật độ thông tin | Cao | Tối đa khả năng hiển thị dữ liệu; bàn làm việc vận hành không nên ẩn thông tin |
| Thẩm mỹ | Gọn gàng, grid-based, padding tối thiểu | Tương thích WCAG AAA; hiệu năng xuất sắc |
| Animation | Nhẹ (150–300ms), chỉ khi cần thiết | Ưu tiên truyền đạt logic; animation là nice-to-have |

---

### 1.2 Bảng màu

> Nguồn: UI Pro Max domain `color` — Bảng màu SaaS General + Màu cảnh báo Real-Time Monitoring

| Token | Mã màu | Tailwind tương đương | Dùng cho |
|---|---|---|---|
| `primary` | `#2563EB` | `blue-600` | Nút CTA, nav active, liên kết |
| `primary-hover` | `#1D4ED8` | `blue-700` | Hover nút chính |
| `secondary` | `#3B82F6` | `blue-500` | Nút phụ, tags |
| `cta` | `#F97316` | `orange-500` | Hành động nhấn mạnh cao |
| `bg-page` | `#F8FAFC` | `slate-50` | Nền trang |
| `bg-surface` | `#FFFFFF` | `white` | Card, panel, sidebar |
| `border` | `#E2E8F0` | `slate-200` | Đường kẻ phân cách, viền card |
| `text-primary` | `#1E293B` | `slate-800` | Văn bản chính |
| `text-muted` | `#64748B` | `slate-500` | Nhãn phụ, metadata |
| `ai-accent` | `#7C3AED` | `violet-700` | Nội dung AI tạo ra, điểm tin cậy |
| `ai-accent-bg` | `#F5F3FF` | `violet-50` | Nền panel AI |

**Màu mức độ ưu tiên (ITIL P1–P4):**

| Ưu tiên | Viền | Nền | Chữ | Tailwind |
|---|---|---|---|---|
| P1 Khẩn cấp | `#EF4444` | `#FEF2F2` | `#991B1B` | `red-500 / red-50 / red-800` |
| P2 Cao | `#F97316` | `#FFF7ED` | `#9A3412` | `orange-500 / orange-50 / orange-800` |
| P3 Trung bình | `#EAB308` | `#FEFCE8` | `#854D0E` | `yellow-500 / yellow-50 / yellow-800` |
| P4 Thấp | `#22C55E` | `#F0FDF4` | `#166534` | `green-500 / green-50 / green-800` |
| Thủ công/Chưa phân loại | `#F97316` | `#FFF7ED` | `#9A3412` | `orange-500 / orange-50` |

**Màu đồng hồ đếm ngược SLA:**

| Trạng thái | Màu |
|---|---|
| An toàn (còn > 50% thời gian) | `#22C55E` green-500 |
| Cảnh báo (còn < 20%) | `#EAB308` yellow-500 |
| Khẩn cấp (còn < 1 giờ) | `#EF4444` red-500 + `animate-pulse` |

---

### 1.3 Chữ (Typography)

> Nguồn: UI Pro Max — "Plus Jakarta Sans" khuyến nghị cho SaaS dashboard (thân thiện, hiện đại, rõ ràng)

```css
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700&display=swap');
```

```js
// tailwind.config.js
fontFamily: {
  sans: ['Plus Jakarta Sans', 'system-ui', 'sans-serif'],
}
```

| Cấp độ | Kích thước | Độ đậm | Chiều cao dòng | Dùng cho |
|---|---|---|---|---|
| `text-2xl` | 24px | 700 | 1.3 | Tiêu đề trang (H1) |
| `text-xl` | 20px | 600 | 1.4 | Tiêu đề phần (H2) |
| `text-base` | 16px | 400 | 1.5 | Văn bản nội dung (tối thiểu để đọc được) |
| `text-sm` | 14px | 400/500 | 1.5 | Ô bảng, nhãn |
| `text-xs` | 12px | 400 | 1.4 | Badge, chú thích metadata |

---

### 1.4 Biểu tượng (Icons)

> Quy tắc: **Không dùng emoji làm icon UI.** Chỉ dùng bộ SVG icon.

- **Bộ chính:** [Lucide React](https://lucide.dev/) — viewBox cố định 24x24
- **Cách dùng:** `import { AlertTriangle, Clock, CheckCircle } from 'lucide-react'`
- Tất cả nút chỉ có icon (không có chữ) BẮT BUỘC phải có `aria-label`

---

### 1.5 Khoảng cách & Bố cục

| Token | Giá trị | Dùng cho |
|---|---|---|
| Chiều rộng sidebar | `240px` cố định | Thanh điều hướng chính |
| Chiều rộng tối đa nội dung | `1400px` | Desktop (1280px+) |
| Padding card | `p-6` (24px) | Khoảng cách bên trong card chuẩn |
| Chiều cao dòng bảng | `h-12` (48px) | Tối thiểu 44px vùng click |
| Khoảng cách giữa các phần | `gap-6` | Grid/flex spacing |
| Thang z-index | `10 / 20 / 30 / 50` | Dropdown / Sidebar / Modal / Toast |

---

## II. CẤU TRÚC THƯ MỤC FRONTEND

```
src/
├── assets/
├── components/
│   ├── ui/                     # shadcn/ui base (Button, Badge, Dialog, Table...)
│   ├── layout/
│   │   ├── AppLayout.tsx       # Layout gốc: Sidebar + nội dung chính
│   │   ├── AppSidebar.tsx      # Bọc SidebarProvider (shadcn pattern)
│   │   └── TopBar.tsx          # Header từng trang + breadcrumb + thông tin user
│   ├── tickets/
│   │   ├── TicketTable.tsx     # Bảng dữ liệu Workbench
│   │   ├── TicketRow.tsx       # Dòng đơn với logic highlight theo priority
│   │   └── TicketFilters.tsx   # Bộ lọc Category / Priority / Status
│   ├── triage/
│   │   ├── AITriagePanel.tsx   # Cột phải: Hiển thị kết quả AI
│   │   ├── ConfidenceBar.tsx   # Thanh tiến trình màu violet + nhãn %
│   │   ├── PriorityMatrix.tsx  # Hiển thị Impact x Urgency -> Priority
│   │   └── HITLPanel.tsx       # Thao tác Chấp nhận / Ghi đè + ô nhập lý do
│   ├── rag/
│   │   ├── RAGPanel.tsx
│   │   ├── SimilarIncidentCard.tsx
│   │   └── RunbookChecklist.tsx
│   ├── deflection/
│   │   ├── DeflectionPanel.tsx # Panel gợi ý thời gian thực (debounce 500ms)
│   │   └── SolutionCard.tsx
│   ├── dashboard/
│   │   ├── KPICard.tsx
│   │   ├── PriorityPieChart.tsx
│   │   ├── TicketBarChart.tsx  # Recharts BarChart
│   │   └── AIMetricsSection.tsx
│   └── shared/
│       ├── SLACountdown.tsx    # Đồng hồ đếm ngược màu động
│       ├── PriorityBadge.tsx   # Badge P1-P4 dạng pill
│       ├── StateBadge.tsx      # Badge trạng thái vòng đời
│       ├── MissingInfoAlert.tsx
│       └── EmptyState.tsx
├── pages/
│   ├── LoginPage.tsx
│   ├── MyTicketsPage.tsx
│   ├── NewTicketPage.tsx
│   ├── WorkbenchPage.tsx
│   ├── TicketDetailPage.tsx
│   └── DashboardPage.tsx
├── context/
│   ├── AuthContext.tsx          # JWT, thông tin user, role
│   └── NotificationContext.tsx  # Trạng thái toast/alert toàn cục
├── hooks/
│   ├── useAuth.ts
│   ├── useTickets.ts
│   ├── useSLA.ts
│   └── useDeflection.ts        # Tìm kiếm deflection có debounce
├── services/
│   ├── api.ts                  # Axios base config + interceptors
│   ├── ticketService.ts
│   └── authService.ts
├── types/
│   ├── ticket.types.ts
│   ├── user.types.ts
│   └── ai.types.ts
├── lib/
│   ├── utils.ts                # Hàm cn() (clsx + tailwind-merge)
│   └── constants.ts            # Map priority, ngưỡng SLA, nhãn trạng thái
└── router/
    ├── routes.tsx
    ├── ProtectedRoute.tsx
    └── RoleGuard.tsx
```

---

## III. ĐẶC TẢ TỪNG MÀN HÌNH

### Màn hình 1: `/login` — Đăng nhập

**Bố cục:** Card căn giữa (420px) trên nền `bg-slate-50`

**Thành phần:**
- Logo + tiêu đề "IT Incident Triage"
- Ô nhập Email + Mật khẩu (mỗi ô có `<label>` chuẩn a11y)
- Nút `[Đăng nhập]` — trạng thái loading: vô hiệu hóa + spinner khi gọi API
- **Chọn nhanh vai trò** (cho demo Mentor): 3 nút outlined `END_USER | IT_SUPPORT | ADMIN` — tự điền thông tin seed
- Trạng thái lỗi: `border-red-500` + thông báo lỗi ngay dưới ô nhập

**Quy tắc UX:**
- Kiểm tra hợp lệ `onBlur` (không phải chỉ khi submit)
- Nhập sai > 5 lần: khoá 15 phút + hiện đồng hồ đếm ngược
- Skip-to-main link (hỗ trợ truy cập)

---

### Màn hình 2: `/tickets/new` — Báo cáo sự cố & AI Deflection

**Bố cục:** Sidebar + nội dung 2 cột (60% trái / 40% phải)

```
Sidebar | Cột trái - Form (60%)      | Cột phải - Panel AI (40%)
        | Tiêu đề sự cố *            | [skeleton khi đang gõ...]
        | [_____________________]    |
        | Mô tả chi tiết *           | Thẻ giải pháp 1
        | [_____________________]    | Thẻ giải pháp 2
        | [_____________________]    |
        | Thiết bị / Hệ thống        | [Đã tự khắc phục được]
        | [_____________________]    | [Chưa giải quyết được]
        |                            |
        | [Hủy]  [Gửi tới IT]        |
```

**Hành vi Panel Deflection:**
- Kích hoạt: `useDeferredValue` hoặc `debounce(500ms)` khi gõ vào textarea Mô tả
- Đang tải: skeleton `animate-pulse` (2 card placeholder)
- "Đã tự khắc phục được" -> `POST /deflections` -> toast thành công -> điều hướng `/my-tickets`
- "Chưa giải quyết được" -> thu gọn panel, focus vào nút Gửi

---

### Màn hình 3: `/tickets` — Bàn làm việc Kỹ thuật viên (Workbench)

**Bố cục:** Sidebar + bảng toàn chiều rộng với sticky header

**Thanh KPI:** `[12 Chờ Triage]  [3 P1 Active]  [5 Sắp vi phạm SLA]`

**Bộ lọc:** Ô tìm kiếm (debounce) + dropdown Category / Priority / Status

**Cột bảng:** Mã INC | Tiêu đề | Đề xuất AI (Danh mục / Độ tin cậy%) | Ưu tiên | SLA đếm ngược

**Quy tắc hiển thị dòng:**
- P1: `border-l-4 border-red-500 bg-red-50`
- MANUAL_TRIAGE_REQUIRED: `border-l-4 border-orange-400 bg-orange-50`
- Hover: `hover:bg-slate-50 cursor-pointer transition-colors duration-150`
- Đồng hồ SLA: cập nhật màu thời gian thực theo ngưỡng

**Hành vi bộ lọc:**
- `useDeferredValue` cho ô tìm kiếm
- Đồng bộ trạng thái lên URL query string (có thể bookmark)

---

### Màn hình 4: `/tickets/:id` — Chi tiết + Grounded RAG + HITL

**Bố cục:** Sidebar + sticky header bar + nội dung 2 cột (55% / 45%)

**Sticky header:** `[<- Quay lại]  INC-0042  |  [AI_SUGGESTED]  |  SLA: 01:23:45`

```
Cột trái (55%)                        | Cột phải (45%)
--------------------------------------|-------------------------------------
Tiêu đề, Người báo cáo, Mô tả        | [PANEL AI TRIAGE - nền violet]
                                      | Danh mục: Network
[CẢNH BÁO] Thiếu thông tin           | Tin cậy: [=========  ] 87%
Thiếu: mã lỗi, file log              |
[Sao chép mẫu câu hỏi]               | Tác động: CAO
                                      | Khẩn cấp: CAO
[PANEL GROUNDED RAG]                  | Ưu tiên: [P1 Khẩn cấp]
Sự cố tương tự (3):                   |
- INC-031: VPN cert hết hạn          | [Chấp nhận đề xuất]  <- nút chính
- INC-019: DNS resolver lỗi          | [Chỉnh sửa / Ghi đè] <- nút viền
- INC-008: Firewall chặn             |
                                      | -- Tiến độ xử lý --
Runbook: Hướng dẫn VPN               | TRIAGED -> IN_PROGRESS -> RESOLVED
[ ] Kiểm tra phiên bản VPN client    |
[ ] Xác nhận cert chưa hết hạn       | -- Nhật ký thay đổi --
[ ] Kiểm tra DNS resolution          | 09:12 Tạo bởi user@company.com
                                      | 09:13 AI phân tích -> P1 Network 87%
```

**Luồng Ghi đè (HITL Override):**
- Click "Chỉnh sửa / Ghi đè" -> mở form inline (KHÔNG dùng dialog/modal): dropdown Danh mục + Ưu tiên + textarea `override_reason` (bắt buộc)
- Submit -> `PATCH /tickets/:id` -> cập nhật badge tức thì (optimistic update) -> toast thành công

**Styling Panel AI:**
- `bg-violet-50 border border-violet-200 rounded-lg p-4`
- ConfidenceBar: nền fill `bg-violet-500`, nhãn `text-violet-700`

---

### Màn hình 5: `/dashboard` — Giám sát Vận hành

**Bố cục:** Sidebar + lưới 3 hàng

**Hàng 1 — Thẻ KPI (4 thẻ):**

| Thẻ | Icon | Chỉ số | Ghi chú |
|---|---|---|---|
| Tổng sự cố | `LayoutDashboard` | `128` | Số đếm |
| P1 Active | `AlertTriangle` | `3` | Màu đỏ |
| Tuân thủ SLA | `CheckCircle` | `94%` | Xanh/đỏ theo giá trị |
| MTTR trung bình | `Clock` | `2.3h` | Mũi tên xu hướng |

**Hàng 2 — Biểu đồ:**
- Biểu đồ tròn: Phân bố P1–P4 (Recharts `PieChart` — màu phân biệt rõ)
- Biểu đồ cột: Ticket theo ngày (Recharts `BarChart`)

**Hàng 3 — Chỉ số AI Engineering:**
- Tỷ lệ Deflection: chỉ số lớn + mũi tên xu hướng tăng/giảm
- Tỷ lệ Human Override theo Danh mục: biểu đồ cột (thể hiện độ chính xác AI theo từng nhóm — chỉ số quan trọng với Mentor)
- Tỷ lệ DLQ / Thủ công: thẻ stat đơn giản

---

## IV. ĐẶC TẢ COMPONENT DÙNG CHUNG

### `<PriorityBadge priority="P1" />`
```tsx
// Pill: bg-red-50 text-red-800 border border-red-200 rounded-full px-2 py-0.5 text-xs font-medium
// P1=đỏ, P2=cam, P3=vàng, P4=xanh lá — map từ constants.ts
```

### `<StateBadge state="AI_SUGGESTED" />`
```tsx
// Badge viền, màu theo trạng thái:
// AI_SUGGESTED: violet | PENDING_TRIAGE: gray | TRIAGED: blue
// IN_PROGRESS: orange | RESOLVED: green | CLOSED: slate
// MANUAL_TRIAGE_REQUIRED: red (viền)
```

### `<SLACountdown deadline={date} createdAt={date} />`
```tsx
// Định dạng: HH:MM:SS
// > 50% còn lại: text-green-600
// < 20% còn lại: text-yellow-600
// < 1h còn lại:  text-red-600 animate-pulse
// Dùng setInterval(1000) trong useEffect, dọn dẹp khi unmount
```

### `<ConfidenceBar value={0.87} />`
```tsx
// Nền: bg-violet-100 rounded h-2
// Fill: bg-violet-500, width = `${value * 100}%`
// transition-all duration-300
// Nhãn: "87%" text-xs text-violet-700 font-medium ml-2
```

---

## V. QUY TẮC UX TỐT NHẤT (Kiểm tra UI Pro Max)

| Quy tắc | Áp dụng ở đâu |
|---|---|
| Không dùng emoji làm icon — dùng Lucide SVG | Toàn bộ ứng dụng |
| `cursor-pointer` trên mọi phần tử click được | TicketRow, KPICard, SolutionCard |
| Hover: `transition-colors duration-200` | Nút, dòng, card |
| Focus: `focus:ring-2 focus:ring-blue-500 focus:outline-none` | Tất cả input/nút |
| Nút loading: vô hiệu hóa + spinner khi async | Đăng nhập, Gửi ticket, HITL |
| Skeleton loading: `animate-pulse` | Panel deflection, tải chi tiết |
| `useDeferredValue` hoặc debounce cho tìm kiếm | Bộ lọc Workbench, kích hoạt Deflection |
| Kiểm tra `onBlur` nội tuyến | Form đăng nhập, tạo ticket, lý do ghi đè |
| `<label htmlFor>` cho mọi input form | Tất cả form |
| `aria-label` cho nút chỉ có icon | Nút thu gọn sidebar, icon hành động |
| Ưu tiên KHÔNG chỉ phân biệt bằng màu | Priority dùng màu + chữ + icon Lucide |
| Bọc `SidebarProvider` (shadcn pattern chính thức) | AppLayout |
| Dùng `<Table>` shadcn cho dữ liệu dạng bảng | WorkbenchPage |
| Chữ phụ tối thiểu `slate-600` (#475569) | Tất cả text phụ/caption |
| Thông báo lỗi nội tuyến gần vị trí lỗi | Tất cả form |

---

## VI. NHẬT KÝ QUYẾT ĐỊNH (DECISION LOG)

| # | Quyết định | Lựa chọn đã cân nhắc | Lý do chọn |
|---|---|---|---|
| D1 | Light mode | Dark mode | Dễ đọc, cảm giác ITSM chuyên nghiệp |
| D2 | Plus Jakarta Sans | Inter, Roboto | UI Pro Max: tốt nhất cho SaaS dashboard; thân thiện + chuyên nghiệp |
| D3 | shadcn/ui + Tailwind | Ant Design, Bootstrap | Hiện đại, tùy biến cao, gây ấn tượng với Mentor, nhẹ |
| D4 | Sidebar điều hướng | Top navbar | Theo kiểu Linear/Notion; chuyên nghiệp, dễ navigate |
| D5 | React Context | Zustand | YAGNI — không cần global state phức tạp |
| D6 | Approach A: Command Center | List-first, Split-pane | Thể hiện tốt nhất chiều sâu SE + AI Engineering |
| D7 | `useDeferredValue` cho tìm kiếm | useEffect + debounce | React 18 native, idiomatic, hiệu năng tốt |
| D8 | Violet cho phần tử AI | Blue (giống primary) | Phân biệt rõ: nội dung AI tạo ra vs. quyết định của con người |
| D9 | Recharts cho biểu đồ | Chart.js, ApexCharts | Native React, TypeScript-friendly, nhẹ |
| D10 | Desktop-first (1280px+) | Mobile responsive | Phạm vi đã xác nhận: demo Mentor trên desktop |

---

## VII. DANH SÁCH KIỂM TRA TRƯỚC KHI GIAO (PRE-DELIVERY CHECKLIST)

### Chất lượng Giao diện
- [ ] Không có emoji làm icon UI (chỉ dùng Lucide SVG)
- [ ] Tất cả icon từ Lucide, kích thước nhất quán (`w-4 h-4` hoặc `w-5 h-5`)
- [ ] Hover state không gây dịch chuyển layout
- [ ] Màu priority nhất quán giữa Badge, highlight dòng, và biểu đồ

### Tương tác
- [ ] `cursor-pointer` trên mọi card/dòng/nút click được
- [ ] Hover: `transition-colors duration-200` hoặc `transition-shadow`
- [ ] Focus ring: `focus:ring-2 focus:ring-blue-500 focus:outline-none`
- [ ] Nút loading vô hiệu hóa khi đang submit

### Khả năng Truy cập (Accessibility)
- [ ] Tất cả ảnh có `alt` text
- [ ] Tất cả input form có `<label>` với `htmlFor`
- [ ] Nút chỉ có icon có `aria-label`
- [ ] Priority dùng màu + chữ + icon (không chỉ màu)
- [ ] Tôn trọng `prefers-reduced-motion` cho animation

### Độ tương phản Light Mode
- [ ] Văn bản chính `#1E293B` (slate-800) trên nền trắng — WCAG AAA
- [ ] Văn bản phụ tối thiểu `#475569` (slate-600)
- [ ] Viền: `border-slate-200` — không dùng `border-white/10`
- [ ] Nền panel AI `bg-violet-50` đủ độ tương phản

### Bố cục
- [ ] Sidebar 240px cố định, nội dung không bị che
- [ ] Sticky header chi tiết ticket không che nội dung
- [ ] Z-index: `10` dropdown, `20` sidebar, `30` modal, `50` toast
