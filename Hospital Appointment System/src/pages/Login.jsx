import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { FiLock, FiUserCheck } from "react-icons/fi";
import { useApp } from "../context/AppContext";

export default function Login() {
  const { user, login, demoUsers } = useApp();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "doctor@hospital.com", password: "password123", role: "Doctor" });

  if (user) return <Navigate to="/" replace />;

  function submit(event) {
    event.preventDefault();
    if (login(form.email, form.password, form.role)) navigate("/");
  }

  return (
    <div className="grid min-h-screen bg-medical-50 lg:grid-cols-[1.05fr_0.95fr]">
      <section className="flex items-center justify-center p-6">
        <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-soft">
          <div className="mb-8">
            <div className="mb-4 grid h-12 w-12 place-items-center rounded-lg bg-medical-600 text-white">
              <FiUserCheck />
            </div>
            <h1 className="text-3xl font-extrabold text-slate-950">MediCore HMS</h1>
            <p className="mt-2 text-sm text-slate-600">Sign in with a demo hospital role.</p>
          </div>
          <form className="space-y-4" onSubmit={submit}>
            <label>
              <span className="label">Role</span>
              <select className="field mt-1" value={form.role} onChange={(event) => setForm({ ...form, role: event.target.value })}>
                <option>Doctor</option>
                <option>Admin</option>
                <option>Receptionist</option>
              </select>
            </label>
            <label>
              <span className="label">Email</span>
              <input className="field mt-1" type="email" required value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} />
            </label>
            <label>
              <span className="label">Password</span>
              <input className="field mt-1" type="password" required value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} />
            </label>
            <button className="btn-primary w-full" type="submit"><FiLock /> Login</button>
          </form>
          <div className="mt-6 rounded-lg bg-slate-50 p-4 text-sm text-slate-600">
            {demoUsers.map((item) => (
              <div key={item.email} className="flex justify-between gap-4 py-1">
                <span>{item.role}</span>
                <span className="font-mono text-xs">{item.email}</span>
              </div>
            ))}
            <div className="mt-2 font-semibold">Password: password123</div>
          </div>
        </div>
      </section>
      <section className="hidden bg-[linear-gradient(135deg,#0369a1,#0f766e)] p-10 text-white lg:flex lg:flex-col lg:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-medical-100">Professional medical workspace</p>
          <h2 className="mt-4 max-w-xl text-5xl font-extrabold leading-tight">Patients, billing, rooms, labs, pharmacy, and emergency operations in one place.</h2>
        </div>
        <div className="grid grid-cols-3 gap-4">
          {["LocalStorage persistence", "Role dashboards", "PDF and CSV exports"].map((item) => (
            <div key={item} className="rounded-lg bg-white/12 p-4 text-sm font-semibold backdrop-blur">{item}</div>
          ))}
        </div>
      </section>
    </div>
  );
}
