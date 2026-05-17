"use client"

import { useSearchParams, useRouter } from "next/navigation"
import { useState, FormEvent } from "react"

export default function OrderPage() {
  const searchParams = useSearchParams()
  const router = useRouter()

  const menu_id = searchParams.get("menu_id") || ""
  const menu_name = searchParams.get("menu_name") || ""
  const price = searchParams.get("price") || "0"

  const [name, setName] = useState("")
  const [phone, setPhone] = useState("")
  const [location, setLocation] = useState("")
  const [quantity, setQuantity] = useState("1")
  const [date, setDate] = useState("")
  const [time, setTime] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          phone,
          location,
          menu_id,
          menu_name,
          total_price: (Number(price) * Number(quantity)).toString(),
          delivery_date: date,
          delivery_time: time,
          quantity,
        }),
      })

      const result = await response.json()

      if (result.success) {
        alert("Pesanan berhasil dikirim!")
        router.push("/menu")
      } else {
        alert("Gagal mengirim pesanan, coba lagi!")
      }
    } catch (error) {
      console.log(error)
      alert("Terjadi kesalahan!")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-6 max-w-md mx-auto">
      <h1 className="text-3xl font-bold mb-2">Form Pemesanan</h1>
      <p className="text-gray-500 mb-6">Isi data diri kamu untuk memesan</p>

      {/* Menu Info */}
      <div className="bg-gray-50 rounded-xl p-4 mb-6 border">
        <p className="text-sm text-gray-500">Menu yang dipesan</p>
        <p className="font-bold text-lg">{menu_name}</p>
        <p className="text-primary font-semibold">
          Rp {(Number(price) * Number(quantity)).toLocaleString("id-ID")}
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Nama</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Masukkan nama kamu"
            required
            className="w-full border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">No. Telepon</label>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="Masukkan nomor telepon"
            required
            className="w-full border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Alamat</label>
          <textarea
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Masukkan alamat lengkap"
            required
            rows={3}
            className="w-full border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Tanggal Pengiriman</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
            className="w-full border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Waktu Pengiriman</label>
          <input
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            required
            className="w-full border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Jumlah pesanan</label>
          <input
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            min="1"
            required
            className="w-full border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-primary text-white py-3 rounded-lg font-semibold hover:opacity-90 disabled:opacity-50"
        >
          {loading ? "Mengirim..." : "Pesan Sekarang"}
        </button>
      </form>
    </div>
  )
}