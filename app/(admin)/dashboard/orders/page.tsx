"use client"

import { useState, useEffect } from "react"
import { Order } from "@/types"
import EditOrder from "./edit"
import DeleteOrder from "./delete"
import { toast } from "sonner"

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [editOrder, setEditOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(false)

  const [filterStatus, setFilterStatus] = useState<
    "all" | "pending" | "done" | "cancelled"
  >("all")

  const fetchOrders = async () => {
    const response = await fetch("/api/orders")
    const result = await response.json()

    if (result.success) {
      setOrders(result.data)
    }
  }
  

  useEffect(() => {
    fetchOrders()
  }, [])

  const updateStatus = async (order: Order, status: string) => {
    setLoading(true)

    try {
      const response = await fetch("/api/orders", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...order,
          status,
        }),
      })

      const result = await response.json()

      if (result.success) {
        toast.success("Status berhasil diupdate")
        fetchOrders()
      } else {
        toast.error("Gagal mengupdate status")
      }
    } catch (error) {
      console.log(error)
      toast.error("Terjadi kesalahan")
    } finally {
      setLoading(false)
    }
  }

  const totalOrders = orders.length

  const pendingOrders = orders.filter(
    (o) => o.status === "pending"
  ).length

  const doneOrders = orders.filter(
    (o) => o.status === "done"
  ).length

  const cancelledOrders = orders.filter(
    (o) => o.status === "cancelled"
  ).length

  const filteredOrders = orders.filter((order) => {
    if (filterStatus === "all") return true
    return order.status === filterStatus
  })

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-emerald-50 via-white to-green-100/50 p-4 sm:p-6 md:p-8 overflow-hidden">

      {/* BACKGROUND SHAPES */}
      <div className="absolute top-10 -right-16 w-72 h-72 bg-emerald-100/40 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 -left-20 w-60 h-60 bg-green-200/30 rounded-3xl rotate-12 blur-2xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-emerald-100/40 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto">

        {/* HEADER */}
        <div className="mb-8 text-center">
          <div className="w-12 h-1.5 bg-emerald-500 rounded-full mx-auto mb-3" />

          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-800">
            Dashboard Pesanan
          </h1>

          <p className="text-sm text-slate-500 mt-2">
            Kelola seluruh pesanan pelanggan dengan mudah
          </p>
        </div>

        {/* FILTER STATS */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-5 mb-8">

          {/* TOTAL */}
          <button
            onClick={() => setFilterStatus("all")}
            className={`text-left rounded-2xl border p-4 shadow-sm transition-all duration-200 hover:-translate-y-1 ${
              filterStatus === "all"
                ? "bg-emerald-500 text-white border-emerald-500 shadow-lg shadow-emerald-500/20"
                : "bg-white/80 backdrop-blur-sm border-emerald-100"
            }`}
          >
            <p className={`text-xs mb-1 ${
              filterStatus === "all"
                ? "text-emerald-100"
                : "text-slate-400"
            }`}>
              Total Pesanan
            </p>

            <h2 className="text-2xl font-black">
              {totalOrders}
            </h2>
          </button>

          {/* PENDING */}
          <button
            onClick={() => setFilterStatus("pending")}
            className={`text-left rounded-2xl border p-4 shadow-sm transition-all duration-200 hover:-translate-y-1 ${
              filterStatus === "pending"
                ? "bg-yellow-500 text-white border-yellow-500 shadow-lg shadow-yellow-500/20"
                : "bg-white/80 backdrop-blur-sm border-yellow-100"
            }`}
          >
            <p className={`text-xs mb-1 ${
              filterStatus === "pending"
                ? "text-yellow-100"
                : "text-slate-400"
            }`}>
              Pending
            </p>

            <h2 className={`text-2xl font-black ${
              filterStatus === "pending"
                ? "text-white"
                : "text-yellow-500"
            }`}>
              {pendingOrders}
            </h2>
          </button>

          {/* DONE */}
          <button
            onClick={() => setFilterStatus("done")}
            className={`text-left rounded-2xl border p-4 shadow-sm transition-all duration-200 hover:-translate-y-1 ${
              filterStatus === "done"
                ? "bg-green-500 text-white border-green-500 shadow-lg shadow-green-500/20"
                : "bg-white/80 backdrop-blur-sm border-green-100"
            }`}
          >
            <p className={`text-xs mb-1 ${
              filterStatus === "done"
                ? "text-green-100"
                : "text-slate-400"
            }`}>
              Selesai
            </p>

            <h2 className={`text-2xl font-black ${
              filterStatus === "done"
                ? "text-white"
                : "text-green-600"
            }`}>
              {doneOrders}
            </h2>
          </button>

          {/* CANCELLED */}
          <button
            onClick={() => setFilterStatus("cancelled")}
            className={`text-left rounded-2xl border p-4 shadow-sm transition-all duration-200 hover:-translate-y-1 ${
              filterStatus === "cancelled"
                ? "bg-red-500 text-white border-red-500 shadow-lg shadow-red-500/20"
                : "bg-white/80 backdrop-blur-sm border-red-100"
            }`}
          >
            <p className={`text-xs mb-1 ${
              filterStatus === "cancelled"
                ? "text-red-100"
                : "text-slate-400"
            }`}>
              Dibatalkan
            </p>

            <h2 className={`text-2xl font-black ${
              filterStatus === "cancelled"
                ? "text-white"
                : "text-red-500"
            }`}>
              {cancelledOrders}
            </h2>
          </button>

        </div>

        {editOrder && (
          <EditOrder
            order={editOrder}
            onClose={() => setEditOrder(null)}
            onSuccess={fetchOrders}
          />
        )}

        {filteredOrders.length === 0 ? (
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-emerald-100 p-10 text-center">
            <p className="text-slate-400">
              Tidak ada pesanan dengan filter ini
            </p>
          </div>
        ) : (
          <>
            {/* MOBILE VIEW */}
            <div className="grid grid-cols-1 md:hidden gap-4">

              {filteredOrders.map((order) => (
                <div
                  key={order.id}
                  className="bg-white/90 backdrop-blur-sm rounded-2xl border border-emerald-100 shadow-sm p-4"
                >

                  <div className="flex items-start justify-between gap-3 mb-4">

                    <div>
                      <h3 className="font-extrabold text-slate-800 text-base">
                        {order.name}
                      </h3>

                      <p className="text-xs text-slate-400">
                        {order.phone}
                      </p>
                    </div>

                    <span
                      className={`px-2.5 py-1 rounded-full text-[10px] font-bold whitespace-nowrap ${
                        order.status === "pending"
                          ? "bg-yellow-100 text-yellow-700"
                          : order.status === "done"
                          ? "bg-green-100 text-green-700"
                          : order.status === "cancelled"
                          ? "bg-red-100 text-red-700"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {order.status}
                    </span>

                  </div>

                  <div className="space-y-2 text-sm">

                    <div className="flex justify-between gap-3">
                      <span className="text-slate-400">
                        Menu
                      </span>

                      <span className="font-medium text-right">
                        {order.menu_name}
                      </span>
                    </div>

                    <div className="flex justify-between gap-3">
                      <span className="text-slate-400">
                        Total
                      </span>

                      <span className="font-black text-emerald-600">
                        Rp{" "}
                        {Number(order.total_price).toLocaleString("id-ID")}
                      </span>
                    </div>

                    <div className="flex justify-between gap-3">
                      <span className="text-slate-400">
                        Jumlah
                      </span>

                      <span>
                        {order.quantity} porsi
                      </span>
                    </div>

                    <div className="flex justify-between gap-3">
                      <span className="text-slate-400">
                        Pengiriman
                      </span>

                      <span className="text-right">
                        {order.delivery_date}
                        <br />
                        {order.delivery_time}
                      </span>
                    </div>

                    <div>
                      <p className="text-slate-400 mb-1">
                        Alamat
                      </p>

                      <p className="text-sm">
                        {order.location}
                      </p>
                    </div>

                  </div>

                  {/* ACTIONS */}
                  <div className="flex flex-wrap gap-2 mt-5">

                    {order.status !== "done" && (
                      <button
                        onClick={() =>
                          updateStatus(order, "done")
                        }
                        disabled={loading}
                        className="flex-1 bg-emerald-500 text-white py-2 rounded-xl text-xs font-bold hover:bg-emerald-600 transition-all"
                      >
                        ✅ Selesai
                      </button>
                    )}

                    {order.status !== "cancelled" && (
                      <button
                        onClick={() =>
                          updateStatus(order, "cancelled")
                        }
                        disabled={loading}
                        className="flex-1 bg-red-500 text-white py-2 rounded-xl text-xs font-bold hover:bg-red-600 transition-all"
                      >
                        ❌ Batalkan
                      </button>
                    )}

                    <button
                      onClick={() => setEditOrder(order)}
                      className="flex-1 bg-blue-500 text-white py-2 rounded-xl text-xs font-bold hover:bg-blue-600 transition-all"
                    >
                      ✏️ Edit
                    </button>

                    <DeleteOrder
                      id={order.id}
                      onSuccess={fetchOrders}
                    />

                  </div>
                </div>
              ))}

            </div>

            {/* DESKTOP TABLE */}
            <div className="hidden md:block overflow-x-auto rounded-2xl border border-emerald-100 bg-white/90 backdrop-blur-sm shadow-lg">

              <table className="w-full">

                <thead>
                  <tr className="bg-emerald-50 text-left text-sm text-emerald-900">
                    <th className="p-4 font-bold">Nama</th>
                    <th className="p-4 font-bold">Menu</th>
                    <th className="p-4 font-bold">Total</th>
                    <th className="p-4 font-bold">Pengiriman</th>
                    <th className="p-4 font-bold">Status</th>
                    <th className="p-4 font-bold">Aksi</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredOrders.map((order) => (
                    <tr
                      key={order.id}
                      className="border-t border-emerald-50 hover:bg-emerald-50/40 transition-colors"
                    >

                      <td className="p-4">
                        <div>
                          <p className="font-bold text-slate-800">
                            {order.name}
                          </p>

                          <p className="text-xs text-slate-400">
                            {order.phone}
                          </p>
                        </div>
                      </td>

                      <td className="p-4">
                        <p className="font-medium text-slate-700">
                          {order.menu_name}
                        </p>

                        <p className="text-xs text-slate-400">
                          {order.quantity} porsi
                        </p>
                      </td>

                      <td className="p-4 font-black text-emerald-600">
                        Rp{" "}
                        {Number(order.total_price).toLocaleString("id-ID")}
                      </td>

                      <td className="p-4 text-sm text-slate-600">
                        {order.delivery_date}
                        <br />
                        {order.delivery_time}
                      </td>

                      <td className="p-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-bold ${
                            order.status === "pending"
                              ? "bg-yellow-100 text-yellow-700"
                              : order.status === "done"
                              ? "bg-green-100 text-green-700"
                              : order.status === "cancelled"
                              ? "bg-red-100 text-red-700"
                              : "bg-gray-100 text-gray-600"
                          }`}
                        >
                          {order.status}
                        </span>
                      </td>

                      <td className="p-4">
                        <div className="flex gap-2 flex-wrap">

                          {order.status !== "done" && (
                            <button
                              onClick={() =>
                                updateStatus(order, "done")
                              }
                              disabled={loading}
                              className="px-3 py-2 rounded-xl text-xs font-bold bg-emerald-500 text-white hover:bg-emerald-600 transition-all"
                            >
                              ✅
                            </button>
                          )}

                          {order.status !== "cancelled" && (
                            <button
                              onClick={() =>
                                updateStatus(order, "cancelled")
                              }
                              disabled={loading}
                              className="px-3 py-2 rounded-xl text-xs font-bold bg-red-500 text-white hover:bg-red-600 transition-all"
                            >
                              ❌
                            </button>
                          )}

                          <button
                            onClick={() => setEditOrder(order)}
                            className="px-3 py-2 rounded-xl text-xs font-bold bg-blue-500 text-white hover:bg-blue-600 transition-all"
                          >
                            ✏️
                          </button>

                          <DeleteOrder
                            id={order.id}
                            onSuccess={fetchOrders}
                          />

                        </div>
                      </td>

                    </tr>
                  ))}
                </tbody>

              </table>

            </div>
          </>
        )}
      </div>
    </div>
  )
}