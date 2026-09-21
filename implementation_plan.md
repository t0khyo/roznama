# Admin Dashboard — Implementation Plan

## Background

The public site is complete under `app/(public)/`. The admin area currently has only a placeholder at `app/admin/page.tsx`. We need a full admin dashboard with sidebar navigation, overview stats, weddings CRUD, and booking-request management — all backed by a typed mock data layer that's ready to swap with Supabase later.

---

## 1. File / Folder Structure

### Routes — `app/admin/`

```
app/admin/
├── layout.tsx              ← admin shell (SidebarProvider + sidebar + main area + auth stub)
├── page.tsx                ← overview/dashboard (stats cards)
├── weddings/
│   └── page.tsx            ← weddings table + create/edit/delete dialogs
└── bookings/
    └── page.tsx            ← booking requests table + status management
```

### Components — `components/admin/`

```
components/admin/
├── admin-sidebar.tsx       ← Sidebar built on shadcn Sidebar primitives
├── stat-card.tsx           ← reusable stats card for overview page
├── weddings-table.tsx      ← DataTable for weddings
├── wedding-form-dialog.tsx ← Dialog with form for create/edit wedding
├── delete-wedding-dialog.tsx ← Confirmation dialog for delete
├── bookings-table.tsx      ← DataTable for booking requests
└── booking-status-dialog.tsx ← Dialog for approving/rejecting bookings
```

### Data Layer — `lib/data/`

```
lib/data/
├── weddings.ts             ← getWeddings(), getWedding(), createWedding(), updateWedding(), deleteWedding()
└── bookings.ts             ← getBookingRequests(), updateBookingStatus()
```

### Types — `types/index.ts` (extend existing)

Add `BookingRequest` and `BookingStatus` alongside the existing `Wedding` type.

---

## 2. shadcn Components — Installed vs. Needed

| Component | Status | Notes |
|-----------|--------|-------|
| `button` | ✅ Installed | — |
| `calendar` | ✅ Installed | — |
| `carousel` | ✅ Installed | — |
| `dialog` | ✅ Installed | For create/edit/delete modals |
| `drawer` | ✅ Installed | — |
| `dropdown-menu` | ✅ Installed | Row actions (edit/delete/approve) |
| `popover` | ✅ Installed | — |
| **`sidebar`** | ❌ Need to add | Admin navigation shell — brings `input`, `separator`, `skeleton`, `tooltip`, `sheet`, and `hooks/use-mobile.ts` |
| **`table`** | ❌ Need to add | Weddings + bookings tables |
| **`badge`** | ❌ Need to add | Status badges (pending/approved/rejected) |
| **`card`** | ❌ Need to add | Stat cards on overview page |
| **`input`** | ❌ Need to add | Form fields (comes with sidebar too) |
| **`label`** | ❌ Need to add | Form labels |
| **`select`** | ❌ Need to add | Status selector in booking management |
| **`textarea`** | ❌ Need to add | Optional — venue/notes fields |

**Install command** (single batch):

```bash
npx shadcn@latest add sidebar table badge card input label select textarea -y
```

---

## 3. TypeScript Types

### Existing — `Wedding` (no changes)

```ts
// types/index.ts — already exists
export interface Wedding {
  id: number
  tribe: string
  groom: string
  date: string   // ISO date string "YYYY-MM-DD"
  image: string  // URL
}
```

### New — `BookingRequest` and `BookingStatus`

```ts
// types/index.ts — additions
export type BookingStatus = "pending" | "approved" | "rejected"

export interface BookingRequest {
  id: number
  name: string        // الاسم 
  phone: string       // رقم الهاتف
  date: string        // ISO date string
  venue: string       // المكان
  status: BookingStatus
  submittedAt: string // ISO datetime
}
```

---

## 4. Data Layer — `lib/data/` Mock Function Shapes

### `lib/data/weddings.ts`

```ts
import type { Wedding } from "@/types"

// In-memory store seeded from the same data currently in lib/constants.ts
export async function getWeddings(): Promise<Wedding[]>
export async function getWedding(id: number): Promise<Wedding | undefined>
export async function createWedding(data: Omit<Wedding, "id">): Promise<Wedding>
export async function updateWedding(id: number, data: Partial<Omit<Wedding, "id">>): Promise<Wedding>
export async function deleteWedding(id: number): Promise<void>
```

> Functions are `async` so swapping to Supabase later requires zero call-site changes.

### `lib/data/bookings.ts`

```ts
import type { BookingRequest, BookingStatus } from "@/types"

export async function getBookingRequests(): Promise<BookingRequest[]>
export async function updateBookingStatus(id: number, status: BookingStatus): Promise<BookingRequest>
```

### Stats helper — `lib/data/stats.ts`

```ts
export interface DashboardStats {
  totalWeddings: number
  upcomingWeddings: number     // date >= today
  totalBookings: number
  pendingBookings: number
}

export async function getDashboardStats(): Promise<DashboardStats>
```

> [!IMPORTANT]
> The public site currently imports `weddingsData` directly from `lib/constants.ts`. After building the data layer, the public components should also migrate to use `getWeddings()` — but that's a separate, small follow-up task to keep this scope focused.

---

## 5. Build Order

| Phase | Deliverable | Details |
|-------|-------------|---------|
| **Phase 1** | shadcn install + types + data layer | Install components, extend types, create `lib/data/` with mock data |
| **Phase 2** | Admin layout + sidebar | `app/admin/layout.tsx` with `SidebarProvider`, `admin-sidebar.tsx`, auth stub |
| **Phase 3** | Overview page | `app/admin/page.tsx` with stat cards calling `getDashboardStats()` |
| **Phase 4** | Weddings management | `app/admin/weddings/page.tsx` with table + create/edit/delete dialogs |
| **Phase 5** | Bookings management | `app/admin/bookings/page.tsx` with table + status management |

Each phase will be delivered and reviewed before moving to the next.

---

## Open Questions

1. **Sidebar branding** — Should the admin sidebar show the same `logo.png` used on the public site, or do you want different admin branding?
2. **Admin color palette** — Should the admin area keep the same cream/maroon/gold brand colors, or shift to a more neutral dark sidebar + white content area (common admin pattern)?
3. **Wedding form fields** — Currently `Wedding` has `id`, `tribe`, `groom`, `date`, `image`. Is that the complete set, or do you plan to add fields like `venue`, `description`, etc.?
4. **Booking request notes** — Should admins be able to add notes/comments when approving/rejecting a booking, or is the status change alone sufficient?
