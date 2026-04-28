export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen">
      <aside className="w-48 bg-gray-800 text-white p-4">
        <h2 className="font-bold text-lg mb-6">Admin Panel</h2>
        <nav className="flex flex-col gap-2">
          <a href="/dashboard/menu" className="text-sm hover:text-primary">Menu</a>
          <a href="/dashboard/orders" className="text-sm hover:text-primary">Pesanan</a>
        </nav>
      </aside>
      <main className="flex-1 bg-gray-50">{children}</main>
    </div>
  )
}