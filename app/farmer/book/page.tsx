"use client";
import { useMemo, useState } from "react";
import Link from "next/link";
import { CheckCircle2, AlertTriangle } from "lucide-react";
import { Card, Field, inputCls, PrimaryButton, PageHead, Badge } from "@/components/ui";
import { useStore } from "@/lib/store";
import { CENTRES, SLOTS, FARMER, GRADE_PRICES, totalKg, inr, type Booking } from "@/lib/data";

export default function BookPage() {
  const { bookings, addBooking } = useStore();
  const [centre, setCentre] = useState(CENTRES[0].name);
  const [date, setDate] = useState("2026-11-09");
  const [slot, setSlot] = useState(SLOTS[0]);
  const [qty, setQty] = useState(1000);
  const [grade, setGrade] = useState<keyof typeof GRADE_PRICES>("1");
  const [done, setDone] = useState<Booking | null>(null);
  const used = totalKg(bookings);
  const remaining = FARMER.yieldCeilingKg - used;
  const over = qty > remaining;
  const est = Math.round((qty / 100) * GRADE_PRICES[grade]);
  const centreShort = CENTRES.find((c) => c.name === centre)?.id ?? "Nashik-1";
  const displayDate = useMemo(() => { const d = new Date(date + "T00:00:00"); return d.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }); }, [date]);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (over || qty <= 0) return;
    const n = bookings.length + 1001;
    const b: Booking = { id: `B-${n}`, batchNo: `B00${n}`, token: `KLN12${n}`, receiptId: null, farmer: FARMER.name, village: FARMER.village, date, displayDate, centre, centreShort, crop: "Onion", quantityKg: qty, grade, pricePerQuintal: GRADE_PRICES[grade], status: "Confirmed", paymentStatus: "Estimated", utr: null, slot };
    addBooking(b); setDone(b);
  }

  if (done) return <div><PageHead title="Slot booked" sub="Your demo booking is confirmed. Show its QR token at the centre." /><Card className="max-w-xl p-6">
    <p className="flex items-center gap-2 font-bold text-emerald-800"><CheckCircle2 /> Booking confirmed</p>
    <dl className="mt-4 space-y-2 text-sm"><div className="flex justify-between"><dt>Token</dt><dd className="font-bold">{done.token}</dd></div><div className="flex justify-between"><dt>Date / slot</dt><dd>{done.displayDate} · {done.slot}</dd></div><div className="flex justify-between"><dt>Centre</dt><dd>{done.centre}</dd></div><div className="flex justify-between"><dt>Quantity</dt><dd>{done.quantityKg.toLocaleString("en-IN")} kg</dd></div><div className="flex justify-between"><dt>Estimated amount</dt><dd className="font-bold">{inr(Math.round((done.quantityKg / 100) * done.pricePerQuintal))}</dd></div></dl>
    <div className="mt-5 flex flex-wrap gap-3"><PrimaryButton href="/farmer/qr">Get QR Token</PrimaryButton><PrimaryButton href="/farmer" className="bg-white !text-emerald-800 ring-1 ring-emerald-200">Back to Dashboard</PrimaryButton></div>
    <p className="mt-3 text-xs text-gray-500">Demo only: this booking lives in your browser session. Use “Reset demo” in the header to restore the original 8 bookings.</p>
  </Card></div>;

  return <div><PageHead title="Book Procurement Slot" sub="Yield-ceiling checked live: you cannot book more than your farm's remaining demo ceiling." actions={<Badge>Remaining ceiling: {remaining.toLocaleString("en-IN")} kg</Badge>} />
    <div className="grid gap-6 lg:grid-cols-3"><Card className="p-6 lg:col-span-2"><form onSubmit={submit} className="grid gap-5 sm:grid-cols-2">
      <Field label="Centre"><select className={inputCls} value={centre} onChange={(e) => setCentre(e.target.value)}>{CENTRES.map((c) => <option key={c.id} value={c.name}>{c.name} — {c.bookedTonnesToday.toLocaleString("en-IN")}/{c.capacityTonnes.toLocaleString("en-IN")} tonnes booked today</option>)}</select></Field>
      <Field label="Delivery date"><input type="date" className={inputCls} value={date} onChange={(e) => setDate(e.target.value)} required /></Field>
      <Field label="Time slot"><select className={inputCls} value={slot} onChange={(e) => setSlot(e.target.value)}>{SLOTS.map((s) => <option key={s}>{s}</option>)}</select></Field>
      <Field label="Crop"><input className={inputCls} value="Onion" readOnly /></Field>
      <Field label="Quantity (kg)" hint={`Season used: ${used.toLocaleString("en-IN")} kg of ${FARMER.yieldCeilingKg.toLocaleString("en-IN")} kg ceiling.`}><input type="number" min={1} max={remaining} className={inputCls} value={qty} onChange={(e) => setQty(Number(e.target.value))} required /></Field>
      <Field label="Expected grade"><select className={inputCls} value={grade} onChange={(e) => setGrade(e.target.value as "1" | "2" | "3")}><option value="1">Grade 1 (Premium) — ₹1,850 / quintal</option><option value="2">Grade 2 (Standard) — ₹1,700 / quintal</option><option value="3">Grade 3 (Lower) — ₹1,550 / quintal</option></select></Field>
      {over && <p className="flex items-center gap-2 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-800 sm:col-span-2"><AlertTriangle size={17} /> This exceeds your remaining yield ceiling by {(qty - remaining).toLocaleString("en-IN")} kg. Reduce the quantity to book.</p>}
      <div className="sm:col-span-2"><PrimaryButton type="submit" className="w-full sm:w-auto">Confirm Booking</PrimaryButton></div>
    </form></Card>
    <Card className="h-fit p-6"><h2 className="font-bold">Booking summary</h2><dl className="mt-3 space-y-2 text-sm"><div className="flex justify-between"><dt>Centre</dt><dd className="text-right font-medium">{centreShort}</dd></div><div className="flex justify-between"><dt>Date</dt><dd>{displayDate}</dd></div><div className="flex justify-between"><dt>Slot</dt><dd>{slot}</dd></div><div className="flex justify-between"><dt>Quantity</dt><dd>{qty.toLocaleString("en-IN")} kg</dd></div><div className="flex justify-between"><dt>Rate</dt><dd>₹{GRADE_PRICES[grade].toLocaleString("en-IN")} / quintal</dd></div><div className="flex justify-between border-t pt-2"><dt className="font-bold">Estimated amount</dt><dd className="font-bold">{inr(est)}</dd></div></dl><p className="mt-3 text-xs text-gray-500">Final grade and amount are set at the centre after weighing. This estimate uses your selected grade only.</p><p className="mt-3 text-sm">Already booked? <Link href="/farmer/qr" className="font-semibold text-emerald-700">Get your QR token →</Link></p></Card></div>
  </div>;
}
