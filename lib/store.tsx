"use client";
import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { SEED_BOOKINGS, type Booking } from "./data";

const KEY = "krishi-line-v1";
interface Store {
  bookings: Booking[];
  addBooking: (b: Booking) => void;
  updateBooking: (id: string, patch: Partial<Booking>) => void;
  resetDemo: () => void;
}
const Ctx = createContext<Store>({ bookings: SEED_BOOKINGS, addBooking: () => {}, updateBooking: () => {}, resetDemo: () => {} });

export function StoreProvider({ children }: { children: ReactNode }) {
  const [bookings, setBookings] = useState<Booking[]>(SEED_BOOKINGS);
  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) { const parsed = JSON.parse(raw) as Booking[]; if (Array.isArray(parsed) && parsed.length) setBookings(parsed); }
    } catch { /* demo data stays */ }
  }, []);
  useEffect(() => { try { localStorage.setItem(KEY, JSON.stringify(bookings)); } catch { /* ignore */ } }, [bookings]);
  const value = useMemo<Store>(() => ({
    bookings,
    addBooking: (b) => setBookings((p) => [b, ...p]),
    updateBooking: (id, patch) => setBookings((p) => p.map((b) => (b.id === id ? { ...b, ...patch } : b))),
    resetDemo: () => setBookings(SEED_BOOKINGS),
  }), [bookings]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}
export const useStore = () => useContext(Ctx);
