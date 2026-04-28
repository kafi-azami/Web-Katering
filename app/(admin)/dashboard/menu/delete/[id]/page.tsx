"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { Menu } from "@/types"

export default function DeleteMenuPage() {
  const router = useRouter()
  const params = useParams()
  const id = params.id as string

  const [menu, setMenu] = useState<Menu | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchMenu = async () => {
      const response = await fetch("/api/menus")
      const result = await response.json()
      const found = result.data.find((m: Menu) => m.id === id)
      setMenu(found || null)
    }
    fetchMenu()
  }, [id])

  const handleDelete = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/menus", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      })

      const result = await response.json()

      if (result.success) {
        alert("Menu berhasil dihapus!")
        router.push("/dashboard/menu")
      } else {
        alert("Gagal menghapus menu!")
      }
    } catch (error) {
      console.log(error)
      alert("Terjadi kesalahan!")
    } finally {
      setLoading(false)
    }
  }

  if (!menu) return <div className="p-6">Loading...</div>

  return (
    <div className="p-6 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-6">Hapus Menu</h1>

      <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
        <p className="text-red-600 font-semibold mb-2">
          Apakah kamu yakin ingin menghapus menu ini?
        </p>
        <p className="text-sm text-gray-600">Tindakan ini tidak dapat dibatalkan!</p>
      </div>

      {/* Menu Info */}
      <div className="bg-white border rounded-xl p-4 mb-6">
        <p className="font-bold text-lg">{menu.name}</p>
        <p className="text-gray-500 text-sm">{menu.description}</p>
        <p className="text-primary font-semibold mt-1">
          Rp {Number(menu.price).toLocaleString("id-ID")}
        </p>
      </div>

      <div className="flex gap-3">
        <button
          onClick={() => router.push("/dashboard/menu")}
          className="flex-1 border py-3 rounded-lg font-semibold hover:bg-gray-50"
        >
          Batal
        </button>
        <button
          onClick={handleDelete}
          disabled={loading}
          className="flex-1 bg-red-500 text-white py-3 rounded-lg font-semibold hover:opacity-90 disabled:opacity-50"
        >
          {loading ? "Menghapus..." : "Hapus Menu"}
        </button>
      </div>
    </div>
  )
}