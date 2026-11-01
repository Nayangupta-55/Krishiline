"use client";
import Link from "next/link";
import { MessageCircle, ClipboardCheck, Wallet, Building2, Users, PackageCheck, ShieldCheck, ArrowRight, Database } from "lucide-react";
import { Card, Badge } from "@/components/ui";
import { MOCK_DB, SEED_BOOKINGS, DISTRICT_BATCHES, CENTRES } from "@/lib/data";

const ROLES = [
  { n: "1", icon: MessageCircle, title: "Farmer (WhatsApp Bot)", sub: "Self-service booking, verification & digital receipt", href: "/farmer/whatsapp", color: "bg-blue-600", feats: ["Land verification", "4-hour slot booking", "QR token", "Digital receipt", "Booking updates"] },
  { n: "2", icon: ClipboardCheck, title: "Government Clerk", sub: "Weighing, grading, receipt generation & QR sticker printing", href: "/roles/clerk", color: "bg-emerald-700", feats: ["QR scan & verify", "Enter weight & grade", "Quality grading", "Digital receipt", "Print QR sticker"] },
  { n: "3", icon: Wallet, title: "Center Accountant", sub: "Digital ledger, deductions & payment processing", href: "/roles/accountant", color: "bg-violet-700", feats: ["Verified entries", "Calculate payable amount", "Bank verification", "Digital signature", "PFMS submission (DBT)"] },
  { n: "4", icon: Building2, title: "Collector Admin Staff", sub: "District monitoring, anomaly detection & vigilance alerts", href: "/roles/collector", color: "bg-amber-600", feats: ["District overview", "Grade comparison", "Red flag alerts", "Investigations", "Reports & export"] },
  { n: "5", icon: Users, title: "FPO Cooperative", sub: "Bulk crop upload, group booking & member management", href: "/roles/fpo", color: "bg-rose-600", feats: ["Bulk farmer upload", "Member management", "Group slot booking", "Booking tracking", "WhatsApp notifications"] },
  { n: "6", icon: PackageCheck, title: "Warehouse Supervisor", sub: "Batch verification, queue management & fraud prevention", href: "/roles/warehouse", color: "bg-orange-600", feats: ["Live batch queue", "QR scan & inspect", "Approve or flag", "Physical verification", "Real-time updates"] },
];
const FLOW = [
  { step: "Step 0", title: "Admin setup", desc: "Admin provisions officials via bulk CSV; only registered Employee IDs clear the login gate.", href: "/roles/admin" },
  { step: "Step 1A", title: "Farmer books on WhatsApp", desc: "“Hi” → village + Gat + Farmer ID → demo OTP → yield-ceiling check → 4-hour slot → QR token.", href: "/farmer/whatsapp" },
  { step: "Step 1D", title: "FPO bulk booking", desc: "FPO uploads a roster; the engine verifies each member's ceiling, aggregates the weight, and locks a flexible 2–6 hour block against the 1,000-tonne daily capacity countdown.", href: "/roles/fpo" },
  { step: "Step 2", title: "Clerk weighs & grades", desc: "Scan token → verify → enter weight → pick grade → digital receipt on WhatsApp → thermal QR sticker prints.", href: "/roles/clerk" },
  { step: "Step 3", title: "Hamals bag & move", desc: "Loose onions go into jute bags, the sticker goes on the first bag, and the trolley is pushed to the godown.", href: "/roles/warehouse" },
  { step: "Step 4", title: "Supervisor gate check", desc: "FIFO queue; Green Pass for ~90%, mandatory Orange scan for 15–20% random + 100% Premium Grade-1. Flag freezes the row.", href: "/roles/warehouse" },
  { step: "Step 5", title: "Accountant → PFMS → DBT", desc: "Auto-ledger, Hamali deductions, bank verification, digital signature, PFMS batch — payment in a 2-day design target.", href: "/roles/accountant" },
];

