# Shadcn UI Adoption Plan
 
## Goal
Audit the project for custom-built components that can be replaced by `shadcn/ui` equivalents, standardizing the codebase and reducing custom HTML/CSS overhead.

## Findings

After reviewing the public and admin components, most of the project already effectively utilizes `shadcn/ui` (e.g., `Button`, `Calendar`, `Carousel`, `Dialog`, `Table`, `DropdownMenu`, etc.).

However, the **`components/public/booking-form.tsx`** component relied heavily on custom markup for form elements and notifications:
1. **Native Inputs & Labels**: Used standard HTML `<input>` and `<label>` instead of shadcn's `Input` and `Label`.
2. **Custom Validation / State**: Used standard React `useState` for form fields instead of `react-hook-form` + `zod`.
3. **Custom Toast**: Implemented a hardcoded success message that mimicked a toast notification using custom markup and animations.

## Proposed Changes (Implemented)

Refactored `booking-form.tsx` to use shadcn `Field`, `Input`, `react-hook-form` with `zod` validation, and `sonner` toast notifications.

### 1. Components
- Generated `components/ui/field.tsx` via shadcn CLI for accessible form fields, labels, and error messages matching the `base-nova` style.
- Utilized existing `components/ui/sonner.tsx` and `components/ui/input.tsx`.

### 2. Toaster Provider
- Added `<Toaster position="bottom-center" />` to `app/layout.tsx` to display notifications app-wide with RTL support.

### 3. Refactor `booking-form.tsx`
- **Form State & Validation**: Defined a Zod validation schema (`bookingSchema`) covering name (min 3 chars), phone number (validated Kuwait/international phone format), date selection, and venue name.
- **Form UI**: Replaced native HTML labels and inputs with shadcn's `<Field>`, `<FieldLabel>`, `<FieldError>`, and `<Input>`.
- **Date Picker**: Integrated `react-hook-form`'s `<Controller>` with the shadcn `Popover` and `Calendar` component.
- **Notifications**: Replaced custom toast banner with `sonner`'s `toast.success(...)`.

## Resolved Decisions
- **Toast vs. Sonner**: Selected **Sonner** (`sonner` + `components/ui/sonner.tsx`).
- **Validation**: Added schema validation using `zod` and `@hookform/resolvers/zod` with localized Arabic error messages.

## Verification Plan
1. Ran Next.js Turbopack build and TypeScript typecheck (`npm run build`) — passed with zero errors.
2. Verified visual styling and Tailwind classes remain identical to original design.
3. Verified form validation triggers cleanly on empty/invalid inputs and displays helpful Arabic feedback.
4. Verified Sonner toast triggers on successful submission and form resets.
