import { Menu } from "@/types"
import Link from "next/link"

async function getMenus(): Promise<Menu[]> {
  const url = `${process.env.NEXT_PUBLIC_BASE_URL}/api/menus`
  const response = await fetch(url, { cache: "no-store" })
  const result = await response.json()
  if (!result.success) return []
  return result.data
}

export default async function AdminMenuPage() {
  const menus = await getMenus()

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Kelola Menu</h1>
        <Link
          href="/dashboard/menu/add"
          className="bg-primary text-white px-4 py-2 rounded-lg hover:opacity-90"
        >
          + Tambah Menu
        </Link>
      </div>

      {menus.length === 0 ? (
        <p className="text-gray-500">Belum ada menu</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full bg-white rounded-xl shadow border">
            <thead>
              <tr className="bg-gray-50 text-left text-sm font-semibold text-gray-600">
                <th className="p-3">Nama</th>
                <th className="p-3">Kategori</th>
                <th className="p-3">Harga</th>
                <th className="p-3">Periodik</th>
                <th className="p-3">Hari</th>
                <th className="p-3">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {menus.map((menu) => (
                <tr key={menu.id} className="border-t text-sm">
                  <td className="p-3 font-medium">{menu.name}</td>
                  <td className="p-3">{menu.category}</td>
                  <td className="p-3">Rp {Number(menu.price).toLocaleString("id-ID")}</td>
                  <td className="p-3">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      menu.is_periodic === "TRUE" || menu.is_periodic === "true"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-gray-100 text-gray-600"
                    }`}>
                      {menu.is_periodic === "TRUE" || menu.is_periodic === "true" ? "Ya" : "Tidak"}
                    </span>
                  </td>
                  <td className="p-3">{menu.day || "-"}</td>
                  <td className="p-3 flex gap-2">
                    <Link
                      href={`/dashboard/menu/edit/${menu.id}`}
                      className="text-sm px-3 py-1 bg-blue-500 text-white rounded hover:opacity-90"
                    >
                      Edit
                    </Link>
                    <Link
                      href={`/dashboard/menu/delete/${menu.id}`}
                      className="text-sm px-3 py-1 bg-red-500 text-white rounded hover:opacity-90"
                    >
                      Hapus
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export const dynamic = "force-dynamic"