import { addDays, format, subDays } from "date-fns";

const today = new Date();
const day = (offset) => format(addDays(today, offset), "yyyy-MM-dd");

export function generateSampleData() {
  const patients = [
    {
      id: "PAT-1001",
      name: "Ayesha Khan",
      age: 34,
      gender: "Female",
      contact: "0300-2211445",
      address: "Gulberg, Lahore",
      bloodGroup: "B+",
      allergies: "Penicillin",
      history: "Hypertension follow-up, annual wellness checks",
      createdAt: day(-12)
    },
    {
      id: "PAT-1002",
      name: "Hamza Ali",
      age: 42,
      gender: "Male",
      contact: "0312-7779090",
      address: "Clifton, Karachi",
      bloodGroup: "O+",
      allergies: "None",
      history: "Migraine and neurology consultations",
      createdAt: day(-7)
    },
    {
      id: "PAT-1003",
      name: "Mariam Siddiqui",
      age: 27,
      gender: "Female",
      contact: "0333-4859951",
      address: "F-8, Islamabad",
      bloodGroup: "A-",
      allergies: "Dust",
      history: "Asthma care and lab monitoring",
      createdAt: day(-3)
    }
  ];

  const weekdaySchedule = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"].map((dayName) => ({
    day: dayName,
    from: "09:00",
    to: "17:00"
  }));

  const doctors = [
    {
      id: "DOC-101",
      name: "Dr. Sana Ahmed",
      specialization: "Cardiology",
      qualification: "FCPS Cardiology",
      experience: 12,
      contact: "042-111-222-333",
      available: true,
      consultationFee: 3000,
      schedule: weekdaySchedule
    },
    {
      id: "DOC-102",
      name: "Dr. Bilal Raza",
      specialization: "Neurology",
      qualification: "MD Neurology",
      experience: 9,
      contact: "021-555-9090",
      available: true,
      consultationFee: 3500,
      schedule: weekdaySchedule
    },
    {
      id: "DOC-103",
      name: "Dr. Fatima Noor",
      specialization: "Dermatology",
      qualification: "MBBS, DDerm",
      experience: 7,
      contact: "051-333-1000",
      available: false,
      consultationFee: 2500,
      schedule: weekdaySchedule
    }
  ];

  const appointments = [
    {
      id: "APT-2001",
      patientId: "PAT-1001",
      doctorId: "DOC-101",
      date: day(0),
      time: "10:00",
      reason: "Chest discomfort",
      status: "Confirmed",
      notification: "To: Ayesha Khan | Your appointment with Dr. Sana Ahmed is confirmed."
    },
    {
      id: "APT-2002",
      patientId: "PAT-1002",
      doctorId: "DOC-102",
      date: day(2),
      time: "13:30",
      reason: "Migraine review",
      status: "Pending",
      notification: "To: Hamza Ali | Appointment request received."
    },
    {
      id: "APT-2003",
      patientId: "PAT-1003",
      doctorId: "DOC-103",
      date: format(subDays(today, 2), "yyyy-MM-dd"),
      time: "11:15",
      reason: "Skin allergy",
      status: "Completed",
      notification: "To: Mariam Siddiqui | Appointment completed."
    }
  ];

  const prescriptions = [
    {
      id: "RX-3001",
      patientId: "PAT-1001",
      doctorId: "DOC-101",
      date: day(-1),
      medicines: "Atorvastatin 10mg - once daily - 30 days\nAspirin 75mg - once daily - 14 days",
      notes: "Low salt diet, repeat lipid profile in 4 weeks.",
      recommendations: "Walk 30 minutes daily"
    }
  ];

  const bills = [
    {
      id: "BILL-4001",
      patientId: "PAT-1001",
      date: day(0),
      consultationFee: 3000,
      medicines: 1200,
      tests: 2500,
      roomCharges: 0,
      status: "Paid"
    },
    {
      id: "BILL-4002",
      patientId: "PAT-1002",
      date: day(-5),
      consultationFee: 3500,
      medicines: 800,
      tests: 0,
      roomCharges: 0,
      status: "Partial"
    }
  ];

  const rooms = [
    { id: "BED-GEN-01", type: "General", bed: "G-01", patientId: "PAT-1003", status: "Occupied", checkIn: day(-2), checkOut: "", chargesPerDay: 5000 },
    { id: "BED-PRI-01", type: "Private", bed: "P-01", patientId: "", status: "Available", checkIn: "", checkOut: "", chargesPerDay: 12000 },
    { id: "BED-ICU-01", type: "ICU", bed: "I-01", patientId: "", status: "Available", checkIn: "", checkOut: "", chargesPerDay: 25000 },
    { id: "BED-EMR-01", type: "Emergency", bed: "E-01", patientId: "", status: "Available", checkIn: "", checkOut: "", chargesPerDay: 8000 }
  ];

  const labTests = [
    { id: "LAB-5001", patientId: "PAT-1003", testName: "Blood Test", date: day(-1), status: "Result Uploaded", result: "CBC within normal range", category: "Pathology" },
    { id: "LAB-5002", patientId: "PAT-1001", testName: "ECG", date: day(0), status: "Pending", result: "", category: "Cardiology" }
  ];

  const medicines = [
    { id: "MED-6001", name: "Paracetamol", category: "Pain Relief", quantity: 120, expiryDate: day(280), price: 120, issuedTo: "" },
    { id: "MED-6002", name: "Amoxicillin", category: "Antibiotic", quantity: 8, expiryDate: day(140), price: 450, issuedTo: "PAT-1003" },
    { id: "MED-6003", name: "Salbutamol Inhaler", category: "Respiratory", quantity: 25, expiryDate: day(360), price: 900, issuedTo: "" }
  ];

  const ambulances = [
    { id: "AMB-7001", driver: "Imran Malik", contact: "1122", location: "Main Hospital", status: "Available", requestFor: "", emergencyContact: "1122 / 15" },
    { id: "AMB-7002", driver: "Naveed Iqbal", contact: "0309-5551111", location: "Johar Town", status: "On Route", requestFor: "PAT-1002", emergencyContact: "1122 / 15" }
  ];

  const activities = [
    { id: "ACT-1", text: "New appointment confirmed for Ayesha Khan", date: day(0), type: "Appointment" },
    { id: "ACT-2", text: "Lab result uploaded for Mariam Siddiqui", date: day(-1), type: "Laboratory" },
    { id: "ACT-3", text: "Invoice BILL-4001 marked paid", date: day(0), type: "Billing" }
  ];

  return { patients, doctors, appointments, prescriptions, bills, rooms, labTests, medicines, ambulances, activities };
}
