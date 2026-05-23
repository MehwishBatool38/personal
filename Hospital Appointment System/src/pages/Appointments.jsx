import { useMemo, useState } from "react";
import { compareAsc, format, isAfter, isBefore, isToday, parseISO } from "date-fns";
import { FiCalendar, FiMail, FiSearch } from "react-icons/fi";
import DataTable from "../components/DataTable";
import FormModal from "../components/FormModal";
import { useApp } from "../context/AppContext";

const statuses = ["Pending", "Confirmed", "Completed", "Cancelled"];

function badge(status) {
  const styles = {
    Pending: "bg-amber-100 text-amber-700",
    Confirmed: "bg-sky-100 text-sky-700",
    Completed: "bg-emerald-100 text-emerald-700",
    Cancelled: "bg-rose-100 text-rose-700"
  };
  return <span className={`badge ${styles[status]}`}>{status}</span>;
}

export default function Appointments() {
  const { data, bookAppointment, updateItem, askConfirm, toast } = useApp();
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("All");
  const [editing, setEditing] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const rows = useMemo(() => {
    return data.appointments
      .map((item) => ({
        ...item,
        patient: data.patients.find((patient) => patient.id === item.patientId)?.name || item.patientId,
        doctor: data.doctors.find((doctor) => doctor.id === item.doctorId)?.name || item.doctorId
      }))
      .sort((a, b) => compareAsc(parseISO(a.date), parseISO(b.date)));
  }, [data]);

  const filtered = rows.filter((row) => {
    const date = parseISO(row.date);
    const category =
      isToday(date) ? "Today" : isAfter(date, new Date()) ? "Upcoming" : isBefore(date, new Date()) ? "Past" : "All";
    return JSON.stringify(row).toLowerCase().includes(query.toLowerCase()) && (filter === "All" || row.status === filter || category === filter);
  });

  const fields = [
    { name: "patientId", label: "Patient", type: "select", required: true, options: data.patients.map((item) => ({ value: item.id, label: `${item.name} (${item.id})` })) },
    { name: "doctorId", label: "Doctor", type: "select", required: true, options: data.doctors.map((item) => ({ value: item.id, label: `${item.name} - ${item.specialization}` })) },
    { name: "date", label: "Date", type: "date", required: true },
    { name: "time", label: "Time", type: "time", required: true },
    { name: "reason", label: "Reason", required: true },
    { name: "status", label: "Status", type: "select", required: true, options: statuses.map((value) => ({ value, label: value })) }
  ];

  function submit(event) {
    event.preventDefault();
    if (editing.id) updateItem("appointments", editing.id, editing, "Appointment");
    else bookAppointment(editing);
    setShowForm(false);
    setEditing(null);
  }

  function cancel(row) {
    askConfirm({
      title: "Cancel appointment",
      message: `Cancel appointment ${row.id} for ${row.patient}?`,
      onConfirm: () => updateItem("appointments", row.id, { status: "Cancelled" }, "Appointment")
    });
  }

  return (
    <div className="space-y-5">
      <section className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-950 dark:text-white">Appointment System</h2>
          <p className="text-sm text-slate-500">Book, reschedule, cancel, and track appointment notifications.</p>
        </div>
        <button className="btn-primary" onClick={() => { setEditing({ date: format(new Date(), "yyyy-MM-dd"), time: "09:00", status: "Pending" }); setShowForm(true); }}>
          <FiCalendar /> Book Appointment
        </button>
      </section>

      <section className="panel p-4">
        <div className="grid gap-3 md:grid-cols-[1fr_220px]">
          <label className="relative">
            <FiSearch className="pointer-events-none absolute left-3 top-3 text-slate-400" />
            <input className="field pl-9" placeholder="Search appointments" value={query} onChange={(event) => setQuery(event.target.value)} />
          </label>
          <select className="field" value={filter} onChange={(event) => setFilter(event.target.value)}>
            {["All", "Today", "Upcoming", "Past", ...statuses].map((item) => <option key={item}>{item}</option>)}
          </select>
        </div>
      </section>

      <DataTable
        rows={filtered}
        columns={[
          { key: "id", label: "ID" },
          { key: "patient", label: "Patient" },
          { key: "doctor", label: "Doctor" },
          { key: "date", label: "Date" },
          { key: "time", label: "Time" },
          { key: "status", label: "Status", render: (row) => badge(row.status) }
        ]}
        onEdit={(row) => { setEditing(row); setShowForm(true); }}
        onDelete={cancel}
        onView={(row) => toast(row.notification || "Mock email notification prepared.")}
      />

      <div className="panel p-4">
        <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white"><FiMail /> Mock Email Format</div>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">Subject: Appointment Confirmation | Body: Patient, doctor, date, time, reason, and status are generated when booking.</p>
      </div>

      {showForm && (
        <FormModal
          title={editing.id ? "Reschedule Appointment" : "Book Appointment"}
          fields={fields}
          values={editing}
          onChange={(name, value) => setEditing((item) => ({ ...item, [name]: value }))}
          onClose={() => setShowForm(false)}
          onSubmit={submit}
          submitLabel={editing.id ? "Save Appointment" : "Book Appointment"}
        />
      )}
    </div>
  );
}
