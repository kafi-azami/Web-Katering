import Link from "next/link"
import { Menu } from "@/types"

async function getMenus(): Promise<Menu[]> {
  const url = `${process.env.NEXT_PUBLIC_BASE_URL}/api/menus`
  const response = await fetch(url, { cache: "no-store" })
  const result = await response.json()
  if (!result.success) return []
  return result.data
}

export default async function HomePage() {
  const menus = await getMenus()

  const regularMenus = menus.filter((m) => m.is_periodic === "FALSE" || m.is_periodic === "false").slice(0, 4)
  const periodicMenus = menus.filter((m) => m.is_periodic === "TRUE" || m.is_periodic === "true")

  return (
    <div className="p-4 max-w-full">

      {/* HERO */}
      <div className="relative rounded-xl overflow-hidden mb-6 p-10 text-center" style={{background: "#085041"}}>
        <p className="text-xs tracking-widest mb-2" style={{color: "#9FE1CB"}}>KATERING NUSANTARA</p>
        <h1 className="text-3xl font-medium mb-3" style={{color: "#E1F5EE"}}>
          Cita Rasa Sunda & Jawa<br />Langsung ke Mejamu
        </h1>
        <p className="text-sm mb-6" style={{color: "#9FE1CB"}}>
          Masakan tradisional autentik dengan bumbu rempah pilihan<br />dari tanah Pasundan dan Mataraman
        </p>
        <div className="flex gap-3 justify-center flex-wrap">
          <Link href="/menu" className="px-6 py-2 rounded-lg font-medium text-sm" style={{background: "#9FE1CB", color: "#04342C"}}>
            Lihat Menu
          </Link>
          <Link href="/order" className="px-6 py-2 rounded-lg text-sm border" style={{color: "#9FE1CB", borderColor: "#9FE1CB"}}>
            Cara Pesan
          </Link>
        </div>
      </div>

      {/* BADGES */}
      <div className="flex gap-2 flex-wrap justify-center mb-6">
        {["🌿 Bahan Segar Setiap Hari", "🚀 Antar ke Lokasi", "💰 Harga Terjangkau", "🍃 Resep Turun-Temurun"].map((b) => (
          <span key={b} className="text-xs px-3 py-1 rounded-full border" style={{background: "#E1F5EE", color: "#085041", borderColor: "#9FE1CB"}}>
            {b}
          </span>
        ))}
      </div>

      {/* MENU UNGGULAN */}
      <h2 className="text-xl font-medium mb-1">Menu Pilihan</h2>
      <p className="text-sm text-gray-500 mb-4">Masakan khas Sunda dan Jawa yang autentik</p>

      {regularMenus.length === 0 ? (
        <p className="text-gray-400 mb-6">Belum ada menu tersedia</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          {regularMenus.map((menu) => (
            <div key={menu.id} className="bg-white rounded-xl border p-3">
              <div className="w-full h-20 rounded-lg flex items-center justify-center text-3xl mb-2" style={{background: "#E1F5EE"}}>
                🍛
              </div>
              <span className="text-xs px-2 py-1 rounded-full" style={{background: "#E1F5EE", color: "#085041"}}>
                {menu.category === "main" ? "Sunda" : menu.category}
              </span>
              <p className="text-sm font-medium mt-1 mb-1">{menu.name}</p>
              <p className="text-xs text-gray-400 mb-2 line-clamp-2">{menu.description}</p>
              <p className="text-sm font-medium mb-2" style={{color: "#085041"}}>
                Rp {Number(menu.price).toLocaleString("id-ID")}
              </p>
              <Link
                href={`/order?menu_id=${menu.id}&menu_name=${menu.name}&price=${menu.price}`}
                className="block text-center text-xs py-2 rounded-lg w-full"
                style={{background: "#085041", color: "#E1F5EE"}}
              >
                Pesan
              </Link>
            </div>
          ))}
        </div>
      )}

      {/* PERIODIC MENU */}
      {periodicMenus.length > 0 && (
        <div className="rounded-xl p-5 mb-6" style={{background: "#04342C"}}>
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
                <p className="text-sm font-medium" style={{color: "#5DCAA5"}}>
                  Rp {Number(menu.price).toLocaleString("id-ID")}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* WHY US */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        {[
          { icon: "🌿", title: "Bahan Segar", desc: "Dipilih dari pasar lokal setiap pagi" },
          { icon: "🍃", title: "Resep Autentik", desc: "Resep tradisional Sunda & Jawa" },
          { icon: "🚀", title: "Antar Cepat", desc: "Pengiriman tepat waktu ke lokasi" },
          { icon: "💰", title: "Harga Hemat", desc: "Porsi besar harga bersahabat" },
        ].map((item) => (
          <div key={item.title} className="bg-gray-50 rounded-xl p-4 text-center border">
            <div className="w-9 h-9 rounded-full flex items-center justify-center mx-auto mb-2 text-base" style={{background: "#E1F5EE"}}>
              {item.icon}
            </div>
            <p className="text-xs font-medium mb-1">{item.title}</p>
            <p className="text-xs text-gray-400">{item.desc}</p>
          </div>
        ))}
      </div>

      {/* CTA */}
      <div className="rounded-xl p-8 text-center" style={{background: "#085041"}}>
        <h2 className="text-xl font-medium mb-2" style={{color: "#E1F5EE"}}>Siap Menikmati Masakan Tradisional?</h2>
        <p className="text-sm mb-4" style={{color: "#9FE1CB"}}>
          Pesan sekarang dan rasakan cita rasa Sunda & Jawa langsung di mejamu
        </p>
        <Link
          href="/menu"
          className="inline-block px-6 py-2 rounded-lg font-medium text-sm"
          style={{background: "#9FE1CB", color: "#04342C"}}
        >
          Pesan Sekarang
        </Link>
      </div>

    </div>
  )
}

export const dynamic = "force-dynamic"