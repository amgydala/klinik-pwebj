# Panduan Alur Demo SIMklinik dengan Data Dummy

Dokumen ini menjadi acuan frontend untuk memperagakan alur SIMklinik tanpa
memanggil API. Seluruh data dan perubahan status selama demo menggunakan data
dummy di sisi frontend. Padanan endpoint dicantumkan hanya agar alur tetap
selaras dengan backend ketika integrasi dilakukan nanti.

> **Penting:** nama, alamat, NIK, kontak, jadwal, dan data klinis di dokumen ini
> adalah contoh sintetis. Jangan gunakan data pasien sungguhan untuk demo.

## 1. Gambaran alur utama

1. Pasien membuat akun dengan data dasar.
2. Sistem menampilkan kelengkapan profil. Jika data kritis belum lengkap,
   pasien diarahkan untuk melengkapinya sebelum membuat janji pada alur demo.
3. Pasien memilih tanggal, mengisi keluhan dan penjamin.
4. Sistem mengarahkan keluhan ke poliklinik, lalu menampilkan dokter dan jadwal
   yang tersedia pada tanggal tersebut beserta sisa kuota.
5. Pasien memilih jadwal dan mengonfirmasi. Sistem demo membuat nomor antrean
   dengan status `waiting`.
6. Dokter memanggil pasien, mengubah status antrean, memeriksa pasien, dan
   mengisi rekam medis SOAP.
7. Antrean menjadi `completed`. Petugas/apoteker membuat tagihan; pasien
   melihat tagihan dan status pembayarannya.
8. Pasien dapat melihat antrean dan riwayat rekam medisnya.

## 2. Batasan perilaku yang harus dicerminkan

- Rekomendasi **bukan diagnosis atau AI**. Backend saat ini memakai pencocokan
  kata sederhana pada keluhan untuk menentukan spesialisasi:
  - Mengandung `gigi` atau `gusi` → `Poliklinik Gigi`.
  - Mengandung `anak`, `bayi`, atau `imunisasi` → `Poliklinik Anak`.
  - Selain itu → `Poliklinik Umum`.
- Ketersediaan jadwal mengikuti **tanggal kunjungan yang dipilih**. Hanya
  jadwal aktif pada tanggal itu, dokter aktif dengan spesialisasi yang cocok,
  dan jadwal yang masih memiliki kuota yang ditampilkan. Rekomendasi utama
  adalah jadwal tersedia pertama menurut urutan jam mulai; pilihan lain tetap
  ditampilkan.
- Profil memiliki dua status berbeda:
  - `is_appointment_ready`: NIK, tanggal lahir, jenis kelamin, dan nomor
    telepon tersedia.
  - `is_complete`: seluruh 10 field penilaian profil tersedia.
- Backend menerima pendaftaran pasien dengan `name`, `email`, `password`,
  `phone`, dan `address`; data profil lainnya dapat dilengkapi kemudian.
  Pembuatan janji tidak selalu diblokir oleh backend jika profil belum siap:
  pemeriksaan ketat hanya berlaku jika `require_complete_profile: true` atau
  header `X-Require-Complete-Profile: true` dikirim. Untuk demo, gunakan
  pengalaman yang lebih jelas: tahan proses booking pada layar kelengkapan
  profil sampai field kritis selesai, dan tampilkan sisa data sebagai anjuran.
- Backend membuat janji terlebih dahulu sebagai `draft`. Nomor antrean baru
  muncul setelah pasien memilih dan mengonfirmasi dokter serta jadwal.
- Status antrean yang didukung mencakup `draft`, `waiting`, `called`,
  `in_consultation`, `skipped`, `completed`, dan `cancelled`. Penyimpanan SOAP
  oleh dokter mengubah antrean menjadi `completed`.
- Di demo tanpa API, semua validasi dan perubahan di atas hanya simulasi
  frontend. Jangan menyebut data telah tersimpan ke database atau menyatakan
  bahwa rekomendasi memberi saran medis.