export default function WorkflowPage() {
  const tokens = [...SEED_BOOKINGS, ...DISTRICT_BATCHES];
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <Badge>NAFED / NCCF · Nashik Model</Badge>
      <h1 className="mt-2 text-3xl font-extrabold sm:text-4xl">Role-Wise <span className="text-emerald-700">Workflow &amp; Features</span></h1>
      <p className="mt-1 max-w-3xl text-gray-600">A complete system overview. One unified codebase that changes its layout by login role — the farmer sees WhatsApp-style booking, the clerk sees grading, the supervisor sees the gate queue, the accountant sees the ledger, the collector sees the district, and the FPO sees group bookings.</p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {ROLES.map((r) => <Link key={r.n} href={r.href}><Card className="group h-full p-5 transition hover:-translate-y-0.5 hover:shadow-md"><div className="flex items-center gap-3"><span className={`flex h-10 w-10 items-center justify-center rounded-full font-bold text-white ${r.color}`}>{r.n}</span><span className={`rounded-xl p-2 ${r.color} bg-opacity-10`}><r.icon size={20} className="text-emerald-800" /></span></div><h3 className="mt-3 font-bold">{r.title}</h3><p className="text-sm text-gray-600">{r.sub}</p><ul className="mt-3 space-y-1 text-sm text-gray-700">{r.feats.map((f) => <li key={f} className="flex gap-2"><ShieldCheck size={15} className="mt-0.5 shrink-0 text-emerald-700" />{f}</li>)}</ul><span className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-emerald-700">View workflow <ArrowRight size={15} /></span></Card></Link>)}
      </div>

      <h2 className="mt-12 text-2xl font-bold">End-to-end workflow</h2>
      <div className="mt-4 grid gap-3 md:grid-cols-2">
        {FLOW.map((f) => <Link key={f.step} href={f.href}><Card className="flex gap-4 p-5 hover:shadow-md"><span className="shrink-0 rounded-lg bg-emerald-700 px-3 py-1.5 text-xs font-bold text-white">{f.step}</span><span><b>{f.title}</b><p className="mt-0.5 text-sm text-gray-600">{f.desc}</p></span></Card></Link>)}
      </div>

      <h2 id="mock-db" className="mt-12 flex items-center gap-2 text-2xl font-bold"><Database className="text-emerald-700" /> Single mock database — 4 tables</h2>
      <p className="mt-1 text-gray-600">The prototype runs on ONE centralized mock database. Demo Farmer ID is the primary key; Village + Gat are composite foreign keys. No live government database is connected — these are fictional sample records.</p>
      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <Card className="overflow-x-auto p-5"><h3 className="font-bold">Table 1 — Farmer Registry</h3><table className="mt-2 w-full text-sm"><thead><tr className="text-left text-gray-500"><th className="py-1">Farmer ID</th><th>Name</th><th>Village</th><th>Phone ends</th></tr></thead><tbody>{MOCK_DB.farmers.map((f) => <tr key={f.farmerId} className="border-t border-gray-100"><td className="py-1.5 font-mono text-xs">{f.farmerId}</td><td>{f.name}</td><td>{f.village}</td><td>…{f.phoneEnding}</td></tr>)}</tbody></table></Card>
        <Card className="overflow-x-auto p-5"><h3 className="font-bold">Table 2 — 7/12 Land Records</h3><table className="mt-2 w-full text-sm"><thead><tr className="text-left text-gray-500"><th className="py-1">Farmer ID</th><th>Village</th><th>Gat</th><th>Acres</th><th>Holder</th></tr></thead><tbody>{MOCK_DB.land.map((l) => <tr key={l.farmerId} className="border-t border-gray-100"><td className="py-1.5 font-mono text-xs">{l.farmerId}</td><td>{l.village}</td><td>{l.gat}</td><td>{l.acres}</td><td>{l.holder}</td></tr>)}</tbody></table></Card>
        <Card className="overflow-x-auto p-5"><h3 className="font-bold">Table 3 — Crop Records (e-Peek Pahani simulation)</h3><table className="mt-2 w-full text-sm"><thead><tr className="text-left text-gray-500"><th className="py-1">Farmer ID</th><th>Gat</th><th>Season</th><th>Crop</th></tr></thead><tbody>{MOCK_DB.crops.map((c) => <tr key={c.farmerId} className="border-t border-gray-100"><td className="py-1.5 font-mono text-xs">{c.farmerId}</td><td>{c.gat}</td><td>{c.season}</td><td>{c.crop}</td></tr>)}</tbody></table></Card>
        <Card className="overflow-x-auto p-5"><h3 className="font-bold">Table 4 — Token &amp; Capacity Ledger</h3><p className="mt-1 text-xs text-gray-500">{tokens.length} tokens issued in demo · daily centre cap 1,000 tonnes</p><table className="mt-2 w-full text-sm"><thead><tr className="text-left text-gray-500"><th className="py-1">Token</th><th>Batch</th><th>Date</th><th>Qty</th><th>Status</th></tr></thead><tbody>{tokens.slice(0, 8).map((t) => <tr key={t.id} className="border-t border-gray-100"><td className="py-1.5 font-mono text-xs">{t.token}</td><td>{t.batchNo}</td><td>{t.displayDate}</td><td>{t.quantityKg.toLocaleString("en-IN")} kg</td><td>{t.status}</td></tr>)}</tbody></table><p className="mt-2 text-xs text-gray-500">Capacity countdown (today): {CENTRES.slice(0, 3).map((c) => `${c.id} ${(c.capacityTonnes - c.bookedTonnesToday).toLocaleString("en-IN")} t left`).join(" · ")}</p></Card>
      </div>

      <div className="mt-8 flex flex-wrap gap-x-8 gap-y-3 border-t pt-6 text-sm text-gray-700">
        <span className="flex items-center gap-2"><ShieldCheck className="text-emerald-700" /> Transparent procurement</span><span>Role-based access control</span><span>Real-time data sync</span><span>Fraud detection &amp; prevention</span><span>Faster payments (DBT via PFMS)</span><span>Farmer friendly &amp; easy to use</span><span className="ml-auto font-bold text-emerald-900">Better Farmers. Fair Markets. Brighter India.</span>
      </div>
    </div>
  );
}
