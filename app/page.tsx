"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { CalendarCheck, FileText, IndianRupee, ShieldCheck, Clock, Users, Building2, Scale, ArrowRight, CheckCircle2, Tractor, ClipboardCheck, PackageCheck, Wallet, MessageCircle, ShieldAlert, Printer, TrendingUp, MapPin } from "lucide-react";
import { Card, Badge, PrimaryButton, GhostButton } from "@/components/ui";
import { useStore } from "@/lib/store";
import { totalKg, totalGross, totalNet, inr, kgFmt, CENTRES, DISTRICT, GRADE_PRICES } from "@/lib/data";

const ROLES = [
  { icon: MessageCircle, title: "1 · Farmer (WhatsApp Bot)", desc: "Easy registration, land verification and slot booking via WhatsApp. No app to install.", href: "/farmer/whatsapp", color: "bg-blue-100 text-blue-800", features: ["Land verification", "4-hour slot booking", "QR token", "Digital receipt", "Booking updates"] },
  { icon: ClipboardCheck, title: "2 · Government Clerk", desc: "Weighing, grading, receipt generation and QR sticker printing.", href: "/roles/clerk", color: "bg-emerald-100 text-emerald-800", features: ["QR scan & verify", "Enter weight & grade", "Quality grading", "Digital receipt", "Print QR sticker"] },
  { icon: Wallet, title: "3 · Center Accountant", desc: "Digital ledger, deductions and payment processing via PFMS.", href: "/roles/accountant", color: "bg-violet-100 text-violet-800", features: ["Verified entries", "Calculate payable amount", "Bank verification", "Digital signature", "PFMS submission (DBT)"] },
  { icon: Building2, title: "4 · Collector Admin Staff", desc: "District monitoring, anomaly detection and vigilance alerts.", href: "/roles/collector", color: "bg-amber-100 text-amber-800", features: ["District overview", "Grade comparison", "Red flag alerts", "Investigations", "Reports & export"] },
  { icon: Users, title: "5 · FPO Cooperative", desc: "Bulk crop upload, group slot booking and member management.", href: "/roles/fpo", color: "bg-rose-100 text-rose-800", features: ["Bulk farmer upload", "Member management", "Group slot booking", "Booking tracking", "WhatsApp notifications"] },
  { icon: PackageCheck, title: "6 · Warehouse Supervisor", desc: "Batch verification, queue management and fraud prevention.", href: "/roles/warehouse", color: "bg-orange-100 text-orange-800", features: ["Live batch queue", "QR scan & inspect", "Approve or flag", "Physical verification", "Real-time updates"] },
];
const COMPARISON = [
  { row: "Gate entry & waiting", govt: "3–4 day queue gridlocks; farmers sleep on roads (farmer-reported)", priv: "Open bidding; arrive 7 AM, leave by 12 noon", kl: "Guaranteed 4-hour windows via WhatsApp token — no physical queue" },
  { row: "Data tracking", govt: "Handwritten registers & loose paper chits, easily altered", priv: "Structured 3-slip master book (farmer / committee / trader)", kl: "Crypto-signed digital slips; locked receipts on WhatsApp" },
  { row: "Accountant workload", govt: "Hours of messy registers; high error margins", priv: "Next-day manual re-typing of thousands of slips", kl: "Automated digital ledger — clean, pre-calculated rows" },
  { row: "Payout timeline", govt: "DBT takes 3–4 weeks (farmer-reported)", priv: "Online transfer within ~30 minutes of auction close", kl: "Verified invoices to PFMS — design target: 2 days" },
  { row: "Corruption risk", govt: "Trader–official cartel; fake entries, out-of-state dumping", priv: "Speed + direct financial stakes keep it transparent", kl: "Yield ceilings + random supervisor audits + variance alarms" },
];
const SAFEGUARDS = [
  { icon: Clock, title: "Late arrival? Standby Queue", desc: "Centres book to 90% only, leaving a 10% cushion every hour. Miss your 4-hour window + 2-hour grace? Join the Standby Queue, cleared in the next cushion slots — or get an Auto-Rollover VIP Priority Pass for 8:00 AM next morning." },
  { icon: PackageCheck, title: "Queue jumps? Auto-reorder", desc: "If trolleys arrive out of order, scanning the QR sticker instantly reorders the supervisor's FIFO queue to the correct batch — the system adapts, it doesn't panic." },
  { icon: Printer, title: "Sticker tampering? Shredded labels", desc: "Ultra-destructible thermal labels shred into confetti if peeled. A load with a missing sticker is blocked until physical inspection — and the supervisor still knows which batch it is from the chronological queue." },
  { icon: ShieldAlert, title: "Three-way cartel? Three firewalls", desc: "Yield-ceiling lock (2 acres = 120 quintals, locked globally), statistical variance alarm (a centre logging 72% Grade-1 while neighbours log 28–35% triggers a Level-3 Collector flag), and a treasury lock that freezes the batch before any money leaves." },
];

