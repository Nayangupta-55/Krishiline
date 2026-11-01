import { grossFor, hamaliFor, netFor, GRADE_LABEL, type Booking } from "./data";

export function receiptHtml(b: Booking) {
  return `<!doctype html><html><head><meta charset="utf-8"><title>Receipt ${b.receiptId ?? b.token}</title><style>body{font-family:Arial,sans-serif;max-width:640px;margin:40px auto;padding:24px;border:1px solid #ccc}h1{color:#065f46}table{width:100%;border-collapse:collapse}td{padding:8px;border-bottom:1px solid #eee}.total{font-weight:bold;font-size:18px}.demo{color:#92400e;background:#fef3c7;padding:10px}</style></head><body><h1>Krishi-Line — Digital Receipt</h1><p class="demo">DEMO RECEIPT — student prototype, not an official document.</p><table><tr><td>Receipt ID</td><td>${b.receiptId ?? "Pending — issued after grading"}</td></tr><tr><td>Batch No.</td><td>${b.batchNo}</td></tr><tr><td>QR Token</td><td>${b.token}</td></tr><tr><td>Farmer</td><td>${b.farmer}, ${b.village}, Nashik</td></tr><tr><td>Date / Slot</td><td>${b.displayDate} · ${b.slot}</td></tr><tr><td>Centre</td><td>${b.centre}</td></tr><tr><td>Crop / Grade</td><td>${b.crop} / ${GRADE_LABEL[b.grade]}</td></tr><tr><td>Quantity</td><td>${b.quantityKg.toLocaleString("en-IN")} kg (${(b.quantityKg / 100).toLocaleString("en-IN")} quintals)</td></tr><tr><td>Rate</td><td>₹${b.pricePerQuintal.toLocaleString("en-IN")} / quintal</td></tr><tr><td>Gross Amount</td><td>₹${grossFor(b).toLocaleString("en-IN")}</td></tr><tr><td>Hamali Deduction</td><td>− ₹${hamaliFor(b).toLocaleString("en-IN")}</td></tr><tr><td>Other Deductions</td><td>− ₹200</td></tr><tr><td class="total">Net Payable</td><td class="total">₹${netFor(b).toLocaleString("en-IN")}</td></tr><tr><td>Status</td><td>${b.status} · Payment: ${b.paymentStatus}</td></tr></table><p>Verify a receipt by matching its token, batch number and receipt ID with the booking in the Farmer Dashboard.</p></body></html>`;
}
export function downloadReceipt(b: Booking) {
  const blob = new Blob([receiptHtml(b)], { type: "text/html" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = `${b.receiptId ?? b.token}-receipt.html`; a.click();
  URL.revokeObjectURL(url);
}
