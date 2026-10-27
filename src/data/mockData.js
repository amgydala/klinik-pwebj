// =====================================================
// MOCK DATA SimKlinik
// Letak file: src/data/mockData.js
// Dipakai sebagai pengganti data dari backend (API).
// =====================================================

// ---------------------------------------------------
// ADMIN
// ---------------------------------------------------

export const adminNama = "Administrator Klinik";

export const adminMenu = [
  { path: "/admin/beranda", label: "Beranda" },
];

export const adminDashboardData = {
  auditLog: [
    {
      id: "audit-001",
      tanggal: "2026-09-16",
      waktu: "09:20",
      pengguna: "dr. Andini",
      aktivitas: "Menyimpan rekam medis RM-0003",
      pasien: "Budi Santoso",
    },
    {
      id: "audit-002",
      tanggal: "2026-09-16",
      waktu: "08:42",
      pengguna: "dr. Andini",
      aktivitas: "Membuka rekam medis RM-0002",
      pasien: "Ayu Lestari",
    },
  ],
};

// ---------------------------------------------------
// APOTEKER
// ---------------------------------------------------

export const apotekerNama = "Apoteker Sinta";

export const apotekerMenu = [
  { path: "/apoteker/beranda", label: "Beranda" },
  { path: "/apoteker/inventaris-obat", label: "Inventaris Obat" },
  { path: "/apoteker/tambah-obat", label: "Tambah Obat" },
  { path: "/apoteker/resep-masuk", label: "Resep Masuk" },
  { path: "/apoteker/riwayat-transaksi", label: "Riwayat Transaksi" },
  { path: "/apoteker/pengaturan", label: "Pengaturan" },
];

// Angka di kartu statistik halaman Beranda
export const berandaStats = {
  totalJenisObat: 124,
  alarmFefo: 5, // batch yang kedaluwarsa < 3 bulan
  stokMenipis: 5, // stok di bawah minimal
};

// Pilihan dropdown
export const kategoriList = ["Antibiotik", "Analgesik", "Antihistamin", "Antasida", "Vitamin"];
export const satuanList = ["Tablet", "Kapsul", "Botol", "Strip", "Box", "Ampul"];

// Inventaris obat (halaman Inventaris Obat)
export const dataObatAwal = [
  { id: 1, nama: "Amoxicillin 250mg", kategori: "Antibiotik", totalStok: 450, harga: 3000, batch: null },
  {
    id: 2,
    nama: "Paracetamol 500mg",
    kategori: "Analgesik",
    totalStok: 800,
    harga: 2500,
    batch: [
      { batchNo: "BATCH-A01", sisaStok: 50, expDate: "01-12-2026", status: "Kuning" },
      { batchNo: "BATCH-A02", sisaStok: 100, expDate: "15-06-2027", status: "Hijau" },
    ],
  },
  { id: 3, nama: "Ibuprofen 400mg", kategori: "Analgesik", totalStok: 300, harga: 4000, batch: null },
  { id: 4, nama: "Cetirizine 10mg", kategori: "Antihistamin", totalStok: 600, harga: 1800, batch: null },
];

// Daftar nama obat untuk dropdown "Restock Obat Lama" (otomatis ikut inventaris)
export const obatTerdaftar = dataObatAwal.map((o) => o.nama);

// Harga per obat, dipakai menghitung total di Resep Masuk
export const hargaObat = {
  "Amoxicillin 250mg": 3000,
  "Paracetamol 500mg": 2500,
  "Ibuprofen 400mg": 4000,
  "Cetirizine 10mg": 1800,
};

// Resep masuk dari dokter
export const dataResepAwal = [
  {
    id: 1,
    pasien: "Budi Santoso",
    dokter: "dr. Andini",
    penjamin: "Umum",
    status: "Belum Diproses",
    obat: [
      { nama: "Amoxicillin 250mg", jumlah: 10 },
      { nama: "Paracetamol 500mg", jumlah: 6 },
    ],
    totalBayar: null,
  },
  {
    id: 2,
    pasien: "Siti Aminah",
    dokter: "dr. Rahman",
    penjamin: "BPJS",
    status: "Sedang Diproses",
    obat: [{ nama: "Ibuprofen 400mg", jumlah: 6 }],
    totalBayar: null,
  },
  {
    id: 3,
    pasien: "Made Wirawan",
    dokter: "dr. Andini",
    penjamin: "Umum",
    status: "Sudah Diproses",
    obat: [{ nama: "Paracetamol 500mg", jumlah: 15 }],
    totalBayar: 37500,
  },
];

