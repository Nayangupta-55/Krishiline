import type { ReactNode } from "react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export const cn = (...c: (string | false | null | undefined)[]) => twMerge(clsx(c));

export function Card({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn("rounded-2xl border border-emerald-100 bg-white shadow-sm", className)}>{children}</div>;
}
export function Badge({ children, tone = "green" }: { children: ReactNode; tone?: "green" | "blue" | "amber" | "red" | "gray" }) {
  const tones: Record<string, string> = {
    green: "bg-emerald-100 text-emerald-800", blue: "bg-blue-100 text-blue-800",
    amber: "bg-amber-100 text-amber-800", red: "bg-red-100 text-red-800", gray: "bg-gray-100 text-gray-700",
  };
  return <span className={cn("inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold", tones[tone])}>{children}</span>;
}
export function PrimaryButton({ children, href, onClick, className, type }: { children: ReactNode; href?: string; onClick?: () => void; className?: string; type?: "button" | "submit" }) {
  const cls = cn("inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-700 px-5 py-2.5 text-sm font-semibold text-white hover:bg-emerald-800 disabled:opacity-50", className);
  if (href) return <a href={href} className={cls}>{children}</a>;
  return <button type={type ?? "button"} onClick={onClick} className={cls}>{children}</button>;
}
export function GhostButton({ children, href, onClick, className }: { children: ReactNode; href?: string; onClick?: () => void; className?: string }) {
  const cls = cn("inline-flex items-center justify-center gap-2 rounded-xl border border-emerald-200 bg-white px-5 py-2.5 text-sm font-semibold text-emerald-800 hover:bg-emerald-50", className);
  if (href) return <a href={href} className={cls}>{children}</a>;
  return <button onClick={onClick} className={cls}>{children}</button>;
}
export function Field({ label, children, hint }: { label: string; children: ReactNode; hint?: string }) {
  return <label className="block"><span className="mb-1 block text-sm font-semibold text-gray-700">{label}</span>{children}{hint && <span className="mt-1 block text-xs text-gray-500">{hint}</span>}</label>;
}
export const inputCls = "w-full rounded-xl border border-gray-300 bg-white px-3.5 py-2.5 text-sm outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100";
export function PageHead({ title, sub, actions }: { title: string; sub: string; actions?: ReactNode }) {
  return <div className="mb-6 flex flex-wrap items-start justify-between gap-4"><div><h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">{title}</h1><p className="mt-1 max-w-2xl text-sm text-gray-600">{sub}</p></div>{actions}</div>;
}
export function Empty({ text }: { text: string }) {
  return <p className="rounded-xl bg-emerald-50 px-4 py-6 text-center text-sm text-emerald-900">{text}</p>;
}
