// =============================================
//   MediBook - Hospital Appointment REST API
//   Stack: Node.js + Express.js
const express = require('express');
const app = express();
app.use(express.json());

// ──────────────────────────────────────────
//  DUMMY DATA (In-Memory Database)
// ──────────────────────────────────────────

let patients = [
  { id: 1, name: "Ali Khan",   email: "ali@gmail.com",  phone: "0300-1111111", age: 25 },
  { id: 2, name: "Sara Ahmed", email: "sara@gmail.com", phone: "0300-2222222", age: 30 }
];

let doctors = [
  { id: 1, name: "Dr. Ayesha",  specialization: "Cardiologist",   available: true  },
  { id: 2, name: "Dr. Bilal",   specialization: "Neurologist",    available: true  },
  { id: 3, name: "Dr. Fatima",  specialization: "Dermatologist",  available: false }
];

let appointments = [
  { id: 1, patientId: 1, doctorId: 1, date: "2025-07-10", time: "10:00 AM", status: "Scheduled" },
  { id: 2, patientId: 2, doctorId: 2, date: "2025-07-11", time: "11:00 AM", status: "Scheduled" }
];


// ──────────────────────────────────────────
//  ROOT ROUTE
// ──────────────────────────────────────────

app.get('/', (req, res) => {
  res.json({
    message: "Welcome to MediBook Hospital API 🏥",
    endpoints: {
      patients:     "/api/patients",
      doctors:      "/api/doctors",
      appointments: "/api/appointments"
    }
  });
});


// ══════════════════════════════════════════
//  PATIENTS CRUD
// ══════════════════════════════════════════

// GET all patients
app.get('/api/patients', (req, res) => {
  res.status(200).json(patients);
});

// GET single patient by ID
app.get('/api/patients/:id', (req, res) => {
  const patient = patients.find(p => p.id === parseInt(req.params.id));
  if (!patient) {
    return res.status(404).json({ message: "Patient not found" });
  }
  res.status(200).json(patient);
});

// POST register new patient
app.post('/api/patients', (req, res) => {
  const { name, email, phone, age } = req.body;

  if (!name || !email || !phone || !age) {
    return res.status(400).json({ message: "All fields required: name, email, phone, age" });
  }

  const newPatient = {
    id: patients.length + 1,
    name,
    email,
    phone,
    age
  };

  patients.push(newPatient);
  res.status(201).json({ message: "Patient registered successfully", patient: newPatient });
});

// PUT update patient
app.put('/api/patients/:id', (req, res) => {
  const patient = patients.find(p => p.id === parseInt(req.params.id));
  if (!patient) {
    return res.status(404).json({ message: "Patient not found" });
  }

  patient.name  = req.body.name  || patient.name;
  patient.email = req.body.email || patient.email;
  patient.phone = req.body.phone || patient.phone;
  patient.age   = req.body.age   || patient.age;

  res.status(200).json({ message: "Patient updated", patient });
});

// DELETE patient
app.delete('/api/patients/:id', (req, res) => {
  const index = patients.findIndex(p => p.id === parseInt(req.params.id));
  if (index === -1) {
    return res.status(404).json({ message: "Patient not found" });
  }

  patients.splice(index, 1);
  res.status(200).json({ message: "Patient deleted successfully" });
});


// ══════════════════════════════════════════
//  DOCTORS CRUD
// ══════════════════════════════════════════

// GET all doctors
app.get('/api/doctors', (req, res) => {
  res.status(200).json(doctors);
});

// GET available doctors only
app.get('/api/doctors/available', (req, res) => {
  const available = doctors.filter(d => d.available === true);
  res.status(200).json(available);
});

// GET single doctor by ID
app.get('/api/doctors/:id', (req, res) => {
  const doctor = doctors.find(d => d.id === parseInt(req.params.id));
  if (!doctor) {
    return res.status(404).json({ message: "Doctor not found" });
  }
  res.status(200).json(doctor);
});