// Riwayat transaksi
export const dataTransaksi = [
  { tanggal: "20 Sep 2026", obat: "Amoxicillin 250mg", jumlah: "10 tablet", noResep: "RSP-0231", pasien: "Budi Santoso", penjamin: "Umum", total: 45000, statusBayar: "Lunas" },
  { tanggal: "19 Sep 2026", obat: "Ibuprofen 400mg", jumlah: "6 tablet", noResep: "RSP-0228", pasien: "Siti Aminah", penjamin: "BPJS", total: 0, statusBayar: "Ditanggung BPJS" },
  { tanggal: "18 Sep 2026", obat: "Paracetamol 500mg", jumlah: "15 tablet", noResep: "RSP-0219", pasien: "Made Wirawan", penjamin: "Umum", total: 75000, statusBayar: "Lunas" },
];

// ---------------------------------------------------
// PASIEN
// ---------------------------------------------------

export const patientNama = "Budi Santoso";

export const patientMenu = [
  { path: "/patient/beranda", label: "Beranda" },
  { path: "/patient/daftar-baru", label: "Daftar Baru" },
  { path: "/patient/riwayat-medis", label: "Riwayat Medis" },
  { path: "/patient/tagihan", label: "Tagihan Saya" },
  { path: "/patient/pengaturan", label: "Pengaturan" },
];

// ----- Beranda -----
export const infoKesehatanPasien = {
  noRekamMedis: "RM-000123",
  penjamin: "BPJS",
  noBpjs: "0001234567890",
  golonganDarah: "O",
  usia: "32 tahun",
};

export const statusAntreanPasien = {
  status: "Menunggu Giliran",
  jam: "12:00",
  dokter: "dr. Andini",
  tanggal: "21 September 2026",
  noAntrean: "A-03",
};

export const riwayatKunjunganPasien = [
  { id: 1, tanggal: "16 Sep 2026", poli: "Poli Dalam", dokter: "dr. Andini", diagnosa: "Gastritis", status: "Selesai" },
  { id: 2, tanggal: "10 Agu 2026", poli: "Poli Umum", dokter: "dr. Rahman", diagnosa: "ISPA", status: "Selesai" },
];

// ----- Daftar Baru -----
export const poliList = ["Poli Umum", "Poli Dalam", "Poli Anak", "Poli Gigi"];

export const dokterList = [
  { id: 1, nama: "dr. Andini", poli: "Poli Dalam" },
  { id: 2, nama: "dr. Rahman", poli: "Poli Umum" },
  { id: 3, nama: "dr. Sari", poli: "Poli Anak" },
  { id: 4, nama: "drg. Putra", poli: "Poli Gigi" },
];

export const slotList = [
  { id: 1, jam: "08:00 - 12:00", kuota: 5 },
  { id: 2, jam: "12:01 - 16:00", kuota: 0 },
  { id: 3, jam: "16:01 - 20:00", kuota: 8 },
];

// Kata kunci keluhan -> poli yang direkomendasikan
export const kataKunciPoli = [
  { poli: "Poli Gigi", kata: ["gigi", "gusi", "sariawan"] },
  { poli: "Poli Anak", kata: ["anak", "bayi", "balita"] },
  { poli: "Poli Dalam", kata: ["perut", "maag", "lambung", "diare", "jantung", "tekanan darah", "diabetes"] },
  { poli: "Poli Umum", kata: ["demam", "batuk", "pilek", "flu", "pusing", "sakit kepala"] },
];

