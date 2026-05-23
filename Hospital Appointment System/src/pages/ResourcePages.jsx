import { useState } from "react";
import { format } from "date-fns";
import FormModal from "../components/FormModal";
import ModulePage from "./ModulePage";
import { useApp } from "../context/AppContext";
import { downloadSimplePdf, invoiceTotal } from "../utils/exporters";

const statusBadge = (status) => {
  const styles = {
    Available: "bg-emerald-100 text-emerald-700",
    Occupied: "bg-amber-100 text-amber-700",
    Pending: "bg-amber-100 text-amber-700",
    Paid: "bg-emerald-100 text-emerald-700",
    Partial: "bg-sky-100 text-sky-700",
    "Result Uploaded": "bg-emerald-100 text-emerald-700",
    "Low Stock": "bg-rose-100 text-rose-700",
    "On Route": "bg-sky-100 text-sky-700",
    Requested: "bg-amber-100 text-amber-700"
  };
  return <span className={`badge ${styles[status] || "bg-slate-100 text-slate-700"}`}>{status}</span>;
};

function patientOptions(data) {
  return data.patients.map((item) => ({ value: item.id, label: `${item.name} (${item.id})` }));
}

function doctorOptions(data) {
  return data.doctors.map((item) => ({ value: item.id, label: `${item.name} - ${item.specialization}` }));
}

function DetailModal({ title, children, onClose }) {
  return (
    <div className="fixed inset-0 z-30 flex items-center justify-center bg-slate-950/40 p-4">
      <div className="w-full max-w-2xl rounded-lg bg-white p-6 shadow-soft dark:bg-slate-900">
        <div className="flex justify-between gap-4">
          <h2 className="text-xl font-bold text-slate-950 dark:text-white">{title}</h2>
          <button className="btn-secondary" onClick={onClose}>Close</button>
        </div>
        <div className="mt-5 text-sm text-slate-700 dark:text-slate-200">{children}</div>
      </div>
    </div>
  );
}

export function PatientsPage() {
  const { data } = useApp();
  const [detail, setDetail] = useState(null);
  const fields = [
    { name: "name", label: "Name", required: true },
    { name: "age", label: "Age", type: "number", min: 0, required: true },
    { name: "gender", label: "Gender", type: "select", required: true, options: ["Female", "Male", "Other"].map((value) => ({ value, label: value })) },
    { name: "contact", label: "Contact", required: true },
    { name: "address", label: "Address", required: true },
    { name: "bloodGroup", label: "Blood Group", type: "select", required: true, options: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map((value) => ({ value, label: value })) },
    { name: "allergies", label: "Allergies" },
    { name: "history", label: "Medical History", type: "textarea" }
  ];
  return (
    <>
      <ModulePage
        title="Patient Management"
        collection="patients"
        label="Patient"
        fields={fields}
        defaultItem={{ createdAt: format(new Date(), "yyyy-MM-dd"), allergies: "None" }}
        columns={[
          { key: "id", label: "Patient ID" },
          { key: "name", label: "Name" },
          { key: "age", label: "Age" },
          { key: "gender", label: "Gender" },
          { key: "bloodGroup", label: "Blood" },
          { key: "contact", label: "Contact" }
        ]}
        filters={["Female", "Male", "Other"].map((value) => ({ key: "gender", value, label: value }))}
        onView={setDetail}
      />
      {detail && (
        <DetailModal title={`${detail.name} Medical History`} onClose={() => setDetail(null)}>
          <dl className="grid gap-3 sm:grid-cols-2">
            {["id", "age", "gender", "contact", "address", "bloodGroup", "allergies", "history"].map((key) => (
              <div key={key} className="rounded-lg bg-slate-50 p-3 dark:bg-slate-950">
                <dt className="text-xs font-bold uppercase text-slate-500">{key}</dt>
                <dd className="mt-1 whitespace-pre-wrap">{detail[key] || "None"}</dd>
              </div>
            ))}
          </dl>
        </DetailModal>
      )}
    </>
  );
}

