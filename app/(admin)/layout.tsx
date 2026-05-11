"use client"

import { useRouter } from "next/navigation"

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()

  const handleLogout = async () => {
    await fetch("/api/auth", { method: "DELETE" })
    router.push("/login")
  }

  return (
    <div className="flex min-h-screen">
      <aside className="w-48 text-white p-4 flex flex-col justify-between" style={{background: "#04342C"}}>
        <div>
          <div className="mb-6">
            <p className="text-xs tracking-widest mb-1" style={{color: "#9FE1CB"}}>KATERING</p>
            <h2 className="font-medium text-lg" style={{color: "#E1F5EE"}}>Admin Panel</h2>
          </div>
          <nav className="flex flex-col gap-2">
            <a href="/dashboard/menu" className="text-sm px-3 py-2 rounded-lg hover:opacity-80" style={{color: "#E1F5EE", background: "#085041"}}>
              🍛 Menu
            </a>
            <a href="/dashboard/orders" className="text-sm px-3 py-2 rounded-lg hover:opacity-80" style={{color: "#E1F5EE", background: "#085041"}}>
              📋 Pesanan
            </a>
          </nav>
        </div>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="text-sm px-3 py-2 rounded-lg w-full text-left hover:opacity-80"
          style={{background: "#7a0000", color: "#FFE0E0"}}
        >
          🚪 Keluar
        </button>
      </aside>

      <main className="flex-1 bg-gray-50">{children}</main>
    </div>
  )
}