// ----- Riwayat Medis -----
export const riwayatMedisPasien = [
  {
    id: 1,
    tanggal: "Rabu, 16 September 2026",
    dokter: "dr. Andini",
    diagnosaUtama: "Gastritis",
    soap: {
      subjective: "Nyeri ulu hati sejak 3 hari, mual, nafsu makan menurun.",
      objective: "TD 120/80, nadi 82x/menit, nyeri tekan epigastrium.",
      assessment: "Gastritis akut.",
      plan: "Terapi obat, hindari makanan pedas dan asam, kontrol bila belum membaik.",
    },
    resep: [
      { nama: "Antasida Doen", jumlah: 10, aturan: "3x1 sebelum makan" },
      { nama: "Omeprazole 20mg", jumlah: 7, aturan: "1x1 pagi hari" },
    ],
  },
  {
    id: 2,
    tanggal: "Senin, 10 Agustus 2026",
    dokter: "dr. Rahman",
    diagnosaUtama: "ISPA",
    soap: {
      subjective: "Batuk dan pilek 4 hari, demam ringan.",
      objective: "Suhu 37,8 C, faring hiperemis.",
      assessment: "Infeksi saluran pernapasan atas.",
      plan: "Obat simptomatik, perbanyak istirahat dan minum air.",
    },
    resep: [
      { nama: "Paracetamol 500mg", jumlah: 10, aturan: "3x1 bila demam" },
      { nama: "Cetirizine 10mg", jumlah: 5, aturan: "1x1 malam hari" },
    ],
  },
];

// ----- Tagihan Saya -----
export const tagihanTertunda = null;

export const riwayatPembayaranPasien = [
  { id: 1, tanggal: "10 Agu 2026", invoice: "INV-0198", ringkasan: "Konsultasi + obat", total: 85000, status: "Lunas" },
  { id: 2, tanggal: "02 Jul 2026", invoice: "INV-0150", ringkasan: "Konsultasi + obat", total: 0, status: "Ditanggung BPJS" },
];



// ---------------------------------------------------
// DOKTER 
// ---------------------------------------------------

export const doctorNama = "dr. Andini";

export const doctorMenu = [
  { path: "/doctor/beranda", label: "Beranda" },
  { path: "/doctor/jadwal-praktik", label: "Jadwal Praktik" },
  { path: "/doctor/antrian-pasien", label: "Antrian Pasien" },
  { path: "/doctor/rekam-medis", label: "Rekam Medis" },
  { path: "/doctor/pengaturan", label: "Pengaturan" },
];

// Jadwal praktik hari ini (dipakai di Beranda)
export const jadwalHariIni = {
  tanggal: "Senin, 21 September 2026",
  tanggalISO: "2026-09-21",
  jamPraktik: "08:00 - 12:00",
};

// Antrean pasien semua tanggal (halaman Antrian Pasien)
export const antreanDokterAwal = [
  { id: 1, tanggal: "2026-09-21", noAntrean: "A-01", nama: "Made Wirawan", jam: "08:00", keluhan: "Demam dan batuk", status: "Selesai" },
  { id: 2, tanggal: "2026-09-21", noAntrean: "A-02", nama: "Ayu Lestari", jam: "08:30", keluhan: "Pusing berkepanjangan", status: "Selesai" },
  { id: 3, tanggal: "2026-09-21", noAntrean: "A-03", nama: "Budi Santoso", jam: "09:15", keluhan: "Nyeri ulu hati", status: "Sedang Diperiksa" },
  { id: 4, tanggal: "2026-09-21", noAntrean: "A-04", nama: "Siti Aminah", jam: "09:30", keluhan: "Sakit kepala", status: "Menunggu" },
  { id: 5, tanggal: "2026-09-21", noAntrean: "A-05", nama: "Komang Adi", jam: "10:00", keluhan: "Kontrol tekanan darah", status: "Menunggu" },
  { id: 6, tanggal: "2026-09-22", noAntrean: "A-01", nama: "Putu Ratna", jam: "08:00", keluhan: "Batuk pilek", status: "Menunggu" },
];

// Antrean khusus hari ini (Beranda), otomatis diambil dari data di atas
export const antreanHariIni = antreanDokterAwal.filter(
  (p) => p.tanggal === jadwalHariIni.tanggalISO
);

