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

  const regularMenus = menus.filter((m) => m.category !== "box_nasi" && (m.is_periodic === "FALSE" || m.is_periodic === "false"))
  const periodicMenus = menus.filter((m) => m.is_periodic === "TRUE" || m.is_periodic === "true")
  const boxNasiMenus = menus.filter((m) => m.category === "box_nasi")

  return (
    <div className="w-full"> 
      <div className="max-w-6xl mx-auto px-4 py-6">
        <h1 className="text-3xl font-medium mb-1">Menu Kami</h1>
        <p className="text-sm text-gray-500 mb-6">Masakan khas Sunda dan Jawa yang autentik</p>

        {/* REGULAR MENU */}
        <section className="mb-10">
          <h2 className="text-xl font-medium mb-1">Menu Utama</h2>
          <p className="text-sm text-gray-500 mb-4">Pilihan masakan tradisional setiap hari</p>
          {regularMenus.length === 0 ? (
            <p className="text-gray-400">Belum ada menu tersedia</p>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {regularMenus.map((menu) => (
                <div key={menu.id} className="bg-white rounded-xl border p-3">
                  <div className="w-full h-60 rounded-lg flex items-center justify-center text-3xl mb-2" style={{background: "#E1F5EE"}}>
                    {menu.image && (
                      <img src={menu.image} alt={menu.name} className="w-full h-60 object-cover rounded-lg" />
                      )}
                  </div>
                  <span className="text-xs px-2 py-1 rounded-full" style={{background: "#E1F5EE", color: "#085041"}}>
                    {menu.category}
                  </span>
                  <p className="text-sm font-medium mt-1 mb-1">{menu.name}</p>
                  <p className="text-xs text-gray-400 mb-2">{menu.description}</p>
                  <p className="text-sm font-medium mb-2" style={{color: "#085041"}}>
                    Rp {Number(menu.price).toLocaleString("id-ID")}
                  </p>
                  <Link
                    href={`/order?menu_id=${menu.id}&menu_name=${menu.name}&price=${menu.price}`}
                    className="block text-center text-xs py-2 rounded-lg w-full"
                    style={{background: "#085041", color: "#E1F5EE"}}
                  >
                    Pesan Sekarang
                  </Link>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* PERIODIC MENU */}
        {periodicMenus.length > 0 && (
          <section className="mb-10">
            <div className="rounded-xl p-5" style={{background: "#04342C"}}>
              <h2 className="text-xl font-medium mb-1" style={{color: "#E1F5EE"}}>Menu Periodik</h2>
              <p className="text-sm mb-4" style={{color: "#9FE1CB"}}>Menu spesial yang berubah setiap hari</p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {periodicMenus.map((menu) => (
                  <div key={menu.id} className="rounded-xl p-3 border" style={{background: "#085041", borderColor: "#1D9E75"}}>
                    <span className="text-xs px-2 py-1 rounded-full font-medium" style={{background: "#9FE1CB", color: "#04342C"}}>
                      {menu.day}
                    </span>
                    <p className="text-sm font-medium mt-2 mb-1" style={{color: "#E1F5EE"}}>{menu.name}</p>
                    <p className="text-xs mb-2" style={{color: "#9FE1CB"}}>{menu.description}</p>
                    <p className="text-sm font-medium mb-2" style={{color: "#5DCAA5"}}>
                      Rp {Number(menu.price).toLocaleString("id-ID")}
                    </p>
                    <Link
                      href={`/order?menu_id=${menu.id}&menu_name=${menu.name}&price=${menu.price}`}
                      className="block text-center text-xs py-2 rounded-lg w-full"
                      style={{background: "#9FE1CB", color: "#04342C"}}
                    >
                      Pesan Sekarang
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* BOX NASI */}
        {boxNasiMenus.length > 0 && (
          <section className="mb-10">
            <div className="rounded-xl border-2 p-5" style={{borderColor: "#085041"}}>
              <div className="flex items-center gap-2 mb-1">
                <h2 className="text-xl font-medium">Box Nasi</h2>
                <span className="text-xs px-2 py-1 rounded-full font-medium" style={{background: "#085041", color: "#E1F5EE"}}>
                  Min. 5 Box
                </span>
              </div>
              <p className="text-sm text-gray-500 mb-4">
                Pesan minimal 5 box — cocok untuk acara, arisan, atau rapat kantor! 🍱
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {boxNasiMenus.map((menu) => (
                  <div key={menu.id} className="bg-white rounded-xl border p-4 flex flex-col">
                    <div className="w-full h-24 rounded-lg flex items-center justify-center text-4xl mb-3" style={{background: "#E1F5EE"}}>
                      🍱
                    </div>
                    <p className="text-base font-medium mb-1">{menu.name}</p>
                    <p className="text-xs text-gray-400 mb-2 flex-1">{menu.description}</p>
                    <p className="text-sm font-medium mb-1" style={{color: "#085041"}}>
                      Rp {Number(menu.price).toLocaleString("id-ID")} / box
                    </p>
                    <p className="text-xs text-gray-400 mb-3">
                      Total min: Rp {(Number(menu.price) * 5).toLocaleString("id-ID")} (5 box)
                    </p>
                    <Link
                      href={`/order?menu_id=${menu.id}&menu_name=${menu.name}&price=${menu.price}&min_qty=5&type=box_nasi`}
                      className="block text-center text-sm py-2 rounded-lg w-full font-medium"
                      style={{background: "#085041", color: "#E1F5EE"}}
                    >
                      Pesan Box Nasi
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

      </div>
    </div>
  )
}

export const dynamic = "force-dynamic"