export function DoctorsPage() {
  const { scheduleDefaults } = useApp();
  const fields = [
    { name: "name", label: "Name", required: true },
    { name: "specialization", label: "Specialization", required: true },
    { name: "qualification", label: "Qualification", required: true },
    { name: "experience", label: "Experience", type: "number", min: 0, required: true },
    { name: "contact", label: "Contact", required: true },
    { name: "consultationFee", label: "Consultation Fee", type: "number", min: 0, required: true },
    { name: "available", label: "Availability", type: "select", required: true, options: [{ value: true, label: "Available" }, { value: false, label: "Unavailable" }] }
  ];
  return (
    <ModulePage
      title="Doctor Management"
      collection="doctors"
      label="Doctor"
      fields={fields}
      defaultItem={{ available: true, schedule: scheduleDefaults() }}
      columns={[
        { key: "id", label: "Doctor ID" },
        { key: "name", label: "Name" },
        { key: "specialization", label: "Specialization" },
        { key: "experience", label: "Exp." },
        { key: "consultationFee", label: "Fee" },
        { key: "available", label: "Status", render: (row) => statusBadge(row.available === true || row.available === "true" ? "Available" : "Unavailable") }
      ]}
      filters={[{ key: "available", value: "true", label: "Available" }, { key: "available", value: "false", label: "Unavailable" }]}
      enrich={(item) => ({ ...item, available: String(item.available) })}
      onView={(row) => downloadSimplePdf(`${row.name} Schedule`, row.schedule?.map((item) => `${item.day}: ${item.from} - ${item.to}`) || [], `${row.id}-schedule.pdf`)}
    />
  );
}

export function PrescriptionsPage() {
  const { data } = useApp();
  const fields = [
    { name: "patientId", label: "Patient", type: "select", required: true, options: patientOptions(data) },
    { name: "doctorId", label: "Doctor", type: "select", required: true, options: doctorOptions(data) },
    { name: "date", label: "Date", type: "date", required: true },
    { name: "medicines", label: "Medicines, Dosage, Duration", type: "textarea", required: true },
    { name: "notes", label: "Doctor Notes", type: "textarea" },
    { name: "recommendations", label: "Recommendations", type: "textarea" }
  ];
  const enrich = (item) => ({
    ...item,
    patient: data.patients.find((patient) => patient.id === item.patientId)?.name || item.patientId,
    doctor: data.doctors.find((doctor) => doctor.id === item.doctorId)?.name || item.doctorId
  });
  return (
    <ModulePage
      title="Prescription Management"
      collection="prescriptions"
      label="Prescription"
      fields={fields}
      defaultItem={{ date: format(new Date(), "yyyy-MM-dd") }}
      columns={[
        { key: "id", label: "RX ID" },
        { key: "patient", label: "Patient" },
        { key: "doctor", label: "Doctor" },
        { key: "date", label: "Date" },
        { key: "recommendations", label: "Recommendations" }
      ]}
      enrich={enrich}
      onPrint={(row) => downloadSimplePdf(`Prescription ${row.id}`, [`Patient: ${row.patient}`, `Doctor: ${row.doctor}`, `Date: ${row.date}`, row.medicines, row.notes, row.recommendations], `${row.id}.pdf`)}
    />
  );
}

