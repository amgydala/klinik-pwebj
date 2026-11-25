import {
  apiRequest,
  forgetSession,
  getStoredToken,
  getStoredUser,
  storeSession,
  updateStoredUser,
} from "./apiClient";

const responseData = (response) => response?.data || response || {};

const userHome = (role) => {
  const destinations = {
    patient: "/patient/beranda",
    doctor: "/doctor/beranda",
    pharmacist: "/apoteker/beranda",
    apoteker: "/apoteker/beranda",
    admin: "/admin/beranda",
    cashier: "/cashier/beranda",
  };
  return destinations[role] || null;
};

export const getCurrentUser = () => getStoredUser();
export const getAccessToken = () => getStoredToken();

export const setCurrentUser = (user) => {
  if (getAccessToken()) updateStoredUser(user);
};

export const login = async (email, password, rememberMe = true) => {
  const response = await apiRequest("/login", {
    method: "POST",
    authenticated: false,
    body: { email: email.trim().toLowerCase(), password },
  });
  const payload = responseData(response);

  if (!payload.token || !payload.user?.id || !payload.user?.role) {
    throw new Error("Respons login server tidak lengkap.");
  }

  const redirect = userHome(payload.user.role);
  if (!redirect) {
    throw new Error(`Peran akun "${payload.user.role}" belum didukung di aplikasi ini.`);
  }

  const user = {
    ...payload.user,
    profile_completeness: payload.profile_completeness || null,
    patient_profile:
      payload.user.role === "patient" ? payload.profile_data || null : null,
    doctor_profile:
      payload.user.role === "doctor" ? payload.profile_data || null : null,
    pharmacist_profile:
      payload.user.role === "pharmacist" ? payload.profile_data || null : null,
  };
  storeSession(user, payload.token, rememberMe);

  return {
    success: true,
    user,
    redirect,
  };
};

export const registerPatient = async ({
  name,
  email,
  phone,
  address,
  password,
}) =>
  apiRequest("/register", {
    method: "POST",
    authenticated: false,
    body: {
      name: name.trim(),
      email: email.trim().toLowerCase(),
      password,
      phone: phone.trim(),
      address: address.trim(),
      role: "patient",
    },
  });

export const getPatientProfile = async () => {
  const response = await apiRequest("/patient/profile");
  return responseData(response);
};

export const updatePatientProfile = async (profile) => {
  const response = await apiRequest("/patient/profile", {
    method: "PUT",
    body: profile,
  });
  return responseData(response);
};

export const createAppointmentDraft = async (appointment) => {
  const response = await apiRequest("/appointments", {
    method: "POST",
    body: appointment,
  });
  return responseData(response);
};

export const recommendAppointment = async (appointmentId) => {
  const response = await apiRequest("/appointments/recommend", {
    method: "POST",
    body: { appointment_id: appointmentId },
  });
  return responseData(response);
};

export const updateAppointmentDraft = async (appointmentId, draft) => {
  const response = await apiRequest(
    `/appointments/${encodeURIComponent(appointmentId)}/draft`,
    {
      method: "PATCH",
      body: draft,
    }
  );
  return responseData(response);
};

export const getAvailableDoctors = async (appointmentId) => {
  const query = new URLSearchParams({ appointment_id: appointmentId });
  const response = await apiRequest(`/appointments/available-doctors?${query}`);
  return responseData(response);
};

export const confirmAppointment = async (
  appointmentId,
  doctorId,
  doctorScheduleId
) => {
  const response = await apiRequest(
    `/appointments/${encodeURIComponent(appointmentId)}/confirm`,
    {
      method: "POST",
      body: {
        doctor_id: doctorId,
        doctor_schedule_id: doctorScheduleId,
      },
    }
  );
  return responseData(response);
};

export const getPatientAppointments = async (query = "") => {
  const response = await apiRequest(`/appointments${query}`);
  const payload = responseData(response);
  return extractList(payload, ["appointments"]);
};

export const getDoctorAppointments = async ({
  status,
  date,
  doctorId,
} = {}) => {
  const query = new URLSearchParams();
  if (status) query.set("status", status);
  if (date) query.set("date", date);
  if (doctorId) query.set("doctor_id", doctorId);
  const suffix = query.toString();
  const response = await apiRequest(`/appointments${suffix ? `?${suffix}` : ""}`);
  return extractList(responseData(response), ["appointments"]);
};

