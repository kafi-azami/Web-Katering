"use client"

import { useState, useEffect } from "react"
import { Order, Menu } from "@/types"
import { toast } from "sonner"

export default function EditOrder({
  order,
  onClose,
  onSuccess,
}: {
  order: Order
  onClose: () => void
  onSuccess: () => void
}) {
  const [editOrder, setEditOrder] = useState<Order>(order)
  const [menus, setMenus] = useState<Menu[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchMenus = async () => {
      try {
        const response = await fetch("/api/menus")
        const result = await response.json()

        if (result.success) {
          setMenus(result.data)
        }
      } catch (error) {
        console.log(error)
      }
    }

    fetchMenus()
  }, [])

  const saveEdit = async () => {
    setLoading(true)

    try {
      const response = await fetch("/api/orders", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...editOrder,
          total_price: (
            Number(editOrder.total_price) * Number(editOrder.quantity || 1)
          ).toString(),
        }),
      })

      const result = await response.json()

      if (result.success) {
        toast.success("Pesanan berhasil diperbarui!")
        onSuccess()
        onClose()
      } else {
        toast.error("Gagal mengedit pesanan!")
      }
    } catch (error) {
      console.log(error)
      toast.error("Terjadi kesalahan!")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 overflow-y-auto">
      
      {/* MODAL */}
      <div className="relative w-full max-w-xl bg-white/90 backdrop-blur-xl rounded-3xl border border-emerald-100 shadow-2xl shadow-emerald-900/10 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* BACKGROUND SHAPES */}
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-emerald-200/30 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-green-200/30 rounded-full blur-3xl pointer-events-none" />

        {/* HEADER */}
        <div className="relative px-5 sm:px-7 pt-6 pb-4 border-b border-emerald-100">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="w-12 h-1.5 bg-emerald-500 rounded-full mb-3" />

              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-800 tracking-tight">
                Edit Pesanan
              </h2>

              <p className="text-sm text-slate-500 mt-1">
                Ubah data pesanan pelanggan dengan mudah
              </p>
            </div>

            <button
              onClick={onClose}
              className="w-10 h-10 rounded-xl bg-slate-100 hover:bg-red-100 text-slate-500 hover:text-red-500 transition-all duration-200 flex items-center justify-center text-lg font-bold"
            >
              ✕
            </button>
          </div>
        </div>

        {/* CONTENT */}
        <div className="relative px-5 sm:px-7 py-5 max-h-[75vh] overflow-y-auto">

          {/* INFO CARD */}
          <div className="bg-gradient-to-r from-emerald-50 to-green-50 border border-emerald-100 rounded-2xl p-4 mb-5">
            <p className="text-xs uppercase tracking-widest font-bold text-emerald-700 mb-1">
              Total Pesanan
            </p>

            <h3 className="text-2xl font-black text-emerald-600">
              Rp{" "}
              {(
                Number(editOrder.total_price || 0) *
                Number(editOrder.quantity || 1)
              ).toLocaleString("id-ID")}
            </h3>
          </div>

          <div className="space-y-4">

            {/* NAMA */}
            <div className="group">
              <label className="block text-sm font-semibold text-slate-700 mb-1">
                Nama Lengkap
              </label>

              <input
                type="text"
                value={editOrder.name}
                onChange={(e) =>
                  setEditOrder({
                    ...editOrder,
                    name: e.target.value,
                  })
                }
                className="w-full border border-slate-200 rounded-2xl px-4 py-3 bg-slate-50/50 outline-none transition-all duration-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 focus:bg-white"
                placeholder="Masukkan nama pelanggan"
              />
            </div>

            {/* TELEPON */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">
                No. Telepon
              </label>

              <input
                type="text"
                value={editOrder.phone}
                onChange={(e) =>
                  setEditOrder({
                    ...editOrder,
                    phone: e.target.value,
                  })
                }
                className="w-full border border-slate-200 rounded-2xl px-4 py-3 bg-slate-50/50 outline-none transition-all duration-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 focus:bg-white"
                placeholder="08xxxxxxxx"
              />
            </div>

            {/* ALAMAT */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">
                Alamat Pengiriman
              </label>

              <textarea
                rows={3}
                value={editOrder.location}
                onChange={(e) =>
                  setEditOrder({
                    ...editOrder,
                    location: e.target.value,
                  })
                }
                className="w-full border border-slate-200 rounded-2xl px-4 py-3 bg-slate-50/50 outline-none resize-none transition-all duration-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 focus:bg-white"
                placeholder="Masukkan alamat lengkap"
              />
            </div>

            {/* MENU */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">
                Pilih Menu
              </label>

              <select
                value={editOrder.menu_id}
                onChange={(e) => {
                  const selected = menus.find(
                    (m) => m.id === e.target.value
                  )

                  setEditOrder({
                    ...editOrder,
                    menu_id: e.target.value,
                    menu_name: selected?.name || "",
                    total_price: selected?.price || "0",
                  })
                }}
                className="w-full border border-slate-200 rounded-2xl px-4 py-3 bg-slate-50/50 outline-none transition-all duration-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 focus:bg-white"
              >
                {menus.map((menu) => (
                  <option key={menu.id} value={menu.id}>
                    {menu.name} - Rp{" "}
                    {Number(menu.price).toLocaleString("id-ID")}
                  </option>
                ))}
              </select>
            </div>

            {/* GRID */}
            <div className="grid grid-cols-2 gap-3">

              {/* JUMLAH */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">
                  Jumlah
                </label>

                <input
                  type="number"
                  min="1"
                  value={editOrder.quantity || "1"}
                  onChange={(e) =>
                    setEditOrder({
                      ...editOrder,
                      quantity: e.target.value,
                    })
                  }
                  className="w-full border border-slate-200 rounded-2xl px-4 py-3 bg-slate-50/50 outline-none transition-all duration-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 focus:bg-white"
                />
              </div>

              {/* STATUS */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">
                  Status
                </label>

                <select
                  value={editOrder.status}
                  onChange={(e) =>
                    setEditOrder({
                      ...editOrder,
                      status: e.target.value,
                    })
                  }
                  className="w-full border border-slate-200 rounded-2xl px-4 py-3 bg-slate-50/50 outline-none transition-all duration-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 focus:bg-white"
                >
                  <option value="pending">Pending</option>
                  <option value="done">Selesai</option>
                  <option value="cancelled">Dibatalkan</option>
                </select>
              </div>
            </div>

            {/* TANGGAL & JAM */}
            <div className="grid grid-cols-2 gap-3">

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">
                  Tanggal Kirim
                </label>

                <input
                  type="date"
                  value={editOrder.delivery_date || ""}
                  onChange={(e) =>
                    setEditOrder({
                      ...editOrder,
                      delivery_date: e.target.value,
                    })
                  }
                  className="w-full border border-slate-200 rounded-2xl px-4 py-3 bg-slate-50/50 outline-none transition-all duration-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">
                  Jam Kirim
                </label>

                <input
                  type="time"
                  value={editOrder.delivery_time || ""}
                  onChange={(e) =>
                    setEditOrder({
                      ...editOrder,
                      delivery_time: e.target.value,
                    })
                  }
                  className="w-full border border-slate-200 rounded-2xl px-4 py-3 bg-slate-50/50 outline-none transition-all duration-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 focus:bg-white"
                />
              </div>
            </div>
          </div>
        </div>

        {/* FOOTER */}
        <div className="relative px-5 sm:px-7 py-5 border-t border-emerald-100 bg-white/60 backdrop-blur-sm flex gap-3">
          
          <button
            onClick={onClose}
            className="flex-1 py-3 rounded-2xl border border-slate-200 bg-white text-slate-700 font-bold hover:bg-slate-50 transition-all duration-200"
          >
            Batal
          </button>

          <button
            onClick={saveEdit}
            disabled={loading}
            className="flex-1 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-green-600 text-white font-bold shadow-lg shadow-emerald-500/20 hover:from-emerald-600 hover:to-green-700 active:scale-[0.98] transition-all duration-150 disabled:opacity-50"
          >
            {loading ? "Menyimpan..." : "Simpan Perubahan"}
          </button>
        </div>
      </div>
    </div>
  )
}