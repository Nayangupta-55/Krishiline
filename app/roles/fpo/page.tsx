"use client";
import { useState } from "react";
import { Card, Badge, PageHead, PrimaryButton, GhostButton } from "@/components/ui";
import { FPO_MEMBERS, FPO_GROUP_BOOKINGS, CENTRES, SLOTS, MOCK_DB, type FpoMember } from "@/lib/data";

const STEPS = ["Upload Farmers & Crop Details", "View Members & Eligibility", "Group Slot Booking", "Get Booking Confirmation", "Track Booking & Delivery Status"];

export default function FpoPage() {
  const [members, setMembers] = useState<FpoMember[]>(FPO_MEMBERS);
  const [csv, setCsv] = useState("");
  const [msg, setMsg] = useState("");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Record<string, boolean>>({ "Ramesh Patil": true, "Suresh Jadhav": true, "Sunil Pawar": true });
  const [date, setDate] = useState("2026-11-09");
  const [slot, setSlot] = useState(SLOTS[0]);
  const [centreId, setCentreId] = useState("Nashik-1");
  const [groupBookings, setGroupBookings] = useState(FPO_GROUP_BOOKINGS.map((g) => ({ ...g, tab: g.status === "Completed" ? "Completed" : g.status === "In Progress" ? "Upcoming" : "Upcoming" })));
  const [tab, setTab] = useState("Upcoming");
  const [confirmation, setConfirmation] = useState<string | null>(null);

  const centre = CENTRES.find((c) => c.id === centreId) ?? CENTRES[0];
  const chosen = members.filter((m) => selected[m.name]);
  const totalQ = chosen.reduce((s, m) => s + m.eligibleQuintals, 0);
  const totalTonnes = totalQ / 10;
  const blockHours = totalTonnes < 50 ? 2 : totalTonnes <= 150 ? 4 : 6;
  const remainingTonnes = centre.capacityTonnes - centre.bookedTonnesToday - (confirmation ? totalTonnes : 0);

  const downloadTemplate = () => {
    const blob = new Blob(["Name,Village,Land (Acres)\nRamesh Patil,Kahan,2.0\nSuresh Jadhav,Kahan,1.5\n"], { type: "text/csv" });
    const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = "krishi-line-fpo-template.csv"; a.click(); URL.revokeObjectURL(a.href);
  };
  const uploadCsv = () => {
    const lines = csv.trim().split(/\r?\n/).filter(Boolean);
    if (!lines.length) { setMsg("Paste CSV rows first — Name, Village, Land (Acres)."); return; }
    const added: FpoMember[] = [];
    for (const line of lines) {
      const [name, village, acresStr] = line.split(",").map((s) => s.trim());
      const acres = Number(acresStr);
      if (!name || !village || !acres || acres <= 0) continue;
      if (members.some((m) => m.name === name) || added.some((m) => m.name === name)) continue;
      const inLandRecords = MOCK_DB.land.some((l) => l.holder === name && l.village.toLowerCase() === village.toLowerCase());
      added.push({ name, village, acres, eligibleQuintals: Math.round(acres * 60), status: inLandRecords ? "Verified" : "Pending" });
    }
    if (!added.length) { setMsg("No new members added — check the format, or these farmers are already members."); return; }
    setMembers((p) => [...p, ...added]);
    setMsg(`Uploaded & cross-verified ${added.length} farmer(s) against the mock land records. Eligible quantity = land × 60 quintals/acre. Members not found in land records are marked Pending.`);
  };
  const confirmBooking = () => {
    if (!chosen.length) { setMsg("Select at least one member first."); return; }
    if (totalTonnes > remainingTonnes) { setMsg(`This bulk load (${totalTonnes} tonnes) exceeds today's remaining capacity at ${centre.id} (${remainingTonnes.toLocaleString("en-IN")} tonnes left). Pick a smaller group or another centre/date.`); return; }
    setGroupBookings((p) => [{ date: "09 Nov 2026", slot, farmers: chosen.length, qtyQuintals: totalQ, centre: centre.id, status: "Confirmed", tab: "Upcoming" }, ...p]);
    setConfirmation(`Booking confirmed! Date: 09 Nov 2026 · Time: ${slot} · Centre: ${centre.name}\nFarmers in this booking (${chosen.length}): ${chosen.map((m) => `${m.name} – ${m.eligibleQuintals} Q`).join(", ")}\nTotal: ${totalQ} quintals (${totalTonnes} tonnes) · Flexible time-block locked: ${blockHours} hours.\nYour QR tokens have been sent to all farmers on WhatsApp (simulated). Individual farmers are blocked from booking during this FPO time-block.`);
    setMsg("");
  };

  const visible = members.filter((m) => m.name.toLowerCase().includes(search.toLowerCase()) || m.village.toLowerCase().includes(search.toLowerCase()));

  return <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6"><PageHead title="FPO Cooperative Dashboard" sub="Role 5 — Bulk crop upload, group booking & member management. The FPO books as a group, but each member's yield ceiling is still checked individually — so a bulk booking can never smuggle in out-of-state stock." />
    <div className="grid gap-2 sm:grid-cols-3 lg:grid-cols-5">{STEPS.map((s, i) => <div key={s} className="rounded-xl border border-gray-200 px-3 py-2.5 text-center text-xs font-bold text-gray-600"><span className="mr-1 inline-flex h-5 w-5 items-center justify-center rounded-full bg-rose-600 text-[11px] text-white">{i + 1}</span>{s}</div>)}</div>

    <div className="mt-6 grid gap-4 sm:grid-cols-3">
      <Card className="p-5"><p className="text-sm text-gray-500">Members</p><p className="text-2xl font-bold">{members.length}</p></Card>
      <Card className="p-5"><p className="text-sm text-gray-500">Capacity countdown — {centre.id} today</p><p className="text-2xl font-bold">{remainingTonnes.toLocaleString("en-IN")} / {centre.capacityTonnes.toLocaleString("en-IN")} tonnes left</p><div className="mt-2 h-2.5 overflow-hidden rounded-full bg-gray-200"><div className="h-full rounded-full bg-emerald-600" style={{ width: `${Math.min(100, ((centre.bookedTonnesToday + (confirmation ? totalTonnes : 0)) / centre.capacityTonnes) * 100)}%` }} /></div></Card>
      <Card className="p-5"><p className="text-sm text-gray-500">Group bookings</p><p className="text-2xl font-bold">{groupBookings.length} in this demo</p><p className="text-xs text-gray-500">Group totals stay separate from Ramesh's personal dashboard.</p></Card>
    </div>
    {msg && <p className="mt-4 rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-900">{msg}</p>}

    <div className="mt-6 grid gap-6 lg:grid-cols-2">
      <Card className="p-5"><h2 className="font-bold">1 · Upload farmers &amp; crop details (bulk CSV / Excel)</h2>
        <p className="mt-1 text-sm text-gray-600">Drag &amp; drop a file, or paste rows: <code className="rounded bg-gray-100 px-1">Name, Village, Land (Acres)</code>. The engine cross-verifies each farmer against the mock land records and calculates their individual yield ceiling.</p>
        <textarea value={csv} onChange={(e) => setCsv(e.target.value)} rows={4} placeholder={"Vilas Shinde,Dindori,1.0"} className="mt-3 w-full rounded-xl border px-3 py-2 font-mono text-sm" />
        <div className="mt-3 flex flex-wrap gap-2"><PrimaryButton onClick={uploadCsv}>Upload &amp; Save</PrimaryButton><GhostButton onClick={downloadTemplate}>Download template</GhostButton></div>
        <h3 className="mt-5 font-bold">2 · View members &amp; eligibility</h3>
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search farmer…" className="mt-2 w-full rounded-lg border px-3 py-2 text-sm" />
        <ul className="mt-2 space-y-2">{visible.map((m) => <li key={m.name} className="flex items-center justify-between rounded-xl border px-3 py-2.5 text-sm"><span><b>{m.name}</b> · Village: {m.village} · Land: {m.acres} Acres<br /><span className="text-gray-500">Eligible: {m.eligibleQuintals} Quintals</span></span><Badge tone={m.status === "Verified" ? "green" : "amber"}>{m.status}</Badge></li>)}</ul>
      </Card>

      <Card className="p-5"><h2 className="font-bold">3 · Group slot booking</h2>
        <p className="mt-1 text-sm text-gray-600">Select multiple farmers and book one delivery slot. The time-block scales with the load: under 50 tonnes → 2 hours, 50–150 tonnes → 4 hours, over 150 tonnes → 6 hours.</p>
        <div className="mt-3 space-y-2">{members.map((m) => <label key={m.name} className="flex items-center justify-between rounded-xl border px-3 py-2.5 text-sm"><span className="flex items-center gap-2"><input type="checkbox" checked={!!selected[m.name]} onChange={(e) => setSelected((p) => ({ ...p, [m.name]: e.target.checked }))} /><b>{m.name}</b> <span className="text-gray-500">({m.eligibleQuintals} Q)</span></span><Badge tone={m.status === "Verified" ? "green" : "amber"}>{m.status}</Badge></label>)}</div>
        <div className="mt-3 grid grid-cols-2 gap-2">
          <label className="text-xs font-semibold text-gray-600">Date<input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="mt-1 w-full rounded-lg border px-3 py-2 text-sm" /></label>
          <label className="text-xs font-semibold text-gray-600">Centre<select value={centreId} onChange={(e) => setCentreId(e.target.value)} className="mt-1 w-full rounded-lg border px-3 py-2 text-sm">{CENTRES.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}</select></label>
        </div>
        <div className="mt-2 grid gap-2">{SLOTS.map((s) => <button key={s} onClick={() => setSlot(s)} className={`rounded-xl border px-3 py-2.5 text-left text-sm font-semibold ${slot === s ? "border-emerald-600 bg-emerald-50 text-emerald-900" : "hover:bg-gray-50"}`}>{s}{slot === s ? " ✓ (Available)" : " (Available)"}</button>)}</div>
        <p className="mt-3 rounded-xl bg-emerald-50 px-3 py-2 text-sm font-semibold text-emerald-900">Total quantity: {totalQ} quintals ({totalTonnes} tonnes) · Flexible time-block: {blockHours} hours · Capacity left after this booking: {remainingTonnes.toLocaleString("en-IN")} tonnes</p>
        <PrimaryButton className="mt-3" onClick={confirmBooking}>Confirm booking</PrimaryButton>
        {confirmation && <div className="mt-3 whitespace-pre-line rounded-xl bg-emerald-50 p-4 text-sm text-emerald-900"><b>4 · Booking confirmed!</b><br />{confirmation}</div>}
      </Card>
    </div>

    <Card className="mt-6 p-5"><h2 className="font-bold">5 · Track booking &amp; delivery status — My Bookings</h2>
      <div className="mt-3 flex gap-2">{(["Upcoming", "Completed", "Cancelled"] as const).map((t) => <button key={t} onClick={() => setTab(t)} className={`rounded-lg px-3 py-1.5 text-sm font-semibold ${tab === t ? "bg-blue-600 text-white" : "bg-gray-100 hover:bg-gray-200"}`}>{t} ({t === "Upcoming" ? groupBookings.filter((g) => g.tab === "Upcoming").length : t === "Completed" ? groupBookings.filter((g) => g.tab === "Completed").length + 10 : 1})</button>)}
      </div>
      <ul className="mt-3 space-y-2 text-sm">{tab === "Cancelled" ? <li className="rounded-xl border px-3 py-2.5">28 Sep 2026 · 2 farmers · 140 Q · Centre: Nashik - 2 · Cancelled by FPO (weather)</li> : groupBookings.filter((g) => g.tab === tab || (tab === "Upcoming" && g.status !== "Completed")).map((g, i) => <li key={i} className="flex flex-wrap items-center justify-between gap-2 rounded-xl border px-3 py-2.5"><span><b>{g.date}</b> · {g.slot} · Farmers: {g.farmers} · Total Qty: {g.qtyQuintals} Q · Center: {g.centre}</span><Badge tone={g.status === "Completed" ? "green" : g.status === "In Progress" ? "amber" : "blue"}>{g.status}</Badge></li>)}
        {tab === "Completed" && <li className="rounded-xl border px-3 py-2.5 text-gray-600">+ 10 earlier completed group bookings in this demo season (28 Oct: 4 farmers · 430 Q · Completed, and 9 more).</li>}
      </ul>
      <p className="mt-3 text-xs text-gray-500">Benefits: easy bulk registration · transparent slot allocation · no long queues for group members · real-time booking and status updates · all members get WhatsApp notifications · better planning of crop delivery.</p>
    </Card>
  </div>;
}