## 3. Data dummy untuk demo

Tanggal demo contoh adalah **29 Oktober 2026**. Ganti tanggal dan jadwal jika
demo dilakukan setelah tanggal tersebut.

### Pasien

| ID | Nama | Email | Telepon | Data profil | Skenario |
|---|---|---|---|---|---|
| `p-1001` | Budi Santoso | `budi.demo@example.test` | `080000001001` | Baru memiliki nama, telepon, alamat; field profil pasien masih kosong | Registrasi baru dan profil belum lengkap |
| `p-1002` | Sari Putri | `sari.demo@example.test` | `080000001002` | NIK, tanggal lahir, jenis kelamin, golongan darah, dan kontak darurat terisi | Pasien siap membuat janji |

Contoh profil awal Budi:

```json
{
  "name": "Budi Santoso",
  "email": "budi.demo@example.test",
  "phone": "080000001001",
  "address": "Jl. Contoh No. 10, Kota Demo",
  "nik": null,
  "place_of_birth": null,
  "date_of_birth": null,
  "gender": null,
  "blood_type": null,
  "emergency_contact_name": null,
  "emergency_contact_phone": null,
  "allergies": [],
  "chronic_diseases": []
}
```

### Dokter dan jadwal

| ID dokter | Dokter | Poliklinik/spesialisasi | ID jadwal | Tanggal | Jam | Kuota | Terisi |
|---|---|---|---|---|---|---:|---:|
| `d-201` | dr. Andi Pratama | Poliklinik Umum | `s-301` | 2026-10-29 | 08:00–12:00 | 5 | 1 |
| `d-202` | drg. Maya Lestari | Poliklinik Gigi | `s-302` | 2026-10-29 | 09:00–12:00 | 4 | 0 |
| `d-203` | dr. Rina Puspita | Poliklinik Anak | `s-303` | 2026-10-29 | 10:00–13:00 | 3 | 3 |
| `d-201` | dr. Andi Pratama | Poliklinik Umum | `s-304` | 2026-10-30 | 08:00–12:00 | 5 | 0 |

Jadwal `s-303` sengaja penuh untuk memperagakan bahwa jadwal tanpa kuota tidak
muncul sebagai pilihan. Jadwal `s-304` memperagakan bahwa tanggal lain hanya
muncul ketika pasien memilih tanggal 30 Oktober.

### Antrean, rekam medis, dan tagihan

Gunakan record awal dan buat perubahan status secara interaktif saat demo:

| ID | Pasien | Dokter/jadwal | Tanggal | Keluhan | Penjamin | Status awal | Nomor |
|---|---|---|---|---|---|---|---|
| `a-401` | Sari (`p-1002`) | Andi (`d-201` / `s-301`) | 2026-10-29 | Demam dan batuk | Umum | `waiting` | `A-001` |

Record contoh untuk tampilan setelah konsultasi:

```json
{
  "appointment_id": "a-401",
  "patient_id": "p-1002",
  "doctor_id": "d-201",
  "subjective": "Demam dan batuk sejak kemarin.",
  "objective": "Contoh catatan pemeriksaan untuk demo.",
  "assessment": "Contoh penilaian klinis demo.",
  "plan": "Contoh rencana tindak lanjut demo.",
  "prescriptions": []
}
```

Teks SOAP di atas hanya contoh tampilan, bukan panduan pemeriksaan atau
rekomendasi terapi.

## 4. Langkah demo pasien: registrasi sampai konfirmasi antrean

### A. Registrasi dan login

**Tampilan:** halaman registrasi pasien.

1. Isi nama, email, password, nomor telepon, dan alamat.
2. Setelah submit, buat record pasien lokal dengan ID dummy baru (misalnya
   `p-1003`), login sebagai pasien, lalu arahkan ke dashboard.
