# Backend - Aplikasi Karyawan

Repositori ini berisi kode sumber backend untuk Aplikasi Karyawan, sebuah sistem informasi karyawan sederhana berbasis web. Backend ini melayani dua frontend: portal **Admin (HRD)** dan portal **Karyawan**.

Sistem ini memungkinkan admin untuk mengelola data pokok karyawan (termasuk membuat data kosong), sementara karyawan dapat melengkapi dan mengelola data pribadi serta sertifikat mereka secara mandiri.

## 🚀 Teknologi yang Digunakan

Backend ini dibangun menggunakan teknologi modern untuk performa, keamanan, dan *developer experience* yang optimal:

*   **Runtime:** [Bun](https://bun.sh/)
*   **Web Framework:** [ElysiaJS](https://elysiajs.com/)
*   **ORM:** [Drizzle ORM](https://orm.drizzle.team/)
*   **Database:** PostgreSQL
*   **Autentikasi:** JWT (JSON Web Tokens)
*   **Arsitektur:** Layered Architecture (`Routes` → `Controllers` → `Services` → `Repositories`)

## 🎯 Fitur Utama (Product Backlog)

API backend ini dirancang untuk mendukung fitur-fitur (Epik & User Stories) berikut:
1.  **Autentikasi & Otorisasi:** Login terpisah untuk Admin & Karyawan dengan manajemen peran (Role-Based Access Control).
2.  **Manajemen Karyawan oleh Admin:** Endpoint CRUD (Create, Read, Update, Delete) untuk data pokok karyawan.
3.  **Profil Karyawan (User):** Endpoint bagi karyawan untuk melihat dan memperbarui data pribadi secara mandiri.
4.  **Manajemen Sertifikat:** Endpoint bagi karyawan untuk menambah, mengedit, atau menghapus sertifikat yang mereka miliki.
5.  **Dashboard & Pelaporan Sederhana:** Endpoint statistik dan ringkasan data untuk ditampilkan pada dashboard Admin.

## 🛠️ Persyaratan Sistem

Pastikan environment Anda telah memiliki:
*   [Bun](https://bun.sh/) versi terbaru.
*   PostgreSQL (bisa dijalankan via Docker atau instance lokal).

## 📦 Cara Instalasi & Menjalankan Project

1.  **Masuk ke direktori backend:**
    ```bash
    cd backend
    ```

2.  **Instal *dependencies*:**
    ```bash
    bun install
    ```

3.  **Konfigurasi *Environment Variables*:**
    Buat file `.env` di *root* folder `backend` (bisa menyalin dari `.env.example` jika ada). Pastikan variabel berikut diisi, contohnya:
    ```env
    DATABASE_URL="postgres://postgres:password@localhost:5432/aplikasi_pegawai"
    JWT_SECRET="super-secret-key-anda"
    PORT=3000
    ```

4.  **Menjalankan Server (Mode Development):**
    ```bash
    bun run dev
    ```
    *(Secara default, Elysia berjalan pada port 3000. Akses di http://localhost:3000)*

## 🗄️ Database Migrations (Drizzle ORM)

Skema database dikelola menggunakan Drizzle ORM. Berikut beberapa perintah umum yang akan digunakan:

*   **Generate file migrasi** (setelah mengubah skema di file TypeScript):
    ```bash
    bun run db:generate
    ```
*   **Menjalankan migrasi ke database PostgreSQL:**
    ```bash
    bun run db:migrate
    ```
*   (Opsional) **Push skema langsung ke database** (berguna saat prototipe/development awal):
    ```bash
    bun run db:push
    ```
*   **Membuka antarmuka Drizzle Studio** (GUI database di browser):
    ```bash
    bun run db:studio
    ```
    
*(Catatan: Perintah-perintah di atas perlu didaftarkan terlebih dahulu di bagian `scripts` pada `package.json` Anda).*

## 🧪 Testing

Project ini menggunakan fitur *test runner* bawaan dari Bun. 

*   Untuk menjalankan seluruh *test suite*:
    ```bash
    bun test
    ```
*   Untuk menjalankan *test* secara spesifik atau dengan *watch mode*:
    ```bash
    bun test --watch
    ```
