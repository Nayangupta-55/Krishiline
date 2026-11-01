"use client";
import { useState } from "react";
import { Card, Badge, PageHead, PrimaryButton, GhostButton } from "@/components/ui";
import { DISTRICT_BATCHES, SEED_BOOKINGS, GRADE_LABEL, inr, grossFor } from "@/lib/data";

// The 22 Oct gate queue (cover p.7): B00124–B00128. Day totals on the
// cover are 12 batches (Pending 8, Approved 3, Audit 1); the 5 rows below
// are the ones in front of the supervisor right now.
type BatchStatus = "Pending" | "Approved" | "Flagged";
const QUEUE = [
  ...SEED_BOOKINGS.filter((b) => b.batchNo === "B00124"),
  ...DISTRICT_BATCHES,
];
const ORANGE = (batchNo: string, grade: string) => batchNo === "B00126" || grade === "1";

export default function WarehousePage() {
  const [status, setStatus] = useState<Record<string, BatchStatus>>({ B00126: "Pending" });
  const [selected, setSelected] = useState(QUEUE[2] ?? QUEUE[0]);
  const [scanned, setScanned] = useState(false);
  const [note, setNote] = useState("");
  const get = (id: string): BatchStatus => status[id] ?? "Pending";
  const approved = Object.values(status).filter((s) => s === "Approved").length;
  const flagged = Object.values(status).filter((s) => s === "Flagged").length;
  const pending = QUEUE.length - approved - flagged;
  const orange = ORANGE(selected.batchNo, selected.grade);

  return <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6"><PageHead title="Warehouse Supervisor Dashboard" sub="Role 6 — Batch verification, queue management & fraud prevention. FIFO queue, Green Pass for ~90% of loads, mandatory Orange scan for 15–20% random + 100% of Premium Grade-1 batches." />
    <div className="grid gap-4 sm:grid-cols-4">
      <Card className="p-5"><p className="text-sm text-gray-500">Live incoming queue (today)</p><p className="text-2xl font-bold">All (12) · Pending (8) · Approved (3) · Audit (1)</p><p className="text-xs text-gray-500">5 batches in front of the gate right now.</p></Card>
      <Card className="p-5"><p className="text-sm text-gray-500">Pending at this gate</p><p className="text-2xl font-bold text-amber-700">{pending}</p></Card>
      <Card className="p-5"><p className="text-sm text-gray-500">Approved in this session</p><p className="text-2xl font-bold text-emerald-700">{approved}</p></Card>
      <Card className="p-5"><p className="text-sm text-gray-500">Flagged (frozen)</p><p className="text-2xl font-bold text-red-700">{flagged}</p><p className="text-xs text-gray-500">Flagged rows get no payment approval.</p></Card>
    </div>
    {note && <p className="mt-4 rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-900">{note}</p>}
    <div className="mt-6 grid gap-6 lg:grid-cols-3">
      <Card className="p-5"><h2 className="font-bold">1 · Live incoming queue — FIFO</h2><p className="text-xs text-gray-500">Batches auto-update in real-time (WebSocket in production; shared demo state here). Click a row to inspect it.</p>
        <ul className="mt-3 space-y-2">{QUEUE.map((b, i) => { const st = get(b.batchNo); return <li key={b.batchNo}><button onClick={() => { setSelected(b); setScanned(false); }} className={`w-full rounded-xl border px-3 py-2.5 text-left text-sm ${selected.batchNo === b.batchNo ? "border-emerald-600 bg-emerald-50" : "hover:bg-gray-50"}`}><span className="mr-2 font-bold text-gray-400">{i + 1}</span><b>{b.batchNo}</b> · {b.farmer} · {GRADE_LABEL[b.grade].split(" (")[0]} <Badge tone={st === "Approved" ? "green" : st === "Flagged" ? "red" : ORANGE(b.batchNo, b.grade) ? "amber" : "gray"}>{st === "Pending" ? (ORANGE(b.batchNo, b.grade) ? "Audit" : "Pending") : st}</Badge></button></li>; })}</ul>
        <div className="mt-4 rounded-xl bg-amber-50 p-3 text-sm text-amber-900"><b>Step 3 — the Hamal workflow:</b> loose onions are packed into jute bags ({selected.bags ?? 50} bags for this batch), the QR sticker goes on the first bag, and the trolley is pushed 50 m to the godown. Barricades force trolleys through one at a time.</div>
      </Card>
      <Card className="p-5"><h2 className="font-bold">2 · Verify batch details</h2>
        <dl className="mt-3 space-y-2 text-sm"><div className="flex justify-between border-b pb-2"><dt className="text-gray-500">Batch No</dt><dd className="font-bold">{selected.batchNo}</dd></div><div className="flex justify-between border-b pb-2"><dt className="text-gray-500">Farmer</dt><dd className="font-bold">{selected.farmer}</dd></div><div className="flex justify-between border-b pb-2"><dt className="text-gray-500">Village</dt><dd>{selected.village}</dd></div><div className="flex justify-between border-b pb-2"><dt className="text-gray-500">Expected grade</dt><dd className="font-bold">{GRADE_LABEL[selected.grade]}</dd></div><div className="flex justify-between border-b pb-2"><dt className="text-gray-500">Total bags / weight</dt><dd>{selected.bags ?? "—"} bags · {selected.quantityKg.toLocaleString("en-IN")} kg</dd></div><div className="flex justify-between border-b pb-2"><dt className="text-gray-500">Booking slot</dt><dd>{selected.slot}</dd></div><div className="flex justify-between"><dt className="text-gray-500">Gross value</dt><dd className="font-bold">{inr(grossFor(selected))}</dd></div></dl>
        <p className="mt-3 rounded-xl bg-emerald-50 px-3 py-2 text-sm font-semibold text-emerald-900">Expected trolley no: {selected.trolley ?? "—"}</p>
        <h3 className="mt-5 font-bold">3 · Scan QR &amp; inspect</h3>
        <p className="text-sm text-gray-600">{orange ? "This batch is flagged for a mandatory Orange scan — 100% of Premium Grade-1 batches are scanned, plus 15–20% random audits." : "Green Pass: the trolley number on the sticker matches the screen. No scan needed — tap Approve in one second."}</p>
        <PrimaryButton className="mt-3" onClick={() => setScanned(true)}>{scanned ? "Scanned ✓ — Valid QR Sticker" : "Simulate QR scan"}</PrimaryButton>
        {scanned && <div className="mt-3 rounded-xl bg-emerald-50 p-3 text-sm"><p className="font-bold text-emerald-900">Valid QR Sticker</p><p>Batch No: {selected.batchNo} · Farmer: {selected.farmer}</p><p>Grade: {selected.grade === "1" ? "Grade 1" : selected.grade === "2" ? "Grade 2" : "Grade 3"} · Weight: {selected.quantityKg.toLocaleString("en-IN")} kg · Bags: {selected.bags ?? "—"}</p><p className="mt-1 text-gray-600">Expected content from the cloud: “{GRADE_LABEL[selected.grade]}” — matches what the clerk logged.</p></div>}
      </Card>
      <Card className="p-5"><h2 className="font-bold">4 · Approve or flag</h2>
        <p className="mt-1 text-sm text-gray-600">After verification, approve the batch or flag it if anything mismatches. A flag freezes the whole transaction row — the accountant never sees an Approve button for it, and no money can leave the treasury.</p>
        <div className="mt-3 space-y-2 text-sm"><p className="flex gap-2">✓ Grade matches ({GRADE_LABEL[selected.grade].split(" (")[0]})</p><p className="flex gap-2">✓ Weight looks correct</p><p className="flex gap-2">✓ Bags properly tagged</p><p className="flex gap-2">✓ No tampering found</p></div>
        <div className="mt-4 flex flex-col gap-2">
          <PrimaryButton onClick={() => { setStatus((p) => ({ ...p, [selected.batchNo]: "Approved" })); setNote(`Batch ${selected.batchNo} approved for unload. Trolley can now be sent to the warehouse for unloading — and the batch moves to the accountant's ledger.`); }}>✓ Approve Unload</PrimaryButton>
          <GhostButton onClick={() => { setStatus((p) => ({ ...p, [selected.batchNo]: "Flagged" })); setNote(`Batch ${selected.batchNo} flagged — data mismatch. Row frozen on the cloud database; the accountant cannot approve its payout.`); }} className="border-red-200 text-red-700 hover:bg-red-50">⚠ Flag Data Mismatch</GhostButton>
        </div>
        <h3 className="mt-5 font-bold">5 · Queue status after this decision</h3>
        <p className="mt-1 text-sm">Pending ({pending}) · Approved ({3 + approved}) · Flagged ({flagged}) — the queue updates automatically, and an out-of-order scan re-sorts the FIFO order instead of blocking the gate.</p>
        <p className="mt-3 rounded-xl bg-gray-50 p-3 text-xs text-gray-600">Why the Orange scan matters: like traffic police who stop only some cars, the random audit makes every clerk and farmer behave as if they will be checked — because any of them might be.</p>
      </Card>
    </div>
  </div>;
}
