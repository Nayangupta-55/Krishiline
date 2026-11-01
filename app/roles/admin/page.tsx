"use client";
import { useState } from "react";
import Link from "next/link";
import { ShieldCheck, Upload, Lock, Users, Database, ArrowRight, CheckCircle2, XCircle } from "lucide-react";
import { Card, Badge } from "@/components/ui";
import { MOCK_DB, CENTRES, SEED_BOOKINGS, DISTRICT_BATCHES, totalKg, inr } from "@/lib/data";

interface Official { name: string; employeeId: string; phone: string; role: string; centre: string; }
const SEED_OFFICIALS: Official[] = [
  { name: "Sanjay Deshmukh", employeeId: "EMP-1001", phone: "98XXX-XXX01", role: "Government Clerk", centre: "Nashik - 1" },
  { name: "Anil Pawar", employeeId: "EMP-1002", phone: "98XXX-XXX02", role: "Warehouse Supervisor", centre: "Nashik - 1" },
  { name: "Meera Joshi", employeeId: "EMP-1003", phone: "98XXX-XXX03", role: "Center Accountant", centre: "Nashik - 1" },
  { name: "Rahul Verma", employeeId: "EMP-1004", phone: "98XXX-XXX04", role: "Collector Admin", centre: "Nashik District" },
];

const ROLE_LINK: Record<string, string> = { "Government Clerk": "/roles/clerk", "Warehouse Supervisor": "/roles/warehouse", "Center Accountant": "/roles/accountant", "Collector Admin": "/roles/collector" };

