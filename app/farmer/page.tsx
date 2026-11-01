"use client";
import Link from "next/link";
import { CalendarPlus, LandPlot, QrCode, ReceiptText, ArrowRight, Bell, MapPin, Clock, IndianRupee, Package, Truck, MessageCircle } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Card, Badge, PrimaryButton, GhostButton } from "@/components/ui";
import { useStore } from "@/lib/store";
import { FARMER, totalKg, totalAmount, totalNet, amountFor, inr, kgFmt } from "@/lib/data";

const ACTIONS = [
  { href: "/farmer/whatsapp", icon: MessageCircle, title: "WhatsApp Bot", desc: "Verify & book on WhatsApp — no app needed", bg: "bg-green-100 text-green-800" },
  { href: "/farmer/book", icon: CalendarPlus, title: "Book New Slot", desc: "Schedule your delivery at nearest center", bg: "bg-emerald-100 text-emerald-800" },
  { href: "/farmer/land", icon: LandPlot, title: "View 7/12 Records", desc: "Check your land and crop details", bg: "bg-blue-100 text-blue-800" },
  { href: "/farmer/qr", icon: QrCode, title: "Get QR Token", desc: "Show at center for weighing and grading", bg: "bg-amber-100 text-amber-800" },
  { href: "/farmer/receipts", icon: ReceiptText, title: "View Receipts", desc: "Download your digital receipts", bg: "bg-rose-100 text-rose-800" },
];

