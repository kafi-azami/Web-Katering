"use client"

import { useState, FormEvent, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { Menu } from "@/types"

export default function EditMenuPage() {
  const router = useRouter()
  const params = useParams()
  const id = params.id as string

  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [price, setPrice] = useState("")
  const [category, setCategory] = useState("")
  const [image, setImage] = useState("")
  const [isPeriodic, setIsPeriodic] = useState("false")
  const [day, setDay] = useState("")
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchMenu = async () => {
      const response = await fetch("/api/menus")
      const result = await response.json()
      const menu = result.data.find((m: Menu) => m.id === id)
      if (menu) {
        setName(menu.name)
        setDescription(menu.description)
        setPrice(menu.price)
        setCategory(menu.category)
        setImage(menu.image)
        setIsPeriodic(menu.is_periodic === "TRUE" || menu.is_periodic === "true" ? "true" : "false")
        setDay(menu.day || "")
      }
    }
    fetchMenu()
  }, [id])

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch("/api/menus", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id,
          name,
          description,
          price,
          category,
          image,
          is_periodic: isPeriodic,
          day: isPeriodic === "true" ? day : "",
        }),
      })

      const result = await response.json()

      if (result.success) {
        alert("Menu berhasil diupdate!")
        router.push("/dashboard/menu")
      } else {
        alert("Gagal mengupdate menu!")
      }
    } catch (error) {
      console.log(error)
      alert("Terjadi kesalahan!")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-6 max-w-lg mx-auto">
      <h1 className="text-2xl font-bold mb-6">Edit Menu</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Nama Menu</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Nama menu"
            required
            className="w-full border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Deskripsi</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Deskripsi menu"
            rows={3}
            className="w-full border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Harga</label>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="Harga menu"
            required
            className="w-full border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Kategori</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
            className="w-full border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="">Pilih kategori</option>
            <option value="main">Menu Utama</option>
            <option value="snack">Snack</option>
            <option value="drink">Minuman</option>
            <option value="dessert">Dessert</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">URL Gambar</label>
          <input
            type="text"
            value={image}
            onChange={(e) => setImage(e.target.value)}
            placeholder="https://..."
            className="w-full border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Menu Periodik?</label>
          <select
            value={isPeriodic}
            onChange={(e) => setIsPeriodic(e.target.value)}
            className="w-full border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="false">Tidak</option>
            <option value="true">Ya</option>
          </select>
        </div>

        {isPeriodic === "true" && (
          <div>
            <label className="block text-sm font-medium mb-1">Hari</label>
            <select
              value={day}
              onChange={(e) => setDay(e.target.value)}
              required
              className="w-full border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="">Pilih hari</option>
              <option value="Senin">Senin</option>
              <option value="Selasa">Selasa</option>
              <option value="Rabu">Rabu</option>
              <option value="Kamis">Kamis</option>
              <option value="Jumat">Jumat</option>
              <option value="Sabtu">Sabtu</option>
              <option value="Minggu">Minggu</option>
            </select>
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-primary text-white py-3 rounded-lg font-semibold hover:opacity-90 disabled:opacity-50"
        >
          {loading ? "Menyimpan..." : "Update Menu"}
        </button>
      </form>
    </div>
  )
}