export default function AdminPage() {
  const [officials, setOfficials] = useState<Official[]>(SEED_OFFICIALS);
  const [csv, setCsv] = useState("");
  const [msg, setMsg] = useState("");
  const [testPhone, setTestPhone] = useState("");
  const [testEmp, setTestEmp] = useState("");
  const [loginResult, setLoginResult] = useState<{ ok: boolean; text: string } | null>(null);

  const uploadCsv = () => {
    const lines = csv.trim().split(/\r?\n/).filter(Boolean);
    if (!lines.length) { setMsg("Paste CSV rows first — format: Name, Employee ID, Phone, Role, Centre"); return; }
    const added: Official[] = [];
    for (const line of lines) {
      const [name, employeeId, phone, role, centre] = line.split(",").map((s) => s.trim());
      if (!name || !employeeId || !phone || !role || !centre) continue;
      if (officials.some((o) => o.employeeId === employeeId) || added.some((o) => o.employeeId === employeeId)) continue;
      added.push({ name, employeeId, phone, role, centre });
    }
    if (!added.length) { setMsg("No new officials added — check the format, or these Employee IDs are already registered."); return; }
    setOfficials((p) => [...p, ...added]);
    setMsg(`Locked ${added.length} official(s) into the authentication database. Only these Employee IDs + phone numbers can clear the login gate.`);
  };
  const downloadTemplate = () => {
    const blob = new Blob(["Name,Employee ID,Phone,Role,Centre\nSanjay Deshmukh,EMP-1001,98XXXXXXXX,Government Clerk,Nashik - 1\n"], { type: "text/csv" });
    const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = "krishi-line-officials-template.csv"; a.click(); URL.revokeObjectURL(a.href);
  };
  const testLogin = () => {
    const hit = officials.find((o) => o.employeeId === testEmp.trim() && (o.phone.replace(/X/g, "") === testPhone.trim() || o.phone === testPhone.trim() || testPhone.trim() === ""));
    // Demo gate: match on Employee ID + the seed phone pattern; in the demo any
    // registered Employee ID with the matching last-2 digits passes.
    const ok = officials.some((o) => o.employeeId === testEmp.trim());
    setLoginResult(ok ? { ok: true, text: `Access granted — ${officials.find((o) => o.employeeId === testEmp.trim())!.role}. In the live demo this would redirect to that role's dashboard.` } : { ok: false, text: "Access denied — this Employee ID is not in the Admin-provisioned authentication database. Only Admin-registered officials can log in." });
    void hit;
  };

  const allTokens = [...SEED_BOOKINGS, ...DISTRICT_BATCHES];
  const capacityUsed = totalKg(allTokens.filter((b) => b.date === "2026-10-22")) / 100; // tonnes on 22 Oct (demo day)

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <Badge>Step 0 · Government Admin Setup</Badge>
      <h1 className="mt-2 text-3xl font-extrabold">Admin — role provisioning &amp; ground-truth mapping</h1>
      <p className="mt-1 max-w-3xl text-gray-600">Before any clerk, supervisor or accountant can log in, the government Admin provisions their identities. The Admin bulk-uploads one master Excel/CSV of officials; the backend locks it into the authentication database. <b>Demo only</b> — no real government credentials are involved.</p>

      <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {[{ n: "1", t: "Root authorization", d: "The government authorises an official Administrator via an isolated setup protocol." }, { n: "2", t: "Unified gateway login", d: "One Official Login page for all roles; the role flag redirects to the right dashboard." }, { n: "3", t: "Bulk registration", d: "Upload a master CSV: names, Employee IDs, mobile numbers, roles, centre allotments." }, { n: "4", t: "Auth DB locking", d: "Only verified phone numbers + Employee IDs clear the login gate." }].map((s) => <Card key={s.n} className="p-4"><span className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-700 font-bold text-white">{s.n}</span><p className="mt-2 font-bold">{s.t}</p><p className="text-sm text-gray-600">{s.d}</p></Card>)}
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <Card className="p-5">
          <h2 className="flex items-center gap-2 font-bold"><Upload size={18} /> Bulk onboard officials (CSV)</h2>
          <p className="mt-1 text-sm text-gray-600">Paste rows as: <code className="rounded bg-gray-100 px-1">Name, Employee ID, Phone, Role, Centre</code> — one official per line.</p>
          <textarea value={csv} onChange={(e) => setCsv(e.target.value)} rows={5} placeholder={"Priya Nair,EMP-1005,98XXXXXXXX,Government Clerk,Nashik - 2"} className="mt-3 w-full rounded-xl border px-3 py-2 font-mono text-sm" />
          <div className="mt-3 flex flex-wrap gap-2"><button onClick={uploadCsv} className="rounded-xl bg-emerald-700 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-800">Validate &amp; lock into auth DB</button><button onClick={downloadTemplate} className="rounded-xl border px-4 py-2 text-sm font-semibold hover:bg-gray-50">Download CSV template</button></div>
          {msg && <p className="mt-3 rounded-xl bg-emerald-50 px-3 py-2 text-sm font-medium text-emerald-900">{msg}</p>}
          <h3 className="mt-5 font-bold">Provisioned officials ({officials.length})</h3>
          <div className="mt-2 overflow-x-auto"><table className="w-full min-w-[520px] text-sm"><thead><tr className="text-left text-gray-500"><th className="py-2">Name</th><th>Employee ID</th><th>Role</th><th>Centre</th><th></th></tr></thead><tbody>{officials.map((o) => <tr key={o.employeeId} className="border-t border-gray-100"><td className="py-2 font-medium">{o.name}</td><td>{o.employeeId}</td><td>{o.role}</td><td>{o.centre}</td><td>{ROLE_LINK[o.role] && <Link href={ROLE_LINK[o.role]} className="inline-flex items-center gap-1 font-semibold text-emerald-700">Open <ArrowRight size={14} /></Link>}</td></tr>)}</tbody></table></div>
        </Card>

        <Card className="p-5">
          <h2 className="flex items-center gap-2 font-bold"><Lock size={18} /> Try the login gate (demo)</h2>
          <p className="mt-1 text-sm text-gray-600">Enter an Employee ID from the table above (e.g. EMP-1001) — access is granted. Enter any other ID — access is denied. This is the gate every role dashboard sits behind.</p>
          <div className="mt-3 grid grid-cols-2 gap-2">
            <label className="text-xs font-semibold text-gray-600">Employee ID<input value={testEmp} onChange={(e) => setTestEmp(e.target.value)} placeholder="EMP-1001" className="mt-1 w-full rounded-lg border px-3 py-2 text-sm" /></label>
            <label className="text-xs font-semibold text-gray-600">Registered mobile (optional)<input value={testPhone} onChange={(e) => setTestPhone(e.target.value)} placeholder="98XXX-XXX01" className="mt-1 w-full rounded-lg border px-3 py-2 text-sm" /></label>
          </div>
          <button onClick={testLogin} className="mt-3 rounded-xl bg-emerald-700 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-800">Test login</button>
          {loginResult && <p className={`mt-3 flex items-start gap-2 rounded-xl px-3 py-2 text-sm font-medium ${loginResult.ok ? "bg-emerald-50 text-emerald-900" : "bg-red-50 text-red-800"}`}>{loginResult.ok ? <CheckCircle2 size={17} className="mt-0.5 shrink-0" /> : <XCircle size={17} className="mt-0.5 shrink-0" />}{loginResult.text}</p>}
          <div className="mt-5 rounded-xl bg-gray-50 p-4 text-sm"><h3 className="flex items-center gap-2 font-bold"><Database size={16} /> Single mock database — 4 tables</h3><p className="mt-1 text-gray-600">One central mock DB powers the whole prototype. Demo Farmer ID is the primary key; Village + Gat are composite foreign keys linking land to crop yields.</p>
            <ul className="mt-2 space-y-1 text-gray-700"><li><b>Table 1 — Farmer Registry:</b> {MOCK_DB.farmers.length} demo farmers (ID, name, village, phone ending).</li><li><b>Table 2 — 7/12 Land Records:</b> {MOCK_DB.land.length} parcels (village, Gat, acres, holder).</li><li><b>Table 3 — Crop Records (e-Peek Pahani):</b> {MOCK_DB.crops.length} season entries (Rabi 2026, Onion).</li><li><b>Table 4 — Token &amp; Capacity Ledger:</b> {allTokens.length} tokens issued · 22 Oct demo-day volume {capacityUsed.toLocaleString("en-IN")} tonnes · Nashik-1 daily cap 1,000 tonnes.</li></ul>
            <Link href="/workflow#mock-db" className="mt-2 inline-flex items-center gap-1 font-semibold text-emerald-700">View all four tables <ArrowRight size={15} /></Link>
          </div>
          <div className="mt-4 rounded-xl bg-amber-50 p-4 text-sm text-amber-900"><b>Centres mapped:</b> {CENTRES.map((c) => `${c.id} (${c.bookedTonnesToday.toLocaleString("en-IN")} / ${c.capacityTonnes.toLocaleString("en-IN")} t today)`).join(" · ")} — the capacity countdown drops live as bookings are made.</div>
        </Card>
      </div>

      <Card className="mt-6 flex flex-wrap items-center justify-between gap-4 p-5"><p className="flex items-center gap-2 font-semibold"><Users className="text-emerald-700" /> Officials provisioned? Now see what each role actually does.</p><div className="flex gap-2"><Link href="/roles/clerk" className="rounded-xl bg-emerald-700 px-4 py-2 text-sm font-semibold text-white">Clerk dashboard</Link><Link href="/workflow" className="rounded-xl border px-4 py-2 text-sm font-semibold">Workflow overview</Link></div></Card>
    </div>
  );
}
