import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { addDays, format } from "date-fns";
import { loadAuth, loadData, loadTheme, resetData, saveAuth, saveData, saveTheme } from "../utils/storage";

const AppContext = createContext(null);

const demoUsers = [
  { email: "admin@hospital.com", password: "password123", role: "Admin", name: "Hospital Admin" },
  { email: "doctor@hospital.com", password: "password123", role: "Doctor", name: "Dr. Demo User" },
  { email: "receptionist@hospital.com", password: "password123", role: "Receptionist", name: "Reception Desk" }
];

const idPrefixes = {
  patients: "PAT",
  doctors: "DOC",
  appointments: "APT",
  prescriptions: "RX",
  bills: "BILL",
  rooms: "BED",
  labTests: "LAB",
  medicines: "MED",
  ambulances: "AMB",
  activities: "ACT"
};

function nextId(collection, existing) {
  const prefix = idPrefixes[collection] || "REC";
  const next = existing.length + 1001;
  return `${prefix}-${next}`;
}

function makeId() {
  if (typeof crypto !== "undefined" && crypto.randomUUID) return crypto.randomUUID();
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export function AppProvider({ children }) {
  const [data, setData] = useState(loadData);
  const [user, setUser] = useState(loadAuth);
  const [theme, setTheme] = useState(loadTheme);
  const [toasts, setToasts] = useState([]);
  const [confirmState, setConfirmState] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 450);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    saveData(data);
  }, [data]);

  useEffect(() => {
    saveAuth(user);
  }, [user]);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    saveTheme(theme);
  }, [theme]);

  function toast(message, type = "success") {
    const id = makeId();
    setToasts((items) => [...items, { id, message, type }]);
    setTimeout(() => setToasts((items) => items.filter((item) => item.id !== id)), 3200);
  }

  function login(email, password, role) {
    const found = demoUsers.find((item) => item.email === email && item.password === password && item.role === role);
    if (!found) {
      toast("Invalid demo credentials for the selected role.", "error");
      return false;
    }
    setUser({ email: found.email, role: found.role, name: found.name });
    toast(`Welcome, ${found.name}.`);
    return true;
  }

  function logout() {
    setUser(null);
    toast("Signed out successfully.");
  }

  function addActivity(text, type = "System") {
    setData((current) => ({
      ...current,
      activities: [
        { id: nextId("activities", current.activities), text, type, date: format(new Date(), "yyyy-MM-dd") },
        ...current.activities
      ].slice(0, 20)
    }));
  }

  function createItem(collection, item, label = "Record") {
    setData((current) => {
      const created = { id: item.id || nextId(collection, current[collection]), ...item };
      return { ...current, [collection]: [created, ...current[collection]] };
    });
    addActivity(`${label} created`, label);
    toast(`${label} created successfully.`);
  }

  function updateItem(collection, id, patch, label = "Record") {
    setData((current) => ({
      ...current,
      [collection]: current[collection].map((item) => (item.id === id ? { ...item, ...patch } : item))
    }));
    addActivity(`${label} ${id} updated`, label);
    toast(`${label} updated successfully.`);
  }

  function deleteItem(collection, id, label = "Record") {
    setData((current) => ({
      ...current,
      [collection]: current[collection].filter((item) => item.id !== id)
    }));
    addActivity(`${label} ${id} deleted`, label);
    toast(`${label} deleted successfully.`);
  }

  function askConfirm(options) {
    setConfirmState(options);
  }

  function confirmAction() {
    confirmState?.onConfirm?.();
    setConfirmState(null);
  }

  function seedFreshData() {
    setData(resetData());
    toast("Demo data restored.");
  }

  function bookAppointment(payload) {
    const patient = data.patients.find((item) => item.id === payload.patientId);
    const doctor = data.doctors.find((item) => item.id === payload.doctorId);
    createItem(
      "appointments",
      {
        ...payload,
        status: payload.status || "Pending",
        notification: `To: ${patient?.name || "Patient"} | Appointment with ${doctor?.name || "doctor"} on ${payload.date} at ${payload.time}.`
      },
      "Appointment"
    );
  }

  function quickCheckout(room) {
    updateItem("rooms", room.id, { patientId: "", status: "Available", checkOut: format(new Date(), "yyyy-MM-dd") }, "Room");
  }

  function scheduleDefaults() {
    return ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"].map((day) => ({ day, from: "09:00", to: "17:00" }));
  }

  const value = useMemo(
    () => ({
      data,
      user,
      theme,
      toasts,
      confirmState,
      loading,
      demoUsers,
      login,
      logout,
      setTheme,
      toast,
      createItem,
      updateItem,
      deleteItem,
      askConfirm,
      confirmAction,
      cancelConfirm: () => setConfirmState(null),
      seedFreshData,
      bookAppointment,
      quickCheckout,
      scheduleDefaults,
      tomorrow: format(addDays(new Date(), 1), "yyyy-MM-dd")
    }),
    [data, user, theme, toasts, confirmState, loading]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) throw new Error("useApp must be used inside AppProvider");
  return context;
}
