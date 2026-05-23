import { NavLink, Outlet, useLocation } from "react-router-dom";
import {
  FiActivity,
  FiBarChart2,
  FiCalendar,
  FiCreditCard,
  FiFileText,
  FiHome,
  FiLogOut,
  FiMenu,
  FiMoon,
  FiPackage,
  FiPlusCircle,
  FiSun,
  FiTruck,
  FiUsers,
  FiX
} from "react-icons/fi";
import { FaBed, FaFlask, FaUserMd } from "react-icons/fa";
import { useState } from "react";
import { useApp } from "../context/AppContext";

const navItems = [
  { to: "/", label: "Dashboard", icon: FiHome, roles: ["Admin", "Doctor", "Receptionist"] },
  { to: "/patients", label: "Patients", icon: FiUsers, roles: ["Admin", "Doctor", "Receptionist"] },
  { to: "/doctors", label: "Doctors", icon: FaUserMd, roles: ["Admin", "Receptionist"] },
  { to: "/appointments", label: "Appointments", icon: FiCalendar, roles: ["Admin", "Doctor", "Receptionist"] },
  { to: "/prescriptions", label: "Prescriptions", icon: FiFileText, roles: ["Admin", "Doctor"] },
  { to: "/billing", label: "Billing", icon: FiCreditCard, roles: ["Admin", "Receptionist"] },
  { to: "/rooms", label: "Rooms", icon: FaBed, roles: ["Admin", "Receptionist"] },
  { to: "/laboratory", label: "Laboratory", icon: FaFlask, roles: ["Admin", "Doctor", "Receptionist"] },
  { to: "/pharmacy", label: "Pharmacy", icon: FiPackage, roles: ["Admin", "Receptionist"] },
  { to: "/ambulance", label: "Ambulance", icon: FiTruck, roles: ["Admin", "Receptionist"] },
  { to: "/reports", label: "Reports", icon: FiBarChart2, roles: ["Admin"] }
];

const pageTitles = {
  "/": "Hospital Dashboard",
  "/patients": "Patient Management",
  "/doctors": "Doctor Management",
  "/appointments": "Appointment System",
  "/prescriptions": "Prescription Management",
  "/billing": "Billing & Invoices",
  "/rooms": "Room & Bed Management",
  "/laboratory": "Laboratory Management",
  "/pharmacy": "Pharmacy Management",
  "/ambulance": "Ambulance Service",
  "/reports": "Reports & Analytics"
};

export default function Layout() {
  const { user, logout, theme, setTheme } = useApp();
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();
  const visibleNav = navItems.filter((item) => item.roles.includes(user.role));

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-white">
      <aside
        className={`fixed inset-y-0 left-0 z-30 w-72 border-r border-slate-200 bg-white transition-transform dark:border-slate-800 dark:bg-slate-900 lg:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-16 items-center justify-between border-b border-slate-200 px-5 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-lg bg-medical-600 text-white">
              <FiActivity />
            </div>
            <div>
              <div className="font-extrabold">MediCore</div>
              <div className="text-xs text-slate-500">Hospital System</div>
            </div>
          </div>
          <button className="btn-secondary !min-h-9 !px-3 lg:hidden" onClick={() => setOpen(false)}>
            <FiX />
          </button>
        </div>
        <nav className="space-y-1 p-4">
          {visibleNav.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold transition hover:bg-medical-50 hover:text-medical-700 dark:hover:bg-slate-800 ${
                    isActive ? "bg-medical-100 text-medical-700 dark:bg-slate-800 dark:text-medical-100" : "text-slate-600 dark:text-slate-300"
                  }`
                }
              >
                <Icon />
                {item.label}
              </NavLink>
            );
          })}
        </nav>
      </aside>

      {open && <button aria-label="Close menu" className="fixed inset-0 z-20 bg-slate-950/30 lg:hidden" onClick={() => setOpen(false)} />}

      <div className="lg:pl-72">
        <header className="sticky top-0 z-10 border-b border-slate-200 bg-white/90 backdrop-blur dark:border-slate-800 dark:bg-slate-950/90">
          <div className="flex min-h-16 items-center justify-between gap-4 px-4 sm:px-6">
            <div className="flex items-center gap-3">
              <button className="btn-secondary !px-3 lg:hidden" onClick={() => setOpen(true)}><FiMenu /></button>
              <div>
                <h1 className="text-lg font-extrabold sm:text-xl">{pageTitles[pathname] || "MediCore"}</h1>
                <p className="text-xs text-slate-500">{user.role} workspace</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button className="btn-secondary !px-3" onClick={() => setTheme(theme === "dark" ? "light" : "dark")} title="Toggle theme">
                {theme === "dark" ? <FiSun /> : <FiMoon />}
              </button>
              <button className="btn-secondary hidden sm:inline-flex" onClick={logout}><FiLogOut /> Logout</button>
            </div>
          </div>
        </header>
        <main className="p-4 sm:p-6">
          <Outlet />
        </main>
      </div>

      <button
        className="fixed bottom-5 right-5 z-10 rounded-full bg-medical-600 p-4 text-white shadow-soft transition hover:-translate-y-1 hover:bg-medical-700 lg:hidden"
        onClick={() => setOpen(true)}
        aria-label="Open navigation"
      >
        <FiPlusCircle />
      </button>
    </div>
  );
}