// POST add new doctor
app.post('/api/doctors', (req, res) => {
  const { name, specialization, available } = req.body;

  if (!name || !specialization) {
    return res.status(400).json({ message: "Fields required: name, specialization" });
  }

  const newDoctor = {
    id: doctors.length + 1,
    name,
    specialization,
    available: available !== undefined ? available : true
  };

  doctors.push(newDoctor);
  res.status(201).json({ message: "Doctor added successfully", doctor: newDoctor });
});

// PUT update doctor
app.put('/api/doctors/:id', (req, res) => {
  const doctor = doctors.find(d => d.id === parseInt(req.params.id));
  if (!doctor) {
    return res.status(404).json({ message: "Doctor not found" });
  }

  doctor.name           = req.body.name           || doctor.name;
  doctor.specialization = req.body.specialization || doctor.specialization;
  if (req.body.available !== undefined) doctor.available = req.body.available;

  res.status(200).json({ message: "Doctor updated", doctor });
});

// DELETE doctor
app.delete('/api/doctors/:id', (req, res) => {
  const index = doctors.findIndex(d => d.id === parseInt(req.params.id));
  if (index === -1) {
    return res.status(404).json({ message: "Doctor not found" });
  }

  doctors.splice(index, 1);
  res.status(200).json({ message: "Doctor deleted successfully" });
});


// ══════════════════════════════════════════
//  APPOINTMENTS CRUD
// ══════════════════════════════════════════

// GET all appointments
app.get('/api/appointments', (req, res) => {
  res.status(200).json(appointments);
});

// GET single appointment by ID
app.get('/api/appointments/:id', (req, res) => {
  const appt = appointments.find(a => a.id === parseInt(req.params.id));
  if (!appt) {
    return res.status(404).json({ message: "Appointment not found" });
  }
  res.status(200).json(appt);
});

// GET appointments by patient ID
app.get('/api/appointments/patient/:patientId', (req, res) => {
  const patientAppts = appointments.filter(a => a.patientId === parseInt(req.params.patientId));
  if (patientAppts.length === 0) {
    return res.status(404).json({ message: "No appointments found for this patient" });
  }
  res.status(200).json(patientAppts);
});

// POST book new appointment
app.post('/api/appointments', (req, res) => {
  const { patientId, doctorId, date, time } = req.body;

  if (!patientId || !doctorId || !date || !time) {
    return res.status(400).json({ message: "All fields required: patientId, doctorId, date, time" });
  }

  // Check if patient exists
  const patient = patients.find(p => p.id === parseInt(patientId));
  if (!patient) {
    return res.status(404).json({ message: "Patient not found" });
  }

  // Check if doctor exists
  const doctor = doctors.find(d => d.id === parseInt(doctorId));
  if (!doctor) {
    return res.status(404).json({ message: "Doctor not found" });
  }

  // Check if doctor is available
  if (!doctor.available) {
    return res.status(400).json({ message: "Doctor is not available" });
  }

  const newAppointment = {
    id: appointments.length + 1,
    patientId: parseInt(patientId),
    doctorId:  parseInt(doctorId),
    date,
    time,
    status: "Scheduled"
  };

  appointments.push(newAppointment);
  res.status(201).json({
    message: "Appointment booked successfully",
    appointment: newAppointment,
    patientName: patient.name,
    doctorName:  doctor.name
  });
});

// PUT update appointment status (Scheduled / Completed / Cancelled)
app.put('/api/appointments/:id', (req, res) => {
  const appt = appointments.find(a => a.id === parseInt(req.params.id));
  if (!appt) {
    return res.status(404).json({ message: "Appointment not found" });
  }

  appt.date   = req.body.date   || appt.date;
  appt.time   = req.body.time   || appt.time;
  appt.status = req.body.status || appt.status;

  res.status(200).json({ message: "Appointment updated", appointment: appt });
});

// DELETE cancel appointment
app.delete('/api/appointments/:id', (req, res) => {
  const index = appointments.findIndex(a => a.id === parseInt(req.params.id));
  if (index === -1) {
    return res.status(404).json({ message: "Appointment not found" });
  }

  appointments.splice(index, 1);
  res.status(200).json({ message: "Appointment cancelled successfully" });
});


// ──────────────────────────────────────────
//  START SERVER
// ──────────────────────────────────────────
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`MediBook Hospital API running on http://localhost:${PORT}`);
});
