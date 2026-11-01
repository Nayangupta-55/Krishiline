"use client";
import { useState } from "react";
import Link from "next/link";
import { MessageCircle, CheckCircle2, ShieldCheck, QrCode, CalendarCheck, FileText, Bell, Smartphone, ArrowRight } from "lucide-react";
import { Card, Badge, PrimaryButton } from "@/components/ui";
import { useStore } from "@/lib/store";
import { FARMER, MOCK_DB, DEMO_OTP, SLOTS, CENTRES, inr, GRADE_PRICES } from "@/lib/data";

const STEPS = [
  { n: 1, title: "Start on WhatsApp", desc: "Farmer sends “Hi” and selects registration option." },
  { n: 2, title: "Verify Identity & Land Records", desc: "Demo Farmer ID + Gat number check against mock 7/12 records." },
  { n: 3, title: "Book Delivery Slot", desc: "Select a convenient 4-hour time slot." },
  { n: 4, title: "Get QR Token", desc: "Receive digital QR token on WhatsApp." },
  { n: 5, title: "Arrive at Center", desc: "Show QR token, get your onions weighed & graded." },
  { n: 6, title: "Receive Digital Receipt", desc: "Get quality & weight details on WhatsApp." },
];

type Msg = { from: "bot" | "user" | "sms"; text: string };

