import { Menu } from "@/types"
import Link from "next/link"

async function getMenus(): Promise<Menu[]> {
  const url = `${process.env.NEXT_PUBLIC_BASE_URL}/api/menus`
  const response = await fetch(url, { cache: "no-store" })
  const result = await response.json()
  if (!result.success) return []
  return result.data
}

export default async function MenuPage() {
  const menus = await getMenus()

  const regularMenus = menus.filter((m) => m.is_periodic === "FALSE" || m.is_periodic === "false")
  const periodicMenus = menus.filter((m) => m.is_periodic === "TRUE" || m.is_periodic === "true")

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Menu Kami</h1>

      {/* Regular Menu */}
      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-4">Menu Utama</h2>
        {regularMenus.length === 0 ? (
          <p className="text-gray-500">Tidak ada menu tersedia</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {regularMenus.map((menu) => (
              <div key={menu.id} className="bg-white rounded-xl shadow p-4 border">
                {menu.image && (
                  <img src={menu.image} alt={menu.name} className="w-full h-40 object-cover rounded-lg mb-3" />
                )}
                <h3 className="font-bold text-lg">{menu.name}</h3>
                <p className="text-gray-500 text-sm mb-2">{menu.description}</p>
                <p className="text-primary font-semibold">Rp {Number(menu.price).toLocaleString("id-ID")}</p>
                <Link
                  href={`/order?menu_id=${menu.id}&menu_name=${menu.name}&price=${menu.price}`}
                  className="mt-3 block text-center bg-primary text-white py-2 rounded-lg hover:opacity-90"
                >
                  Pesan Sekarang
                </Link>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Periodic Menu */}
      {periodicMenus.length > 0 && (
        <section>
          <h2 className="text-xl font-semibold mb-4">Menu Periodik</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {periodicMenus.map((menu) => (
              <div key={menu.id} className="bg-white rounded-xl shadow p-4 border border-yellow-300">
                {menu.image && (
                  <img src={menu.image} alt={menu.name} className="w-full h-40 object-cover rounded-lg mb-3" />
                )}
                <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full">
                  {menu.day}
                </span>
                <h3 className="font-bold text-lg mt-2">{menu.name}</h3>
                <p className="text-gray-500 text-sm mb-2">{menu.description}</p>
                <p className="text-primary font-semibold">Rp {Number(menu.price).toLocaleString("id-ID")}</p>
                <Link
                  href={`/order?menu_id=${menu.id}&menu_name=${menu.name}&price=${menu.price}`}
                  className="mt-3 block text-center bg-primary text-white py-2 rounded-lg hover:opacity-90"
                >
                  Pesan Sekarang
                </Link>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}