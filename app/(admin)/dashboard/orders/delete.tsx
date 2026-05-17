"use client"

import { useState } from "react"
import {toast} from "sonner"

export default function DeleteOrder({
  id,
  onSuccess,
}: {
  id: string
  onSuccess: () => void
}) {
  const [loading, setLoading] = useState(false)

  const handleDelete = async () => {
    if (!confirm("Yakin ingin menghapus pesanan ini?")) return
    setLoading(true)
    try {
      const response = await fetch("/api/orders", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      })
      const result = await response.json()
      if (result.success) onSuccess()
      else toast.error("Gagal menghapus pesanan!")
    } catch (error) {
      console.log(error)
      toast.error("Terjadi kesalahan!")
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={handleDelete}
      disabled={loading}
      className="text-xs px-2 py-1 rounded-lg bg-gray-500 text-white disabled:opacity-50"
    >
      🗑️ Hapus
    </button>
  )
}