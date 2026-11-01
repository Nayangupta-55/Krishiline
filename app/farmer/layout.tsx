import Link from "next/link";
import { LayoutDashboard, CalendarPlus, QrCode, LandPlot, ReceiptText, IndianRupee } from "lucide-react";
const LINKS = [
  { href: "/farmer", label: "Dashboard", icon: LayoutDashboard },
  { href: "/farmer/book", label: "Book Slot", icon: CalendarPlus },
  { href: "/farmer/qr", label: "QR Token", icon: QrCode },
  { href: "/farmer/land", label: "Land Records (7/12)", icon: LandPlot },
  { href: "/farmer/receipts", label: "Receipts", icon: ReceiptText },
  { href: "/farmer/payments", label: "Payments", icon: IndianRupee },
];
export default function FarmerLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
      <nav className="mb-6 flex gap-2 overflow-x-auto pb-1" aria-label="Farmer sections">
        {LINKS.map((l) => <Link key={l.href} href={l.href} className="flex shrink-0 items-center gap-2 rounded-full border border-emerald-200 bg-white px-4 py-2 text-sm font-semibold text-emerald-900 hover:bg-emerald-700 hover:text-white"><l.icon size={16} />{l.label}</Link>)}
      </nav>
      {children}
    </div>
  );
}