export const updateAppointmentStatus = async (appointmentId, status) => {
  const response = await apiRequest(
    `/appointments/${encodeURIComponent(appointmentId)}/status`,
    { method: "PATCH", body: { status } }
  );
  return responseData(response);
};

export const getDoctorSchedules = async (doctorId) => {
  const response = await apiRequest(
    `/doctor-schedules/${encodeURIComponent(doctorId)}`
  );
  return extractList(responseData(response), ["schedules"]);
};

export const createDoctorSchedule = async (schedule) => {
  const response = await apiRequest("/doctor-schedules", {
    method: "POST",
    body: schedule,
  });
  return responseData(response);
};

export const updateDoctorSchedule = async (scheduleId, changes) => {
  const response = await apiRequest(
    `/doctor-schedules/${encodeURIComponent(scheduleId)}`,
    { method: "PUT", body: changes }
  );
  return responseData(response);
};

export const deactivateDoctorSchedule = async (scheduleId) => {
  const response = await apiRequest(
    `/doctor-schedules/${encodeURIComponent(scheduleId)}`,
    { method: "DELETE" }
  );
  return responseData(response);
};

export const getMedicines = async () => {
  const response = await apiRequest("/medicines");
  return extractList(responseData(response), ["medicines"]);
};

export const getMedicineDetails = async (medicineId) => {
  const response = await apiRequest(
    `/medicines/${encodeURIComponent(medicineId)}`
  );
  return responseData(response);
};

export const createMedicine = async (medicine) => {
  const response = await apiRequest("/medicines", {
    method: "POST",
    body: medicine,
  });
  return responseData(response);
};

export const updateMedicine = async (medicineId, changes) => {
  const response = await apiRequest(
    `/medicines/${encodeURIComponent(medicineId)}`,
    { method: "PUT", body: changes }
  );
  return responseData(response);
};

export const deleteMedicine = async (medicineId) => {
  const response = await apiRequest(
    `/medicines/${encodeURIComponent(medicineId)}`,
    { method: "DELETE" }
  );
  return responseData(response);
};

export const createMedicalRecord = async (record) => {
  const response = await apiRequest("/medical-records", {
    method: "POST",
    body: record,
  });
  return responseData(response);
};

export const getPatientMedicalRecords = async (patientId) => {
  const response = await apiRequest(
    `/medical-records/patient/${encodeURIComponent(patientId)}`
  );
  return extractList(responseData(response), ["medical_records", "records"]);
};

export const getPatientBillings = async () => {
  const response = await apiRequest("/billings");
  return extractList(responseData(response), ["billings", "invoices"]);
};

export const getPharmacistBillings = getPatientBillings;
export const getAdminBillings = getPatientBillings;

export const getBillingDetails = async (billingId) => {
  const response = await apiRequest(
    `/billings/${encodeURIComponent(billingId)}`
  );
  return responseData(response);
};

export const createBilling = async (billing) => {
  const response = await apiRequest("/billings", {
    method: "POST",
    body: billing,
  });
  return responseData(response);
};

export const updateBillingPayment = async (billingId, paymentMethod) => {
  const response = await apiRequest(
    `/billings/${encodeURIComponent(billingId)}`,
    {
      method: "PUT",
      body: { payment_status: "paid", payment_method: paymentMethod },
    }
  );
  return responseData(response);
};

export const registerStaff = async (staffData) =>
  apiRequest("/admin/staff/register", {
    method: "POST",
    body: staffData,
  });

export const getMedicalRecordAuditLogs = async (page = 1, perPage = 20) => {
  const query = new URLSearchParams({
    page: String(page),
    per_page: String(perPage),
  });
  const response = await apiRequest(`/medical-records/audit-logs?${query}`);
  return responseData(response);
};

export const logoutUser = async () => {
  try {
    if (getAccessToken()) {
      await apiRequest("/logout", { method: "POST" });
    }
  } finally {
    forgetSession();
  }
};

function extractList(payload, keys) {
  if (Array.isArray(payload)) return payload;
  for (const key of keys) {
    if (Array.isArray(payload?.[key])) return payload[key];
    if (Array.isArray(payload?.data?.[key])) return payload.data[key];
  }
  if (Array.isArray(payload?.data)) return payload.data;
  if (Array.isArray(payload?.data?.data)) return payload.data.data;
  return [];
}
