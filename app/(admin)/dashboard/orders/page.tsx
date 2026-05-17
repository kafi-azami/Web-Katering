"use client"

import { useState, useEffect } from "react"
import { Order } from "@/types"
import EditOrder from "./edit"
import DeleteOrder from "./delete"

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [editOrder, setEditOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(false)

  const fetchOrders = async () => {
    const response = await fetch("/api/orders")
    const result = await response.json()
    if (result.success) setOrders(result.data)
  }

  useEffect(() => { fetchOrders() }, [])

  const updateStatus = async (order: Order, status: string) => {
    setLoading(true)
    try {
      const response = await fetch("/api/orders", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...order, status }),
      })
      const result = await response.json()
      if (result.success) fetchOrders()
      else alert("Gagal mengupdate status!")
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Daftar Pesanan</h1>

      {editOrder && (
        <EditOrder
          order={editOrder}
          onClose={() => setEditOrder(null)}
          onSuccess={fetchOrders}
        />
      )}

      {orders.length === 0 ? (
        <p className="text-gray-500">Belum ada pesanan</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full bg-white rounded-xl shadow border">
            <thead>
              <tr className="bg-gray-50 text-left text-sm font-semibold text-gray-600">
                <th className="p-3">Nama</th>
                <th className="p-3">No. Telepon</th>
                <th className="p-3">Alamat</th>
                <th className="p-3">Menu</th>
                <th className="p-3">Total</th>
                <th className="p-3">Tanggal Order</th>
                <th className="p-3">Tanggal Pengiriman</th>
                <th className="p-3">Waktu Pengiriman</th>
                <th className="p-3">Jumlah</th>
                <th className="p-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id} className="border-t text-sm">
                  <td className="p-3 font-medium">{order.name}</td>
                  <td className="p-3">{order.phone}</td>
                  <td className="p-3">{order.location}</td>
                  <td className="p-3">{order.menu_name}</td>
                  <td className="p-3">Rp {Number(order.total_price).toLocaleString("id-ID")}</td>
                  <td className="p-3">{order.date}</td>
                  <td className="p-3">{order.delivery_date}</td>
                  <td className="p-3">{order.delivery_time}</td>
                  <td className="p-3">{order.quantity}</td>
                  <td className="p-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      order.status === "pending" ? "bg-yellow-100 text-yellow-700"
                      : order.status === "done" ? "bg-green-100 text-green-700"
                      : order.status === "cancelled" ? "bg-red-100 text-red-700"
                      : "bg-gray-100 text-gray-600"
                    }`}>
                      {order.status === "pending" ? "Pending"
                        : order.status === "done" ? "Selesai"
                        : order.status === "cancelled" ? "Dibatalkan"
                        : order.status}
                    </span>
                  </td>
                  <td className="p-3">
                    <div className="flex gap-1 flex-wrap">
                      {order.status !== "done" && (
                        <button
                          onClick={() => updateStatus(order, "done")}
                          disabled={loading}
                          className="text-xs px-2 py-1 rounded-lg text-white disabled:opacity-50"
                          style={{background: "#085041"}}
                        >
                          ✅ Selesai
                        </button>
                      )}
                      {order.status !== "cancelled" && (
                        <button
                          onClick={() => updateStatus(order, "cancelled")}
                          disabled={loading}
                          className="text-xs px-2 py-1 rounded-lg bg-red-500 text-white disabled:opacity-50"
                        >
                          ❌ Batalkan
                        </button>
                      )}
                      <button
                        onClick={() => setEditOrder(order)}
                        className="text-xs px-2 py-1 rounded-lg bg-blue-500 text-white"
                      >
                        ✏️ Edit
                      </button>
                      <DeleteOrder id={order.id} onSuccess={fetchOrders} />
                    </div>
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