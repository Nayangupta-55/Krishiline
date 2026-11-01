# Krishi-Line — Transparent Procurement | Stronger Farmers

Student prototype (Nashik onion model), built to the team's cover design and
the updated workflow document (Nov 2026). **Demo data only** — not an
official government portal, and it has no real access to Aadhaar, land
records, NAFED/NCCF databases or PFMS. WhatsApp, OTP and PFMS steps are
simulated against a fictional mock database.

## What is built

- **Homepage** (`/`) — hero matching the reference design, the problem
  (government vs private vs Krishi-Line), role-wise workflow, safeguards,
  revenue model and production roadmap. Stats derived from the booking list.
- **Workflow overview** (`/workflow`) — the 6 role cards from the cover,
  the end-to-end Step 0–5 flow, and the 4-table mock database viewer.
- **WhatsApp Bot simulator** (`/farmer/whatsapp`) — the 6-step farmer flow:
  “Hi” → village + Gat + Farmer ID → demo OTP (123456, shown in a fictional
  SMS) → yield-ceiling check → 4-hour slot → QR token. A wrong Gat number
  gets flagged for manual verification instead of verifying.
- **Farmer Dashboard** (`/farmer`) — upcoming booking, stats (gross + net),
  monthly chart, recent bookings, updates, quick links.
- **Book Slot** (`/farmer/book`) — live yield-ceiling check (12,000 kg for
  2.0 acres = 120 quintals), centre/date/slot/grade selection, estimated amount.
- **QR Token** (`/farmer/qr`) — real QR code (qrcode lib) encoding token,
  centre, date, slot and quantity; PNG download, print, copy.
- **Land Records 7/12** (`/farmer/land`) — simulated parcels, search, ceiling
  progress (Gat 142/A, Kahan, 2.0 acres).
- **Receipts** (`/farmer/receipts`) — view modal + downloadable HTML receipt
  with Gross / Hamali / Other / Net breakdown.
- **Payments** (`/farmer/payments`) — PFMS-style timeline per booking, net
  amounts matching the receipts and the accountant's ledger.
- **Admin** (`/roles/admin`) — Step 0 role provisioning: bulk CSV upload of
  officials, auth-DB locking, login-gate test, mock-DB overview.
- **Role dashboards** — Clerk (6-step wizard: scan → verify → weigh → grade
  → receipt → thermal QR sticker), Warehouse Supervisor (5-step: FIFO queue,
  Hamal bagging, QR scan, approve/flag, queue update), Center Accountant
  (6-step: verified entries → amount calc → bank verify → digital signature
  → PFMS submit → payment tracking), Collector Admin (district overview,
  centre comparison, grade-variance chart, suspicious entries, investigations,
  report export), FPO (CSV bulk upload with land cross-check, member
  eligibility, group slot booking with flexible 2–6 hour blocks, capacity
  countdown, booking tracking).

## One consistent dataset

`lib/data.ts` holds the seed data. Every total, chart, receipt and payment
figure is derived from it, so screens cannot disagree:

- Farmer: Ramesh Patil, Village Kahan, Gat 142/A, 2.0 acres, eligible
  120 quintals = 12,000 kg ceiling. 8 bookings, 9,540 kg (95.4 quintals).
- Rate card: Grade 1 (Premium) ₹1,850, Grade 2 (Standard) ₹1,700,
  Grade 3 (Lower) ₹1,550 per quintal.
- Deductions: Hamali ₹100/quintal + Other ₹200 per booking.
  Net = Gross − Hamali − Other. Example (cover): 22 Oct, batch B00124,
  1,250 kg Grade 1 → Gross ₹23,125 → Net ₹21,675.
- Completed: 7 bookings, 8,540 kg. Gross ₹1,47,670 · Net ₹1,37,730.
  Paid (net): ₹1,22,250 · Processing (net): ₹15,480 · Upcoming est. (net): ₹17,300.
- District demo scope (Collector): 12 centres, 24,560 quintals, 8,240
  farmers; the 5 centres shown total 17,050 quintals, the other 7 make up
  the remaining 7,510.

Bookings created in the demo are stored in the browser (localStorage) and
shared across farmer and role screens in the same session. Use **Reset demo**
in the header to restore the original 8 bookings.

## Honesty notes

- Problem claims (multi-day queues, tractor losses, 3–4 week DBT) are the
  team's farmer-reported field narrative, labelled as such in the app —
  not verified official findings. The verified anchor shown is the
  Maharashtra GR of 29 Sep 2026 constituting a 5-member inquiry committee
  on Nashik NAFED/NCCF onion procurement.
- “2-day payment” is the design target for PFMS settlement, not a measured
  result. District totals on the Collector screen are illustrative demo
  scope, labelled as such, and reconciled against the centre table.

## Run it

```bash
npm install
npm run dev     # http://localhost:3000
npm run build   # production build + typecheck
npm start
```

## Tech

Next.js 16 (App Router) + TypeScript + Tailwind CSS v4 + shadcn-style
components (`components/ui.tsx`, `cn` via clsx + tailwind-merge) +
Lucide icons + Framer Motion + Recharts + qrcode.