// Pasien yang diperiksa lewat Form SOAP
export const pasienPeriksaList = [
  { id: 3, noAntrean: "A-03", nama: "Budi Santoso", jam: "09:15", keluhan: "Nyeri ulu hati", penjamin: "BPJS" },
  { id: 4, noAntrean: "A-04", nama: "Siti Aminah", jam: "09:30", keluhan: "Sakit kepala", penjamin: "BPJS" },
  { id: 5, noAntrean: "A-05", nama: "Komang Adi", jam: "10:00", keluhan: "Kontrol tekanan darah", penjamin: "Umum" },
];

// Pilihan obat di dropdown resep (Form SOAP)
export const daftarObatResep = [
  "Amoxicillin 250mg",
  "Paracetamol 500mg",
  "Ibuprofen 400mg",
  "Cetirizine 10mg",
  "Antasida Doen",
  "Omeprazole 20mg",
];

// Jadwal praktik dokter (halaman Jadwal Praktik)
export const jadwalPraktikAwal = [
  { id: 1, hari: "Senin", tanggal: "21 Sep 2026", jam: "08:00 - 12:00", kuota: 20, ruangan: "Poli Dalam - Ruang 2", keterangan: "", pengajuan: null },
  { id: 2, hari: "Selasa", tanggal: "22 Sep 2026", jam: "08:00 - 12:00", kuota: 20, ruangan: "Poli Dalam - Ruang 2", keterangan: "", pengajuan: null },
  { id: 3, hari: "Rabu", tanggal: "23 Sep 2026", jam: "13:00 - 16:00", kuota: 15, ruangan: "Poli Dalam - Ruang 2", keterangan: "Praktik sore", pengajuan: null },
  { id: 4, hari: "Kamis", tanggal: "24 Sep 2026", jam: "08:00 - 12:00", kuota: 20, ruangan: "Poli Dalam - Ruang 2", keterangan: "", pengajuan: null },
];

// Rekam medis pasien (halaman Rekam Medis)
export const rekamMedisDokterAwal = [
  {
    id: "RM-0003",
    tanggal: "2026-09-16",
    jam: "09:15",
    pasien: "Budi Santoso",
    diagnosaUtama: "Gastritis",
    soap: {
      subjective: "Nyeri ulu hati sejak 3 hari, mual, nafsu makan menurun.",
      objective: "TD 120/80, nadi 82x/menit, nyeri tekan epigastrium.",
      assessment: "Gastritis akut.",
      plan: "Terapi obat, hindari makanan pedas dan asam, kontrol bila belum membaik.",
    },
    resep: [
      { nama: "Antasida Doen", jumlah: 10, aturan: "3x1 sebelum makan" },
      { nama: "Omeprazole 20mg", jumlah: 7, aturan: "1x1 pagi hari" },
    ],
  },
  {
    id: "RM-0002",
    tanggal: "2026-09-16",
    jam: "08:30",
    pasien: "Ayu Lestari",
    diagnosaUtama: "Tension headache",
    soap: {
      subjective: "Pusing berkepanjangan 1 minggu, kurang tidur.",
      objective: "TD 110/70, tidak ada defisit neurologis.",
      assessment: "Tension headache.",
      plan: "Analgesik, atur pola tidur, kontrol 1 minggu.",
    },
    resep: [{ nama: "Paracetamol 500mg", jumlah: 10, aturan: "3x1 bila nyeri" }],
  },
  {
    id: "RM-0001",
    tanggal: "2026-08-10",
    jam: "08:00",
    pasien: "Made Wirawan",
    diagnosaUtama: "ISPA",
    soap: {
      subjective: "Batuk dan pilek 4 hari, demam ringan.",
      objective: "Suhu 37,8 C, faring hiperemis.",
      assessment: "Infeksi saluran pernapasan atas.",
      plan: "Obat simptomatik, perbanyak istirahat dan minum air.",
    },
    resep: [
      { nama: "Paracetamol 500mg", jumlah: 10, aturan: "3x1 bila demam" },
      { nama: "Cetirizine 10mg", jumlah: 5, aturan: "1x1 malam hari" },
    ],
  },
];