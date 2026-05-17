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

export default async function MenuPage({
  searchParams,
}: {
  searchParams: Promise<{ query?: string }>;
}) {
  const resolvedSearchParams = await searchParams;
  const searchQuery = resolvedSearchParams.query?.toLowerCase() || "";
  
  const menus = await getMenus();

  // Filter berdasarkan search bar
  const filteredData = menus.filter((menu) =>
    menu.name.toLowerCase().includes(searchQuery)
  );

  const regularMenus = filteredData.filter(
    (m) => m.is_periodic === "FALSE" || m.is_periodic === "false"
  );
  const periodicMenus = filteredData.filter(
    (m) => m.is_periodic === "TRUE" || m.is_periodic === "true"
  );

  return (
    <div className="p-4 max-w-full">
      {/* HEADER SECTION */}
      <div className="mb-8">
        <h1 className="text-2xl font-semibold mb-2">Daftar Menu</h1>
        <p className="text-sm text-gray-500">Pilih hidangan favoritmu dari dapur Nusantara kami</p>
      </div>

      <SearchBar />

      {/* Info Hasil Pencarian */}
      {searchQuery && (
        <p className="text-sm mb-6 text-gray-600">
          Menampilkan hasil untuk: <span className="font-bold text-emerald-700">"{searchQuery}"</span>
        </p>
      )}

      {/* REGULAR MENU SECTION */}
      <section className="mb-10">
        <h2 className="text-xl font-medium mb-4">Menu Utama</h2>
        {regularMenus.length === 0 ? (
          <div className="bg-gray-50 rounded-xl p-10 text-center border">
            <p className="text-gray-400 italic">Menu tidak ditemukan</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {regularMenus.map((menu) => (
              <div key={menu.id} className="bg-white rounded-xl border p-3 shadow-sm hover:shadow-md transition-shadow">
                {/* LOGIKA GAMBAR: Jika ada URL image pakai <img>, jika tidak pakai Placeholder hijau */}
                {menu.image ? (
                  <img 
                    src={menu.image} 
                    alt={menu.name} 
                    className="w-full h-32 object-cover rounded-lg mb-3" 
                  />
                ) : (
                  <div className="w-full h-24 rounded-lg flex items-center justify-center text-4xl mb-3" style={{ background: "#E1F5EE" }}>
                    <img src="/placeholder.png" alt="🍽️" className="w-12 h-12 opacity-50" />

                  </div>
                )}

                <span className="text-xs px-2 py-1 rounded-full" style={{ background: "#E1F5EE", color: "#085041" }}>
                  {menu.category || "Nusantara"}
                </span>
                
                <h3 className="text-sm font-medium mt-2 mb-1 line-clamp-1">{menu.name}</h3>
                <p className="text-xs text-gray-400 mb-3 line-clamp-2">{menu.description}</p>
                
                <p className="text-sm font-bold mb-3" style={{ color: "#085041" }}>
                  Rp {Number(menu.price).toLocaleString("id-ID")}
                </p>

                <Link
                  href={`/order?menu_id=${menu.id}&menu_name=${menu.name}&price=${menu.price}`}
                  className="block text-center text-xs py-2.5 rounded-lg w-full font-medium transition-opacity hover:opacity-90"
                  style={{ background: "#085041", color: "#E1F5EE" }}
                >
                  Pesan Sekarang
                </Link>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* PERIODIC MENU SECTION */}
      {periodicMenus.length > 0 && (
        <section className="rounded-xl p-6 mb-10" style={{ background: "#04342C" }}>
          <h2 className="text-xl font-medium mb-1" style={{ color: "#E1F5EE" }}>Menu Periodik</h2>
          <p className="text-sm mb-6" style={{ color: "#9FE1CB" }}>Spesial tersedia sesuai jadwal hari</p>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {periodicMenus.map((menu) => (
              <div key={menu.id} className="rounded-xl p-3 border" style={{ background: "#085041", borderColor: "#1D9E75" }}>
                <span className="text-xs px-2 py-1 rounded-full font-medium" style={{ background: "#9FE1CB", color: "#04342C" }}>
                  {menu.day}
                </span>
                
                <h3 className="text-sm font-medium mt-3 mb-1" style={{ color: "#E1F5EE" }}>{menu.name}</h3>
                <p className="text-xs mb-3 line-clamp-2" style={{ color: "#9FE1CB" }}>{menu.description}</p>
                
                <p className="text-sm font-bold mb-3" style={{ color: "#5DCAA5" }}>
                  Rp {Number(menu.price).toLocaleString("id-ID")}
                </p>

                <Link
                  href={`/order?menu_id=${menu.id}&menu_name=${menu.name}&price=${menu.price}`}
                  className="block text-center text-xs py-2 rounded-lg w-full font-medium transition-colors"
                  style={{ background: "#9FE1CB", color: "#04342C" }}
                >
                  Pesan
                </Link>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

export const dynamic = "force-dynamic";