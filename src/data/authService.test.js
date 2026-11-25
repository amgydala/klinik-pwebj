import {
  getAccessToken,
  getCurrentUser,
  getDoctorAppointments,
  getMedicalRecordAuditLogs,
  getMedicineDetails,
  login,
  logoutUser,
  createMedicalRecord,
  createBilling,
  createAppointmentDraft,
  createDoctorSchedule,
  createMedicine,
  deleteMedicine,
  confirmAppointment,
  getAvailableDoctors,
  getBillingDetails,
  getDoctorSchedules,
  getMedicines,
  getPatientAppointments,
  getPatientBillings,
  getPatientMedicalRecords,
  getPatientProfile,
  recommendAppointment,
  updateDoctorSchedule,
  updateMedicine,
  updatePatientProfile,
  registerPatient,
  deactivateDoctorSchedule,
  updateAppointmentDraft,
  updateAppointmentStatus,
  updateBillingPayment,
} from "./authService";

const response = (body, status = 200) => ({
  ok: status >= 200 && status < 300,
  status,
  text: async () => JSON.stringify(body),
});

beforeEach(() => {
  localStorage.clear();
  sessionStorage.clear();
  global.fetch = jest.fn();
});

afterEach(() => {
  jest.restoreAllMocks();
});

test("login stores the JWT and backend user, respecting remember me", async () => {
  global.fetch.mockResolvedValue(
    response({
      token: "jwt-test-token",
      user: { id: "patient-1", name: "Test Patient", role: "patient" },
      profile_completeness: { is_appointment_ready: false, percentage: 30 },
    })
  );

  const result = await login(" TEST@EXAMPLE.TEST ", "password123", false);

  expect(global.fetch.mock.calls[0][0]).toMatch(/\/api\/login$/);
  expect(global.fetch.mock.calls[0][1]).toEqual(
    expect.objectContaining({
      method: "POST",
      headers: { Accept: "application/json", "Content-Type": "application/json" },
      body: JSON.stringify({
        email: "test@example.test",
        password: "password123",
      }),
    })
  );
  expect(result.redirect).toBe("/patient/beranda");
  expect(getAccessToken()).toBe("jwt-test-token");
  expect(getCurrentUser()).toMatchObject({
    id: "patient-1",
    name: "Test Patient",
    profile_completeness: { is_appointment_ready: false, percentage: 30 },
  });
  expect(sessionStorage.getItem("simklinik_token")).toBe("jwt-test-token");
  expect(localStorage.getItem("simklinik_token")).toBeNull();
});

test("patient registration sends the documented public endpoint payload", async () => {
  global.fetch.mockResolvedValue(response({ status: "success" }, 201));

  await registerPatient({
    name: " Test Patient ",
    email: " TEST@EXAMPLE.TEST ",
    phone: " 081234567890 ",
    address: " Jl. Contoh ",
    password: "password123",
  });

  expect(global.fetch.mock.calls[0][0]).toMatch(/\/api\/register$/);
  expect(global.fetch.mock.calls[0][1]).toEqual(
    expect.objectContaining({
      method: "POST",
      body: JSON.stringify({
        name: "Test Patient",
        email: "test@example.test",
        password: "password123",
        phone: "081234567890",
        address: "Jl. Contoh",
        role: "patient",
      }),
    })
  );
});

test("login exposes backend validation errors", async () => {
  global.fetch.mockResolvedValue(
    response(
      { message: "The provided credentials are incorrect." },
      401
    )
  );

  await expect(login("test@example.test", "wrong-password")).rejects.toThrow(
    "The provided credentials are incorrect."
  );
});

test("doctor login retains the doctor profile ID for staff workflows", async () => {
  global.fetch.mockResolvedValue(
    response({
      token: "doctor-token",
      user: { id: "user-1", name: "Doctor Test", role: "doctor" },
      profile_data: { id: "doctor-profile-1", specialization: "Umum" },
    })
  );

  const result = await login("doctor@example.test", "password123");

  expect(result.redirect).toBe("/doctor/beranda");
  expect(getCurrentUser()).toMatchObject({
    id: "user-1",
    doctor_profile: { id: "doctor-profile-1" },
    patient_profile: null,
  });
});