3. Tampilkan sapaan pasien dan banner **“Profil Anda belum lengkap”** dengan
   persentase serta tombol **Lengkapi profil**.

Padanan backend: `POST /api/register`, yang sekaligus mengembalikan token dan
status kelengkapan profil. Demo tidak perlu membuat token sungguhan.

### B. Menangani profil yang belum lengkap

Untuk Budi yang baru mendaftar:

- Nama, telepon, dan alamat sudah terisi.
- Perkiraan kelengkapan awal adalah **30% dari 10 field**.
- `is_appointment_ready` bernilai `false` karena NIK, tanggal lahir, dan jenis
  kelamin belum diisi.
- Tampilkan daftar field yang belum lengkap dan tandai empat syarat kritis:
  NIK, tanggal lahir, jenis kelamin, dan nomor telepon.

Saat pasien memilih **Lengkapi profil**, sediakan form untuk data identitas,
tanggal lahir, jenis kelamin, golongan darah, alergi/penyakit kronis, pekerjaan,
serta kontak darurat. Setelah field kritis terisi, contoh persentase Budi
menjadi **60%**; status booking siap, tetapi profil penuh masih belum lengkap.
Setelah semua 10 field penilaian terisi, tampilkan **100%** dan
`is_complete: true`.

Untuk skenario demo utama, tahan tombol booking saat `is_appointment_ready`
masih `false`, jelaskan field yang harus dilengkapi, lalu izinkan pasien lanjut
setelah menyimpan form. Data seperti alergi dan kontak darurat tetap dapat
ditampilkan sebagai informasi yang membantu petugas, bukan pengganti konsultasi
profesional.

Padanan backend:

- `GET /api/patient/profile` mengambil profil dan rincian field yang kurang.
- `PUT /api/patient/profile` memperbarui field yang dikirim.
- Kriteria hitung ada di `User::getProfileCompleteness()`.

### C. Membuat draft janji

**Tampilan:** form **Buat janji temu**.

1. Pilih tanggal kunjungan; untuk data contoh gunakan **29 Oktober 2026**.
2. Masukkan keluhan, misalnya **“Gusi bengkak dan sakit saat mengunyah”**.
3. Pilih penjamin, misalnya **Umum** atau **BPJS**.
4. Validasi tanggal tidak lampau dan keluhan/penjamin tidak kosong.
5. Simpan appointment lokal dengan status `draft`, tanpa nomor antrean.

Padanan backend: `POST /api/appointments` dengan `date`, `complaint`, dan
`guarantor`; `require_complete_profile` dapat dipakai untuk meminta pemeriksaan
ketat. Jika tanggal atau keluhan berubah sebelum konfirmasi, perbarui draft.

### D. Rekomendasi berdasarkan keluhan dan tanggal

**Tampilan:** halaman **Pilih dokter** dengan ringkasan tanggal, keluhan, dan
poliklinik tujuan.

Untuk contoh keluhan **“Gusi bengkak dan sakit saat mengunyah”** pada
**29 Oktober 2026**:

1. Pemetaan kata mengarahkan pasien ke **Poliklinik Gigi**.
2. Tampilkan jadwal aktif poliklinik itu pada 29 Oktober yang masih memiliki
   kuota. Dari data contoh, drg. Maya Lestari tersedia pukul 09:00–12:00 dengan
   kuota tersisa 4 dari 4.
3. Tandai jadwal pertama yang tersedia sebagai **Rekomendasi**, tetapi biarkan
   pasien memilih alternatif yang memenuhi tanggal dan spesialisasi.
4. Jika keluhan diubah menjadi **“Demam dan batuk”**, arahkan ke
   **Poliklinik Umum**. Jika diubah menjadi **“Anak demam”**, arahkan ke
   **Poliklinik Anak**.
5. Jika dipilih tanggal 30 Oktober, cari jadwal pada tanggal itu saja. Jangan
   menampilkan jadwal tanggal 29 Oktober.