export default function Home() {
  const { bookings } = useStore();
  const completed = bookings.filter((b) => b.status === "Completed");
  return (
    <div>
      {/* Hero — matches the reference image */}
      <section id="about" className="relative overflow-hidden bg-gradient-to-br from-emerald-50 via-white to-amber-50">
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-14 sm:px-6 lg:grid-cols-2 lg:py-20">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <Badge>NAFED / NCCF · Nashik Model</Badge>
            <h1 className="mt-4 text-4xl font-extrabold leading-[1.05] tracking-tight text-gray-900 sm:text-5xl lg:text-6xl">Fair Prices<br /><span className="text-emerald-700">For Our Farmers</span></h1>
            <p className="mt-4 max-w-xl text-base text-gray-600 sm:text-lg">A transparent, digital procurement platform to <b className="text-gray-900">eliminate</b> middlemen, prevent corruption and ensure timely payments to farmers.</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <PrimaryButton href="/farmer/whatsapp">Get Started <ArrowRight size={17} /></PrimaryButton>
              <GhostButton href="#problem">Learn More</GhostButton>
            </div>
            <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3 text-sm text-gray-700">
              <span className="flex items-center gap-2"><ShieldCheck className="text-emerald-700" size={18} /> Transparent procurement</span>
              <span className="flex items-center gap-2"><Scale className="text-emerald-700" size={18} /> Fair market prices</span>
              <span className="flex items-center gap-2"><IndianRupee className="text-emerald-700" size={18} /> Faster payments (DBT via PFMS)</span>
            </div>
          </motion.div>
          <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6 }} className="relative">
            <div className="overflow-hidden rounded-3xl border border-emerald-100 bg-gradient-to-b from-sky-200 via-emerald-100 to-emerald-200 shadow-xl">
              <div className="px-6 pt-6"><p className="text-right font-serif text-2xl font-bold italic text-emerald-900">“Farmer First”</p></div>
              <div className="flex items-end justify-center gap-2 px-6 pb-0 pt-4" aria-hidden>
                <div className="mb-6 hidden rounded-2xl bg-white/90 p-4 shadow sm:block"><p className="text-xs font-semibold text-gray-500">NEXT SLOT</p><p className="font-bold text-emerald-900">09 Nov · 8 AM – 12 PM</p><p className="text-sm text-gray-600">Nashik Center – 1 · 1,000 kg</p></div>
                <div className="flex flex-col items-center"><div className="flex gap-1">{[0, 1, 2, 3].map((i) => <span key={i} className="block h-10 w-10 rounded-full bg-rose-700/90 ring-4 ring-rose-200" />)}</div><div className="mt-1 h-16 w-28 rounded-t-full bg-amber-700/80" /></div>
                <Tractor className="mb-8 text-emerald-900" size={44} />
              </div>
              <div className="flex items-center gap-2 bg-white/90 px-5 py-3 text-sm"><MapPin size={17} className="text-emerald-700" /> Supporting Farmers of Maharashtra <span className="ml-auto hidden items-center gap-1 text-gray-500 sm:flex"><Clock size={15} /> 4-hour windows · no gate queue</span></div>
            </div>
            <div className="absolute -bottom-4 left-4 rounded-2xl bg-white px-4 py-3 shadow-lg"><p className="text-xs text-gray-500">Grade 1 (Premium) demo rate</p><p className="font-bold text-emerald-800">₹{GRADE_PRICES["1"].toLocaleString("en-IN")} / quintal</p></div>
          </motion.div>
        </div>
      </section>

      {/* Live demo stats — derived from the booking list */}
      <section id="market" className="mx-auto max-w-7xl px-4 sm:px-6"><div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Ramesh Patil — season quantity", value: kgFmt(totalKg(bookings)), note: `${bookings.length} bookings · ceiling 120 quintals` },
          { label: "Completed gross value", value: inr(totalGross(completed)), note: "Quantity × grade rate, from receipts" },
          { label: "Completed net payable", value: inr(totalNet(completed)), note: "After Hamali ₹100/qtl + ₹200 other" },
          { label: "District demo scope", value: `${DISTRICT.centres} centres · ${DISTRICT.farmers.toLocaleString("en-IN")} farmers`, note: `${DISTRICT.quintalsProcured.toLocaleString("en-IN")} quintals procured (illustrative)` },
        ].map((s) => <Card key={s.label} className="p-5"><p className="text-2xl font-extrabold text-emerald-900">{s.value}</p><p className="mt-1 text-sm font-semibold">{s.label}</p><p className="text-xs text-gray-500">{s.note}</p></Card>)}
      </div></section>

      {/* Problem — workflow Part 1 + 2, honestly labelled */}
      <section id="problem" className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
        <h2 className="text-2xl font-bold sm:text-3xl">The problem Krishi-Line attacks</h2>
        <p className="mt-2 max-w-3xl text-gray-600">The story below is the team’s <b>farmer-reported field narrative</b> — what farmers in the team’s research described — not a verified official finding. The one verified anchor: a 5-member inquiry committee on Nashik NAFED/NCCF onion procurement was constituted by Maharashtra GR on 29 Sep 2026, chaired by the Nashik Collector. Queue lengths and payout delays in the table are farmer-reported claims from the team’s workflow document.</p>
        <div className="mt-5 grid gap-4 md:grid-cols-3">
          <Card className="p-5"><h3 className="font-bold">Long queues, by design?</h3><p className="mt-1 text-sm text-gray-600">Farmers described multi-day tractor lines in the sun — rented tractors idling, onions losing moisture and weight in the heat, then getting a low grade at the scale. The team’s narrative says this pushed genuine farmers to leave, making room for out-of-state trader trucks. Treat this as an allegation to investigate, not as proven fact.</p></Card>
          <Card className="p-5"><h3 className="font-bold">Paper that can be rewritten</h3><p className="mt-1 text-sm text-gray-600">Handwritten registers and loose paper chits (kacchi slips) can be altered, falsified or destroyed. Accountants then spend days re-typing them, and DBT crawls — farmers reported waiting 3–4 weeks for payment.</p></Card>
          <Card className="p-5"><h3 className="font-bold">Why farmers prefer private centres</h3><p className="mt-1 text-sm text-gray-600">Private centres run open auctions: arrive at 7 AM, leave by noon, paid within ~30 minutes. Krishi-Line’s bet is to give government centres the same speed — with public, tamper-evident records the private route doesn’t need.</p></Card>
        </div>
        <Card className="mt-6 overflow-x-auto p-5"><h3 className="font-bold">Government vs Private vs Krishi-Line</h3>
          <table className="mt-3 w-full min-w-[760px] text-sm"><thead><tr className="text-left text-gray-500"><th className="py-2"></th><th>Government (reported)</th><th>Private centre</th><th>Krishi-Line</th></tr></thead><tbody>
            {COMPARISON.map((c) => <tr key={c.row} className="border-t border-gray-100 align-top"><td className="py-3 font-semibold">{c.row}</td><td className="py-3 pr-3 text-gray-600">{c.govt}</td><td className="py-3 pr-3 text-gray-600">{c.priv}</td><td className="py-3 font-medium text-emerald-900">{c.kl}</td></tr>)}
          </tbody></table>
          <p className="mt-2 text-xs text-gray-500">“2 days” is Krishi-Line’s design target for PFMS settlement in this prototype, not a measured result.</p>
        </Card>
      </section>

      {/* Role-wise workflow — cover p.1 */}
      <section className="bg-white py-14"><div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex flex-wrap items-end justify-between gap-4"><div><h2 className="text-2xl font-bold sm:text-3xl">Role-Wise Workflow &amp; Features</h2><p className="mt-1 text-gray-600">A complete system overview — one codebase, six role views (plus Admin provisioning). Every card below opens a working demo screen.</p></div><Link href="/workflow" className="flex items-center gap-1 text-sm font-semibold text-emerald-700">Full workflow overview <ArrowRight size={16} /></Link></div>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {ROLES.map((r) => <Link key={r.title} href={r.href}><Card className="group h-full p-5 transition hover:-translate-y-0.5 hover:shadow-md"><span className={`inline-flex rounded-xl p-2.5 ${r.color}`}><r.icon size={22} /></span><h3 className="mt-3 font-bold">{r.title}</h3><p className="mt-1 text-sm text-gray-600">{r.desc}</p><ul className="mt-3 space-y-1 text-sm text-gray-700">{r.features.map((f) => <li key={f} className="flex gap-2"><CheckCircle2 size={15} className="mt-0.5 shrink-0 text-emerald-700" />{f}</li>)}</ul><span className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-emerald-700">Open workflow <ArrowRight size={15} className="transition group-hover:translate-x-0.5" /></span></Card></Link>)}
        </div>
        <div className="mt-6 flex flex-wrap gap-x-8 gap-y-3 text-sm text-gray-700">
          <span className="flex items-center gap-2"><ShieldCheck className="text-emerald-700" /> Transparent procurement</span>
          <span className="flex items-center gap-2"><Users className="text-emerald-700" /> Role-based access control</span>
          <span className="flex items-center gap-2"><TrendingUp className="text-emerald-700" /> Real-time data sync</span>
          <span className="flex items-center gap-2"><ShieldAlert className="text-emerald-700" /> Fraud detection &amp; prevention</span>
          <span className="flex items-center gap-2"><IndianRupee className="text-emerald-700" /> Faster payments (DBT via PFMS)</span>
        </div>
      </div></section>

      {/* Safeguards — workflow Part 4 */}
      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
        <h2 className="text-2xl font-bold sm:text-3xl">Crushing every loophole</h2><p className="mt-1 text-gray-600">The safeguards from the updated workflow, each one demo-able in the app.</p>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {SAFEGUARDS.map((s) => <Card key={s.title} className="p-5"><s.icon className="text-emerald-700" /><h3 className="mt-2 font-bold">{s.title}</h3><p className="mt-1 text-sm text-gray-600">{s.desc}</p></Card>)}
        </div>
        <div className="mt-4 flex flex-wrap gap-3"><PrimaryButton href="/roles/collector">See the variance alarm live</PrimaryButton><GhostButton href="/roles/warehouse">Try the supervisor gate</GhostButton><GhostButton href="/farmer/book">Test the standby rule — book a slot</GhostButton></div>
      </section>

      {/* Revenue + Roadmap */}
      <section id="resources" className="bg-white py-14"><div className="mx-auto grid max-w-7xl gap-6 px-4 sm:px-6 lg:grid-cols-2">
        <Card className="p-6"><h2 className="text-xl font-bold">How it earns (business model)</h2><p className="mt-1 text-sm text-gray-500">Farmers never pay. Three institutional streams:</p><ul className="mt-4 space-y-3 text-sm text-gray-700">
          <li><b>Government SaaS (B2G):</b> seasonal fee per centre from NAFED/NCCF, for the platform + thermal sticker-printer kit.</li>
          <li><b>FPO Premium Portals (B2B SaaS):</b> monthly subscription for bulk upload, group booking and payout tracking.</li>
          <li><b>Anonymised market insights:</b> regional crop volume &amp; quality forecasts for retail buyers — aggregated, anonymised data only.</li>
        </ul></Card>
        <Card className="p-6"><h2 className="text-xl font-bold">Production roadmap</h2><p className="mt-1 text-sm text-gray-500">Beyond the competition — what replaces the mock database:</p><ol className="mt-4 list-decimal space-y-2 pl-5 text-sm text-gray-700">
          <li>Approach the state IT / Agriculture department or national AgriStack team for formal platform permission and API documentation.</li>
          <li>Phase out mock tables; plug in authorised APIs for farmer authentication and live land/crop records.</li>
          <li>Keep the architecture flexible — one unified gateway or several secure REST APIs, whatever the government provides.</li>
        </ol><p className="mt-3 text-xs text-gray-500">Today the WhatsApp OTP, land check and PFMS steps are simulations with fictional demo data. Nothing here claims a live government integration.</p></Card>
      </div></section>

      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6"><Card className="flex flex-wrap items-center justify-between gap-4 bg-emerald-800 p-8 !text-white">
        <div><h2 className="text-2xl font-bold">Try the full demo flow</h2><p className="mt-1 text-emerald-100">Start on WhatsApp, get your QR token, then watch the same batch move through clerk, warehouse, accountant and collector screens.</p></div>
        <div className="flex gap-3"><PrimaryButton href="/farmer/whatsapp" className="bg-white !text-emerald-900 hover:bg-emerald-50">Start on WhatsApp</PrimaryButton><GhostButton href="/workflow" className="border-white/30 bg-transparent !text-white hover:bg-white/10">Workflow overview</GhostButton></div>
      </Card>
      <div className="mt-6"><h3 className="font-bold">Centres in this demo</h3><div className="mt-2 grid gap-3 sm:grid-cols-3">{CENTRES.slice(0, 3).map((c) => <Card key={c.id} className="p-4 text-sm"><p className="font-bold">{c.name}</p><p className="text-gray-600">{c.slotsBooked}/{c.slotCapacity} slots booked · {c.bookedTonnesToday.toLocaleString("en-IN")} / {c.capacityTonnes.toLocaleString("en-IN")} tonnes today</p></Card>)}</div></div>
      </section>
    </div>
  );
}