test("doctor queue filters and encounter payloads match the documented API", async () => {
  global.fetch
    .mockResolvedValueOnce(response({ data: [{ id: "appointment-1" }] }))
    .mockResolvedValueOnce(response({ data: { status: "called" } }))
    .mockResolvedValueOnce(response({ data: { id: "record-1" } }))
    .mockResolvedValueOnce(response({ data: { payment_status: "paid" } }));

  await getDoctorAppointments({
    status: "waiting",
    date: "2026-10-20",
    doctorId: "doctor-1",
  });
  await updateAppointmentStatus("appointment-1", "called");
  await createMedicalRecord({
    appointment_id: "appointment-1",
    patient_id: "patient-1",
    subjective: "Keluhan",
    objective: "Pemeriksaan",
    assessment: "Diagnosis",
    plan: "Rencana",
    prescriptions: [{ medicine_id: "medicine-1", quantity: 2 }],
  });
  await updateBillingPayment("billing-1", "cash");

  expect(global.fetch.mock.calls[0][0]).toContain(
    "status=waiting&date=2026-10-20&doctor_id=doctor-1"
  );
  expect(global.fetch.mock.calls[1][1].body).toBe(
    JSON.stringify({ status: "called" })
  );
  expect(global.fetch.mock.calls[2][0]).toMatch(/\/api\/medical-records$/);
  expect(JSON.parse(global.fetch.mock.calls[2][1].body)).toMatchObject({
    appointment_id: "appointment-1",
    patient_id: "patient-1",
    prescriptions: [{ medicine_id: "medicine-1", quantity: 2 }],
  });
  expect(global.fetch.mock.calls[3][1].body).toBe(
    JSON.stringify({ payment_status: "paid", payment_method: "cash" })
  );
});

test("billing, medicine detail/delete, and admin audit calls use documented routes", async () => {
  global.fetch
    .mockResolvedValueOnce(response({ data: { id: "billing-1" } }, 201))
    .mockResolvedValueOnce(response({ data: { id: "medicine-1" } }))
    .mockResolvedValueOnce(response({ message: "deleted" }))
    .mockResolvedValueOnce(response({ data: { current_page: 1, data: [] } }));

  await createBilling({
    appointment_id: "appointment-1",
    doctor_fee: 75000,
    guarantor: "Umum",
  });
  await getMedicineDetails("medicine-1");
  await deleteMedicine("medicine-1");
  await getMedicalRecordAuditLogs(2, 20);

  expect(global.fetch.mock.calls[0][0]).toMatch(/\/api\/billings$/);
  expect(global.fetch.mock.calls[0][1].body).toBe(
    JSON.stringify({
      appointment_id: "appointment-1",
      doctor_fee: 75000,
      guarantor: "Umum",
    })
  );
  expect(global.fetch.mock.calls[1][0]).toMatch(/\/api\/medicines\/medicine-1$/);
  expect(global.fetch.mock.calls[2][1].method).toBe("DELETE");
  expect(global.fetch.mock.calls[3][0]).toContain(
    "/api/medical-records/audit-logs?page=2&per_page=20"
  );
});

