export default function CustomerLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <nav className="bg-white shadow p-4 flex justify-between items-center">
        <h1 className="font-bold text-primary text-xl">🍱 Katering</h1>
        <div className="flex gap-4">
          <a href="/" className="text-sm hover:text-primary">Home</a>
          <a href="/menu" className="text-sm hover:text-primary">Menu</a>
          <a href="/order" className="text-sm hover:text-primary">Pesan</a>
        </div>
      </nav>
      <main>{children}</main>
    </div>
  )
}