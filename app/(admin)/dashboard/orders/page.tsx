import { Order } from "@/types"

async function getOrders(): Promise<Order[]> {
  const url = `${process.env.NEXT_PUBLIC_BASE_URL}/api/orders`
  const response = await fetch(url, { cache: "no-store" })
  const result = await response.json()
  if (!result.success) return []
  return result.data
}

export default async function AdminOrdersPage() {
  const orders = await getOrders()

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Daftar Pesanan</h1>

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
                <th className="p-3">Tanggal</th>
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
                  <td className="p-3">
                    Rp {Number(order.total_price).toLocaleString("id-ID")}
                  </td>
                  <td className="p-3">{order.date}</td>
                  <td className="p-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      order.status === "pending"
                        ? "bg-yellow-100 text-yellow-700"
                        : order.status === "done"
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-100 text-gray-600"
                    }`}>
                      {order.status}
                    </span>
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