export function BillingPage() {
  const { data } = useApp();
  const fields = [
    { name: "patientId", label: "Patient", type: "select", required: true, options: patientOptions(data) },
    { name: "date", label: "Date", type: "date", required: true },
    { name: "consultationFee", label: "Consultation Fee", type: "number", min: 0, required: true },
    { name: "medicines", label: "Medicines", type: "number", min: 0, required: true },
    { name: "tests", label: "Tests", type: "number", min: 0, required: true },
    { name: "roomCharges", label: "Room Charges", type: "number", min: 0, required: true },
    { name: "status", label: "Payment Status", type: "select", required: true, options: ["Paid", "Pending", "Partial"].map((value) => ({ value, label: value })) }
  ];
  const enrich = (item) => ({ ...item, patient: data.patients.find((patient) => patient.id === item.patientId)?.name || item.patientId, total: invoiceTotal(item) });
  return (
    <ModulePage
      title="Billing & Invoice System"
      collection="bills"
      label="Bill"
      fields={fields}
      defaultItem={{ date: format(new Date(), "yyyy-MM-dd"), consultationFee: 0, medicines: 0, tests: 0, roomCharges: 0, status: "Pending" }}
      columns={[
        { key: "id", label: "Invoice" },
        { key: "patient", label: "Patient" },
        { key: "date", label: "Date" },
        { key: "total", label: "Total", render: (row) => `Rs ${row.total.toLocaleString()}` },
        { key: "status", label: "Status", render: (row) => statusBadge(row.status) }
      ]}
      filters={["Paid", "Pending", "Partial"].map((value) => ({ key: "status", value, label: value }))}
      enrich={enrich}
      onPrint={(row) => downloadSimplePdf(`Invoice ${row.id}`, [`Patient: ${row.patient}`, `Date: ${row.date}`, `Consultation: ${row.consultationFee}`, `Medicines: ${row.medicines}`, `Tests: ${row.tests}`, `Room: ${row.roomCharges}`, `Total: ${row.total}`, `Status: ${row.status}`], `${row.id}.pdf`)}
    />
  );
}

export function RoomsPage() {
  const { data, quickCheckout } = useApp();
  const fields = [
    { name: "type", label: "Room Type", type: "select", required: true, options: ["General", "Private", "ICU", "Emergency"].map((value) => ({ value, label: value })) },
    { name: "bed", label: "Bed Number", required: true },
    { name: "patientId", label: "Assigned Patient", type: "select", options: [{ value: "", label: "No patient" }, ...patientOptions(data)] },
    { name: "status", label: "Status", type: "select", required: true, options: ["Available", "Occupied"].map((value) => ({ value, label: value })) },
    { name: "checkIn", label: "Check-in", type: "date" },
    { name: "checkOut", label: "Check-out", type: "date" },
    { name: "chargesPerDay", label: "Charges Per Day", type: "number", min: 0, required: true }
  ];
  const enrich = (item) => ({ ...item, patient: data.patients.find((patient) => patient.id === item.patientId)?.name || "Unassigned" });
  return (
    <ModulePage
      title="Room & Bed Management"
      collection="rooms"
      label="Room"
      fields={fields}
      defaultItem={{ status: "Available", chargesPerDay: 5000 }}
      columns={[
        { key: "id", label: "Room ID" },
        { key: "type", label: "Type" },
        { key: "bed", label: "Bed" },
        { key: "patient", label: "Patient" },
        { key: "chargesPerDay", label: "Daily Charge" },
        { key: "status", label: "Status", render: (row) => statusBadge(row.status) }
      ]}
      filters={["Available", "Occupied", "ICU", "Emergency"].map((value) => ({ key: value === "Available" || value === "Occupied" ? "status" : "type", value, label: value }))}
      enrich={enrich}
      onView={(row) => row.status === "Occupied" && quickCheckout(row)}
    />
  );
}

