import Link from "next/link";
import { headers } from "next/headers";

import { Menu } from "@/types";
import SearchBar from "@/components/searchbar";

async function getMenus(): Promise<Menu[]> {
  try {
    const headersList = await headers();

    const host = headersList.get("host");

    const protocol = process.env.NODE_ENV === "development" ? "http" : "https";

    const url = `${protocol}://${host}/api/menus`;

    const response = await fetch(url, {
      cache: "no-store",
    });

    const result = await response.json();

    if (!result.success) return [];

    return result.data;
  } catch (error) {
    console.error("Fetch error:", error);
    return [];
  }
}

export default async function MenuPage({
  searchParams,
}: {
  searchParams: Promise<{ query?: string; page?: string }>;
}) {
  const params = await searchParams;
  const currentPage = Number(params.page) || 1;
  const itemsPerPage = 8;
  const query = params.query?.toLowerCase() || "";
  const menus = await getMenus();

  const filteredRegularMenus = menus.filter(
    (m) =>
      (m.is_periodic === "FALSE" || m.is_periodic === "false") &&
      m.name.toLowerCase().includes(query),
  );

  const periodicMenus = menus.filter(
    (m) =>
      (m.is_periodic === "TRUE" || m.is_periodic === "true") &&
      m.name.toLowerCase().includes(query),
  );

  const totalMenus = filteredRegularMenus.length;
  const totalPages = Math.ceil(totalMenus / itemsPerPage);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  const regularMenus = filteredRegularMenus.slice(startIndex, endIndex);

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-emerald-50 via-white to-green-100/50 p-4 sm:p-6 md:p-8 overflow-hidden">
      {/* BACKGROUND DECORATIVE SHAPES */}
      <div className="absolute top-10 -right-16 w-72 h-72 bg-emerald-100/40 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 -left-20 w-60 h-60 bg-green-200/30 rounded-3xl rotate-12 blur-2xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-emerald-100/40 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-6xl mx-auto">
        {/* HEADER */}
        <div className="text-center mb-8 sm:mb-12">
          <div className="w-12 h-1.5 bg-emerald-500 rounded-full mx-auto mb-3" />

          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-800 break-words">
            Menu Kami
          </h1>

          <p className="text-xs sm:text-sm text-slate-500 mt-2 max-w-md mx-auto px-4">
            Pilih hidangan favoritmu dan nikmati kelezatan terbaik yang kami
            siapkan khusus untukmu.
          </p>
        </div>

        {/* SEARCH */}
        <div className="mb-10 max-w-md mx-auto px-2">
          <SearchBar />
        </div>

        <div className="justify-center grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
          <div className="bg-white rounded-2xl p-4 border border-emerald-100 shadow-sm">
            <p className="text-xs text-slate-400 mb-1">Total Menu</p>
            <h3 className="text-2xl font-black text-emerald-600">
              {totalMenus}
            </h3>
          </div>

          <div className="bg-white rounded-2xl p-4 border border-emerald-100 shadow-sm">
            <p className="text-xs text-slate-400 mb-1">Total Halaman</p>
            <h3 className="text-2xl font-black text-blue-600">{totalPages}</h3>
          </div>
        </div>

        {/* PERIODIC MENU SECTION */}
        {periodicMenus.length > 0 && (
          <section className="relative rounded-2xl p-3 sm:p-5 mb-8 bg-gradient-to-br from-slate-900 via-emerald-950 to-slate-950 border border-emerald-800/50 shadow-xl overflow-hidden">
            {/* AKSEN BACKGROUND */}
            <div className="absolute -right-20 -top-20 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -left-20 -bottom-20 w-48 h-48 bg-green-500/10 rounded-full blur-3xl pointer-events-none" />

            {/* HEADER SECTION */}
            <div className="relative z-10 flex items-center justify-between mb-4 px-1">
              <div>
                <div className="flex items-center gap-1.5 mb-0.5">
                  <span className="w-1.5 h-4 sm:h-5 bg-gradient-to-b from-amber-400 to-amber-500 rounded-full" />
                  <h2 className="text-sm sm:text-base md:text-lg font-black text-white tracking-tight">
                    Menu Periodik Spesial
                  </h2>
                </div>
                <p className="text-[10px] sm:text-xs text-emerald-200/60">
                  Berganti kelezatan baru setiap harinya
                </p>
              </div>

              <span className="text-[9px] font-bold px-2 py-0.5 bg-emerald-900/50 border border-emerald-800/40 text-emerald-400 rounded-full whitespace-nowrap">
                🔥 {periodicMenus.length} Menu
              </span>
            </div>

            {/* GRID DIUBAH MENJADI md:grid-cols-4 AGAR 4 KE KANAN DI DESKTOP */}
            <div className="relative z-10 grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
              {periodicMenus.map((menu) => (
                <div
                  key={menu.id}
                  className="group bg-slate-900/50 backdrop-blur-sm rounded-xl border border-emerald-900/60 p-3 flex flex-col justify-between transition-all duration-200 hover:border-emerald-500/40 relative overflow-hidden"
                >
                  <div>
                    {/* GAMBAR DISET SEIMBANG (h-24 sm:h-28) */}
                    {menu.image ? (
                      <div className="w-full h-24 sm:h-28 overflow-hidden rounded-xl mb-3 relative border border-emerald-950 bg-slate-950">
                        <img
                          src={menu.image}
                          alt={menu.name}
                          className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                        />
                      </div>
                    ) : (
                      <div className="w-full h-24 sm:h-28 rounded-xl mb-3 flex items-center justify-center text-3xl bg-slate-950 border border-emerald-950">
                        🍲
                      </div>
                    )}

                    {/* TAG HARI & NAMA */}
                    <div className="inline-flex items-center gap-1 bg-amber-400/10 border border-amber-500/20 text-amber-400 text-[8px] sm:text-[10px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider mb-2">
                      <span className="w-1 h-1 bg-amber-400 rounded-full animate-pulse" />
                      {menu.day}
                    </div>

                    <h3 className="font-extrabold text-sm text-emerald-50 break-words line-clamp-1 leading-tight mb-1 group-hover:text-emerald-300 transition-colors duration-150">
                      {menu.name}
                    </h3>

                    <p className="text-emerald-100/50 text-[11px] sm:text-xs line-clamp-2 break-words font-medium mb-3 leading-normal">
                      {menu.description}
                    </p>
                  </div>

                  {/* HARGA DAN TOMBOL PESAN */}
                  <div className="mt-auto relative z-10">
                    <p className="text-sm sm:text-base font-black text-emerald-400 tracking-tight mb-2">
                      Rp {Number(menu.price).toLocaleString("id-ID")}
                    </p>

                    <Link
                      href={`/order?menu_id=${menu.id}&menu_name=${encodeURIComponent(menu.name)}&price=${menu.price}`}
                      className="block text-center bg-gradient-to-r from-emerald-500 to-green-500 text-slate-950 py-2 px-4 rounded-xl font-bold text-xs tracking-wide shadow-md hover:brightness-105 active:scale-[0.97] transition-all duration-150 w-full"
                    >
                      Pesan
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* REGULAR MENU SECTION */}
        <section className="mb-12">
          {/* HEADER SEARAH DENGAN ACTION LINK */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6 px-1 gap-2">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="w-2 h-5 bg-emerald-500 rounded-full" />
                <h2 className="text-lg sm:text-2xl font-bold text-slate-800">
                  Menu Utama
                </h2>
              </div>
              <p className="text-xs sm:text-sm text-slate-500">
                Hidangan lezat nusantara pilihan terbaik untuk Anda
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
                Menu tidak ditemukan
              </p>
            </div>
          ) : (
            /* GRID HALUS DAN PROPORSIONAL (2 KOLOM DI MOBILE, 4 KOLOM DI DESKTOP) */
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
              {regularMenus.map((menu) => (
                <div
                  key={menu.id}
                  className="group bg-white/90 backdrop-blur-sm rounded-2xl border border-emerald-100/60 p-3 flex flex-col justify-between shadow-sm hover:shadow-xl hover:shadow-emerald-900/5 hover:-translate-y-1 transition-all duration-300"
                >
                  <div>
                    {/* GAMBAR DENGAN ASPEK RASIO SEIMBANG (Sama tinggi dengan pembungkus emoji di referensimu) */}
                    {menu.image ? (
                      <div className="w-full h-32 sm:h-48 overflow-hidden rounded-xl mb-4 relative border border-emerald-100/30 bg-slate-50">
                        <img
                          src={menu.image}
                          alt={menu.name}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      </div>
                    ) : (
                      /* FALLBACK JIKA KEBETULAN DATA GAMBAR KOSONG */
                      <div className="w-full h-32 sm:h-48 rounded-xl flex items-center justify-center text-3xl mb-4 bg-gradient-to-br from-emerald-50 to-green-100/60 border border-emerald-100">
                        🍛
                      </div>
                    )}

                    {/* NAMA DAN DESKRIPSI RINGKAS (Anti-meluber di mobile) */}
                    <h3 className="text-sm font-extrabold text-slate-800 mt-1 mb-1 break-words line-clamp-1 group-hover:text-emerald-600 transition-colors duration-150">
                      {menu.name}
                    </h3>

                    <p className="text-[11px] sm:text-xs text-slate-400 mb-3 line-clamp-2 break-words leading-normal">
                      {menu.description}
                    </p>
                  </div>

                  {/* HARGA DAN BUTTON COMPACT */}
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

        <div className="flex justify-center items-center gap-2 mt-10 flex-wrap">
          {Array.from({ length: totalPages }, (_, i) => {
            const page = i + 1;

            return (
              <Link
                key={page}
                href={`/menu?page=${page}&query=${query}`}
                className={`px-4 py-2 rounded-xl text-sm font-bold transition-all
          ${
            currentPage === page
              ? "bg-emerald-500 text-white"
              : "bg-white border border-emerald-100 text-slate-700 hover:bg-emerald-50"
          }
        `}
              >
                {page}
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
