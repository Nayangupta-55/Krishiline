"use client";
import { CheckCircle2, Circle, Clock3 } from "lucide-react";
import { Card, Badge, PageHead } from "@/components/ui";
import { useStore } from "@/lib/store";
import { grossFor, netFor, inr, totalNet } from "@/lib/data";

const STEPS = ["Receipt issued", "Accountant approved", "PFMS submitted (demo)", "DBT credited (demo)"];
function stepIndex(p: string) { return p === "Paid" ? 4 : p === "Processing" ? 2 : 1; }

export default function PaymentsPage() {
  const { bookings } = useStore();
  const paid = bookings.filter((b) => b.paymentStatus === "Paid");
  const processing = bookings.filter((b) => b.paymentStatus === "Processing");
  const estimated = bookings.filter((b) => b.paymentStatus === "Estimated");
  const sorted = [...bookings].sort((a, b) => b.date.localeCompare(a.date));
  return <div><PageHead title="Payment Tracking" sub="Demo PFMS-style timeline. What you receive is the Net Payable — Gross minus Hamali (₹100/quintal) minus ₹200 other deductions — exactly as on the receipt and the accountant's ledger." />
    <div className="grid gap-4 sm:grid-cols-3">
      <Card className="p-5"><p className="text-sm text-gray-500">Credited (demo) — net</p><p className="text-2xl font-bold text-emerald-800">{inr(totalNet(paid))}</p><p className="text-sm text-gray-600">{paid.length} bookings · UTRs shown below are demo values</p></Card>
      <Card className="p-5"><p className="text-sm text-gray-500">Processing — net</p><p className="text-2xl font-bold text-amber-700">{inr(totalNet(processing))}</p><p className="text-sm text-gray-600">{processing.length} booking awaiting accountant / PFMS step</p></Card>
      <Card className="p-5"><p className="text-sm text-gray-500">Upcoming estimate — net</p><p className="text-2xl font-bold">{inr(totalNet(estimated))}</p><p className="text-sm text-gray-600">Payable only after delivery and grading</p></Card>
    </div>
    <div className="mt-6 space-y-4">{sorted.map((b) => { const done = stepIndex(b.paymentStatus); return (
      <Card key={b.id} className="p-5"><div className="flex flex-wrap justify-between gap-3"><div><p className="font-bold">{b.displayDate} · {b.centreShort} · {b.quantityKg.toLocaleString("en-IN")} kg</p><p className="text-sm text-gray-600">Token {b.token} · Receipt {b.receiptId ?? "pending"} {b.utr ? `· UTR ${b.utr}` : ""}</p></div><div className="text-right"><p className="font-bold">{inr(netFor(b))} <span className="text-xs font-normal text-gray-500">(gross {inr(grossFor(b))})</span></p><Badge tone={b.paymentStatus === "Paid" ? "green" : b.paymentStatus === "Processing" ? "amber" : "gray"}>{b.paymentStatus}</Badge></div></div>
        <ol className="mt-4 flex flex-wrap gap-x-6 gap-y-2">{STEPS.map((s, i) => <li key={s} className="flex items-center gap-1.5 text-sm"><span className={i < done ? "text-emerald-700" : "text-gray-400"}>{i < done ? <CheckCircle2 size={16} /> : i === done ? <Clock3 size={16} /> : <Circle size={16} />}</span><span className={i < done ? "font-semibold text-emerald-800" : "text-gray-600"}>{s}</span></li>)}</ol>
      </Card>); })}
    </div>
  </div>;
}
