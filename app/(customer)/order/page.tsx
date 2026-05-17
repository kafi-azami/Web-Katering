"use client"

import { Suspense, useState, FormEvent } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { toast } from "sonner"

function OrderContent() {
  const searchParams = useSearchParams()
  const router = useRouter()

  const menu_id = searchParams.get("menu_id") || ""
  const menu_name = searchParams.get("menu_name") || "Menu Lezat Spesial" // fallback text jika null
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
        headers: {
          "Content-Type": "application/json",
        },
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
        toast.success("Pesanan berhasil dikirim!")
        router.push("/menu")
      } else {
        toast.error("Gagal mengirim pesanan, coba lagi!")
      }
    } catch (error) {
      console.log(error)
      toast.error("Terjadi kesalahan!")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-emerald-50 via-white to-green-100/50 p-4 sm:p-6 md:p-8 overflow-hidden flex items-center justify-center">
      
      {/* BACKGROUND DECORATIVE SHAPES (MINIMALIS) */}
      <div className="absolute -top-10 -left-10 w-40 h-40 bg-emerald-200/40 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute top-1/4 -right-20 w-60 h-60 bg-green-200/30 rounded-3xl rotate-45 blur-xl pointer-events-none" />
      <div className="absolute -bottom-16 left-1/3 w-52 h-52 bg-mint-100/40 rounded-full blur-2xl pointer-events-none" />

      {/* MAIN CONTAINER */}
      <div className="relative w-full max-w-md bg-white/80 backdrop-blur-md rounded-2xl shadow-xl shadow-emerald-900/5 border border-emerald-100/80 p-5 sm:p-6 md:p-8 transition-all duration-300 hover:shadow-2xl hover:shadow-emerald-900/10">
        
        {/* HEADER */}
        <div className="text-center mb-6 relative">
          {/* Akses dekorasi garis kecil di atas judul */}
          <div className="w-12 h-1.5 bg-emerald-500 rounded-full mx-auto mb-3" />
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-800 break-words px-2">
            Form Pemesanan
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1.5">
            Yuk, isi data diri kamu untuk menyelesaikan pesanan
          </p>
        </div>

        {/* MENU INFO CARD */}
        <div className="relative bg-gradient-to-r from-emerald-50 to-green-50 rounded-xl p-4 mb-6 border border-emerald-100 overflow-hidden group">
          {/* Mini shape dekoratif di dalam card info */}
          <div className="absolute -right-4 -bottom-4 w-12 h-12 bg-emerald-200/30 rounded-full transition-transform duration-500 group-hover:scale-150" />
          
          <p className="text-xs font-semibold text-emerald-700 tracking-wider uppercase mb-1">
            Menu yang dipesan
          </p>
          <h2 className="font-bold text-base sm:text-lg text-slate-800 break-words leading-tight mb-1">
            {menu_name}
          </h2>
          <p className="text-xl font-extrabold text-emerald-600 tracking-tight">
            Rp {(Number(price) * Number(quantity)).toLocaleString("id-ID")}
          </p>
        </div>

        {/* FORM */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* INPUT NAMA */}
          <div className="group">
            <label className="block text-xs sm:text-sm font-semibold text-slate-700 mb-1 transition-colors group-focus-within:text-emerald-600">
              Nama Lengkap
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Masukkan nama kamu"
              required
              className="w-full text-sm sm:text-base border border-slate-200 rounded-xl px-3.5 py-2.5 bg-slate-50/50 outline-none transition-all duration-200 focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10 placeholder:text-slate-400"
            />
          </div>

          {/* INPUT TELEPON */}
          <div className="group">
            <label className="block text-xs sm:text-sm font-semibold text-slate-700 mb-1 transition-colors group-focus-within:text-emerald-600">
              No. Telepon / WhatsApp
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Contoh: 08123456xxx"
              required
              className="w-full text-sm sm:text-base border border-slate-200 rounded-xl px-3.5 py-2.5 bg-slate-50/50 outline-none transition-all duration-200 focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10 placeholder:text-slate-400"
            />
          </div>

          {/* INPUT ALAMAT */}
          <div className="group">
            <label className="block text-xs sm:text-sm font-semibold text-slate-700 mb-1 transition-colors group-focus-within:text-emerald-600">
              Alamat Lengkap
            </label>
            <textarea
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Tuliskan alamat pengiriman detail..."
              required
              rows={2}
              className="w-full text-sm sm:text-base border border-slate-200 rounded-xl px-3.5 py-2.5 bg-slate-50/50 outline-none transition-all duration-200 focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10 placeholder:text-slate-400 resize-none"
            />
          </div>

          {/* GRID UNTUK TANGGAL & WAKTU (RESPONSIF) */}
          <div className="grid grid-cols-2 gap-3">
            <div className="group">
              <label className="block text-xs sm:text-sm font-semibold text-slate-700 mb-1 transition-colors group-focus-within:text-emerald-600">
                Tanggal Kirim
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
                className="w-full text-xs sm:text-sm border border-slate-200 rounded-xl px-3 py-2.5 bg-slate-50/50 outline-none transition-all duration-200 focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10 text-slate-700"
              />
            </div>

            <div className="group">
              <label className="block text-xs sm:text-sm font-semibold text-slate-700 mb-1 transition-colors group-focus-within:text-emerald-600">
                Waktu Kirim
              </label>
              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                required
                className="w-full text-xs sm:text-sm border border-slate-200 rounded-xl px-3 py-2.5 bg-slate-50/50 outline-none transition-all duration-200 focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10 text-slate-700"
              />
            </div>
          </div>

          {/* INPUT JUMLAH PESANAN */}
          <div className="group">
            <label className="block text-xs sm:text-sm font-semibold text-slate-700 mb-1 transition-colors group-focus-within:text-emerald-600">
              Jumlah Pesanan
            </label>
            <div className="relative flex items-center">
              <input
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                min="1"
                required
                className="w-full text-sm sm:text-base border border-slate-200 rounded-xl px-4 py-2.5 bg-slate-50/50 outline-none transition-all duration-200 focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10 text-slate-800 font-medium"
              />
              <span className="absolute right-4 text-xs sm:text-sm font-medium text-slate-400 pointer-events-none">
                Porsi
              </span>
            </div>
          </div>

          {/* BUTTON SUBMIT */}
          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 bg-gradient-to-r from-emerald-500 to-green-600 text-white py-3 px-4 rounded-xl font-bold text-sm sm:text-base tracking-wide shadow-lg shadow-emerald-500/20 hover:from-emerald-600 hover:to-green-700 active:scale-[0.98] focus:ring-4 focus:ring-emerald-500/30 disabled:opacity-50 disabled:pointer-events-none transition-all duration-150 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                <span>Mengirim...</span>
              </>
            ) : (
              "Pesan Sekarang"
            )}
          </button>
        </form>
      </div>
    </div>
  )
}

export default function OrderPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-emerald-50">
        <div className="animate-pulse flex flex-col items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-emerald-200 animate-spin border-4 border-emerald-500 border-t-transparent" />
          <p className="text-emerald-700 font-medium text-sm">Memuat Halaman...</p>
        </div>
      </div>
    }>
      <OrderContent />
    </Suspense>
  )
}