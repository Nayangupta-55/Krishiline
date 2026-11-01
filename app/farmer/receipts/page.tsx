"use client";
import { useState } from "react";
import { Download, Eye, X } from "lucide-react";
import { Card, Badge, GhostButton, PrimaryButton, PageHead } from "@/components/ui";
import { useStore } from "@/lib/store";
import { grossFor, hamaliFor, netFor, inr, type Booking } from "@/lib/data";
import { downloadReceipt } from "@/lib/receipt";

export default function ReceiptsPage() {
  const { bookings } = useStore();
  const [view, setView] = useState<Booking | null>(null);
  const sorted = [...bookings].sort((a, b) => b.date.localeCompare(a.date));
  return <div><PageHead title="Digital Receipts" sub="Every receipt amount is calculated from the same quantity × grade price as the booking — Gross, Hamali and Net all derive from it. Open one to verify it." />
    <Card className="overflow-x-auto p-5"><table className="w-full min-w-[720px] text-sm"><thead><tr className="text-left text-gray-500"><th className="py-2">Receipt</th><th>Date</th><th>Centre</th><th>Quantity</th><th>Grade / Rate</th><th>Gross / Net</th><th>Status</th><th>Actions</th></tr></thead><tbody>
      {sorted.map((b) => <tr key={b.id} className="border-t border-gray-100"><td className="py-3 font-semibold">{b.receiptId ?? "— pending —"}</td><td>{b.displayDate}</td><td>{b.centreShort}</td><td>{b.quantityKg.toLocaleString("en-IN")} kg</td><td>Grade {b.grade} · ₹{b.pricePerQuintal.toLocaleString("en-IN")}/qtl</td><td className="font-semibold">{inr(grossFor(b))}<br /><span className="text-xs font-normal text-gray-500">Net {inr(netFor(b))}</span></td><td><Badge tone={b.status === "Completed" ? "blue" : "green"}>{b.status}</Badge></td><td className="flex gap-2 py-3"><button onClick={() => setView(b)} className="flex items-center gap-1 font-semibold text-emerald-700"><Eye size={15} /> View</button><button onClick={() => downloadReceipt(b)} className="flex items-center gap-1 font-semibold text-emerald-700"><Download size={15} /> Download</button></td></tr>)}
    </tbody></table></Card>
    {view && <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" role="dialog" aria-modal="true" aria-label="Receipt preview">
      <Card className="w-full max-w-lg p-6"><div className="flex items-start justify-between"><div><h2 className="text-xl font-bold text-emerald-900">Krishi-Line — Digital Receipt</h2><p className="text-sm text-gray-500">Demo receipt · not an official document</p></div><button onClick={() => setView(null)} aria-label="Close"><X /></button></div>
        <dl className="mt-4 space-y-2 text-sm"><div className="flex justify-between border-b pb-2"><dt>Receipt ID</dt><dd className="font-semibold">{view.receiptId ?? "Issued after grading"}</dd></div><div className="flex justify-between border-b pb-2"><dt>QR Token</dt><dd className="font-mono font-semibold">{view.token}</dd></div><div className="flex justify-between border-b pb-2"><dt>Farmer</dt><dd>Ramesh Patil</dd></div><div className="flex justify-between border-b pb-2"><dt>Date / Slot</dt><dd>{view.displayDate} · {view.slot}</dd></div><div className="flex justify-between border-b pb-2"><dt>Centre</dt><dd>{view.centre}</dd></div><div className="flex justify-between border-b pb-2"><dt>Crop / Grade</dt><dd>{view.crop} / Grade {view.grade}</dd></div><div className="flex justify-between border-b pb-2"><dt>Quantity</dt><dd>{view.quantityKg.toLocaleString("en-IN")} kg</dd></div><div className="flex justify-between border-b pb-2"><dt>Price</dt><dd>₹{view.pricePerQuintal.toLocaleString("en-IN")} / quintal</dd></div><div className="flex justify-between border-b pb-2"><dt>Gross amount</dt><dd className="font-semibold">{inr(grossFor(view))}</dd></div><div className="flex justify-between border-b pb-2"><dt>Hamali deduction</dt><dd>− {inr(hamaliFor(view))}</dd></div><div className="flex justify-between border-b pb-2"><dt>Other deductions</dt><dd>− ₹200</dd></div><div className="flex justify-between pt-1"><dt className="font-bold">Net payable</dt><dd className="text-lg font-bold">{inr(netFor(view))}</dd></div></dl>
        <div className="mt-5 flex gap-3"><PrimaryButton onClick={() => downloadReceipt(view)}>Download HTML receipt</PrimaryButton><GhostButton onClick={() => window.print()}>Print</GhostButton></div>
      </Card></div>}
  </div>;
}
