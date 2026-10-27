// =====================================================
// AUTH & DEMO USER SERVICE (SIMklinik / SIMRS)
// Berdasarkan panduan alur DEMO_ALUR_SIMKLINIK.md
// =====================================================

export const BASELINE_PATIENTS = [
  {
    id: "p-1001",
    name: "Budi Santoso",
    email: "budi.demo@example.test",
    phone: "080000001001",
    address: "Jl. Contoh No. 10, Kota Demo",
    nik: null,
    place_of_birth: null,
    date_of_birth: null,
    gender: null,
    blood_type: null,
    emergency_contact_name: null,
    emergency_contact_phone: null,
    allergies: [],
    chronic_diseases: [],
    is_appointment_ready: false,
    completeness: 30,
    role: "patient",
    scenario: "Registrasi baru dan profil belum lengkap (30%)",
  },
  {
    id: "p-1002",
    name: "Sari Putri",
    email: "sari.demo@example.test",
    phone: "080000001002",
    address: "Jl. Melati No. 5, Kota Demo",
    nik: "3271012345670001",
    place_of_birth: "Jakarta",
    date_of_birth: "1994-05-12",
    gender: "Perempuan",
    blood_type: "O",
    emergency_contact_name: "Bambang Wijaya",
    emergency_contact_phone: "080000009999",
    allergies: ["Seafood"],
    chronic_diseases: [],
    is_appointment_ready: true,
    completeness: 80,
    role: "patient",
    scenario: "Pasien siap membuat janji temu (80% / Siap Booking)",
  },
];

export const STAFF_ACCOUNTS = [
  {
    id: "d-201",
    name: "dr. Andi Pratama",
    email: "andi.demo@example.test",
    role: "doctor",
    specialization: "Poliklinik Umum",
    redirectPath: "/doctor/beranda",
    scenario: "Dokter Poliklinik Umum (SOAP & Panggil Pasien)",
  },
  {
    id: "d-202",
    name: "drg. Maya Lestari",
    email: "maya.demo@example.test",
    role: "doctor",
    specialization: "Poliklinik Gigi",
    redirectPath: "/doctor/beranda",
    scenario: "Dokter Gigi (Rekomendasi Keluhan Gigi & Gusi)",
  },
  {
    id: "d-203",
    name: "dr. Rina Puspita",
    email: "rina.demo@example.test",
    role: "doctor",
    specialization: "Poliklinik Anak",
    redirectPath: "/doctor/beranda",
    scenario: "Dokter Spesialis Anak (Poliklinik Anak)",
  },
  {
    id: "apt-301",
    name: "Apoteker Sinta",
    email: "apoteker.demo@example.test",
    role: "apoteker",
    specialization: "Instalasi Farmasi",
    redirectPath: "/apoteker/beranda",
    scenario: "Apoteker (Resep Masuk & Inventaris FEFO)",
  },
  {
    id: "ksr-401",
    name: "Kasir Doni",
    email: "kasir.demo@example.test",
    role: "cashier",
    specialization: "Kasir & Pembayaran",
    redirectPath: "/cashier/beranda",
    scenario: "Kasir (Tagihan, Invoice & Penjamin Umum/BPJS)",
  },
];

const STORAGE_KEYS = {
  CURRENT_USER: "simklinik_current_user",
  PATIENTS: "simklinik_patients",
};

// Ambil daftar pasien dari localStorage atau baseline
export const getPatients = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.PATIENTS);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (e) {
    console.error("Gagal membaca pasien dari storage", e);
  }
  return BASELINE_PATIENTS;
};

// Simpan daftar pasien
export const savePatients = (patients) => {
  try {
    localStorage.setItem(STORAGE_KEYS.PATIENTS, JSON.stringify(patients));
  } catch (e) {
    console.error("Gagal menyimpan pasien ke storage", e);
  }
};

// Ambil pengguna yang sedang login
export const getCurrentUser = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (e) {
    console.error("Gagal membaca current user", e);
  }
  // Default fallback: Budi Santoso sesuai panduan alur awal
  return BASELINE_PATIENTS[0];
};

// Set pengguna yang aktif login
export const setCurrentUser = (user) => {
  try {
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
  } catch (e) {
    console.error("Gagal menyimpan current user", e);
  }
};

// Keluar / Logout
export const logoutUser = () => {
  try {
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
  } catch (e) {
    console.error("Gagal logout", e);
  }
};

// Reset data demo ke kondisi awal sesuai DEMO_ALUR_SIMKLINIK.md Section 7
export const resetDemoData = () => {
  try {
    localStorage.setItem(STORAGE_KEYS.PATIENTS, JSON.stringify(BASELINE_PATIENTS));
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(BASELINE_PATIENTS[0]));
  } catch (e) {
    console.error("Gagal reset data demo", e);
  }
};

// Registrasi Pasien Baru sesuai DEMO_ALUR_SIMKLINIK.md Section 4.A
export const registerPatient = ({ name, email, phone, address, password }) => {
  const patients = getPatients();

  // Generate ID baru p-1003, dst
  const newId = `p-${1000 + patients.length + 1}`;

  const newPatient = {
    id: newId,
    name: name.trim(),
    email: email.trim().toLowerCase(),
    phone: phone.trim(),
    address: address.trim(),
    password: password || "demo123",
    nik: null,
    place_of_birth: null,
    date_of_birth: null,
    gender: null,
    blood_type: null,
    emergency_contact_name: null,
    emergency_contact_phone: null,
    allergies: [],
    chronic_diseases: [],
    is_appointment_ready: false,
    completeness: 30, // 30% kelengkapan awal dari 10 field
    role: "patient",
    scenario: "Registrasi baru pasien (Profil belum lengkap 30%)",
  };

  const updatedPatients = [...patients, newPatient];
  savePatients(updatedPatients);
  setCurrentUser(newPatient);

  return newPatient;
};

// Login dengan verifikasi demo
export const login = (email, password) => {
  const cleanEmail = (email || "").trim().toLowerCase();

  // Cek staff
  const staff = STAFF_ACCOUNTS.find((s) => s.email.toLowerCase() === cleanEmail);
  if (staff) {
    setCurrentUser(staff);
    return { success: true, user: staff, redirect: staff.redirectPath };
  }

  // Cek pasien
  const patients = getPatients();
  const patient = patients.find((p) => p.email.toLowerCase() === cleanEmail);
  if (patient) {
    setCurrentUser(patient);
    return { success: true, user: patient, redirect: "/patient/beranda" };
  }

  // Fallback demo: jika memasukkan email baru saat demo tanpa register, kita buat sesi pasien simulasi
  const fallbackPatient = {
    id: `p-${Date.now().toString().slice(-4)}`,
    name: cleanEmail.split("@")[0].replace(/[._]/g, " ") || "Pasien Demo",
    email: cleanEmail,
    phone: "081234567890",
    address: "Jl. Demo Sehat No. 1",
    is_appointment_ready: false,
    completeness: 30,
    role: "patient",
  };
  setCurrentUser(fallbackPatient);
  return { success: true, user: fallbackPatient, redirect: "/patient/beranda" };
};
