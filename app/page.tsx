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

  export default async function HomePage({
    searchParams,
  }: {
    searchParams: Promise<{ query?: string }>;
  }) {
    // 1. Unwrap searchParams (Penting untuk Next.js 15)
    const resolvedSearchParams = await searchParams; 
    
    // 2. Gunakan nama variabel 'searchQuery' agar cocok dengan code di bawah
    const searchQuery = resolvedSearchParams.query?.toLowerCase() || "";
    
    const menus = await getMenus();

    // 3. Filter data berdas  arkan input
    const filteredData = menus.filter((menu) =>
      menu.name.toLowerCase().includes(searchQuery)
    );

    const regularMenus = filteredData
      .filter((m) => m.is_periodic === "FALSE" || m.is_periodic === "false")
      .slice(0, 4);

    const periodicMenus = filteredData.filter(
      (m) => m.is_periodic === "TRUE" || m.is_periodic === "true"
    );

    return (
      <div className="p-4 max-w-full">
        {/* HERO */}
        <div className="relative rounded-xl overflow-hidden mb-6 p-10 text-center" style={{ background: "#085041" }}>
          <p className="text-xs tracking-widest mb-2" style={{ color: "#9FE1CB" }}>KATERING NUSANTARA</p>
          <h1 className="text-3xl font-medium mb-3" style={{ color: "#E1F5EE" }}>
            Cita Rasa Sunda & Jawa<br />Langsung ke Mejamu
          </h1>
          <p className="text-sm mb-6" style={{ color: "#9FE1CB" }}>
            Masakan tradisional autentik dengan bumbu rempah pilihan dari tanah Pasundan dan Mataraman
          </p>
          <div className="flex gap-3 justify-center flex-wrap">
            <Link href="/menu" className="px-6 py-2 rounded-lg font-medium text-sm" style={{ background: "#9FE1CB", color: "#04342C" }}>
              Lihat Menu
            </Link>
            <Link href="/order" className="px-6 py-2 rounded-lg text-sm border" style={{ color: "#9FE1CB", borderColor: "#9FE1CB" }}>
              Cara Pesan
            </Link>
          </div>
        </div>

        <SearchBar />

        {/* Teks info pencarian (Sudah tidak merah lagi) */}
        {searchQuery && (
          <p className="text-sm mb-4 text-gray-600">
            Menampilkan hasil untuk: <span className="font-bold text-emerald-700">"{searchQuery}"</span>
          </p>
        )}

        {/* BADGES */}
        <div className="flex gap-2 flex-wrap justify-center mb-6">
          {["🌿 Bahan Segar Setiap Hari", "🚀 Antar ke Lokasi", "💰 Harga Terjangkau", "🍃 Resep Turun-Temurun"].map((b) => (
            <span key={b} className="text-xs px-3 py-1 rounded-full border" style={{ background: "#E1F5EE", color: "#085041", borderColor: "#9FE1CB" }}>
              {b}
            </span>
          ))}
        </div>

        <h2 className="text-xl font-medium mb-1">Menu Pilihan</h2>
        <p className="text-sm text-gray-500 mb-4">Masakan khas Sunda dan Jawa yang autentik</p>

        {/* Catalog */}
        {regularMenus.length === 0 ? (
          <div className="bg-gray-50 rounded-xl p-10 text-center border mb-6">
            <p className="text-gray-400">
              {searchQuery ? `Menu "${searchQuery}" tidak ditemukan.` : "Belum ada menu tersedia."}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
            {regularMenus.map((menu) => (
              <div key={menu.id} className="bg-white rounded-xl border p-3">
                <div className="w-full h-60 rounded-lg flex items-center justify-center text-3xl mb-2" style={{ background: "#E1F5EE" }}>
                  {menu.image ? (<img src={menu.image} alt={menu.name} className="w-full h-full object-cover rounded-lg" />) : (
                    <span style={{ color: "#085041" }}>🍽️</span>
                  )}
                </div>
                <span className="text-xs px-2 py-1 rounded-full" style={{ background: "#E1F5EE", color: "#085041" }}>
                  {menu.category === "main" ? "Sunda" : menu.category}
                </span>
                <p className="text-sm font-medium mt-1 mb-1">{menu.name}</p>
                <p className="text-xs text-gray-400 mb-2 line-clamp-2">{menu.description}</p>
                <p className="text-sm font-medium mb-2" style={{ color: "#085041" }}>
                  Rp {Number(menu.price).toLocaleString("id-ID")}
                </p>
                <Link
                  href={`/order?menu_id=${menu.id}&menu_name=${menu.name}&price=${menu.price}`}
                  className="block text-center text-xs py-2 rounded-lg w-full"
                  style={{ background: "#085041", color: "#E1F5EE" }}
                >
                  Pesan
                </Link>
              </div>
            ))}
          </div>
        )}

        {/* PERIODIC MENU */}
        {periodicMenus.length > 0 && (
          <div className="rounded-xl p-5 mb-6" style={{ background: "#04342C" }}>
            <h2 className="text-xl font-medium mb-1" style={{ color: "#E1F5EE" }}>Menu Periodik</h2>
            <p className="text-sm mb-4" style={{ color: "#9FE1CB" }}>Menu spesial yang berubah setiap hari</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {periodicMenus.map((menu) => (
                <div key={menu.id} className="rounded-xl p-3 border" style={{ background: "#085041", borderColor: "#1D9E75" }}>
                  <span className="text-xs px-2 py-1 rounded-full font-medium" style={{ background: "#9FE1CB", color: "#04342C" }}>
                    {menu.day}
                  </span>
                  <p className="text-sm font-medium mt-2 mb-1" style={{ color: "#E1F5EE" }}>{menu.name}</p>
                  <p className="text-xs mb-2" style={{ color: "#9FE1CB" }}>{menu.description}</p>
                  <p className="text-sm font-medium" style={{ color: "#5DCAA5" }}>
                    Rp {Number(menu.price).toLocaleString("id-ID")}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  export const dynamic = "force-dynamic";