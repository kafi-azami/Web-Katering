import Link from "next/link";
import { Menu } from "@/types";
import SearchBar from "@/components/searchbar";

async function getMenus(): Promise<Menu[]> {
  const url = `${process.env.NEXT_PUBLIC_BASE_URL}/api/menus`;
  try {
    const response = await fetch(url, { cache: "no-store" });
    const result = await response.json();
    if (!result.success) return [];
    return result.data;
  } catch (error) {
    console.error("Fetch error:", error);
    return [];
  }
}

export default async function HomePage() {
  const menus = await getMenus();

  const regularMenus = menus
    .filter((m) => m.is_periodic === "FALSE" || m.is_periodic === "false")
    .slice(0, 4);
  const periodicMenus = menus.filter(
    (m) => m.is_periodic === "TRUE" || m.is_periodic === "true",
  );

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-emerald-50 via-white to-green-100/50 p-4 sm:p-6 md:p-8 overflow-hidden">
      {/* BACKGROUND DECORATIVE SHAPES (MINIMALIS) */}
      <div className="absolute top-20 -left-16 w-72 h-72 bg-emerald-200/30 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 -right-24 w-80 h-80 bg-green-200/20 rounded-3xl rotate-45 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-10 left-1/4 w-60 h-60 bg-mint-100/40 rounded-full blur-2xl pointer-events-none" />

      <div className="relative max-w-6xl mx-auto">
        {/* HERO SECTION */}
        <div className="relative bg-gradient-to-br from-slate-900 via-emerald-950 to-slate-950 rounded-2xl sm:rounded-3xl overflow-hidden mb-8 p-4 xs:p-6 sm:p-12 md:p-16 text-center shadow-2xl shadow-emerald-950/40 border border-emerald-800/60 group">
          {/* SHAPE BULAT 1: KANAN ATAS (Bergerak ke kiri bawah + membesar saat hover) */}
          <div className="absolute -right-16 -top-16 w-36 h-36 sm:w-48 sm:h-48 bg-gradient-to-br from-emerald-400 to-green-500 opacity-20 rounded-full blur-2xl pointer-events-none transition-all duration-700 ease-out group-hover:scale-150 group-hover:-translate-x-10 group-hover:translate-y-10 group-hover:opacity-40" />

          {/* SHAPE BULAT 2: KIRI BAWAH (Bergerak ke kanan atas + membesar saat hover) */}
          <div className="absolute -left-12 -bottom-12 w-32 h-32 sm:w-40 sm:h-40 bg-gradient-to-tr from-green-400 to-emerald-500 opacity-20 rounded-full blur-2xl pointer-events-none transition-all duration-700 ease-out group-hover:scale-150 group-hover:translate-x-8 group-hover:-translate-y-8 group-hover:opacity-40" />

          {/* KONTEN HERO */}
          <div className="relative z-10 flex flex-col items-center w-full">
            {/* BADGE (Mengecil di mobile) */}
            <span className="inline-flex items-center gap-1 text-[9px] sm:text-xs font-bold tracking-widest text-emerald-400 bg-emerald-950/80 border border-emerald-700/50 px-2.5 py-1 rounded-full mb-2.5 sm:mb-4 uppercase backdrop-blur-sm shadow-inner">
              <span className="w-1 h-1 sm:w-1.5 sm:h-1.5 bg-emerald-400 rounded-full animate-pulse" />
              Katering Nusantara
            </span>

            {/* JUDUL UTAMA (Ukuran teks menggunakan satuan dinamic fluid VW & SM breakpoint) */}
            <h1 className="text-[5.5vw] xs:text-[5vw] sm:text-4xl md:text-5xl font-black text-white tracking-tight leading-tight sm:leading-[1.15] mb-2 sm:mb-4 break-words w-full px-1 max-w-2xl drop-shadow-sm">
              Cita Rasa Sunda & Jawa <br className="hidden xs:inline" />
              <span className="bg-gradient-to-r from-emerald-400 via-green-300 to-emerald-400 bg-clip-text text-transparent bg-[length:200%_auto]">
                Langsung ke Mejamu
              </span>
            </h1>

            {/* DESKRIPSI (Mengecil proposional di mobile) */}
            <p className="text-[3.2vw] xs:text-[11px] sm:text-sm md:text-base text-emerald-100/70 max-w-xl mx-auto mb-4 sm:mb-8 break-words骨 px-2 leading-relaxed font-medium">
              Masakan tradisional autentik dengan bumbu rempah pilihan dari
              tanah Pasundan dan Mataraman.
            </p>

            {/* TOMBOL AKSI (Menjadi sejajar/inline persegi panjang di mobile, bukan menumpuk) */}
            <div className="flex flex-row gap-2 sm:gap-3 justify-center items-center w-full max-w-xs sm:max-w-sm px-1">
              <Link
                href="/menu"
                className="flex-1 px-3 py-2 sm:px-6 sm:py-3 rounded-xl font-extrabold text-[3vw] xs:text-xs sm:text-sm bg-gradient-to-r from-emerald-400 to-green-500 text-slate-950 shadow-lg shadow-emerald-500/20 hover:from-emerald-300 hover:to-green-400 active:scale-[0.97] transition-all duration-150 text-center tracking-wide whitespace-nowrap"
              >
                Lihat Menu
              </Link>
              <Link
                href="/order"
                className="flex-1 px-3 py-2 sm:px-6 sm:py-3 rounded-xl font-extrabold text-[3vw] xs:text-xs sm:text-sm text-emerald-300 border border-emerald-700/60 bg-emerald-950/30 backdrop-blur-sm hover:border-emerald-500 hover:text-white active:scale-[0.97] transition-all duration-150 text-center tracking-wide whitespace-nowrap"
              >
                Cara Pesan
              </Link>
            </div>
          </div>
        </div>

        {/* QUICK BADGES DISPLAY */}
        <div className="flex gap-2 flex-wrap justify-center mb-10 px-1">
          {[
            "🌿 Bahan Segar Setiap Hari",
            "🚀 Antar ke Lokasi",
            "💰 Harga Terjangkau",
            "🍃 Resep Turun-Temurun",
          ].map((badge) => (
            <span
              key={badge}
              className="text-[10px] sm:text-xs px-3 py-1.5 rounded-xl border border-emerald-100/80 bg-white/70 backdrop-blur-sm text-emerald-800 font-medium shadow-sm"
            >
              {badge}
            </span>
          ))}
        </div>

        {/* REGULAR MENU SECTION */}
        <section className="mb-12">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6 px-1 gap-2">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="w-2 h-5 bg-emerald-500 rounded-full" />
                <h2 className="text-lg sm:text-2xl font-bold text-slate-800">
                  Menu Pilihan
                </h2>
              </div>
              <p className="text-xs sm:text-sm text-slate-500">
                Masakan khas Sunda dan Jawa terfavorit minggu ini
              </p>
            </div>
            <Link
              href="/menu"
              className="text-xs font-bold text-emerald-600 hover:text-emerald-700 inline-flex items-center gap-1 group/link"
            >
              Lihat Semua
              <svg
                className="w-3 h-3 transform transition-transform group-hover/link:translate-x-0.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="3"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </Link>
          </div>

          {regularMenus.length === 0 ? (
            <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 text-center border border-emerald-100">
              <p className="text-slate-400 text-xs sm:text-sm">
                Belum ada menu pilihan tersedia
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
              {regularMenus.map((menu) => (
                <div
                  key={menu.id}
                  className="group bg-white/90 backdrop-blur-sm rounded-2xl border border-emerald-100/60 p-3 flex flex-col justify-between shadow-sm hover:shadow-xl hover:shadow-emerald-900/5 hover:-translate-y-1 transition-all duration-300"
                >
                  <div>
                    <div className="w-full h-24 sm:h-28 rounded-xl flex items-center justify-center text-3xl mb-3 bg-gradient-to-br from-emerald-50 to-green-100/60 border border-emerald-100 group-hover:scale-[1.02] transition-transform duration-300">
                      🍛
                    </div>
                    <span className="inline-block text-[9px] sm:text-xs font-bold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-100 uppercase tracking-wide">
                      {menu.category === "main" ? "Sunda" : menu.category}
                    </span>
                    <h3 className="text-sm font-extrabold text-slate-800 mt-2 mb-1 break-words line-clamp-1">
                      {menu.name}
                    </h3>
                    <p className="text-[11px] sm:text-xs text-slate-400 mb-3 line-clamp-2 break-words leading-normal">
                      {menu.description}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm sm:text-base font-black text-emerald-600 mb-2">
                      Rp {Number(menu.price).toLocaleString("id-ID")}
                    </p>
                    <Link
                      href={`/order?menu_id=${menu.id}&menu_name=${encodeURIComponent(menu.name)}&price=${menu.price}`}
                      className="block text-center text-xs font-bold py-2 rounded-xl w-full bg-emerald-500 text-white hover:bg-emerald-600 active:scale-[0.97] transition-all duration-150 shadow-md shadow-emerald-500/10"
                    >
                      Pesan
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* PERIODIC MENU SECTION */}
        {periodicMenus.length > 0 && (
          <section className="relative rounded-2xl p-5 sm:p-6 mb-12 bg-gradient-to-br from-emerald-900 to-emerald-950 shadow-xl border border-emerald-800 overflow-hidden group">
            {/* Soft decorative shape */}
            <div className="absolute -right-20 -bottom-20 w-48 h-48 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />

            <div className="relative z-10 mb-4">
              <h2 className="text-lg sm:text-xl font-bold text-emerald-50">
                Menu Periodik
              </h2>
              <p className="text-xs text-emerald-300/80">
                Menu spesial yang berganti dengan kelezatan baru setiap harinya
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {periodicMenus.map((menu) => (
                <div
                  key={menu.id}
                  className="rounded-xl p-3 bg-emerald-900/40 border border-emerald-700/60 flex flex-col justify-between hover:bg-emerald-900/60 hover:border-emerald-500/50 transition-all duration-200"
                >
                  <div>
                    <span className="inline-block text-[9px] sm:text-xs px-2 py-0.5 rounded-md font-bold bg-emerald-400 text-emerald-950 uppercase tracking-wider">
                      {menu.day}
                    </span>
                    <h3 className="text-xs sm:text-sm font-bold text-emerald-50 mt-2 mb-1 break-words line-clamp-1">
                      {menu.name}
                    </h3>
                    <p className="text-[10px] sm:text-xs text-emerald-200/60 mb-3 line-clamp-2 break-words leading-tight">
                      {menu.description}
                    </p>
                  </div>
                  <p className="text-xs sm:text-sm font-extrabold text-emerald-400">
                    Rp {Number(menu.price).toLocaleString("id-ID")}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* WHY US FEATURES SECTION */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          {[
            {
              icon: "🌿",
              title: "Bahan Segar",
              desc: "Dipilih dari pasar lokal tiap pagi",
            },
            {
              icon: "🍃",
              title: "Resep Autentik",
              desc: "Tradisional Sunda & Jawa asli",
            },
            {
              icon: "🚀",
              title: "Antar Tepat Waktu",
              desc: "Pengiriman cepat langsung ke rumah",
            },
            {
              icon: "💰",
              title: "Harga Hemat",
              desc: "Porsi kenyang harga bersahabat",
            },
          ].map((item) => (
            <div
              key={item.title}
              className="bg-white/80 backdrop-blur-sm rounded-2xl p-3.5 text-center border border-emerald-100/50 shadow-sm hover:border-emerald-200 transition-colors duration-200"
            >
              <div className="w-9 h-9 rounded-xl flex items-center justify-center mx-auto mb-2 text-sm bg-gradient-to-br from-emerald-50 to-green-100 border border-emerald-100 shadow-sm">
                {item.icon}
              </div>
              <h4 className="text-xs font-bold text-slate-800 mb-0.5 break-words">
                {item.title}
              </h4>
              <p className="text-[10px] sm:text-xs text-slate-400 break-words leading-normal">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export const dynamic = "force-dynamic";
