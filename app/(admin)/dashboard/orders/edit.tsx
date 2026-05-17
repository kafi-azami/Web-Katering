"use client"

import { useState, useEffect } from "react"
import { Order, Menu } from "@/types"

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
  const [menus, setMenus] =  useState<Menu[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchMenus = async () => {
      const response = await fetch("/api/menus")
      const result = await response.json()
      if (result.success) setMenus(result.data)
    }
    fetchMenus()
  }, [])

  const saveEdit = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/orders", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editOrder),
      })
      const result = await response.json()
      if (result.success) {
        onSuccess()
        onClose()
      } else alert("Gagal mengedit pesanan!")
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-md">
        <h2 className="text-lg font-bold mb-4">Edit Pesanan</h2>
        <div className="space-y-3">
          <div>
            <label className="text-sm font-medium">Nama</label>
            <input
              className="w-full border rounded-lg px-3 py-2 text-sm mt-1"
              value={editOrder.name}
              onChange={(e) => setEditOrder({ ...editOrder, name: e.target.value })}
            />
          </div>
          <div>
            <label className="text-sm font-medium">No. Telepon</label>
            <input
              className="w-full border rounded-lg px-3 py-2 text-sm mt-1"
              value={editOrder.phone}
              onChange={(e) => setEditOrder({ ...editOrder, phone: e.target.value })}
            />
          </div>
          <div>
            <label className="text-sm font-medium">Alamat</label>
            <textarea
              className="w-full border rounded-lg px-3 py-2 text-sm mt-1"
              value={editOrder.location}
              onChange={(e) => setEditOrder({ ...editOrder, location: e.target.value })}
            />
          </div>
          <div>
            <label className="text-sm font-medium">Menu</label>
            <select
              className="w-full border rounded-lg px-3 py-2 text-sm mt-1"
              value={editOrder.menu_id}
              onChange={(e) => {
                const selected = menus.find((m) => m.id === e.target.value)
                setEditOrder({
                  ...editOrder,
                  menu_id: e.target.value,
                  menu_name: selected?.name || editOrder.menu_name,
                  total_price: selected?.price || editOrder.total_price,
                })
              }}
            >
              {menus.map((menu) => (
                <option key={menu.id} value={menu.id}>
                  {menu.name} - Rp {Number(menu.price).toLocaleString("id-ID")}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-sm font-medium">Jumlah Pesanan</label>
              <input
               type="number"
               min="1"
               className="w-full border rounded-lg px-3 py-2 text-sm mt-1"
               value={editOrder.quantity || "1"}
               onChange={(e) => setEditOrder({ ...editOrder, quantity: e.target.value })}
             />
          </div>

          <div>
            <label className="text-sm font-medium">Tanggal Pengiriman</label>
            <input
              type="date"
              className="w-full border rounded-lg px-3 py-2 text-sm mt-1"
              value={editOrder.delivery_date || ""}
              onChange={(e) => setEditOrder({ ...editOrder, delivery_date: e.target.value })}
            />
          </div>

          <div>
            <label className="text-sm font-medium">Jam Pengiriman</label>
            <input
              type="time"
              className="w-full border rounded-lg px-3 py-2 text-sm mt-1"
              value={editOrder.delivery_time || ""}
              onChange={(e) => setEditOrder({ ...editOrder, delivery_time: e.target.value })}
            />
          </div>
          <div>
            <label className="text-sm font-medium">Status</label>
            <select
              className="w-full border rounded-lg px-3 py-2 text-sm mt-1"
              value={editOrder.status}
              onChange={(e) => setEditOrder({ ...editOrder, status: e.target.value })}
            >
              <option value="pending">Pending</option>
              <option value="done">Selesai</option>
              <option value="cancelled">Dibatalkan</option>
            </select>
          </div>
        </div>
        <div className="flex gap-2 mt-4">
          <button onClick={onClose} className="flex-1 border py-2 rounded-lg text-sm">
            Batal
          </button>
          <button
            onClick={saveEdit}
            disabled={loading}
            className="flex-1 py-2 rounded-lg text-sm text-white disabled:opacity-50"
            style={{background: "#085041"}}
          >
            {loading ? "Menyimpan..." : "Simpan"}
          </button>
        </div>
      </div>
    </div>
  )
}