6. Jika tidak ada jadwal cocok atau semua kuota penuh, tampilkan keadaan kosong
   yang jelas: **“Tidak ada jadwal tersedia untuk keluhan dan tanggal ini.”**
   Tawarkan ubah tanggal atau keluhan; jangan membuat nomor antrean.

Padanan backend: `POST /api/appointments/recommend` untuk rekomendasi dan
`GET /api/appointments/available-doctors?appointment_id=...` untuk daftar
pilihan. Keduanya memakai appointment draft agar tanggal dan keluhan konsisten.
Pemetaan kata dilakukan oleh `AppointmentController`, bukan model diagnosis.

### E. Konfirmasi dokter dan jadwal

**Tampilan:** dialog ringkasan konfirmasi berisi dokter, poliklinik, tanggal,
jam, keluhan, penjamin, dan sisa kuota.

1. Minta pasien menekan **Konfirmasi janji**.
2. Tandai satu kuota terpakai dan ubah status lokal dari `draft` menjadi
   `waiting`.
3. Berikan nomor antrean. Contoh: `A-001` untuk dokter gigi pada tanggal
   tersebut jika belum ada antrean aktif sebelumnya; untuk dr. Andi, data demo
   sudah memiliki satu antrean sehingga nomor berikutnya `A-002`.
4. Tampilkan halaman sukses dengan kartu nomor antrean, waktu praktik, status,
   dan tombol **Lihat antrean**.

Di backend, konfirmasi memeriksa dokter aktif, jadwal aktif yang cocok dengan
tanggal, kecocokan spesialisasi, kuota, serta janji aktif ganda untuk pasien
dan dokter yang sama pada tanggal yang sama. Simulasikan hasil validasi ini di
frontend. Jika kuota habis sebelum konfirmasi, jangan menerbitkan nomor dan
minta pasien memilih jadwal lain.

## 5. Langkah demo petugas: antrean sampai selesai konsultasi

### A. Dashboard dokter

**Tampilan:** pilih peran **Dokter** pada pemilih akun demo, lalu tampilkan
antrean yang bukan `draft`, dengan filter tanggal/dokter/status.

Padanan backend: `GET /api/appointments?date=2026-10-29&doctor_id=d-201`.
Pasien hanya melihat antreannya sendiri; dokter/admin melihat antrean non-draft.

### B. Memanggil dan memeriksa pasien

1. Dokter membuka antrean berstatus `waiting` dan memilih **Panggil**:
   `waiting` → `called`.
2. Tampilkan notifikasi pasien dipanggil dan tombol **Mulai konsultasi**:
   `called` → `in_consultation`.
3. Jika pasien belum hadir, dokter dapat menandai `skipped`; antrean dapat
   dikembalikan ke `waiting` bila dipanggil ulang.
4. Dokter mengisi SOAP: keluhan/anamnesis (`subjective`), pemeriksaan
   (`objective`), penilaian (`assessment`), rencana (`plan`), dan resep opsional.
5. Setelah SOAP disimpan, tandai appointment `completed`, tampilkan pesan
   konsultasi selesai, dan sediakan tombol **Pasien berikutnya**.

Padanan backend: `PATCH /api/appointments/{id}/status` untuk status antrean
serta `POST /api/medical-records` untuk menyimpan SOAP. Pada backend, simpan
SOAP sekaligus membuat audit log dan mengubah status antrean menjadi
`completed`.

### C. Riwayat dan privasi

Di dashboard pasien, tampilkan antrean milik pasien dan riwayat SOAP. Di demo,
akun pasien tidak boleh membuka riwayat pasien lain. Dashboard admin dapat
menampilkan audit log sebagai tabel sederhana untuk memperlihatkan siapa yang
membuat/membuka data rekam medis.

Padanan backend:

- `GET /api/medical-records/patient/{patientId}` untuk riwayat.
- `GET /api/medical-records/audit-logs` untuk admin.