export default function FarmerDashboard() {
  const { bookings } = useStore();
  const sorted = [...bookings].sort((a, b) => b.date.localeCompare(a.date));
  const upcoming = bookings.find((b) => b.status === "Confirmed") ?? sorted[0];
  const completed = bookings.filter((b) => b.status === "Completed");
  const paid = bookings.filter((b) => b.paymentStatus === "Paid");
  const monthly = ["2026-08", "2026-09", "2026-10", "2026-11"].map((m) => ({
    month: m === "2026-08" ? "Aug" : m === "2026-09" ? "Sep" : m === "2026-10" ? "Oct" : "Nov",
    kg: bookings.filter((b) => b.date.startsWith(m)).reduce((s, b) => s + b.quantityKg, 0),
  }));
  return (
    <div>
      <section className="overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-50 via-white to-emerald-100 p-6 sm:p-8">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-sm text-gray-600">Welcome back,</p>
            <h1 className="flex flex-wrap items-center gap-3 text-3xl font-extrabold text-emerald-900 sm:text-4xl">Ramesh Patil <Badge>✓ Verified Farmer</Badge></h1>
            <p className="mt-2 max-w-xl text-gray-600">Manage your procurement bookings, view records and track your produce — all in one place.</p>
            <p className="mt-1 flex items-center gap-1 text-sm text-gray-500"><MapPin size={15} /> {FARMER.village} · {FARMER.landAcres} acres · Yield ceiling {kgFmt(FARMER.yieldCeilingKg)}</p>
          </div>
          <button className="relative rounded-full bg-white p-3 shadow" aria-label="Notifications"><Bell /><span className="absolute right-2 top-2 h-2.5 w-2.5 rounded-full bg-red-500" /></button>
        </div>
        <p className="mt-4 text-right font-serif text-xl font-bold italic text-emerald-800">“Fair Markets, Brighter Farmers.”</p>
      </section>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {ACTIONS.map((a) => <Link key={a.title} href={a.href}><Card className="flex h-full items-center gap-4 p-5 transition hover:shadow-md"><span className={`rounded-2xl p-3 ${a.bg}`}><a.icon size={24} /></span><span><span className="block font-bold">{a.title}</span><span className="text-sm text-gray-600">{a.desc}</span></span><ArrowRight className="ml-auto text-gray-400" size={18} /></Card></Link>)}
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Card className="p-5">
            <div className="flex items-center justify-between"><h2 className="text-lg font-bold">Upcoming Booking</h2><Link href="/farmer/book" className="text-sm font-semibold text-emerald-700">View All →</Link></div>
            {upcoming && <div className="mt-4 rounded-2xl bg-emerald-50 p-5">
              <div className="flex flex-wrap items-start justify-between gap-3"><div className="flex gap-4"><div className="rounded-xl bg-white px-4 py-2 text-center shadow-sm"><p className="text-2xl font-extrabold">{upcoming.displayDate.split(" ")[0]}</p><p className="text-xs text-gray-500">{upcoming.displayDate.split(" ").slice(1).join(" ")}</p></div><div><p className="font-bold">{upcoming.centre}</p><p className="text-sm text-gray-600">{FARMER.district}</p><p className="mt-1 flex flex-wrap gap-3 text-sm"><span className="flex items-center gap-1"><Clock size={15} /> {upcoming.slot}</span><span>🧅 {upcoming.crop} · {kgFmt(upcoming.quantityKg)} (Est.)</span></p></div></div><Badge tone={upcoming.status === "Confirmed" ? "green" : "blue"}>✓ {upcoming.status}</Badge></div>
              <div className="mt-4 flex flex-wrap gap-3"><GhostButton href="/farmer/qr">View QR Token</GhostButton><PrimaryButton href="/farmer/book">Manage Booking →</PrimaryButton></div>
            </div>}
          </Card>
          <Card className="p-5">
            <div className="flex items-center justify-between"><h2 className="text-lg font-bold">Recent Bookings</h2><Link href="/farmer/receipts" className="text-sm font-semibold text-emerald-700">View All →</Link></div>
            <div className="mt-3 overflow-x-auto"><table className="w-full min-w-[560px] text-sm"><thead><tr className="text-left text-gray-500"><th className="py-2">Date</th><th>Center</th><th>Crop</th><th>Quantity (kg)</th><th>Status</th><th>Receipt</th></tr></thead><tbody>{sorted.slice(0, 5).map((b) => <tr key={b.id} className="border-t border-gray-100"><td className="py-3">{b.displayDate}</td><td>{b.centreShort}</td><td>🧅 {b.crop}</td><td>{b.quantityKg.toLocaleString("en-IN")}</td><td><Badge tone={b.status === "Confirmed" ? "green" : "blue"}>{b.status}</Badge></td><td><Link href="/farmer/receipts" className="font-semibold text-emerald-700">View</Link></td></tr>)}</tbody></table></div>
            <p className="mt-3 text-xs text-gray-500">Showing the 5 latest of {bookings.length} season bookings. Totals below use all {bookings.length}.</p>
          </Card>
        </div>
        <div className="space-y-6">
          <Card className="p-5"><div className="flex items-center justify-between"><h2 className="text-lg font-bold">Your Procurement Stats</h2><span className="text-xs font-semibold text-gray-500">This Season</span></div>
            <div className="mt-4 grid grid-cols-3 gap-3 text-center">
              <div className="rounded-xl bg-emerald-50 p-3"><Package className="mx-auto text-emerald-700" /><p className="mt-1 text-xs text-gray-500">Total Quantity</p><p className="font-bold">{kgFmt(totalKg(bookings))}</p></div>
              <div className="rounded-xl bg-blue-50 p-3"><IndianRupee className="mx-auto text-blue-700" /><p className="mt-1 text-xs text-gray-500">Total Amount</p><p className="font-bold">{inr(totalAmount(bookings))}</p></div>
              <div className="rounded-xl bg-violet-50 p-3"><Truck className="mx-auto text-violet-700" /><p className="mt-1 text-xs text-gray-500">Total Bookings</p><p className="font-bold">{bookings.length}</p></div>
            </div>
            <div className="mt-3 space-y-1 text-sm text-gray-600"><p>Completed gross: <b className="text-gray-900">{inr(totalAmount(completed))}</b> · Net payable: <b className="text-gray-900">{inr(totalNet(completed))}</b></p><p>Paid so far (net): <b className="text-gray-900">{inr(totalNet(paid))}</b> · Upcoming estimate (gross): <b className="text-gray-900">{inr(amountFor(upcoming))}</b></p><p className="text-xs text-gray-500">Net = Gross − Hamali ₹100/quintal − ₹200 other. Ceiling used: {(totalKg(bookings) / 100).toFixed(1)} / 120 quintals.</p></div>
            <h3 className="mt-5 font-semibold">Monthly Procurement (kg)</h3>
            <div className="h-44"><ResponsiveContainer width="100%" height="100%"><BarChart data={monthly}><CartesianGrid strokeDasharray="3 3" vertical={false} /><XAxis dataKey="month" /><YAxis /><Tooltip formatter={(v) => [`${Number(v).toLocaleString("en-IN")} kg`, "Quantity"]} /><Bar dataKey="kg" fill="#059669" radius={[6, 6, 0, 0]} /></BarChart></ResponsiveContainer></div>
            <p className="text-xs text-gray-500">Aug {monthly[0].kg.toLocaleString("en-IN")} + Sep {monthly[1].kg.toLocaleString("en-IN")} + Oct {monthly[2].kg.toLocaleString("en-IN")} + Nov {monthly[3].kg.toLocaleString("en-IN")} = {kgFmt(totalKg(bookings))}.</p>
          </Card>
          <Card className="p-5"><h2 className="text-lg font-bold">Important Updates</h2><ul className="mt-3 space-y-3 text-sm"><li><b>New slots available for next week</b><br /><span className="text-gray-500">Nashik Center – 1 · 2 hours ago</span></li><li><b>Grade 1 (Premium) price in demo</b><br /><span className="text-gray-500">₹1,850 / quintal · 1 day ago</span></li><li><b>Carry original documents</b><br /><span className="text-gray-500">Please bring Aadhaar and land records · 3 days ago</span></li></ul></Card>
          <Card className="p-5"><h2 className="text-lg font-bold">Quick Links</h2><ul className="mt-2 space-y-1 text-sm font-medium">{[["Check Market Prices", "/farmer/payments"], ["Find Nearest Center", "/farmer/book"], ["Download Guidelines", "/farmer/land"], ["Farmer Helpline", "/farmer"]].map(([t, h]) => <li key={t}><Link href={h} className="flex justify-between rounded-lg px-2 py-2 hover:bg-emerald-50">{t}<span>›</span></Link></li>)}</ul></Card>
        </div>
      </div>
    </div>
  );
}