export default function WhatsAppBot() {
  const { addBooking } = useStore();
  const [stage, setStage] = useState(0);
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [village, setVillage] = useState("Kahan");
  const [gat, setGat] = useState("142/A");
  const [farmerId, setFarmerId] = useState("KL-FARMER-001");
  const [otp, setOtp] = useState("");
  const [otpError, setOtpError] = useState("");
  const [verified, setVerified] = useState(false);
  const [mismatch, setMismatch] = useState(false);
  const [slot, setSlot] = useState(SLOTS[0]);
  const [booked, setBooked] = useState(false);
  const [token, setToken] = useState("");

  const push = (m: Msg[]) => setMsgs((p) => [...p, ...m]);
  const start = () => {
    setMsgs([{ from: "user", text: "Hi" }, { from: "bot", text: "Namaskar! 🙏 Welcome to Krishi-Line.\nPlease select an option:\n1. Register as Farmer\n2. Book Slot\n3. Check Status" }]);
    setStage(1);
  };
  const sendOtp = () => {
    const rec = MOCK_DB.land.find((l) => l.farmerId === farmerId && l.gat === gat && l.village.toLowerCase() === village.trim().toLowerCase());
    push([{ from: "user", text: `Village: ${village}, Gat: ${gat}, Farmer ID: ${farmerId}` }, { from: "bot", text: `A demo verification OTP has been sent to your registered mobile number ending in ${FARMER.phoneEnding}.` }, { from: "sms", text: `Krishi-Line demo SMS: your test code is ${DEMO_OTP}. No real SMS is sent — this is a fictional notification for the prototype.` }]);
    setMismatch(!rec);
    setStage(2);
  };
  const verifyOtp = () => {
    if (otp.trim() !== DEMO_OTP) { setOtpError(`Wrong code. Demo code is ${DEMO_OTP} (shown in the fictional SMS above).`); return; }
    setOtpError("");
    if (mismatch) {
      push([{ from: "user", text: otp }, { from: "bot", text: "OTP correct, but this Farmer ID is NOT linked to the Gat number you entered in our sample records. Your request is flagged — manual on-site verification will be required at the centre." }]);
      setStage(2);
      return;
    }
    setVerified(true);
    push([{ from: "user", text: otp }, { from: "bot", text: `Verified! ✅\nVillage: ${FARMER.village}\nLand: ${FARMER.landAcres} Acres\nYou are eligible for ${FARMER.eligibleQuintals} quintals.\n\nNow select a delivery slot.` }]);
    setStage(3);
  };
  const bookSlot = () => {
    const t = "KLN" + Math.floor(10000 + Math.random() * 89999);
    setToken(t);
    addBooking({ id: "B-WA-" + Date.now(), batchNo: "B-WA", token: t, receiptId: null, farmer: FARMER.name, village: FARMER.village, date: "2026-11-09", displayDate: "09 Nov 2026", centre: CENTRES[0].name, centreShort: "Nashik - 1", crop: "Onion", quantityKg: 1000, grade: "1", pricePerQuintal: GRADE_PRICES["1"], status: "Confirmed", paymentStatus: "Estimated", utr: null, slot });
    push([{ from: "user", text: `Book slot: 09 Nov 2026, ${slot}` }, { from: "bot", text: `Your booking is confirmed! ✅\nDate: 09 Nov 2026\nTime: ${slot}\nCenter: Nashik – Center 1\n\nToken No: ${t}\n\nShow this QR at the procurement center.` }]);
    setBooked(true);
    setStage(4);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <Badge>Role 1 · Farmer (WhatsApp Bot)</Badge>
      <h1 className="mt-2 text-3xl font-extrabold">Self-service booking, verification &amp; digital receipt</h1>
      <p className="mt-1 max-w-3xl text-gray-600">No app to download. The farmer sends “Hi” to the number on Gram Panchayat banners and the bot walks them through verification, slot booking and the QR token. <b>Demo only:</b> the OTP, the land-record check and the SMS are simulated against a fictional mock database — no real Aadhaar, MahaBhulekh or SMS gateway is involved.</p>

      {/* 6-step strip from cover p.2 */}
      <div className="mt-6 grid gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {STEPS.map((s) => <Card key={s.n} className={`p-4 ${stage >= s.n ? "ring-2 ring-emerald-500" : ""}`}><span className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-700 font-bold text-white">{s.n}</span><p className="mt-2 text-sm font-bold">{s.title}</p><p className="text-xs text-gray-500">{s.desc}</p></Card>)}
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        {/* Phone simulator */}
        <Card className="overflow-hidden p-0">
          <div className="flex items-center gap-3 bg-emerald-800 px-4 py-3 text-white"><span className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-600"><MessageCircle size={19} /></span><div><p className="font-bold leading-tight">Krishi-Line</p><p className="text-xs text-emerald-200">WhatsApp Bot · demo · online</p></div><Smartphone className="ml-auto" size={18} /></div>
          <div className="h-[480px] space-y-3 overflow-y-auto bg-[#e7dfd3] p-4">
            {msgs.length === 0 && <p className="rounded-xl bg-white p-4 text-sm text-gray-500">Tap “Send Hi” to start the demo conversation — exactly as a farmer would from a Gram Panchayat banner number.</p>}
            {msgs.map((m, i) => (
              <div key={i} className={`flex ${m.from === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[85%] whitespace-pre-line rounded-2xl px-4 py-2.5 text-sm shadow ${m.from === "user" ? "rounded-br-sm bg-[#d9fdd3] text-gray-900" : m.from === "sms" ? "rounded-bl-sm border border-dashed border-gray-400 bg-amber-50 text-gray-800" : "rounded-bl-sm bg-white text-gray-900"}`}>
                  {m.from === "sms" && <p className="mb-1 text-[11px] font-bold tracking-wide text-gray-500">FICTIONAL SMS — NOT A REAL MESSAGE</p>}
                  {m.text}
                </div>
              </div>
            ))}
            {verified && !booked && (
              <div className="rounded-2xl bg-white p-4 shadow">
                <p className="font-bold">Select your delivery slot (09 Nov 2026)</p>
                <div className="mt-2 grid gap-2">{SLOTS.map((s) => <button key={s} onClick={() => setSlot(s)} className={`rounded-xl border px-3 py-2.5 text-left text-sm font-semibold ${slot === s ? "border-emerald-600 bg-emerald-50 text-emerald-900" : "border-gray-200 hover:bg-gray-50"}`}>{s}{slot === s ? " ✓" : ""}</button>)}</div>
                <button onClick={bookSlot} className="mt-3 w-full rounded-xl bg-emerald-700 px-4 py-2.5 font-semibold text-white hover:bg-emerald-800">Confirm booking</button>
              </div>
            )}
            {booked && (
              <div className="rounded-2xl bg-white p-4 shadow">
                <p className="flex items-center gap-2 font-bold text-emerald-800"><CheckCircle2 /> Procurement Completed (example)</p>
                <p className="mt-2 text-sm text-gray-700">Token No: {token} · Date: 09 Nov 2026 · Centre: Nashik – Center 1</p>
                <p className="mt-2 text-sm text-gray-600">When this batch is graded, the receipt lands here on WhatsApp. The 22 Oct example: Token KLN12345 · Weight 1,250 kg · Grade 1 (Premium) · Rate ₹1,850/quintal · Gross ₹23,125 · Net ₹21,675.</p>
                <Link href="/farmer/qr" className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-emerald-700">View your QR token <ArrowRight size={15} /></Link>
              </div>
            )}
          </div>
          <div className="space-y-3 border-t bg-white p-4">
            {stage === 0 && <PrimaryButton onClick={start} className="w-full justify-center">Send “Hi” to start</PrimaryButton>}
            {stage === 1 && (
              <div className="space-y-2">
                <label className="block text-xs font-semibold text-gray-600">Village<input value={village} onChange={(e) => setVillage(e.target.value)} className="mt-1 w-full rounded-lg border px-3 py-2 text-sm" /></label>
                <div className="grid grid-cols-2 gap-2">
                  <label className="block text-xs font-semibold text-gray-600">Gat (Land Parcel) No.<input value={gat} onChange={(e) => setGat(e.target.value)} className="mt-1 w-full rounded-lg border px-3 py-2 text-sm" /></label>
                  <label className="block text-xs font-semibold text-gray-600">Demo Farmer ID<input value={farmerId} onChange={(e) => setFarmerId(e.target.value)} className="mt-1 w-full rounded-lg border px-3 py-2 text-sm" /></label>
                </div>
                <p className="text-xs text-gray-500">Try changing the Gat number to something else — the bot flags it for manual verification instead of verifying.</p>
                <PrimaryButton onClick={sendOtp} className="w-full justify-center">Send details &amp; get OTP</PrimaryButton>
              </div>
            )}
            {stage === 2 && (
              <div className="space-y-2">
                <label className="block text-xs font-semibold text-gray-600">Enter the demo OTP (shown in the fictional SMS above)<input value={otp} onChange={(e) => setOtp(e.target.value)} inputMode="numeric" placeholder="123456" className="mt-1 w-full rounded-lg border px-3 py-2 text-sm" /></label>
                {otpError && <p className="text-xs font-medium text-red-600">{otpError}</p>}
                {mismatch && <p className="text-xs font-medium text-amber-700">⚠️ Farmer ID ↔ Gat mismatch flagged — manual on-site verification required. Fix the Gat number and resend to try again.</p>}
                <PrimaryButton onClick={verifyOtp} className="w-full justify-center">Verify OTP</PrimaryButton>
              </div>
            )}
            {stage >= 3 && !booked && <p className="text-center text-sm text-gray-500">Pick a slot in the chat above to finish the booking.</p>}
            {booked && <p className="text-center text-sm font-medium text-emerald-800">Booked! This booking now appears on your Farmer Dashboard.</p>}
          </div>
        </Card>

        {/* Features + benefits + receipt example */}
        <div className="space-y-6">
          <Card className="p-5"><h2 className="font-bold">Key features for farmers</h2>
            <div className="mt-3 grid grid-cols-2 gap-3 text-sm">
              {[{ i: MessageCircle, t: "WhatsApp-based onboarding" }, { i: FileText, t: "Land record verification (7/12)" }, { i: ShieldCheck, t: "Eligibility & yield limit check" }, { i: CalendarCheck, t: "4-hour slot booking" }, { i: QrCode, t: "Digital QR token generation" }, { i: FileText, t: "Receive digital quality receipt" }, { i: Bell, t: "Booking & status notifications" }].map((f) => <span key={f.t} className="flex items-center gap-2 rounded-xl bg-emerald-50 px-3 py-2.5"><f.i size={17} className="text-emerald-700" />{f.t}</span>)}
            </div>
          </Card>
          <Card className="p-5"><h2 className="font-bold">Benefits for farmers</h2>
            <ul className="mt-3 space-y-2 text-sm text-gray-700">{["No long queues", "No tractor rental losses", "Transparent weighing & grading", "Instant digital records", "Faster payments (DBT)", "No need to install any app"].map((b) => <li key={b} className="flex gap-2"><CheckCircle2 size={16} className="mt-0.5 shrink-0 text-emerald-700" />{b}</li>)}</ul>
          </Card>
          <Card className="p-5"><h2 className="font-bold">Yield ceiling — the anti-dumping lock</h2><p className="mt-2 text-sm text-gray-600">Ramesh’s Gat 142/A is 2.0 acres. At 60 quintals per acre, his season ceiling is <b>120 quintals (12,000 kg)</b>, locked to his Farmer ID. If anyone tries to book 50 tonnes under a 2-acre profile, the system blocks it globally — that is what stops out-of-state onion dumping through a genuine farmer’s account.</p><p className="mt-2 text-sm text-gray-600">Used so far this season: <b>95.4 quintals</b> of 120 (79.5%).</p><Link href="/farmer/land" className="mt-2 inline-flex items-center gap-1 text-sm font-semibold text-emerald-700">View land records <ArrowRight size={15} /></Link></Card>
          <Card className="p-5"><h2 className="font-bold">What the receipt looks like (22 Oct example)</h2><p className="mt-2 text-sm text-gray-700">Token KLN12345 · Date 22 Oct 2026 · Weight 1,250 kg · Grade 1 (Premium) · Rate ₹1,850/quintal · Gross ₹23,125 · Hamali −₹1,250 · Other −₹200 · <b>Net ₹21,675</b> · Batch B00124.</p><Link href="/farmer/receipts" className="mt-2 inline-flex items-center gap-1 text-sm font-semibold text-emerald-700">Open receipts <ArrowRight size={15} /></Link></Card>
        </div>
      </div>
    </div>
  );
}
