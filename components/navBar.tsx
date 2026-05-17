"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar(): JSX.Element {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  // Mencegah scroll pada body saat pop-up menu mobile terbuka
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const navItems = [
    { name: "Home", href: "/" },
    { name: "Menu", href: "/menu" },
    { name: "Pesan", href: "/order" },
  ];

  return (
    <>
      <nav className="sticky top-0 z-50 w-full border-b border-emerald-100/60 bg-white/80 backdrop-blur-xl shadow-md shadow-emerald-900/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            
            {/* LOGO */}
            <Link href="/" className="flex items-center gap-2 group z-50">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center shadow-md shadow-emerald-500/20 transition-transform duration-300 group-hover:scale-105">
                <span className="text-white text-lg">🍱</span>
              </div>
              <div className="leading-tight">
                <h1 className="font-black text-lg text-slate-800 tracking-tight transition-colors duration-300 group-hover:text-emerald-600">
                  Katering
                </h1>
                <p className="text-[10px] text-slate-400 -mt-0.5 font-medium tracking-wide">
                  Fresh & Traditional
                </p>
              </div>
            </Link>

            {/* DESKTOP MENU (Hidden on Mobile) */}
            <div className="hidden md:flex items-center gap-2 bg-slate-100/80 p-1 rounded-2xl border border-slate-200/50 backdrop-blur-sm">
              {navItems.map((item) => {
                const active = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`relative px-5 py-2 rounded-xl text-sm font-bold transition-all duration-200 ${
                      active
                        ? "bg-gradient-to-r from-emerald-500 to-green-600 text-white shadow-md shadow-emerald-500/10"
                        : "text-slate-600 hover:text-emerald-600 hover:bg-white"
                    }`}
                  >
                    {item.name}
                  </Link>
                );
              })}
            </div>

            {/* BURGER BUTTON (Visible on Mobile Only) */}
            <div className="flex md:hidden z-50">
              <button
                onClick={() => setIsOpen(!isOpen)}
                type="button"
                className="relative inline-flex items-center justify-center p-2.5 rounded-xl text-slate-700 bg-slate-100/80 border border-slate-200/60 hover:text-emerald-600 hover:bg-emerald-50 focus:outline-none transition-all duration-200 active:scale-95"
                aria-controls="mobile-menu"
                aria-expanded={isOpen}
              >
                <span className="sr-only">Buka menu utama</span>
                {/* Efek animasi transisi icon burger ke 'X' */}
                <div className="w-5 h-5 flex flex-col justify-between items-center overflow-hidden">
                  <span className={`w-5 h-0.5 bg-current transform transition-all duration-300 origin-left ${isOpen ? "rotate-45 translate-x-[2px] -translate-y-[1px]" : ""}`} />
                  <span className={`w-5 h-0.5 bg-current transition-all duration-300 ${isOpen ? "translate-x-10 opacity-0" : ""}`} />
                  <span className={`w-5 h-0.5 bg-current transform transition-all duration-300 origin-left ${isOpen ? "-rotate-45 translate-x-[2px] translate-y-[1px]" : ""}`} />
                </div>
              </button>
            </div>

          </div>
        </div>
      </nav>

      {/* MOBILE POPUP MENU OVERLAY */}
      <div
        className={`fixed inset-0 z-40 md:hidden transition-all duration-300 ${
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      >
        {/* Backdrop blur gelap tipis */}
        <div className="absolute inset-0 bg-slate-900/20 backdrop-blur-md" onClick={() => setIsOpen(false)} />

        {/* Panel Konten Pop-up Menu */}
        <div
          className={`absolute top-20 left-4 right-4 bg-white/95 backdrop-blur-xl rounded-2xl border border-emerald-100/80 p-6 shadow-2xl shadow-emerald-900/10 transition-all duration-300 origin-top transform ${
            isOpen ? "scale-100 translate-y-0 opacity-100" : "scale-95 -translate-y-4 opacity-0"
          }`}
        >
          {/* Shape Dekoratif Minimalis di dalam Pop-up */}
          <div className="absolute -top-10 -right-10 w-24 h-24 bg-emerald-100/50 rounded-full blur-xl pointer-events-none" />
          <div className="absolute -bottom-6 -left-6 w-20 h-20 bg-green-100/50 rounded-full blur-xl pointer-events-none" />

          <div className="relative flex flex-col gap-3">
            <p className="text-[10px] font-bold text-emerald-700 tracking-widest uppercase mb-1 px-3">
              Navigasi Menu
            </p>
            
            {navItems.map((item) => {
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className={`w-full px-4 py-3.5 rounded-xl text-base font-bold transition-all duration-150 flex items-center justify-between group/item ${
                    active
                      ? "bg-gradient-to-r from-emerald-500 to-green-600 text-white shadow-lg shadow-emerald-500/10"
                      : "text-slate-700 hover:text-emerald-600 hover:bg-emerald-50/60"
                  }`}
                >
                  <span className="break-words max-w-[80%]">{item.name}</span>
                  {/* Panah indikator kecil */}
                  <svg
                    className={`w-4 h-4 transform transition-transform duration-200 group-hover/item:translate-x-1 ${
                      active ? "text-white" : "text-slate-400 group-hover/item:text-emerald-500"
                    }`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2.5"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              );
            })}
          </div>

          {/* Mini Info Footer di dalam Pop-up */}
          <div className="mt-6 pt-4 border-t border-slate-100 text-center">
            <p className="text-xs text-slate-400 font-medium">🍱 Katering Premium Berbahan Segar</p>
          </div>
        </div>
      </div>
    </>
  );
}