## 6. Langkah demo kasir/apotek: tagihan dan pembayaran

1. Pilih peran **Apoteker/Kasir** pada pemilih akun demo.
2. Setelah konsultasi, tampilkan ringkasan tagihan dari jasa dokter dan resep
   yang ada.
3. Untuk penjamin **Umum**, buat tagihan `unpaid`; setelah pasien membayar,
   ubah menjadi `paid` dan tampilkan metode pembayaran.
4. Untuk **BPJS**, demonstrasikan status `covered_by_bpjs` dan nilai yang
   ditanggung sesuai perilaku backend; jangan minta pembayaran simulasi untuk
   bagian yang ditanggung.
5. Jika resep digunakan, tampilkan stok berkurang dari batch dengan tanggal
   kedaluwarsa paling awal (FEFO) setelah pembayaran berhasil, atau saat klaim
   BPJS diproses.
6. Pasien dapat melihat status tagihan miliknya. Peran admin/apoteker dapat
   melihat daftar tagihan; pembuatan/perubahan tagihan dibatasi pada admin dan
   apoteker.

Padanan backend: `POST /api/billings` membuat tagihan,
`PATCH/PUT /api/billings/{id}` memperbarui status pembayaran, dan
`/api/medicines` untuk data obat serta batch. Jangan membuat tagihan dua kali
untuk appointment yang sama.

## 7. Bentuk data mock yang disarankan

Simpan satu sumber data lokal agar perubahan pada profil, kuota, antrean, SOAP,
dan pembayaran konsisten di semua layar. Contoh bentuk sederhananya:

```js
const demoData = {
  patients: [],
  doctors: [],
  schedules: [],
  appointments: [],
  medicalRecords: [],
  medicines: [],
  billings: [],
};
```

Gunakan fungsi mock frontend dengan operasi yang menyerupai backend, misalnya
`registerPatient`, `getProfileCompleteness`, `updatePatientProfile`,
`createAppointmentDraft`, `recommendDoctors`, `getAvailableDoctors`,
`confirmAppointment`, `updateAppointmentStatus`, `saveMedicalRecord`,
`createBilling`, dan `updatePaymentStatus`. Semua fungsi tersebut harus
mengembalikan data dummy lokal dan tidak melakukan `fetch`/HTTP request.

Untuk demo berulang, data awal dapat di-reset ke seed saat halaman dimuat atau
melalui tombol **Reset demo**. Jika memakai `localStorage`, sediakan reset agar
kuota dan status yang berubah dapat dikembalikan ke kondisi awal. Hindari
menaruh password atau token sungguhan di data dummy.

## 8. Pemetaan ringkas fitur ke endpoint backend

| Tahap UI | Endpoint backend (referensi integrasi nanti) |
|---|---|
| Registrasi/login pasien | `POST /api/register`, `POST /api/login` |
| Lihat/perbarui profil | `GET /api/patient/profile`, `PUT /api/patient/profile` |
| Buat/perbarui draft | `POST /api/appointments`, `PATCH /api/appointments/{id}/draft` |
| Rekomendasi dan daftar jadwal | `POST /api/appointments/recommend`, `GET /api/appointments/available-doctors?appointment_id=...` |
| Konfirmasi pilihan dan antrean | `POST /api/appointments/{id}/confirm`, `GET /api/appointments` |
| Status antrean | `PATCH /api/appointments/{id}/status` |
| SOAP, riwayat, audit | `POST /api/medical-records`, `GET /api/medical-records/patient/{patientId}`, `GET /api/medical-records/audit-logs` |
| Inventaris dan pembayaran | `/api/medicines`, `/api/billings` |

Seluruh endpoint di atas memerlukan autentikasi kecuali registrasi/login.
Dokter, pasien, admin, dan apoteker memiliki batasan peran yang berbeda;
simulasi role di frontend hanya untuk demonstrasi, bukan kontrol keamanan.
