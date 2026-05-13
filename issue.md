# Issue: Inisialisasi Project Baru dengan Bun

## Deskripsi

Buat project backend baru dari nol menggunakan **Bun** sebagai runtime dan package manager. Project menggunakan **ElysiaJS** sebagai framework HTTP, **Drizzle ORM** untuk database layer, **PostgreSQL** sebagai database, dan **Zod** untuk validasi & type-safety.

---

## Task 1: Inisialisasi Project

- Jalankan `bun init` pada root folder project.
- Install dependency utama:
  - `elysia` (framework HTTP)
  - `drizzle-orm` dan `drizzle-kit` (ORM & migration tool)
  - `postgres` (driver PostgreSQL — gunakan package `postgres` / postgresjs)
  - `zod` (validasi schema & type-safety)
- Setup `tsconfig.json` dengan strict mode enabled.
- Buat script di `package.json`:
  - `dev` — jalankan server dalam mode development
  - `db:generate` — generate migration files via drizzle-kit
  - `db:migrate` — jalankan migration ke database

---

## Task 2: Buat Struktur Folder

Buat struktur folder berikut di dalam project:

```
src/
├── layers/
│   ├── controllers/
│   ├── services/
│   ├── repositories/
│   ├── models/
│   ├── middlewares/
│   └── utils/
├── config/
├── database/
├── routes/
├── app.ts
└── server.ts
```

Setiap folder boleh diisi file `index.ts` kosong sebagai placeholder agar struktur terbentuk di git.

---

## Task 3: Setup Konfigurasi

- Buat file `src/config/env.ts` — load environment variables menggunakan Zod untuk validasi (contoh: `DATABASE_URL`, `PORT`).
- Buat file `.env.example` berisi daftar env yang dibutuhkan.
- Buat file `drizzle.config.ts` di root project — konfigurasi drizzle-kit agar membaca schema dari `src/database/` dan output migration ke folder `drizzle/`.

---

## Task 4: Setup Database Connection

- Buat file `src/database/connection.ts` — inisialisasi koneksi PostgreSQL menggunakan `postgres` (postgresjs) dan wrap dengan `drizzle-orm`.
- Buat file `src/database/schema.ts` — tempat mendefinisikan table schema menggunakan Drizzle. Cukup buat satu contoh table sederhana (misal: `users`) sebagai referensi.

---

## Task 5: Setup App & Server

- **`src/app.ts`** — inisialisasi instance Elysia, pasang global middleware (jika ada), dan register routes.
- **`src/server.ts`** — import app dari `app.ts`, jalankan server dengan `app.listen()` menggunakan port dari config.

---

## Task 6: Buat Contoh CRUD Sederhana

Buat satu contoh flow lengkap untuk resource `users` agar jadi referensi pattern:

1. **Model** (`src/layers/models/user.model.ts`) — definisikan Zod schema untuk validasi input (create & update).
2. **Repository** (`src/layers/repositories/user.repository.ts`) — fungsi-fungsi query ke database via Drizzle (find, findById, create, update, delete).
3. **Service** (`src/layers/services/user.service.ts`) — business logic yang memanggil repository. Validasi input menggunakan Zod schema dari model.
4. **Controller** (`src/layers/controllers/user.controller.ts`) — handler yang menerima request, panggil service, dan return response.
5. **Route** (`src/routes/user.route.ts`) — definisikan endpoint CRUD (`GET`, `POST`, `PUT`, `DELETE`) dan hubungkan ke controller.
6. Register route di `src/app.ts`.

---

## Task 7: Middleware & Error Handling

- Buat global error handler middleware di `src/layers/middlewares/error.middleware.ts` — tangkap error dan kembalikan response JSON yang konsisten.
- Buat contoh utility di `src/layers/utils/` jika diperlukan (misal: response formatter).

---

## Catatan

- Semua type dan validasi harus menggunakan **Zod**. Hindari penggunaan `any`.
- Ikuti alur **Controller → Service → Repository** secara konsisten.
- Pastikan project bisa dijalankan dengan `bun run dev` tanpa error setelah semua task selesai.
