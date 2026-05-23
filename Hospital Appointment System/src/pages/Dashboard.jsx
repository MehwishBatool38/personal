import { format, isToday, parseISO } from "date-fns";
import { FiCalendar, FiCreditCard, FiRefreshCw, FiUsers } from "react-icons/fi";
import { FaUserMd } from "react-icons/fa";
import { Bar, BarChart, CartesianGrid, Cell, Legend, Line, LineChart, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import Skeleton from "../components/Skeleton";
import { useApp } from "../context/AppContext";
import { invoiceTotal } from "../utils/exporters";

export default function Dashboard() {
  const { data, loading, seedFreshData } = useApp();
  if (loading) return <Skeleton />;

  const appointmentsToday = data.appointments.filter((item) => isToday(parseISO(item.date))).length;
  const revenue = data.bills.reduce((total, bill) => total + invoiceTotal(bill), 0);
  const monthly = Array.from({ length: 6 }).map((_, index) => {
    const month = format(new Date(new Date().getFullYear(), new Date().getMonth() - (5 - index), 1), "MMM");
    return {
      month,
      revenue: Math.round(revenue / 6 + index * 950),
      appointments: Math.max(2, data.appointments.length + index)
    };
  });
  const statusChart = ["Pending", "Confirmed", "Completed", "Cancelled"].map((status) => ({
    name: status,
    value: data.appointments.filter((item) => item.status === status).length
  }));

  const stats = [
    { label: "Total Patients", value: data.patients.length, icon: FiUsers, color: "bg-medical-600" },
    { label: "Appointments Today", value: appointmentsToday, icon: FiCalendar, color: "bg-teal-600" },
    { label: "Available Doctors", value: data.doctors.filter((item) => item.available === true || item.available === "true").length, icon: FaUserMd, color: "bg-indigo-600" },
    { label: "Revenue", value: `Rs ${revenue.toLocaleString()}`, icon: FiCreditCard, color: "bg-emerald-600" }
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-950 dark:text-white">Real-time Overview</h2>
          <p className="text-sm text-slate-500">LocalStorage data updates instantly across the workspace.</p>
        </div>
        <button className="btn-secondary" onClick={seedFreshData}><FiRefreshCw /> Restore Demo Data</button>
      </div>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((item) => {
          const Icon = item.icon;
          return (
            <div key={item.label} className="panel p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-slate-500">{item.label}</p>
                  <p className="mt-2 text-2xl font-extrabold text-slate-950 dark:text-white">{item.value}</p>
                </div>
                <div className={`grid h-12 w-12 place-items-center rounded-lg text-white ${item.color}`}><Icon /></div>
              </div>
            </div>
          );
        })}
      </section>

      <section className="grid gap-5 xl:grid-cols-[1.4fr_0.9fr]">
        <div className="panel p-5">
          <h3 className="mb-4 font-bold text-slate-950 dark:text-white">Monthly Statistics</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthly}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="revenue" stroke="#0284c7" strokeWidth={3} />
                <Line type="monotone" dataKey="appointments" stroke="#0f766e" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="panel p-5">
          <h3 className="mb-4 font-bold text-slate-950 dark:text-white">Appointment Status</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={statusChart} dataKey="value" nameKey="name" outerRadius={105} label>
                  {statusChart.map((entry, index) => (
                    <Cell key={entry.name} fill={["#f59e0b", "#0284c7", "#16a34a", "#dc2626"][index]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </section>

      <section className="grid gap-5 xl:grid-cols-[0.95fr_1.05fr]">
        <div className="panel p-5">
          <h3 className="mb-4 font-bold text-slate-950 dark:text-white">Revenue Summary</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.bills.map((bill) => ({ id: bill.id, total: invoiceTotal(bill) }))}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="id" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="total" fill="#0369a1" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="panel p-5">
          <h3 className="mb-4 font-bold text-slate-950 dark:text-white">Recent Activities</h3>
          <div className="space-y-3">
            {data.activities.slice(0, 6).map((activity) => (
              <div key={activity.id} className="flex items-start justify-between gap-4 rounded-lg bg-slate-50 p-3 dark:bg-slate-950">
                <div>
                  <p className="font-semibold text-slate-800 dark:text-slate-100">{activity.text}</p>
                  <p className="text-xs text-slate-500">{activity.type}</p>
                </div>
                <span className="text-xs font-semibold text-slate-500">{activity.date}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
