# Web Katering

Web Katering adalah aplikasi berbasis web yang dirancang untuk mempermudah manajemen dan pemesanan layanan katering secara online. Proyek ini dibangun sebagai prototipe awal menggunakan Next.js dengan arsitektur App Router untuk memberikan gambaran alur sistem pemesanan katering yang efisien.

---

## Fitur Aplikasi (Prototipe Awal)

Sebagai sebuah prototipe, fokus utama dari proyek ini adalah menguji alur kerja (workflow) dasar dari dua sisi pengguna tanpa melibatkan sistem autentikasi yang kompleks.

### Fitur Pengguna (User)
Aplikasi ini menerapkan sistem *guest checkout*, di mana pengguna tidak perlu melakukan registrasi atau login untuk melakukan pemesanan.
* **Pemesanan Langsung:** Pengguna dapat memilih menu katering dan melakukan pemesanan langsung dari dashboard utama.
* **Pencarian Menu:** Memudahkan pengguna mencari menu katering tertentu secara spesifik melalui kolom pencarian.
* **Filter Menu:** Menyaring hidangan berdasarkan nama dan jenis makanan untuk mempercepat proses pemilihan.

### Fitur Pengelola (Admin)
Halaman manajemen untuk mengelola ketersediaan menu dan memantau aktivitas pemesanan yang masuk.
* **CRUD Manajemen Menu:** Mengisi, melihat, memperbarui, dan menghapus data menu katering secara dinamis.
* **Statistik Pesanan:** Memantau jumlah total pesanan yang masuk secara real-time melalui panel admin.

---

## Teknologi Utama

Proyek ini memanfaatkan ekosistem modern untuk memastikan kemudahan pengembangan dan performa yang optimal:

| Komponen | Teknologi |
| :--- | :--- |
| Framework | Next.js 15 (App Router) |
| Bahasa Pemrograman | TypeScript |
| Struktur Styling | Tailwind CSS |
| Komponen UI | Shadcn UI |
| Database / Penyimpanan | Google Sheets (Spreadsheet) |
| Penjamin Kualitas | ESLint |

---

## Struktur Direktori

```text
├── app/              # Routing halaman utama, alur pemesanan, dan panel admin
├── components/       # Komponen UI modular (tabel, card menu, form input)
├── lib/              # Fungsi utilitas dan konfigurasi integrasi Google Sheets API
├── public/           # Aset statis seperti gambar menu dan ikon aplikasi
└── types/            # Definisi tipe data TypeScript global
```

---

## Pengembangan Lebih Lanjut

Karena proyek ini masih berstatus prototipe awal, pengembangan di masa mendatang direncanakan untuk mencakup:
* Integrasi sistem autentikasi (Login/Register) untuk keamanan data admin.
* Migrasi database dari Google Sheets ke database relasional/non-relasional untuk skalabilitas.
* Sistem pembayaran (Payment Gateway) otomatis.
* Integrasi notifikasi pesanan langsung ke WhatsApp admin.