export function LaboratoryPage() {
  const { data } = useApp();
  const fields = [
    { name: "patientId", label: "Patient", type: "select", required: true, options: patientOptions(data) },
    { name: "testName", label: "Test", type: "select", required: true, options: ["Blood Test", "X-Ray", "MRI", "ECG", "CT Scan", "Urine Test"].map((value) => ({ value, label: value })) },
    { name: "category", label: "Category", required: true },
    { name: "date", label: "Date", type: "date", required: true },
    { name: "status", label: "Status", type: "select", required: true, options: ["Pending", "Result Uploaded"].map((value) => ({ value, label: value })) },
    { name: "result", label: "Mock Test Result", type: "textarea" }
  ];
  const enrich = (item) => ({ ...item, patient: data.patients.find((patient) => patient.id === item.patientId)?.name || item.patientId });
  return (
    <ModulePage
      title="Laboratory Management"
      collection="labTests"
      label="Lab Test"
      fields={fields}
      defaultItem={{ date: format(new Date(), "yyyy-MM-dd"), status: "Pending" }}
      columns={[
        { key: "id", label: "Test ID" },
        { key: "patient", label: "Patient" },
        { key: "testName", label: "Test" },
        { key: "date", label: "Date" },
        { key: "status", label: "Status", render: (row) => statusBadge(row.status) },
        { key: "result", label: "Result" }
      ]}
      filters={["Pending", "Result Uploaded"].map((value) => ({ key: "status", value, label: value }))}
      enrich={enrich}
    />
  );
}

export function PharmacyPage() {
  const { data } = useApp();
  const fields = [
    { name: "name", label: "Medicine Name", required: true },
    { name: "category", label: "Category", required: true },
    { name: "quantity", label: "Quantity", type: "number", min: 0, required: true },
    { name: "expiryDate", label: "Expiry Date", type: "date", required: true },
    { name: "price", label: "Price", type: "number", min: 0, required: true },
    { name: "issuedTo", label: "Issue To Patient", type: "select", options: [{ value: "", label: "Inventory stock" }, ...patientOptions(data)] }
  ];
  const enrich = (item) => ({ ...item, stockStatus: Number(item.quantity) <= 10 ? "Low Stock" : "Available", patient: data.patients.find((patient) => patient.id === item.issuedTo)?.name || "Inventory" });
  return (
    <ModulePage
      title="Pharmacy Management"
      collection="medicines"
      label="Medicine"
      fields={fields}
      defaultItem={{ quantity: 0, price: 0 }}
      columns={[
        { key: "id", label: "Medicine ID" },
        { key: "name", label: "Name" },
        { key: "quantity", label: "Qty" },
        { key: "expiryDate", label: "Expiry" },
        { key: "price", label: "Price" },
        { key: "stockStatus", label: "Stock", render: (row) => statusBadge(row.stockStatus) }
      ]}
      filters={[{ key: "stockStatus", value: "Low Stock", label: "Low Stock" }, { key: "stockStatus", value: "Available", label: "Available" }]}
      enrich={enrich}
    />
  );
}

export function AmbulancePage() {
  const { data } = useApp();
  const fields = [
    { name: "driver", label: "Driver", required: true },
    { name: "contact", label: "Contact", required: true },
    { name: "location", label: "Current Location", required: true },
    { name: "status", label: "Status", type: "select", required: true, options: ["Available", "Requested", "On Route"].map((value) => ({ value, label: value })) },
    { name: "requestFor", label: "Request For Patient", type: "select", options: [{ value: "", label: "No patient" }, ...patientOptions(data)] },
    { name: "emergencyContact", label: "Emergency Numbers", required: true }
  ];
  const enrich = (item) => ({ ...item, patient: data.patients.find((patient) => patient.id === item.requestFor)?.name || "None" });
  return (
    <ModulePage
      title="Ambulance Service"
      collection="ambulances"
      label="Ambulance"
      fields={fields}
      defaultItem={{ status: "Available", emergencyContact: "1122 / 15" }}
      columns={[
        { key: "id", label: "Ambulance" },
        { key: "driver", label: "Driver" },
        { key: "contact", label: "Contact" },
        { key: "location", label: "Location" },
        { key: "patient", label: "Patient" },
        { key: "status", label: "Status", render: (row) => statusBadge(row.status) }
      ]}
      filters={["Available", "Requested", "On Route"].map((value) => ({ key: "status", value, label: value }))}
      enrich={enrich}
    />
  );
}
