import { useMemo, useState } from "react";
import { isWithinInterval, parseISO } from "date-fns";
import { FiDownload, FiFileText } from "react-icons/fi";
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { useApp } from "../context/AppContext";
import { downloadCsv, downloadSimplePdf, invoiceTotal } from "../utils/exporters";

export default function Reports() {
  const { data } = useApp();
  const [range, setRange] = useState({ from: "", to: "" });

  const filteredAppointments = useMemo(() => {
    if (!range.from || !range.to) return data.appointments;
    return data.appointments.filter((item) =>
      isWithinInterval(parseISO(item.date), { start: parseISO(range.from), end: parseISO(range.to) })
    );
  }, [data.appointments, range]);

  const filteredBills = useMemo(() => {
    if (!range.from || !range.to) return data.bills;
    return data.bills.filter((item) =>
      isWithinInterval(parseISO(item.date), { start: parseISO(range.from), end: parseISO(range.to) })
    );
  }, [data.bills, range]);

  const chartData = [
    { name: "Patients", count: data.patients.length },
    { name: "Appointments", count: filteredAppointments.length },
    { name: "Revenue", count: filteredBills.reduce((sum, bill) => sum + invoiceTotal(bill), 0) },
    { name: "Lab Tests", count: data.labTests.length },
    { name: "Medicines", count: data.medicines.length }
  ];

  const reports = [
    { title: "Patient Report", rows: data.patients },
    { title: "Appointment Report", rows: filteredAppointments },
    { title: "Revenue Report", rows: filteredBills.map((bill) => ({ ...bill, total: invoiceTotal(bill) })) }
  ];

  return (
    <div className="space-y-6">
      <section className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-950 dark:text-white">Reports & Analytics</h2>
          <p className="text-sm text-slate-500">Filter reports by date range and export CSV or PDF.</p>
        </div>
      </section>

      <section className="panel grid gap-4 p-4 md:grid-cols-2">
        <label>
          <span className="label">From</span>
          <input className="field mt-1" type="date" value={range.from} onChange={(event) => setRange({ ...range, from: event.target.value })} />
        </label>
        <label>
          <span className="label">To</span>
          <input className="field mt-1" type="date" value={range.to} onChange={(event) => setRange({ ...range, to: event.target.value })} />
        </label>
      </section>

      <section className="grid gap-4 lg:grid-cols-3">
        {reports.map((report) => (
          <div key={report.title} className="panel p-5">
            <div className="flex items-center gap-3">
              <div className="grid h-10 w-10 place-items-center rounded-lg bg-medical-100 text-medical-700"><FiFileText /></div>
              <div>
                <h3 className="font-bold text-slate-950 dark:text-white">{report.title}</h3>
                <p className="text-sm text-slate-500">{report.rows.length} rows</p>
              </div>
            </div>
            <div className="mt-5 flex gap-2">
              <button className="btn-secondary" onClick={() => downloadCsv(`${report.title}.csv`, report.rows)}><FiDownload /> CSV</button>
              <button className="btn-secondary" onClick={() => downloadSimplePdf(report.title, report.rows.map((row) => `${row.id} - ${row.name || row.status || row.total}`), `${report.title}.pdf`)}><FiDownload /> PDF</button>
            </div>
          </div>
        ))}
      </section>

      <section className="panel p-5">
        <h3 className="mb-4 font-bold text-slate-950 dark:text-white">Monthly Statistics</h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="count" fill="#0284c7" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>
    </div>
  );
}