test("patient booking, profile, record, and billing methods use documented routes", async () => {
  global.fetch
    .mockResolvedValueOnce(response({ data: { id: "profile-1" } }))
    .mockResolvedValueOnce(response({ data: { id: "profile-1" } }))
    .mockResolvedValueOnce(response({ data: { id: "appointment-1" } }))
    .mockResolvedValueOnce(response({ data: { status: "updated" } }))
    .mockResolvedValueOnce(response({ data: { recommendation: "general" } }))
    .mockResolvedValueOnce(response({ data: { doctors: [] } }))
    .mockResolvedValueOnce(response({ data: { id: "appointment-1" } }))
    .mockResolvedValueOnce(response({ data: [{ id: "appointment-1" }] }))
    .mockResolvedValueOnce(response({ data: [{ id: "record-1" }] }))
    .mockResolvedValueOnce(response({ data: [{ id: "billing-1" }] }))
    .mockResolvedValueOnce(response({ data: { id: "billing-1" } }));

  await getPatientProfile();
  await updatePatientProfile({ nik: "123" });
  await createAppointmentDraft({ complaint: "Demam" });
  await updateAppointmentDraft("appointment-1", { complaint: "Batuk" });
  await recommendAppointment("appointment-1");
  await getAvailableDoctors("appointment-1");
  await confirmAppointment("appointment-1", "doctor-1", "schedule-1");
  await getPatientAppointments("?status=waiting");
  await getPatientMedicalRecords("patient-1");
  await getPatientBillings();
  await getBillingDetails("billing-1");

  expect(global.fetch.mock.calls.map(([url]) => url)).toEqual([
    expect.stringMatching(/\/api\/patient\/profile$/),
    expect.stringMatching(/\/api\/patient\/profile$/),
    expect.stringMatching(/\/api\/appointments$/),
    expect.stringMatching(/\/api\/appointments\/appointment-1\/draft$/),
    expect.stringMatching(/\/api\/appointments\/recommend$/),
    expect.stringMatching(/\/api\/appointments\/available-doctors\?appointment_id=appointment-1$/),
    expect.stringMatching(/\/api\/appointments\/appointment-1\/confirm$/),
    expect.stringMatching(/\/api\/appointments\?status=waiting$/),
    expect.stringMatching(/\/api\/medical-records\/patient\/patient-1$/),
    expect.stringMatching(/\/api\/billings$/),
    expect.stringMatching(/\/api\/billings\/billing-1$/),
  ]);
  expect(global.fetch.mock.calls[6][1].body).toBe(
    JSON.stringify({
      doctor_id: "doctor-1",
      doctor_schedule_id: "schedule-1",
    })
  );
});

test("doctor schedule and medicine management methods use documented routes", async () => {
  global.fetch
    .mockResolvedValueOnce(response({ data: [{ id: "schedule-1" }] }))
    .mockResolvedValueOnce(response({ data: { id: "schedule-1" } }, 201))
    .mockResolvedValueOnce(response({ data: { id: "schedule-1" } }))
    .mockResolvedValueOnce(response({ message: "inactive" }))
    .mockResolvedValueOnce(response({ data: [{ id: "medicine-1" }] }))
    .mockResolvedValueOnce(response({ data: { id: "medicine-1" } }, 201))
    .mockResolvedValueOnce(response({ data: { id: "medicine-1" } }));

  await getDoctorSchedules("doctor-1");
  await createDoctorSchedule({
    doctor_id: "doctor-1",
    schedule_date: "2026-10-20",
    start_time: "08:00",
    end_time: "12:00",
    quota: 15,
  });
  await updateDoctorSchedule("schedule-1", { quota: 20 });
  await deactivateDoctorSchedule("schedule-1");
  await getMedicines();
  await createMedicine({
    name: "Test medicine",
    category: "Tablet",
    base_price: 10,
    batches: [{ batch_no: "B-1", stock: 5, exp_date: "2027-01-01" }],
  });
  await updateMedicine("medicine-1", { base_price: 12 });

  expect(global.fetch.mock.calls.map(([url]) => url)).toEqual([
    expect.stringMatching(/\/api\/doctor-schedules\/doctor-1$/),
    expect.stringMatching(/\/api\/doctor-schedules$/),
    expect.stringMatching(/\/api\/doctor-schedules\/schedule-1$/),
    expect.stringMatching(/\/api\/doctor-schedules\/schedule-1$/),
    expect.stringMatching(/\/api\/medicines$/),
    expect.stringMatching(/\/api\/medicines$/),
    expect.stringMatching(/\/api\/medicines\/medicine-1$/),
  ]);
  expect(global.fetch.mock.calls[3][1].method).toBe("DELETE");
  expect(global.fetch.mock.calls[5][1].body).toContain('"batch_no":"B-1"');
});

test("logout revokes the API session and clears stored credentials", async () => {
  global.fetch
    .mockResolvedValueOnce(
      response({
        token: "jwt-test-token",
        user: { id: "patient-1", name: "Test Patient", role: "patient" },
      })
    )
    .mockResolvedValueOnce(response({ status: "success" }));

  await login("test@example.test", "password123");
  await logoutUser();

  expect(global.fetch.mock.calls[1][0]).toMatch(/\/api\/logout$/);
  expect(global.fetch.mock.calls[1][1]).toEqual(
    expect.objectContaining({
      method: "POST",
      headers: {
        Accept: "application/json",
        Authorization: "Bearer jwt-test-token",
      },
    })
  );
  expect(getAccessToken()).toBeNull();
  expect(getCurrentUser()).toBeNull();
});
