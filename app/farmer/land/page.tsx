"use client";
import { useState } from "react";
import { Search, ShieldCheck } from "lucide-react";
import { Card, Field, inputCls, PageHead, Badge } from "@/components/ui";
import { LAND_PARCELS, FARMER, totalKg } from "@/lib/data";
import { useStore } from "@/lib/store";

export default function LandPage() {
  const { bookings } = useStore();
  const [q, setQ] = useState("");
  const rows = LAND_PARCELS.filter((p) => (p.survey + p.village + p.crop).toLowerCase().includes(q.toLowerCase()));
  const area = LAND_PARCELS.reduce((s, p) => s + p.areaAcres, 0);
  const used = totalKg(bookings);
  const pct = Math.min(100, Math.round((used / FARMER.yieldCeilingKg) * 100));
  return <div><PageHead title="Land Records (7/12) — Demo" sub="Simulated land-record view for the demo farmer. This is NOT a live lookup of any government land database." />
    <div className="grid gap-4 sm:grid-cols-3">
      <Card className="p-5"><p className="text-sm text-gray-500">Total land</p><p className="text-2xl font-bold">{area} acres</p><p className="text-sm text-gray-600">{LAND_PARCELS.length} parcels · all verified in demo</p></Card>
      <Card className="p-5"><p className="text-sm text-gray-500">Season yield ceiling</p><p className="text-2xl font-bold">{FARMER.yieldCeilingKg.toLocaleString("en-IN")} kg</p><p className="text-sm text-gray-600">Design rule in demo: 5,000 kg per acre</p></Card>
      <Card className="p-5"><p className="text-sm text-gray-500">Ceiling used</p><p className="text-2xl font-bold">{pct}%</p><div className="mt-2 h-2.5 rounded-full bg-gray-100"><div className="h-2.5 rounded-full bg-emerald-600" style={{ width: `${pct}%` }} /></div><p className="mt-1 text-sm text-gray-600">{used.toLocaleString("en-IN")} kg booked · {(FARMER.yieldCeilingKg - used).toLocaleString("en-IN")} kg remaining</p></Card>
    </div>
    <Card className="mt-6 p-5">
      <Field label="Search by survey number, village or crop"><div className="relative"><Search className="absolute left-3 top-3 text-gray-400" size={18} /><input className={`${inputCls} pl-10`} placeholder="Try 142/A or Kahan" value={q} onChange={(e) => setQ(e.target.value)} /></div></Field>
      <div className="mt-4 overflow-x-auto"><table className="w-full min-w-[640px] text-sm"><thead><tr className="text-left text-gray-500"><th className="py-2">Survey No.</th><th>Village</th><th>Area</th><th>Crop</th><th>Owner</th><th>Status</th></tr></thead><tbody>{rows.map((p) => <tr key={p.survey} className="border-t border-gray-100"><td className="py-3 font-semibold">{p.survey}</td><td>{p.village}</td><td>{p.areaAcres} acres</td><td>{p.crop}</td><td>{p.owner}</td><td><Badge><ShieldCheck size={13} /> {p.status}</Badge></td></tr>)}</tbody></table></div>
      {rows.length === 0 && <p className="py-6 text-center text-sm text-gray-500">No parcel matches “{q}”. Try a different survey number.</p>}
    </Card>
    <p className="mt-4 text-xs text-gray-500">How booking uses this: the booking form checks quantity against the ceiling above. In a production system this check would run against a verified land record; here the record is simulated and clearly labelled.</p>
  </div>;
}
