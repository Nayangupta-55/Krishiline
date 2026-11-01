"use client";
import { useState } from "react";
import Link from "next/link";
import { Leaf, Menu, X, ChevronDown, Sprout, Landmark } from "lucide-react";
import { useStore } from "@/lib/store";

// Top nav follows the reference homepage: Home · About · Procurement ·
// Market Info · Resources · Contact, plus the NAFED / NCCF mark.
const NAV = [
  { label: "Home", href: "/" },
  { label: "About", href: "/#about" },
  { label: "Procurement", href: "/workflow" },
  { label: "Market Info", href: "/#market" },
  { label: "Resources", href: "/#resources" },
  { label: "Contact", href: "/#contact" },
];
const FARMER_NAV = [
  { label: "Farmer Dashboard", href: "/farmer" },
  { label: "WhatsApp Bot", href: "/farmer/whatsapp" },
  { label: "Book Slot", href: "/farmer/book" },
  { label: "QR Token", href: "/farmer/qr" },
  { label: "Land Records", href: "/farmer/land" },
  { label: "Receipts", href: "/farmer/receipts" },
  { label: "Payments", href: "/farmer/payments" },
];
const ROLES = [
  { label: "Admin — Role Provisioning", href: "/roles/admin" },
  { label: "Farmer (WhatsApp Bot)", href: "/farmer/whatsapp" },
  { label: "Government Clerk", href: "/roles/clerk" },
  { label: "Warehouse Supervisor", href: "/roles/warehouse" },
  { label: "Center Accountant", href: "/roles/accountant" },
  { label: "Collector Admin", href: "/roles/collector" },
  { label: "FPO Cooperative", href: "/roles/fpo" },
];

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [rolesOpen, setRolesOpen] = useState(false);
  const { resetDemo } = useStore();
  return (
    <header className="sticky top-0 z-40 border-b border-emerald-100 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
        <Link href="/" className="flex items-center gap-2.5">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-700 text-white"><Leaf size={22} /></span>
          <span className="leading-tight"><span className="block text-lg font-extrabold text-emerald-900">Krishi-Line</span><span className="block text-[11px] font-medium text-gray-500">Transparent Procurement | Stronger Farmers</span></span>
        </Link>
        <nav className="hidden items-center gap-1 lg:flex" aria-label="Main">
          {NAV.map((n) => <Link key={n.href} href={n.href} className={`rounded-lg px-3 py-2 text-sm font-medium ${n.label === "Home" ? "bg-emerald-700 text-white" : "text-gray-700 hover:bg-emerald-50 hover:text-emerald-800"}`}>{n.label}</Link>)}
          <div className="relative">
            <button onClick={() => setRolesOpen(!rolesOpen)} className="flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium text-gray-700 hover:bg-emerald-50" aria-expanded={rolesOpen}>Roles <ChevronDown size={15} /></button>
            {rolesOpen && <div className="absolute right-0 mt-2 w-64 rounded-xl border bg-white p-2 shadow-lg">{ROLES.map((r) => <Link key={r.href} href={r.href} onClick={() => setRolesOpen(false)} className="block rounded-lg px-3 py-2 text-sm text-gray-700 hover:bg-emerald-50">{r.label}</Link>)}</div>}
          </div>
        </nav>
        <div className="hidden items-center gap-2 lg:flex"><span className="flex items-center gap-1.5 rounded-lg bg-emerald-50 px-3 py-2 text-xs font-bold text-emerald-900"><Landmark size={15} /> NAFED</span><span className="rounded-lg bg-gray-100 px-3 py-2 text-xs font-bold text-gray-700">NCCF</span></div>
        <div className="flex items-center gap-2">
          <button onClick={() => { resetDemo(); window.location.href = "/farmer"; }} className="hidden rounded-xl border border-emerald-200 px-3 py-2 text-xs font-semibold text-emerald-800 hover:bg-emerald-50 sm:block" title="Restore the original demo bookings">Reset demo</button>
          <Link href="/farmer" className="hidden rounded-xl bg-emerald-700 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-800 sm:block">Farmer Login</Link>
          <button className="rounded-lg p-2 lg:hidden" onClick={() => setOpen(!open)} aria-label="Toggle menu">{open ? <X /> : <Menu />}</button>
        </div>
      </div>
      {open && <nav className="border-t px-4 py-3 lg:hidden" aria-label="Mobile">
        {[...NAV, ...FARMER_NAV, ...ROLES].map((n) => <Link key={n.href + n.label} href={n.href} onClick={() => setOpen(false)} className="block rounded-lg px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-emerald-50">{n.label}</Link>)}
      </nav>}
      <div className="bg-amber-50 px-4 py-1.5 text-center text-[11px] font-medium text-amber-900 sm:text-xs">Student prototype — demo data only. Not an official government portal. No real Aadhaar, land-record, NAFED/NCCF or PFMS access. WhatsApp, OTP and PFMS steps are simulated.</div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer id="contact" className="mt-12 border-t border-emerald-100 bg-emerald-950 text-emerald-100">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:grid-cols-4 sm:px-6">
        <div><p className="flex items-center gap-2 text-lg font-bold text-white"><Sprout /> Krishi-Line</p><p className="mt-2 text-sm text-emerald-200">A transparent, queue-free procurement flow for Nashik onion farmers — booking, QR entry, grading, digital receipts and payment tracking in one place.</p><p className="mt-3 text-sm text-emerald-200">Demo helpline: 1800-123-4567 · Demo WhatsApp: “Hi” to the Krishi-Line bot.</p></div>
        <div><p className="font-semibold text-white">Farmer</p><ul className="mt-2 space-y-1.5 text-sm">{FARMER_NAV.map((n) => <li key={n.href}><Link href={n.href} className="hover:text-white">{n.label}</Link></li>)}</ul></div>
        <div><p className="font-semibold text-white">Roles</p><ul className="mt-2 space-y-1.5 text-sm">{ROLES.map((r) => <li key={r.href}><Link href={r.href} className="hover:text-white">{r.label}</Link></li>)}</ul></div>
        <div><p className="font-semibold text-white">About the demo</p><p className="mt-2 text-sm text-emerald-200">All figures are simulated demo data. Problem claims on this site are the team’s farmer-reported field narrative, labelled as such — not verified official findings. Production would need authorised government integrations (see Roadmap).</p></div>
      </div>
      <p className="border-t border-emerald-900 py-4 text-center text-xs text-emerald-300">Krishi-Line demo · Nashik model · Better Farmers. Fair Markets. Brighter India.</p>
    </footer>
  );
}
