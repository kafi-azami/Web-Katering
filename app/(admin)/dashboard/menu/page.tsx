"use client"

import { useMemo, useState, useEffect } from "react"
import Link from "next/link"

import { Menu } from "@/types"

async function getMenus(): Promise<Menu[]> {
  const url = `${process.env.NEXT_PUBLIC_BASE_URL}/api/menus`

  const response = await fetch(url, {
    cache: "no-store",
  })

  const result = await response.json()

  if (!result.success) return []

  return result.data
}

export default function AdminMenuPage() {
  const [menus, setMenus] = useState<Menu[]>([])
  const [loading, setLoading] = useState(true)

  const [categoryIndex, setCategoryIndex] = useState(0)

  const [periodicFilter, setPeriodicFilter] = useState<
    "all" | "periodic" | "non-periodic"
  >("all")

  const [selectedDate, setSelectedDate] = useState(() => {
    return new Date().toISOString().split("T")[0]
  })

  const [showDatePicker, setShowDatePicker] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getMenus()
        setMenus(data)
      } catch (error) {
        console.log(error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const categories = useMemo(() => {
    const uniqueCategories = [
      ...new Set(
        menus.map((m) => m.category || "lainnya")
      ),
    ]

    return ["all", ...uniqueCategories]
  }, [menus])

  const currentCategory =
    categories[categoryIndex]

  const filteredMenus = menus.filter((menu) => {
    const menuCategory =
      menu.category || "lainnya"

    const isPeriodic =
      menu.is_periodic === "TRUE" ||
      menu.is_periodic === "true"

    const categoryMatch =
      currentCategory === "all"
        ? true
        : menuCategory === currentCategory

    const periodicMatch =
      periodicFilter === "all"
        ? true
        : periodicFilter === "periodic"
        ? isPeriodic
        : !isPeriodic

    return categoryMatch && periodicMatch
  })

  const periodicMenus = menus.filter(
    (m) =>
      m.is_periodic === "TRUE" ||
      m.is_periodic === "true"
  ).length

  const nonPeriodicMenus =
    menus.length - periodicMenus

  const nextCategory = () => {
    if (categoryIndex >= categories.length - 1) {
      setCategoryIndex(0)
    } else {
      setCategoryIndex(categoryIndex + 1)
    }
  }

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-emerald-50 via-white to-green-100/50 p-4 sm:p-6 md:p-8 overflow-hidden">

      {/* BACKGROUND */}
      <div className="absolute top-10 -right-16 w-72 h-72 bg-emerald-100/40 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 -left-20 w-60 h-60 bg-green-200/30 rounded-3xl rotate-12 blur-2xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-emerald-100/40 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto">

        {/* HEADER */}
        <div className="mb-8 text-center">

          <div className="w-12 h-1.5 bg-emerald-500 rounded-full mx-auto mb-3" />

          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-800">
            Dashboard Menu
          </h1>

          <p className="text-sm text-slate-500 mt-2">
            Kelola seluruh menu makanan dengan mudah
          </p>

        </div>

        {/* TOP ACTION */}
        <div className="flex justify-end mb-6">
          <Link
            href="/dashboard/menu/add"
            className="bg-gradient-to-r from-emerald-500 to-green-600 text-white px-5 py-3 rounded-2xl font-bold text-sm shadow-lg shadow-emerald-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
          >
            + Tambah Menu
          </Link>
        </div>

        {/* FILTER CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">

          {/* KATEGORI */}
          <button
            onClick={nextCategory}
            className="bg-white/90 backdrop-blur-sm rounded-2xl border border-emerald-100 p-5 shadow-sm hover:-translate-y-1 hover:shadow-lg transition-all duration-200 text-left"
          >
            <p className="text-xs text-slate-400 mb-1">
              Filter Kategori
            </p>

            <h2 className="text-2xl font-black text-emerald-600 capitalize">
              {currentCategory === "all"
                ? "Semua"
                : currentCategory}
            </h2>

            <p className="text-xs text-slate-400 mt-2">
              Klik untuk ganti kategori
            </p>
          </button>

          {/* PERIODIK */}
          <button
            onClick={() => {
              if (periodicFilter === "all") {
                setPeriodicFilter("periodic")
              } else if (
                periodicFilter === "periodic"
              ) {
                setPeriodicFilter("non-periodic")
              } else {
                setPeriodicFilter("all")
              }
            }}
            className="bg-white/90 backdrop-blur-sm rounded-2xl border border-emerald-100 p-5 shadow-sm hover:-translate-y-1 hover:shadow-lg transition-all duration-200 text-left"
          >
            <p className="text-xs text-slate-400 mb-1">
              Filter Periodik
            </p>

            <h2 className="text-2xl font-black text-emerald-600">
              {periodicFilter === "all"
                ? "Semua"
                : periodicFilter === "periodic"
                ? "Periodik"
                : "Non Periodik"}
            </h2>

            <p className="text-xs text-slate-400 mt-2">
              Klik untuk ganti filter
            </p>
          </button>

          {/* TANGGAL */}
          <button
            onClick={() =>
              setShowDatePicker(true)
            }
            className="bg-white/90 backdrop-blur-sm rounded-2xl border border-emerald-100 p-5 shadow-sm hover:-translate-y-1 hover:shadow-lg transition-all duration-200 text-left"
          >
            <p className="text-xs text-slate-400 mb-1">
              Filter Waktu
            </p>

            <h2 className="text-xl font-black text-emerald-600">
              {selectedDate}
            </h2>

            <p className="text-xs text-slate-400 mt-2">
              Klik untuk pilih tanggal
            </p>
          </button>

        </div>

        {/* STATS */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-5 mb-8">

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-emerald-100 p-4 shadow-sm">
            <p className="text-xs text-slate-400 mb-1">
              Total Menu
            </p>

            <h2 className="text-2xl font-black text-emerald-600">
              {menus.length}
            </h2>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-green-100 p-4 shadow-sm">
            <p className="text-xs text-slate-400 mb-1">
              Hasil Filter
            </p>

            <h2 className="text-2xl font-black text-green-600">
              {filteredMenus.length}
            </h2>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-yellow-100 p-4 shadow-sm">
            <p className="text-xs text-slate-400 mb-1">
              Periodik
            </p>

            <h2 className="text-2xl font-black text-yellow-500">
              {periodicMenus}
            </h2>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-slate-100 p-4 shadow-sm">
            <p className="text-xs text-slate-400 mb-1">
              Non Periodik
            </p>

            <h2 className="text-2xl font-black text-slate-700">
              {nonPeriodicMenus}
            </h2>
          </div>

        </div>

        {/* DATE POPUP */}
        {showDatePicker && (
          <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">

            <div className="w-full max-w-sm bg-white rounded-3xl border border-emerald-100 shadow-2xl p-6">

              <h2 className="text-xl font-black text-slate-800 mb-2">
                Pilih Tanggal
              </h2>

              <p className="text-sm text-slate-400 mb-5">
                Filter data berdasarkan tanggal tertentu
              </p>

              <input
                type="date"
                value={selectedDate}
                onChange={(e) =>
                  setSelectedDate(e.target.value)
                }
                className="w-full border border-emerald-100 rounded-2xl px-4 py-3 outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500"
              />

              <div className="flex gap-3 mt-6">

                <button
                  onClick={() =>
                    setShowDatePicker(false)
                  }
                  className="flex-1 border border-slate-200 py-3 rounded-2xl font-bold text-slate-600"
                >
                  Tutup
                </button>

                <button
                  onClick={() =>
                    setShowDatePicker(false)
                  }
                  className="flex-1 bg-gradient-to-r from-emerald-500 to-green-600 text-white py-3 rounded-2xl font-bold shadow-lg shadow-emerald-500/20"
                >
                  Simpan
                </button>

              </div>

            </div>

          </div>
        )}

        {/* EMPTY */}
        {!loading && filteredMenus.length === 0 && (
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-emerald-100 p-10 text-center">
            <p className="text-slate-400">
              Tidak ada menu ditemukan
            </p>
          </div>
        )}

        {/* MOBILE CARD */}
        <div className="grid grid-cols-1 md:hidden gap-4">

          {filteredMenus.map((menu) => (
            <div
              key={menu.id}
              className="bg-white/90 backdrop-blur-sm rounded-2xl border border-emerald-100 shadow-sm p-4"
            >

              <div className="flex items-start justify-between gap-3 mb-4">

                <div>
                  <h3 className="font-extrabold text-slate-800 text-base">
                    {menu.name}
                  </h3>

                  <p className="text-xs text-slate-400 capitalize">
                    {menu.category}
                  </p>
                </div>

                <span
                  className={`px-2.5 py-1 rounded-full text-[10px] font-bold whitespace-nowrap ${
                    menu.is_periodic === "TRUE" ||
                    menu.is_periodic === "true"
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-slate-100 text-slate-700"
                  }`}
                >
                  {menu.is_periodic === "TRUE" ||
                  menu.is_periodic === "true"
                    ? "Periodik"
                    : "Normal"}
                </span>

              </div>

              <div className="space-y-2 text-sm">

                <div className="flex justify-between">
                  <span className="text-slate-400">
                    Harga
                  </span>

                  <span className="font-black text-emerald-600">
                    Rp{" "}
                    {Number(menu.price).toLocaleString(
                      "id-ID"
                    )}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-slate-400">
                    Hari
                  </span>

                  <span>
                    {menu.day || "-"}
                  </span>
                </div>

              </div>

              <div className="flex gap-2 mt-5">

                <Link
                  href={`/dashboard/menu/edit/${menu.id}`}
                  className="flex-1 bg-blue-500 text-white py-2 rounded-xl text-xs font-bold text-center hover:bg-blue-600 transition-all"
                >
                  ✏️ Edit
                </Link>

                <Link
                  href={`/dashboard/menu/delete/${menu.id}`}
                  className="flex-1 bg-red-500 text-white py-2 rounded-xl text-xs font-bold text-center hover:bg-red-600 transition-all"
                >
                  🗑 Hapus
                </Link>

              </div>

            </div>
          ))}

        </div>

        {/* DESKTOP TABLE */}
        <div className="hidden md:block overflow-x-auto rounded-2xl border border-emerald-100 bg-white/90 backdrop-blur-sm shadow-lg mt-6">

          <table className="w-full">

            <thead>
              <tr className="bg-emerald-50 text-left text-sm text-emerald-900">
                <th className="p-4 font-bold">
                  Nama
                </th>

                <th className="p-4 font-bold">
                  Kategori
                </th>

                <th className="p-4 font-bold">
                  Harga
                </th>

                <th className="p-4 font-bold">
                  Periodik
                </th>

                <th className="p-4 font-bold">
                  Hari
                </th>

                <th className="p-4 font-bold">
                  Aksi
                </th>
              </tr>
            </thead>

            <tbody>

              {filteredMenus.map((menu) => (
                <tr
                  key={menu.id}
                  className="border-t border-emerald-50 hover:bg-emerald-50/40 transition-colors"
                >

                  <td className="p-4 font-bold text-slate-800">
                    {menu.name}
                  </td>

                  <td className="p-4 capitalize text-slate-600">
                    {menu.category}
                  </td>

                  <td className="p-4 font-black text-emerald-600">
                    Rp{" "}
                    {Number(menu.price).toLocaleString(
                      "id-ID"
                    )}
                  </td>

                  <td className="p-4">

                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold ${
                        menu.is_periodic === "TRUE" ||
                        menu.is_periodic === "true"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-slate-100 text-slate-700"
                      }`}
                    >
                      {menu.is_periodic === "TRUE" ||
                      menu.is_periodic === "true"
                        ? "Ya"
                        : "Tidak"}
                    </span>

                  </td>

                  <td className="p-4 text-slate-600">
                    {menu.day || "-"}
                  </td>

                  <td className="p-4">

                    <div className="flex gap-2">

                      <Link
                        href={`/dashboard/menu/edit/${menu.id}`}
                        className="px-4 py-2 rounded-xl text-xs font-bold bg-blue-500 text-white hover:bg-blue-600 transition-all"
                      >
                        ✏️ Edit
                      </Link>

                      <Link
                        href={`/dashboard/menu/delete/${menu.id}`}
                        className="px-4 py-2 rounded-xl text-xs font-bold bg-red-500 text-white hover:bg-red-600 transition-all"
                      >
                        🗑 Hapus
                      </Link>

                    </div>

                  </td>

                </tr>
              ))}

            </tbody>

          </table>

        </div>

      </div>
    </div>
  )
}