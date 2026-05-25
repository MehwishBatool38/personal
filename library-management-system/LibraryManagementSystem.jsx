import React, { useState, useEffect, useContext, createContext, useCallback } from "react";

// ─── CONTEXTS ────────────────────────────────────────────────────────────────
const AuthContext = createContext(null);
const ThemeContext = createContext(null);
const ToastContext = createContext(null);

// ─── MOCK DATA ────────────────────────────────────────────────────────────────
const MOCK_USERS = [
  { id: "S001", name: "Ahmed Raza", email: "ahmed@uni.edu", password: "123456", role: "student", studentId: "2021-CS-001", department: null, avatar: "AR", blocked: false, approved: true, registered: "2024-01-15" },
  { id: "S002", name: "Fatima Khan", email: "fatima@uni.edu", password: "123456", role: "student", studentId: "2021-EE-045", department: null, avatar: "FK", blocked: false, approved: true, registered: "2024-01-20" },
  { id: "S003", name: "Usman Ali", email: "usman@uni.edu", password: "123456", role: "student", studentId: "2022-ME-012", department: null, avatar: "UA", blocked: false, approved: false, registered: "2024-03-10" },
  { id: "T001", name: "Dr. Sara Malik", email: "sara@uni.edu", password: "123456", role: "teacher", facultyId: "FAC-2019-05", department: "Computer Science", avatar: "SM", blocked: false, approved: true, registered: "2023-08-01" },
  { id: "T002", name: "Prof. Bilal Ahmed", email: "bilal@uni.edu", password: "123456", role: "teacher", facultyId: "FAC-2018-11", department: "Physics", avatar: "BA", blocked: false, approved: true, registered: "2023-08-01" },
  { id: "L001", name: "Mr. Khalid Librarian", email: "librarian@library.com", password: "admin123", role: "librarian", avatar: "KL", blocked: false, approved: true, registered: "2023-01-01" },
];

const MOCK_BOOKS = [
  { id: "B001", isbn: "978-0-13-110362-7", title: "The C Programming Language", author: "Kernighan & Ritchie", publisher: "Prentice Hall", year: 1988, genre: "Computer Science", totalCopies: 5, availableCopies: 3, shelf: "CS-A1", description: "The definitive guide to C programming by its creators. Essential reading for every programmer.", cover: "💻", featured: true },
  { id: "B002", isbn: "978-0-13-468599-1", title: "Clean Code", author: "Robert C. Martin", publisher: "Prentice Hall", year: 2008, genre: "Computer Science", totalCopies: 4, availableCopies: 2, shelf: "CS-A2", description: "A handbook of agile software craftsmanship with practical advice on writing maintainable code.", cover: "🧹", featured: true },
  { id: "B003", isbn: "978-0-7432-7356-5", title: "Sapiens", author: "Yuval Noah Harari", publisher: "Harper", year: 2011, genre: "History", totalCopies: 6, availableCopies: 4, shelf: "HIS-B3", description: "A brief history of humankind from ancient times to the present day.", cover: "🌍", featured: true },
  { id: "B004", isbn: "978-0-06-112008-4", title: "To Kill a Mockingbird", author: "Harper Lee", publisher: "HarperCollins", year: 1960, genre: "Fiction", totalCopies: 8, availableCopies: 5, shelf: "FIC-C1", description: "A Pulitzer Prize-winning novel about racial injustice and the loss of innocence in the American South.", cover: "📖", featured: false },
  { id: "B005", isbn: "978-0-14-028329-7", title: "1984", author: "George Orwell", publisher: "Penguin", year: 1949, genre: "Fiction", totalCopies: 7, availableCopies: 1, shelf: "FIC-C2", description: "A dystopian novel set in a totalitarian society controlled by Big Brother.", cover: "👁️", featured: true },
  { id: "B006", isbn: "978-0-19-953556-9", title: "A Brief History of Time", author: "Stephen Hawking", publisher: "Bantam", year: 1988, genre: "Science", totalCopies: 5, availableCopies: 3, shelf: "SCI-D1", description: "An exploration of cosmology, black holes, and the nature of time for general readers.", cover: "🔭", featured: true },
  { id: "B007", isbn: "978-0-13-235088-4", title: "Introduction to Algorithms", author: "Cormen et al.", publisher: "MIT Press", year: 2009, genre: "Computer Science", totalCopies: 3, availableCopies: 0, shelf: "CS-A3", description: "The comprehensive textbook covering algorithms and data structures.", cover: "⚡", featured: false },
  { id: "B008", isbn: "978-0-7432-7357-2", title: "Atomic Habits", author: "James Clear", publisher: "Avery", year: 2018, genre: "Self-Help", totalCopies: 6, availableCopies: 4, shelf: "SH-E1", description: "Proven strategies for building good habits and breaking bad ones.", cover: "⚛️", featured: true },
  { id: "B009", isbn: "978-0-394-74242-0", title: "The Great Gatsby", author: "F. Scott Fitzgerald", publisher: "Scribner", year: 1925, genre: "Fiction", totalCopies: 5, availableCopies: 3, shelf: "FIC-C3", description: "A tale of wealth, ambition, and the American Dream in the Jazz Age.", cover: "🥂", featured: false },
  { id: "B010", isbn: "978-0-06-093546-9", title: "Thinking, Fast and Slow", author: "Daniel Kahneman", publisher: "Farrar", year: 2011, genre: "Psychology", totalCopies: 4, availableCopies: 2, shelf: "PSY-F1", description: "An exploration of the two systems of thinking that drive our choices.", cover: "🧠", featured: false },
  { id: "B011", isbn: "978-0-12-374780-0", title: "Physics of the Impossible", author: "Michio Kaku", publisher: "Doubleday", year: 2008, genre: "Science", totalCopies: 3, availableCopies: 2, shelf: "SCI-D2", description: "A fascinating exploration of technologies once thought impossible.", cover: "🚀", featured: false },
  { id: "B012", isbn: "978-0-14-303943-3", title: "The Alchemist", author: "Paulo Coelho", publisher: "HarperOne", year: 1988, genre: "Fiction", totalCopies: 9, availableCopies: 6, shelf: "FIC-C4", description: "A philosophical novel about a young shepherd's journey to find treasure.", cover: "✨", featured: true },
];

const MOCK_TRANSACTIONS = [
  { id: "TR001", bookId: "B001", userId: "S001", bookTitle: "The C Programming Language", userName: "Ahmed Raza", issueDate: "2026-05-12", dueDate: "2026-06-08", returnDate: null, status: "borrowed", fine: 0, renewCount: 0 },
  { id: "TR002", bookId: "B005", userId: "S001", bookTitle: "1984", userName: "Ahmed Raza", issueDate: "2026-04-20", dueDate: "2026-05-04", returnDate: null, status: "overdue", fine: 105, renewCount: 0 },
  { id: "TR003", bookId: "B003", userId: "S001", bookTitle: "Sapiens", userName: "Ahmed Raza", issueDate: "2026-03-01", dueDate: "2026-03-15", returnDate: "2026-03-14", status: "returned", fine: 0, renewCount: 0 },
  { id: "TR004", bookId: "B002", userId: "T001", bookTitle: "Clean Code", userName: "Dr. Sara Malik", issueDate: "2026-05-01", dueDate: "2026-06-01", returnDate: null, status: "borrowed", fine: 0, renewCount: 1 },
  { id: "TR005", bookId: "B006", userId: "S002", bookTitle: "A Brief History of Time", userName: "Fatima Khan", issueDate: "2026-04-10", dueDate: "2026-04-24", returnDate: null, status: "overdue", fine: 155, renewCount: 0 },
  { id: "TR006", bookId: "B007", userId: "T001", bookTitle: "Introduction to Algorithms", userName: "Dr. Sara Malik", issueDate: "2026-05-05", dueDate: "2026-06-04", returnDate: null, status: "borrowed", fine: 0, renewCount: 0 },
  { id: "TR007", bookId: "B008", userId: "S002", bookTitle: "Atomic Habits", userName: "Fatima Khan", issueDate: "2026-04-28", dueDate: "2026-05-12", returnDate: "2026-05-12", status: "returned", fine: 0, renewCount: 0 },
];

const MOCK_FINES = [
  { id: "F001", userId: "S001", userName: "Ahmed Raza", bookTitle: "1984", amount: 105, daysOverdue: 21, status: "pending", transactionId: "TR002" },
  { id: "F002", userId: "S002", userName: "Fatima Khan", bookTitle: "A Brief History of Time", amount: 155, daysOverdue: 31, status: "pending", transactionId: "TR005" },
  { id: "F003", userId: "S001", userName: "Ahmed Raza", bookTitle: "Thinking Fast", amount: 25, daysOverdue: 5, status: "paid", transactionId: "TR008" },
];

const GENRES = ["All", "Computer Science", "Fiction", "History", "Science", "Self-Help", "Psychology", "Mathematics", "Engineering", "Literature"];
const FINE_PER_DAY = 5;
const STUDENT_BOOK_LIMIT = 3;
const TEACHER_BOOK_LIMIT = 10;
const STUDENT_LOAN_DAYS = 14;
const TEACHER_LOAN_DAYS = 30;

// ─── UTILITIES ───────────────────────────────────────────────────────────────
const today = new Date();
today.setHours(0, 0, 0, 0);

const storage = {
  read(key, fallback) {
    if (typeof window === "undefined") return fallback;
    try {
      const saved = window.localStorage.getItem(key);
      return saved ? JSON.parse(saved) : fallback;
    } catch {
      return fallback;
    }
  },
  write(key, value) {
    if (typeof window === "undefined") return;
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // Local storage can be unavailable in private browsing; the app still works in memory.
    }
  },
};

function useStoredState(key, fallback) {
  const [value, setValue] = useState(() => storage.read(key, fallback));
  useEffect(() => storage.write(key, value), [key, value]);
  return [value, setValue];
}

const calcFine = (dueDate) => {
  const due = new Date(dueDate);
  const diff = Math.floor((today - due) / (1000 * 60 * 60 * 24));
  return diff > 0 ? diff * FINE_PER_DAY : 0;
};

const formatDate = (d) => {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("en-PK", { day: "2-digit", month: "short", year: "numeric" });
};

const daysLeft = (dueDate) => {
  const due = new Date(dueDate);
  const diff = Math.ceil((due - today) / (1000 * 60 * 60 * 24));
  return diff;
};

// ─── TOAST SYSTEM ─────────────────────────────────────────────────────────────
function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const addToast = useCallback((msg, type = "success") => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, msg, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3500);
  }, []);
  return (
    <ToastContext.Provider value={addToast}>
      {children}
      <div style={{ position: "fixed", bottom: 24, right: 24, zIndex: 9999, display: "flex", flexDirection: "column", gap: 10 }}>
        {toasts.map(t => (
          <div key={t.id} style={{
            background: t.type === "success" ? "#0f766e" : t.type === "error" ? "#b91c1c" : t.type === "warning" ? "#b45309" : "#1d4ed8",
            color: "#fff", padding: "12px 20px", borderRadius: 10, fontSize: 14, fontFamily: "'Crimson Pro', serif",
            boxShadow: "0 4px 20px rgba(0,0,0,0.3)", minWidth: 260, animation: "slideUp 0.3s ease",
            display: "flex", alignItems: "center", gap: 10
          }}>
            <span>{t.type === "success" ? "✓" : t.type === "error" ? "✗" : "!"}</span>
            {t.msg}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

// ─── MAIN APP ─────────────────────────────────────────────────────────────────
export default function App() {
  const [dark, setDark] = useStoredState("libraryms:dark-mode", false);
  const [user, setUser] = useState(null);
  const [view, setView] = useState("landing"); // landing, login, student, teacher, librarian
  const [users, setUsers] = useStoredState("libraryms:users", MOCK_USERS);
  const [books, setBooks] = useStoredState("libraryms:books", MOCK_BOOKS);
  const [transactions, setTransactions] = useStoredState("libraryms:transactions", MOCK_TRANSACTIONS);
  const [fines, setFines] = useStoredState("libraryms:fines", MOCK_FINES);
  const [loginRole, setLoginRole] = useState("student");

  const theme = {
    dark,
    bg: dark ? "#10170e" : "#f6faee",
    surface: dark ? "#172014" : "#ffffff",
    surface2: dark ? "#21311b" : "#eef7df",
    border: dark ? "#32472a" : "#dcecc5",
    text: dark ? "#eff7e9" : "#263326",
    textMuted: dark ? "#a6b898" : "#718363",
    accent: dark ? "#a8d875" : "#79a957",
    accentStrong: dark ? "#8fbd5f" : "#5f8f45",
    accentSoft: dark ? "rgba(168,216,117,0.16)" : "rgba(121,169,87,0.14)",
    accentBorder: dark ? "rgba(168,216,117,0.3)" : "rgba(121,169,87,0.25)",
    accent2: "#d99a36",
    danger: "#ef4444",
    success: "#5f9f64",
    card: dark ? "rgba(23,32,20,0.92)" : "rgba(255,255,255,0.96)",
    brandGradient: dark ? "linear-gradient(135deg,#a8d875,#6f9f4a)" : "linear-gradient(135deg,#9ccf6b,#5f8f45)",
    heroOverlay: dark ? "rgba(16,23,14,0.86)" : "rgba(20,32,16,0.76)",
    heroOverlay2: dark ? "rgba(33,49,27,0.76)" : "rgba(56,83,38,0.58)",
    footer: dark ? "#0f160d" : "#22331c",
  };

  const login = (email, password) => {
    const normalizedEmail = email.trim().toLowerCase();
    return users.find(u => u.email.toLowerCase() === normalizedEmail && u.password === password);
  };

  return (
    <ThemeContext.Provider value={{ theme, setDark }}>
      <AuthContext.Provider value={{ user, setUser, users, setUsers, books, setBooks, transactions, setTransactions, fines, setFines }}>
        <ToastProvider>
          <style>{`
            @import url('https://fonts.googleapis.com/css2?family=Crimson+Pro:ital,wght@0,300;0,400;0,600;0,700;1,400&family=JetBrains+Mono:wght@400;600&family=Syne:wght@400;600;700;800&display=swap');
            * { margin:0; padding:0; box-sizing:border-box; }
            body { font-family:'Crimson Pro',serif; background:${theme.bg}; color:${theme.text}; transition:background 0.3s,color 0.3s; }
            ::-webkit-scrollbar { width:6px; }
            ::-webkit-scrollbar-track { background:${theme.bg}; }
            ::-webkit-scrollbar-thumb { background:${theme.accent}; border-radius:3px; }
            @keyframes slideUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
            @keyframes fadeIn { from{opacity:0} to{opacity:1} }
            @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.5} }
            @keyframes spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
            @keyframes shimmer { 0%{background-position:-200% 0} 100%{background-position:200% 0} }
            .btn { cursor:pointer; border:none; border-radius:8px; font-family:'Syne',sans-serif; font-weight:600; transition:all 0.2s; }
            .btn:hover { transform:translateY(-1px); box-shadow:0 4px 12px rgba(0,0,0,0.2); }
            .btn:active { transform:translateY(0); }
            .input { background:${theme.surface2}; border:1.5px solid ${theme.border}; color:${theme.text}; border-radius:8px; padding:10px 14px; font-family:'Crimson Pro',serif; font-size:15px; width:100%; outline:none; transition:border 0.2s; }
            .input:focus { border-color:${theme.accent}; }
            .card { background:${theme.card}; border:1px solid ${theme.border}; border-radius:8px; backdrop-filter:blur(10px); }
            .badge { padding:3px 10px; border-radius:20px; font-size:12px; font-family:'JetBrains Mono',monospace; font-weight:600; }
            .shimmer { background:linear-gradient(90deg,${theme.surface} 25%,${theme.surface2} 50%,${theme.surface} 75%); background-size:200% 100%; animation:shimmer 1.5s infinite; border-radius:8px; }
            img { max-width:100%; display:block; }
            table { min-width:720px; }
            .card { overflow-x:auto !important; }
            .portal-actions, .landing-stats, .footer-links { flex-wrap:wrap; }
            @media (max-width: 900px) {
              .landing-nav { padding:16px 24px !important; gap:14px; align-items:flex-start !important; }
              .portal-actions { width:100%; justify-content:flex-start; }
              .landing-hero-content { margin-top:48px !important; }
              .hero-title { font-size:46px !important; line-height:1.08 !important; }
              .landing-stats { display:grid !important; grid-template-columns:repeat(2,minmax(0,1fr)) !important; gap:18px !important; }
              .featured-grid, .portal-grid { grid-template-columns:1fr !important; }
              .library-info, .portal-section, .featured-section { padding:48px 20px !important; }
              .app-shell { flex-direction:column !important; }
              .sidebar { width:100% !important; min-height:auto !important; padding:12px !important; position:sticky; top:0; z-index:20; }
              .sidebar-brand { margin-bottom:12px !important; padding-bottom:12px !important; }
              .sidebar-user { display:none !important; }
              .sidebar-nav { display:flex !important; gap:8px !important; overflow-x:auto !important; padding-bottom:4px; }
              .sidebar-nav button { width:auto !important; white-space:nowrap !important; margin-bottom:0 !important; flex:0 0 auto; }
              .main-shell { overflow:visible !important; }
              .topbar { height:auto !important; min-height:60px; padding:12px 16px !important; flex-wrap:wrap !important; }
              .topbar h1 { flex-basis:100%; }
              .topbar-date { display:none !important; }
              .page-body { padding:16px !important; overflow:visible !important; }
              div[style*="grid-template-columns: 1fr 1fr"],
              div[style*="grid-template-columns: repeat(3,1fr)"] { grid-template-columns:1fr !important; }
            }
            @media (max-width: 560px) {
              .landing-nav { padding:14px 16px !important; }
              .portal-actions .btn { flex:1 1 100%; }
              .hero-title { font-size:38px !important; }
              .landing-stats { grid-template-columns:1fr !important; }
              .login-card { padding:28px 20px !important; }
              .card { width:100%; }
            }
          `}</style>

          {view === "landing" && <LandingPage theme={theme} onLogin={(role) => { setLoginRole(role); setView("login"); }} />}
          {view === "login" && <LoginPage theme={theme} role={loginRole} login={login} onSuccess={(u) => { setUser(u); setView(u.role); }} onBack={() => setView("landing")} onSwitchRole={setLoginRole} />}
          {view === "student" && user?.role === "student" && <StudentPanel theme={theme} onLogout={() => { setUser(null); setView("landing"); }} />}
          {view === "teacher" && user?.role === "teacher" && <TeacherPanel theme={theme} onLogout={() => { setUser(null); setView("landing"); }} />}
          {view === "librarian" && user?.role === "librarian" && <LibrarianPanel theme={theme} onLogout={() => { setUser(null); setView("landing"); }} />}
        </ToastProvider>
      </AuthContext.Provider>
    </ThemeContext.Provider>
  );
}

// ─── LANDING PAGE ─────────────────────────────────────────────────────────────
function LandingPage({ theme: t, onLogin }) {
  const [searchQ, setSearchQ] = useState("");
  const [activeAnnouncement, setActiveAnnouncement] = useState(0);
  const { books } = useContext(AuthContext);
  const featured = books.filter(b => b.featured);

  const announcements = [
    "📚 New arrivals: 50 new books added this week across all genres!",
    "🎓 Semester exam period: Library hours extended to 10 PM",
    "⚠️ Fine amnesty week: 50% off all pending fines until May 31",
    "🔖 Book fair scheduled for June 15 — Nominations open now",
  ];

  useEffect(() => {
    const t = setInterval(() => setActiveAnnouncement(p => (p + 1) % announcements.length), 3500);
    return () => clearInterval(t);
  }, []);

  const filteredSearch = searchQ.length > 1 ? books.filter(b =>
    b.title.toLowerCase().includes(searchQ.toLowerCase()) ||
    b.author.toLowerCase().includes(searchQ.toLowerCase()) ||
    b.genre.toLowerCase().includes(searchQ.toLowerCase())
  ) : [];

  return (
    <div style={{ minHeight: "100vh", background: t.bg }}>
      {/* HERO */}
      <div className="landing-hero" style={{
        background: `linear-gradient(120deg, ${t.heroOverlay}, ${t.heroOverlay2}), url("https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=1800&q=80") center/cover no-repeat`,
        padding: "0 0 80px",
        position: "relative", overflow: "hidden"
      }}>
        {/* Nav */}
        <nav className="landing-nav" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "20px 48px", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ width: 42, height: 42, background: t.brandGradient, borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22 }}>📚</div>
            <div>
              <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: 20, color: "#e2e8f0", letterSpacing: 0 }}>LibraryMS</div>
              <div style={{ fontSize: 11, color: "#c6d8b8", fontFamily: "'JetBrains Mono',monospace" }}>Mishas University</div>
            </div>
          </div>
          <div className="portal-actions" style={{ display: "flex", gap: 10 }}>
            {["Student Login", "Teacher Login", "Admin Login"].map((label, i) => {
              const roles = ["student", "teacher", "librarian"];
              return (
                <button key={i} onClick={() => onLogin(roles[i])} className="btn" style={{
                  background: i === 2 ? t.brandGradient : "rgba(255,255,255,0.09)",
                  color: "#e2e8f0", padding: "9px 18px", fontSize: 13, border: "1px solid rgba(255,255,255,0.1)"
                }}>{label}</button>
              );
            })}
          </div>
        </nav>

        {/* Announcement Ticker */}
        <div style={{ background: "rgba(156,207,107,0.16)", borderBottom: "1px solid rgba(156,207,107,0.28)", padding: "10px 48px", display: "flex", alignItems: "center", gap: 12 }}>
          <span style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: 11, color: "#b7e286", textTransform: "uppercase", letterSpacing: 1, whiteSpace: "nowrap" }}>Notice</span>
          <div style={{ color: "#dce9d2", fontSize: 14, animation: "fadeIn 0.5s ease" }} key={activeAnnouncement}>{announcements[activeAnnouncement]}</div>
        </div>

        {/* Hero Content */}
        <div className="landing-hero-content" style={{ maxWidth: 800, margin: "80px auto 0", textAlign: "center", padding: "0 24px", animation: "fadeIn 0.8s ease" }}>
          <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 12, color: "#b7e286", letterSpacing: 3, marginBottom: 16, textTransform: "uppercase" }}>Est. 1975 · Digital Library System</div>
          <h1 className="hero-title" style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: 64, color: "#f1f5f9", lineHeight: 1.05, marginBottom: 20, letterSpacing: 0 }}>
            Knowledge Without<br /><span style={{ color: "#b7e286" }}>Boundaries</span>
          </h1>
          <p style={{ color: "#94a3b8", fontSize: 18, lineHeight: 1.7, marginBottom: 40, maxWidth: 580, margin: "0 auto 40px" }}>
            Your gateway to 50,000+ books, research papers, and digital resources. Borrow, explore, and discover — all in one place.
          </p>

          {/* Search */}
          <div style={{ position: "relative", maxWidth: 560, margin: "0 auto" }}>
            <input
              className="input"
              placeholder="Search books, authors, genres..."
              value={searchQ}
              onChange={e => setSearchQ(e.target.value)}
              style={{ padding: "16px 20px 16px 50px", fontSize: 16, background: "rgba(255,255,255,0.07)", border: "1.5px solid rgba(255,255,255,0.12)", color: "#e2e8f0", borderRadius: 12 }}
            />
            <span style={{ position: "absolute", left: 16, top: "50%", transform: "translateY(-50%)", fontSize: 20 }}>🔍</span>
            {filteredSearch.length > 0 && (
              <div style={{ position: "absolute", top: "110%", left: 0, right: 0, background: t.surface, border: `1px solid ${t.border}`, borderRadius: 12, zIndex: 100, overflow: "hidden" }}>
                {filteredSearch.slice(0, 5).map(b => (
                  <div key={b.id} style={{ padding: "12px 16px", display: "flex", alignItems: "center", gap: 12, borderBottom: `1px solid ${t.border}`, cursor: "pointer" }}
                    onMouseEnter={e => e.currentTarget.style.background = t.surface2}
                    onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                    <span style={{ fontSize: 24 }}>{b.cover}</span>
                    <div style={{ textAlign: "left" }}>
                      <div style={{ color: "#e2e8f0", fontWeight: 600, fontSize: 14 }}>{b.title}</div>
                      <div style={{ color: "#64748b", fontSize: 12 }}>{b.author} · {b.genre}</div>
                    </div>
                    <span style={{ marginLeft: "auto", fontSize: 11, color: b.availableCopies > 0 ? "#10b981" : "#ef4444" }}>
                      {b.availableCopies > 0 ? `${b.availableCopies} available` : "Unavailable"}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Stats */}
          <div className="landing-stats" style={{ display: "flex", justifyContent: "center", gap: 40, marginTop: 60 }}>
            {[["50,000+", "Books"], ["12,000+", "Students"], ["98%", "Satisfaction"], ["24/7", "Digital Access"]].map(([v, l]) => (
              <div key={l} style={{ textAlign: "center" }}>
                <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: 28, color: "#b7e286" }}>{v}</div>
                <div style={{ fontSize: 13, color: "#c6d8b8" }}>{l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* FEATURED BOOKS */}
      <div className="featured-section" style={{ padding: "80px 48px", background: t.bg }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <SectionHeader title="Featured Books" subtitle="New arrivals and most borrowed this month" />
          <div className="featured-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(200px,1fr))", gap: 20, marginTop: 32 }}>
            {featured.map(b => (
              <div key={b.id} className="card" style={{ padding: 20, transition: "transform 0.2s, box-shadow 0.2s", cursor: "pointer" }}
                onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = "0 8px 24px rgba(121,169,87,0.18)"; }}
                onMouseLeave={e => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = ""; }}>
                <div style={{ fontSize: 48, textAlign: "center", marginBottom: 12, background: t.surface2, borderRadius: 12, padding: "20px 0" }}>{b.cover}</div>
                <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: 14, color: t.text, marginBottom: 4, lineHeight: 1.3 }}>{b.title}</div>
                <div style={{ fontSize: 13, color: t.textMuted, marginBottom: 10 }}>{b.author}</div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span className="badge" style={{ background: t.surface2, color: t.accent }}>{b.genre}</span>
                  <span style={{ fontSize: 12, color: b.availableCopies > 0 ? t.success : t.danger, fontFamily: "'JetBrains Mono',monospace" }}>
                    {b.availableCopies}/{b.totalCopies}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* LIBRARY INFO */}
      <div className="library-info" style={{ background: t.surface, borderTop: `1px solid ${t.border}`, borderBottom: `1px solid ${t.border}`, padding: "64px 48px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: 32 }}>
          <InfoCard icon="🕐" title="Library Hours" lines={["Mon–Fri: 8:00 AM – 10:00 PM", "Saturday: 9:00 AM – 6:00 PM", "Sunday: 10:00 AM – 4:00 PM", "Holidays: Closed"]} theme={t} />
          <InfoCard icon="📋" title="Library Rules" lines={["• Maintain silence in reading areas", "• Return books by due date", "• No food or drinks near books", "• Max 3 books for students (10 for faculty)"]} theme={t} />
          <InfoCard icon="📞" title="Contact Us" lines={["📍 Main Campus, Block-C", "📞 +92-42-9231-4567", "✉️ library@mishas.edu", "💬 Live chat available weekdays"]} theme={t} />
        </div>
      </div>

      {/* LOGIN PORTALS */}
      <div className="portal-section" style={{ padding: "80px 48px" }}>
        <div style={{ maxWidth: 800, margin: "0 auto", textAlign: "center" }}>
          <SectionHeader title="Access Your Portal" subtitle="Choose your role to sign in" />
          <div className="portal-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 20, marginTop: 36 }}>
            {[
              { role: "student", icon: "🎓", label: "Student Portal", desc: "Borrow books, track fines, manage your reading" },
              { role: "teacher", icon: "👩‍🏫", label: "Faculty Portal", desc: "Extended limits, reserve books, recommend titles" },
              { role: "librarian", icon: "🔑", label: "Admin Panel", desc: "Manage library, users, reports, and settings" },
            ].map(({ role, icon, label, desc }) => (
              <div key={role} onClick={() => onLogin(role)} className="card" style={{
                padding: 28, cursor: "pointer", transition: "all 0.2s", textAlign: "center",
                border: `1px solid ${t.border}`
              }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = t.accent; e.currentTarget.style.transform = "translateY(-4px)"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = t.border; e.currentTarget.style.transform = ""; }}>
                <div style={{ fontSize: 40, marginBottom: 12 }}>{icon}</div>
                <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: 16, color: t.text, marginBottom: 8 }}>{label}</div>
                <div style={{ fontSize: 13, color: t.textMuted, lineHeight: 1.5 }}>{desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <footer style={{ background: t.footer, color: "#c6d8b8", textAlign: "center", padding: "32px 24px", fontSize: 13, borderTop: "1px solid rgba(198,216,184,0.18)" }}>
        <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, color: "#b7e286", marginBottom: 6, fontSize: 16 }}>LibraryMS · Mishas University</div>
        <div>© 2025 All rights reserved · Built with React & Node.js · v2.5.0</div>
        <div className="footer-links" style={{ marginTop: 8, display: "flex", justifyContent: "center", gap: 20 }}>
          {["Privacy Policy", "Terms of Service", "Help Center", "Report Issue"].map(l => (
            <span key={l} style={{ cursor: "pointer", color: "#aabd9b" }} onMouseEnter={e => e.target.style.color = "#d7f3b7"} onMouseLeave={e => e.target.style.color = "#aabd9b"}>{l}</span>
          ))}
        </div>
      </footer>
    </div>
  );
}

function InfoCard({ icon, title, lines, theme: t }) {
  return (
    <div className="card" style={{ padding: 28 }}>
      <div style={{ fontSize: 28, marginBottom: 12 }}>{icon}</div>
      <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: 16, color: t.text, marginBottom: 12 }}>{title}</div>
      {lines.map((l, i) => <div key={i} style={{ color: t.textMuted, fontSize: 14, marginBottom: 6, lineHeight: 1.5 }}>{l}</div>)}
    </div>
  );
}

// ─── LOGIN PAGE ───────────────────────────────────────────────────────────────
function LoginPage({ theme: t, role, login, onSuccess, onBack, onSwitchRole }) {
  const addToast = useContext(ToastContext);
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [tab, setTab] = useState("login");

  const hints = {
    student: { email: "ahmed@uni.edu", pass: "123456", icon: "🎓", label: "Student" },
    teacher: { email: "sara@uni.edu", pass: "123456", icon: "👩‍🏫", label: "Faculty" },
    librarian: { email: "librarian@library.com", pass: "admin123", icon: "🔑", label: "Librarian" },
  };

  const handleLogin = () => {
    if (!email || !pass) { addToast("Please fill in all fields", "error"); return; }
    setLoading(true);
    setTimeout(() => {
      const user = login(email, pass);
      if (user) {
        if (user.role !== role) {
          addToast("Wrong portal! Please use the correct login.", "error");
          setLoading(false); return;
        }
        if (user.blocked) {
          addToast("This account is blocked. Please contact the librarian.", "error");
          setLoading(false); return;
        }
        if (!user.approved) {
          addToast("Your registration is still pending approval.", "warning");
          setLoading(false); return;
        }
        addToast(`Welcome back, ${user.name}! 👋`, "success");
        onSuccess(user);
      } else {
        addToast("Invalid credentials. Please try again.", "error");
        setLoading(false);
      }
    }, 900);
  };

  const h = hints[role];

  return (
    <div style={{ minHeight: "100vh", background: t.bg, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 24 }}>
      <button onClick={onBack} className="btn" style={{ position: "fixed", top: 20, left: 20, background: "rgba(255,255,255,0.07)", color: t.text, padding: "8px 16px", fontSize: 14, border: `1px solid ${t.border}` }}>← Back</button>

      <div className="card login-card" style={{ width: "100%", maxWidth: 420, padding: 40, animation: "slideUp 0.4s ease" }}>
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div style={{ fontSize: 48, marginBottom: 8 }}>{h.icon}</div>
          <h2 style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: 26, color: t.text }}>{h.label} Portal</h2>
          <p style={{ color: t.textMuted, fontSize: 14, marginTop: 4 }}>Mishas University Library Management System</p>
        </div>

        {/* Tab: Login / Register */}
        {role !== "librarian" && (
          <div style={{ display: "flex", background: t.surface2, borderRadius: 10, padding: 4, marginBottom: 24 }}>
            {["login", "register"].map(tb => (
              <button key={tb} onClick={() => setTab(tb)} className="btn" style={{
                flex: 1, padding: "9px 0", fontSize: 14, textTransform: "capitalize",
                background: tab === tb ? t.accent : "transparent", color: tab === tb ? "#fff" : t.textMuted,
              }}>{tb}</button>
            ))}
          </div>
        )}

        {tab === "login" ? (
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div>
              <label style={{ fontSize: 13, color: t.textMuted, display: "block", marginBottom: 6, fontFamily: "'Syne',sans-serif", fontWeight: 600 }}>Email Address</label>
              <input className="input" placeholder={`e.g. ${h.email}`} value={email} onChange={e => setEmail(e.target.value)} type="email" />
            </div>
            <div>
              <label style={{ fontSize: 13, color: t.textMuted, display: "block", marginBottom: 6, fontFamily: "'Syne',sans-serif", fontWeight: 600 }}>Password</label>
              <div style={{ position: "relative" }}>
                <input className="input" placeholder="Enter your password" value={pass} onChange={e => setPass(e.target.value)} type={showPass ? "text" : "password"} onKeyDown={e => e.key === "Enter" && handleLogin()} />
                <button onClick={() => setShowPass(!showPass)} style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: t.textMuted }}>{showPass ? "🙈" : "👁️"}</button>
              </div>
            </div>

            {/* Quick fill hint */}
            <div style={{ background: t.surface2, borderRadius: 8, padding: "10px 14px", fontSize: 13, color: t.textMuted, display: "flex", alignItems: "center", gap: 8 }}>
              <span>💡</span>
              <span>Demo: <code style={{ color: t.accent }}>{h.email}</code> / <code style={{ color: t.accent }}>{h.pass}</code></span>
              <button onClick={() => { setEmail(h.email); setPass(h.pass); }} className="btn" style={{ marginLeft: "auto", background: t.accent, color: "#fff", padding: "4px 10px", fontSize: 11 }}>Fill</button>
            </div>

            <button onClick={handleLogin} className="btn" disabled={loading} style={{
              background: t.brandGradient, color: "#fff", padding: "13px 0",
              fontSize: 15, fontFamily: "'Syne',sans-serif", opacity: loading ? 0.7 : 1, marginTop: 4
            }}>
              {loading ? "Signing in..." : "Sign In →"}
            </button>

            <div style={{ display: "flex", justifyContent: "space-between" }}>
              {["student", "teacher", "librarian"].filter(r => r !== role).map(r => (
                <button key={r} onClick={() => onSwitchRole(r)} style={{ background: "none", border: "none", color: t.accent, fontSize: 13, cursor: "pointer", textDecoration: "underline" }}>
                  {r.charAt(0).toUpperCase() + r.slice(1)} Login
                </button>
              ))}
            </div>
          </div>
        ) : (
          <RegisterForm theme={t} role={role} />
        )}
      </div>
    </div>
  );
}

function RegisterForm({ theme: t, role }) {
  const addToast = useContext(ToastContext);
  const { users, setUsers } = useContext(AuthContext);
  const [form, setForm] = useState({ name: "", email: "", id: "", dept: "", pass: "", confirm: "" });

  const handleRegister = () => {
    if (!form.name || !form.email || !form.id || !form.pass) { addToast("Please fill all required fields", "error"); return; }
    if (role === "teacher" && !form.dept) { addToast("Department is required for faculty registration", "error"); return; }
    if (form.pass.length < 6) { addToast("Password must be at least 6 characters", "error"); return; }
    if (form.pass !== form.confirm) { addToast("Passwords do not match", "error"); return; }
    const normalizedEmail = form.email.trim().toLowerCase();
    const normalizedId = form.id.trim().toLowerCase();
    const duplicate = users.some(u =>
      u.email.toLowerCase() === normalizedEmail ||
      u.studentId?.toLowerCase() === normalizedId ||
      u.facultyId?.toLowerCase() === normalizedId
    );
    if (duplicate) { addToast("An account with this email or ID already exists", "error"); return; }

    const initials = form.name.trim().split(/\s+/).map(part => part[0]).join("").slice(0, 2).toUpperCase() || "U";
    const newUser = {
      id: `${role === "student" ? "S" : "T"}${Date.now()}`,
      name: form.name.trim(),
      email: normalizedEmail,
      password: form.pass,
      role,
      studentId: role === "student" ? form.id.trim() : undefined,
      facultyId: role === "teacher" ? form.id.trim() : undefined,
      department: role === "teacher" ? form.dept.trim() : null,
      avatar: initials,
      blocked: false,
      approved: false,
      registered: today.toISOString().split("T")[0],
    };

    setUsers(prev => [...prev, newUser]);
    setForm({ name: "", email: "", id: "", dept: "", pass: "", confirm: "" });
    addToast("Registration submitted! Awaiting librarian approval. ✅", "success");
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      {[
        { key: "name", label: "Full Name", ph: "Your full name" },
        { key: "email", label: "Email", ph: "your@email.edu" },
        { key: "id", label: role === "student" ? "Student ID" : "Faculty ID", ph: role === "student" ? "2021-CS-001" : "FAC-2023-01" },
        ...(role === "teacher" ? [{ key: "dept", label: "Department", ph: "Computer Science" }] : []),
        { key: "pass", label: "Password", ph: "Minimum 6 characters" },
        { key: "confirm", label: "Confirm Password", ph: "Re-enter password" },
      ].map(f => (
        <div key={f.key}>
          <label style={{ fontSize: 13, color: t.textMuted, display: "block", marginBottom: 4, fontFamily: "'Syne',sans-serif", fontWeight: 600 }}>{f.label}</label>
          <input className="input" type={f.key.includes("pass") || f.key === "confirm" ? "password" : "text"} placeholder={f.ph} value={form[f.key]} onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))} />
        </div>
      ))}
      <button onClick={handleRegister} className="btn" style={{ background: t.brandGradient, color: "#fff", padding: "13px 0", fontSize: 15, marginTop: 4 }}>
        Submit Registration
      </button>
    </div>
  );
}

// ─── SHARED COMPONENTS ────────────────────────────────────────────────────────
function SectionHeader({ title, subtitle, action }) {
  const { theme: t } = useContext(ThemeContext);
  return (
    <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: 4 }}>
      <div>
        <h2 style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: 26, color: t.text }}>{title}</h2>
        {subtitle && <p style={{ color: t.textMuted, fontSize: 14, marginTop: 4 }}>{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

function StatCard({ icon, label, value, sub, color, theme: t }) {
  return (
    <div className="card" style={{ padding: 22, borderLeft: `3px solid ${color || t.accent}` }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <div style={{ fontSize: 12, color: t.textMuted, fontFamily: "'Syne',sans-serif", fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 6 }}>{label}</div>
          <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: 32, color: t.text }}>{value}</div>
          {sub && <div style={{ fontSize: 12, color: t.textMuted, marginTop: 4 }}>{sub}</div>}
        </div>
        <div style={{ fontSize: 36, opacity: 0.8 }}>{icon}</div>
      </div>
    </div>
  );
}

function BookCard({ book, onBorrow, theme: t, showBorrow = true }) {
  const [expanded, setExpanded] = useState(false);
  return (
    <div className="card" style={{ padding: 18, transition: "all 0.2s", cursor: "pointer" }}
      onMouseEnter={e => e.currentTarget.style.transform = "translateY(-2px)"}
      onMouseLeave={e => e.currentTarget.style.transform = ""}
      onClick={() => setExpanded(!expanded)}>
      <div style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
        <div style={{ fontSize: 40, background: t.surface2, borderRadius: 10, width: 60, height: 70, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{book.cover}</div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: 15, color: t.text, marginBottom: 3, lineHeight: 1.3 }}>{book.title}</div>
          <div style={{ fontSize: 13, color: t.textMuted, marginBottom: 6 }}>{book.author} · {book.year}</div>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            <span className="badge" style={{ background: t.surface2, color: t.accent }}>{book.genre}</span>
            <span className="badge" style={{ background: book.availableCopies > 0 ? "rgba(16,185,129,0.15)" : "rgba(239,68,68,0.15)", color: book.availableCopies > 0 ? t.success : t.danger }}>
              {book.availableCopies > 0 ? `${book.availableCopies} available` : "Unavailable"}
            </span>
          </div>
        </div>
      </div>
      {expanded && (
        <div style={{ marginTop: 14, paddingTop: 14, borderTop: `1px solid ${t.border}`, animation: "fadeIn 0.2s ease" }}>
          <p style={{ fontSize: 14, color: t.textMuted, lineHeight: 1.6, marginBottom: 10 }}>{book.description}</p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6, fontSize: 13, marginBottom: showBorrow ? 12 : 0 }}>
            {[["ISBN", book.isbn], ["Publisher", book.publisher], ["Shelf", book.shelf], ["Total Copies", book.totalCopies]].map(([k, v]) => (
              <div key={k}><span style={{ color: t.textMuted }}>{k}: </span><span style={{ color: t.text, fontFamily: "'JetBrains Mono',monospace" }}>{v}</span></div>
            ))}
          </div>
          {showBorrow && onBorrow && (
            <button onClick={(e) => { e.stopPropagation(); onBorrow(book); }} className="btn" disabled={book.availableCopies === 0}
              style={{ background: book.availableCopies > 0 ? t.brandGradient : t.surface2, color: book.availableCopies > 0 ? "#fff" : t.textMuted, padding: "9px 20px", fontSize: 14, width: "100%" }}>
              {book.availableCopies > 0 ? "📤 Borrow This Book" : "⏳ Join Waitlist"}
            </button>
          )}
        </div>
      )}
    </div>
  );
}

function Sidebar({ items, active, setActive, theme: t, user }) {
  return (
    <div className="sidebar" style={{ width: 240, minHeight: "100vh", background: t.surface, borderRight: `1px solid ${t.border}`, padding: 20, display: "flex", flexDirection: "column", flexShrink: 0 }}>
      <div className="sidebar-brand" style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 32, paddingBottom: 20, borderBottom: `1px solid ${t.border}` }}>
        <div style={{ width: 38, height: 38, background: t.brandGradient, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>📚</div>
        <div>
          <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: 16, color: t.text }}>LibraryMS</div>
          <div style={{ fontSize: 11, color: t.textMuted, fontFamily: "'JetBrains Mono',monospace" }}>{user?.role}</div>
        </div>
      </div>

      {/* User info */}
      <div className="sidebar-user" style={{ display: "flex", alignItems: "center", gap: 10, background: t.surface2, borderRadius: 10, padding: "10px 12px", marginBottom: 24 }}>
        <div style={{ width: 34, height: 34, background: t.brandGradient, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: 12, color: "#fff" }}>{user?.avatar}</div>
        <div style={{ overflow: "hidden" }}>
          <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: 13, color: t.text, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{user?.name}</div>
          <div style={{ fontSize: 11, color: t.textMuted }}>{user?.email}</div>
        </div>
      </div>

      <nav className="sidebar-nav" style={{ flex: 1 }}>
        {items.map(({ key, icon, label, badge }) => (
          <button key={key} onClick={() => setActive(key)} className="btn" style={{
            width: "100%", textAlign: "left", padding: "10px 14px", marginBottom: 4, fontSize: 14,
            background: active === key ? t.accentSoft : "transparent",
            color: active === key ? t.accent : t.textMuted,
            display: "flex", alignItems: "center", gap: 10, borderRadius: 10,
            border: active === key ? `1px solid ${t.accentBorder}` : "1px solid transparent",
            fontFamily: "'Syne',sans-serif", fontWeight: active === key ? 700 : 400,
          }}>
            <span style={{ fontSize: 18 }}>{icon}</span>
            <span style={{ flex: 1 }}>{label}</span>
            {badge && <span style={{ background: t.danger, color: "#fff", borderRadius: "50%", width: 18, height: 18, fontSize: 10, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'JetBrains Mono',monospace" }}>{badge}</span>}
          </button>
        ))}
      </nav>
    </div>
  );
}

function TopBar({ title, theme: t, onLogout, setDark, dark }) {
  return (
    <div className="topbar" style={{ height: 60, background: t.surface, borderBottom: `1px solid ${t.border}`, display: "flex", alignItems: "center", padding: "0 28px", gap: 16 }}>
      <h1 style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: 18, color: t.text, flex: 1 }}>{title}</h1>
      <div className="topbar-date" style={{ fontSize: 13, color: t.textMuted, fontFamily: "'JetBrains Mono',monospace" }}>{today.toDateString()}</div>
      <button onClick={() => setDark(!dark)} className="btn" style={{ background: t.surface2, border: `1px solid ${t.border}`, color: t.text, padding: "7px 12px", fontSize: 16 }}>
        {dark ? "☀️" : "🌙"}
      </button>
      <button onClick={onLogout} className="btn" style={{ background: "rgba(239,68,68,0.1)", color: t.danger, padding: "7px 14px", fontSize: 13, border: "1px solid rgba(239,68,68,0.2)" }}>
        Sign Out
      </button>
    </div>
  );
}

// ─── STUDENT PANEL ────────────────────────────────────────────────────────────
function StudentPanel({ theme: t, onLogout }) {
  const { user, books, transactions, fines, setBooks, setTransactions, setFines } = useContext(AuthContext);
  const { setDark, theme } = useContext(ThemeContext);
  const addToast = useContext(ToastContext);
  const [active, setActive] = useState("dashboard");
  const [searchQ, setSearchQ] = useState("");
  const [genreFilter, setGenreFilter] = useState("All");

  const myTx = transactions.filter(tx => tx.userId === user.id);
  const myFines = fines.filter(f => f.userId === user.id && f.status === "pending");
  const overdue = myTx.filter(tx => tx.status === "overdue");
  const borrowed = myTx.filter(tx => tx.status === "borrowed" || tx.status === "overdue");
  const totalFines = myFines.reduce((s, f) => s + f.amount, 0);

  const handleBorrow = (book) => {
    if (borrowed.length >= STUDENT_BOOK_LIMIT) { addToast(`Max ${STUDENT_BOOK_LIMIT} books allowed for students`, "error"); return; }
    if (book.availableCopies === 0) { addToast("No copies available currently", "error"); return; }
    const due = new Date(today); due.setDate(due.getDate() + STUDENT_LOAN_DAYS);
    const newTx = { id: `TR${Date.now()}`, bookId: book.id, userId: user.id, bookTitle: book.title, userName: user.name, issueDate: today.toISOString().split("T")[0], dueDate: due.toISOString().split("T")[0], returnDate: null, status: "borrowed", fine: 0, renewCount: 0 };
    setTransactions(prev => [...prev, newTx]);
    setBooks(prev => prev.map(b => b.id === book.id ? { ...b, availableCopies: b.availableCopies - 1 } : b));
    addToast(`"${book.title}" borrowed successfully! Due: ${formatDate(due.toISOString().split("T")[0])}`, "success");
  };

  const handleReturn = (tx) => {
    const fine = calcFine(tx.dueDate);
    setTransactions(prev => prev.map(t => t.id === tx.id ? { ...t, status: "returned", returnDate: today.toISOString().split("T")[0], fine } : t));
    setBooks(prev => prev.map(b => b.id === tx.bookId ? { ...b, availableCopies: b.availableCopies + 1 } : b));
    if (fine > 0) {
      setFines(prev => prev.some(f => f.transactionId === tx.id) ? prev : [...prev, {
        id: `F${Date.now()}`,
        userId: user.id,
        userName: user.name,
        bookTitle: tx.bookTitle,
        amount: fine,
        daysOverdue: Math.abs(daysLeft(tx.dueDate)),
        status: "pending",
        transactionId: tx.id,
      }]);
    }
    if (fine > 0) addToast(`Returned with fine: Rs. ${fine}. Please clear at library desk.`, "warning");
    else addToast(`"${tx.bookTitle}" returned successfully! ✅`, "success");
  };

  const handleRenew = (tx) => {
    const newDue = new Date(tx.dueDate); newDue.setDate(newDue.getDate() + STUDENT_LOAN_DAYS);
    setTransactions(prev => prev.map(t => t.id === tx.id ? { ...t, dueDate: newDue.toISOString().split("T")[0], renewCount: t.renewCount + 1, status: "borrowed" } : t));
    addToast(`Book renewed! New due date: ${formatDate(newDue.toISOString().split("T")[0])}`, "success");
  };

  const filteredBooks = books.filter(b => {
    const q = searchQ.toLowerCase();
    const matchQ = !q || b.title.toLowerCase().includes(q) || b.author.toLowerCase().includes(q) || b.isbn.includes(q) || b.genre.toLowerCase().includes(q);
    const matchG = genreFilter === "All" || b.genre === genreFilter;
    return matchQ && matchG;
  });

  const navItems = [
    { key: "dashboard", icon: "🏠", label: "Dashboard" },
    { key: "search", icon: "🔍", label: "Search Books" },
    { key: "borrowed", icon: "📤", label: "My Books", badge: borrowed.length || null },
    { key: "history", icon: "📜", label: "History" },
    { key: "fines", icon: "💰", label: "Fines", badge: myFines.length || null },
    { key: "profile", icon: "👤", label: "Profile" },
  ];

  return (
    <div className="app-shell" style={{ display: "flex", minHeight: "100vh", background: t.bg }}>
      <Sidebar items={navItems} active={active} setActive={setActive} theme={t} user={user} />
      <div className="main-shell" style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        <TopBar title={navItems.find(n => n.key === active)?.label || "Dashboard"} theme={t} onLogout={onLogout} setDark={setDark} dark={theme.dark} />
        <div className="page-body" style={{ flex: 1, overflow: "auto", padding: 28 }}>

          {active === "dashboard" && (
            <div style={{ animation: "fadeIn 0.4s ease" }}>
              <div style={{ marginBottom: 24 }}>
                <h2 style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: 22, color: t.text }}>Welcome back, {user.name.split(" ")[0]}! 👋</h2>
                <p style={{ color: t.textMuted, fontSize: 14 }}>Here's your library activity overview</p>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: 16, marginBottom: 28 }}>
                <StatCard icon="📤" label="Currently Borrowed" value={borrowed.length} sub={`Limit: ${STUDENT_BOOK_LIMIT}`} color={t.accent} theme={t} />
                <StatCard icon="⚠️" label="Overdue Books" value={overdue.length} sub="Return immediately" color={t.danger} theme={t} />
                <StatCard icon="📚" label="Total Borrowed" value={myTx.length} sub="All time" color="#8b5cf6" theme={t} />
                <StatCard icon="💰" label="Pending Fines" value={`Rs. ${totalFines}`} sub={`${myFines.length} fine(s)`} color={t.accent2} theme={t} />
              </div>

              {overdue.length > 0 && (
                <div style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: 12, padding: 18, marginBottom: 20 }}>
                  <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, color: t.danger, marginBottom: 8 }}>⚠️ Overdue Alert</div>
                  {overdue.map(tx => (
                    <div key={tx.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "6px 0", borderBottom: `1px solid rgba(239,68,68,0.1)` }}>
                      <span style={{ color: t.text, fontSize: 14 }}>{tx.bookTitle}</span>
                      <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                        <span style={{ color: t.danger, fontSize: 13, fontFamily: "'JetBrains Mono',monospace" }}>Rs. {calcFine(tx.dueDate)}</span>
                        <button onClick={() => handleReturn(tx)} className="btn" style={{ background: t.danger, color: "#fff", padding: "5px 12px", fontSize: 12 }}>Return Now</button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <SectionHeader title="Currently Borrowed" subtitle="Books you have checked out" />
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(320px,1fr))", gap: 14, marginTop: 16 }}>
                {borrowed.length === 0 ? <EmptyState icon="📚" msg="No books currently borrowed" /> :
                  borrowed.map(tx => (
                    <div key={tx.id} className="card" style={{ padding: 18 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
                        <div>
                          <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, color: t.text, fontSize: 15 }}>{tx.bookTitle}</div>
                          <div style={{ fontSize: 13, color: t.textMuted }}>Issued: {formatDate(tx.issueDate)}</div>
                        </div>
                        <span className="badge" style={{ background: tx.status === "overdue" ? "rgba(239,68,68,0.15)" : "rgba(16,185,129,0.15)", color: tx.status === "overdue" ? t.danger : t.success }}>
                          {tx.status === "overdue" ? `${Math.abs(daysLeft(tx.dueDate))}d overdue` : `${daysLeft(tx.dueDate)}d left`}
                        </span>
                      </div>
                      <div style={{ fontSize: 13, color: t.textMuted, marginBottom: 12 }}>Due: {formatDate(tx.dueDate)} {tx.renewCount > 0 && `· Renewed ${tx.renewCount}×`}</div>
                      {tx.status === "overdue" && <div style={{ color: t.danger, fontSize: 13, marginBottom: 10 }}>Fine: Rs. {calcFine(tx.dueDate)}</div>}
                      <div style={{ display: "flex", gap: 8 }}>
                        <button onClick={() => handleReturn(tx)} className="btn" style={{ flex: 1, background: "rgba(239,68,68,0.1)", color: t.danger, border: "1px solid rgba(239,68,68,0.2)", padding: "8px 0", fontSize: 13 }}>Return</button>
                        {tx.renewCount < 2 && tx.status !== "overdue" && (
                          <button onClick={() => handleRenew(tx)} className="btn" style={{ flex: 1, background: t.accentSoft, color: t.accent, border: `1px solid ${t.accentBorder}`, padding: "8px 0", fontSize: 13 }}>Renew</button>
                        )}
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {active === "search" && (
            <div style={{ animation: "fadeIn 0.4s ease" }}>
              <div style={{ display: "flex", gap: 12, marginBottom: 20 }}>
                <div style={{ position: "relative", flex: 1 }}>
                  <span style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)" }}>🔍</span>
                  <input className="input" placeholder="Search by title, author, ISBN, or genre..." value={searchQ} onChange={e => setSearchQ(e.target.value)} style={{ paddingLeft: 42 }} />
                </div>
                <select className="input" value={genreFilter} onChange={e => setGenreFilter(e.target.value)} style={{ width: 180 }}>
                  {GENRES.map(g => <option key={g} value={g}>{g}</option>)}
                </select>
              </div>
              <div style={{ color: t.textMuted, fontSize: 13, marginBottom: 14, fontFamily: "'JetBrains Mono',monospace" }}>{filteredBooks.length} books found</div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(320px,1fr))", gap: 14 }}>
                {filteredBooks.length === 0 ? <EmptyState icon="🔍" msg="No books match your search" /> :
                  filteredBooks.map(b => <BookCard key={b.id} book={b} onBorrow={handleBorrow} theme={t} />)}
              </div>
            </div>
          )}

          {active === "borrowed" && (
            <div style={{ animation: "fadeIn 0.4s ease" }}>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(320px,1fr))", gap: 14 }}>
                {borrowed.length === 0 ? <EmptyState icon="📤" msg="No books currently borrowed" /> :
                  borrowed.map(tx => (
                    <div key={tx.id} className="card" style={{ padding: 20 }}>
                      <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, color: t.text, fontSize: 16, marginBottom: 12 }}>{tx.bookTitle}</div>
                      <div style={{ display: "flex", flexDirection: "column", gap: 6, fontSize: 14, color: t.textMuted, marginBottom: 14 }}>
                        <div>📅 Issued: {formatDate(tx.issueDate)}</div>
                        <div>⏰ Due: {formatDate(tx.dueDate)}</div>
                        <div>🔄 Renewals: {tx.renewCount}/2</div>
                        {tx.status === "overdue" && <div style={{ color: t.danger }}>💸 Fine: Rs. {calcFine(tx.dueDate)}</div>}
                      </div>
                      <div style={{ display: "flex", gap: 8 }}>
                        <button onClick={() => handleReturn(tx)} className="btn" style={{ flex: 1, background: t.danger, color: "#fff", padding: "9px 0", fontSize: 13 }}>📥 Return</button>
                        {tx.renewCount < 2 && tx.status !== "overdue" && (
                          <button onClick={() => handleRenew(tx)} className="btn" style={{ flex: 1, background: t.accent, color: "#fff", padding: "9px 0", fontSize: 13 }}>🔄 Renew</button>
                        )}
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {active === "history" && (
            <div style={{ animation: "fadeIn 0.4s ease" }}>
              <div className="card" style={{ overflow: "hidden" }}>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead>
                    <tr style={{ background: t.surface2 }}>
                      {["Book Title", "Issued", "Due", "Returned", "Fine", "Status"].map(h => (
                        <th key={h} style={{ padding: "14px 16px", textAlign: "left", fontSize: 12, color: t.textMuted, fontFamily: "'Syne',sans-serif", fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.8 }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {myTx.length === 0 ? (
                      <tr><td colSpan={6} style={{ textAlign: "center", padding: 40, color: t.textMuted }}>No history yet</td></tr>
                    ) : myTx.map(tx => (
                      <tr key={tx.id} style={{ borderTop: `1px solid ${t.border}` }}>
                        <td style={{ padding: "12px 16px", fontFamily: "'Syne',sans-serif", fontWeight: 600, color: t.text, fontSize: 14 }}>{tx.bookTitle}</td>
                        <td style={{ padding: "12px 16px", color: t.textMuted, fontSize: 13 }}>{formatDate(tx.issueDate)}</td>
                        <td style={{ padding: "12px 16px", color: t.textMuted, fontSize: 13 }}>{formatDate(tx.dueDate)}</td>
                        <td style={{ padding: "12px 16px", color: t.textMuted, fontSize: 13 }}>{tx.returnDate ? formatDate(tx.returnDate) : "—"}</td>
                        <td style={{ padding: "12px 16px", color: tx.fine > 0 ? t.danger : t.success, fontSize: 13, fontFamily: "'JetBrains Mono',monospace" }}>Rs. {tx.fine}</td>
                        <td style={{ padding: "12px 16px" }}>
                          <span className="badge" style={{ background: tx.status === "returned" ? "rgba(95,159,100,0.15)" : tx.status === "overdue" ? "rgba(239,68,68,0.15)" : t.accentSoft, color: tx.status === "returned" ? t.success : tx.status === "overdue" ? t.danger : t.accent }}>
                            {tx.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {active === "fines" && (
            <div style={{ animation: "fadeIn 0.4s ease" }}>
              <div style={{ display: "grid", gap: 14 }}>
                {myFines.length === 0 ? <EmptyState icon="✅" msg="No pending fines! You're all clear." /> :
                  myFines.map(f => (
                    <div key={f.id} className="card" style={{ padding: 20, borderLeft: `3px solid ${t.danger}` }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                        <div>
                          <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, color: t.text, fontSize: 16, marginBottom: 6 }}>{f.bookTitle}</div>
                          <div style={{ fontSize: 13, color: t.textMuted }}>{f.daysOverdue} days overdue · Rs. {FINE_PER_DAY}/day</div>
                        </div>
                        <div style={{ textAlign: "right" }}>
                          <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: 28, color: t.danger }}>Rs. {f.amount}</div>
                          <button onClick={() => addToast("Redirecting to payment gateway... (Demo Mode)", "info")} className="btn" style={{ background: t.accent2, color: "#fff", padding: "7px 16px", fontSize: 13, marginTop: 8 }}>Pay Now 💳</button>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {active === "profile" && <ProfileView user={user} theme={t} />}
        </div>
      </div>
    </div>
  );
}

// ─── TEACHER PANEL ────────────────────────────────────────────────────────────
function TeacherPanel({ theme: t, onLogout }) {
  const { user, books, transactions, setBooks, setTransactions } = useContext(AuthContext);
  const { setDark, theme } = useContext(ThemeContext);
  const addToast = useContext(ToastContext);
  const [active, setActive] = useState("dashboard");
  const [searchQ, setSearchQ] = useState("");
  const [recForm, setRecForm] = useState({ title: "", reason: "", course: "" });

  const myTx = transactions.filter(tx => tx.userId === user.id);
  const borrowed = myTx.filter(tx => tx.status === "borrowed" || tx.status === "overdue");

  const handleBorrow = (book) => {
    if (borrowed.length >= TEACHER_BOOK_LIMIT) { addToast(`Max ${TEACHER_BOOK_LIMIT} books for faculty`, "error"); return; }
    if (book.availableCopies === 0) { addToast("No copies available", "error"); return; }
    const due = new Date(today); due.setDate(due.getDate() + TEACHER_LOAN_DAYS);
    const newTx = { id: `TR${Date.now()}`, bookId: book.id, userId: user.id, bookTitle: book.title, userName: user.name, issueDate: today.toISOString().split("T")[0], dueDate: due.toISOString().split("T")[0], returnDate: null, status: "borrowed", fine: 0, renewCount: 0 };
    setTransactions(prev => [...prev, newTx]);
    setBooks(prev => prev.map(b => b.id === book.id ? { ...b, availableCopies: b.availableCopies - 1 } : b));
    addToast(`Borrowed! Due in ${TEACHER_LOAN_DAYS} days`, "success");
  };

  const filteredBooks = books.filter(b => !searchQ || b.title.toLowerCase().includes(searchQ.toLowerCase()) || b.author.toLowerCase().includes(searchQ.toLowerCase()));

  const navItems = [
    { key: "dashboard", icon: "🏠", label: "Dashboard" },
    { key: "search", icon: "🔍", label: "Browse Books" },
    { key: "borrowed", icon: "📤", label: "My Books", badge: borrowed.length || null },
    { key: "recommend", icon: "💡", label: "Recommend Book" },
    { key: "reserve", icon: "🔖", label: "Reserve Books" },
    { key: "profile", icon: "👤", label: "Profile" },
  ];

  return (
    <div className="app-shell" style={{ display: "flex", minHeight: "100vh", background: t.bg }}>
      <Sidebar items={navItems} active={active} setActive={setActive} theme={t} user={user} />
      <div className="main-shell" style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <TopBar title={navItems.find(n => n.key === active)?.label || ""} theme={t} onLogout={onLogout} setDark={setDark} dark={theme.dark} />
        <div className="page-body" style={{ flex: 1, overflow: "auto", padding: 28 }}>

          {active === "dashboard" && (
            <div style={{ animation: "fadeIn 0.4s ease" }}>
              <div style={{ marginBottom: 24 }}>
                <h2 style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: 22, color: t.text }}>Faculty Dashboard — {user.department}</h2>
                <p style={{ color: t.textMuted, fontSize: 14 }}>Extended borrowing privileges: {TEACHER_BOOK_LIMIT} books · {TEACHER_LOAN_DAYS} days</p>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: 16, marginBottom: 28 }}>
                <StatCard icon="📤" label="Books Borrowed" value={borrowed.length} sub={`Limit: ${TEACHER_BOOK_LIMIT}`} color={t.accent} theme={t} />
                <StatCard icon="📚" label="Total History" value={myTx.length} color="#8b5cf6" theme={t} />
                <StatCard icon="📅" label="Loan Duration" value={`${TEACHER_LOAN_DAYS}d`} sub="Faculty privilege" color={t.accent2} theme={t} />
                <StatCard icon="🔄" label="Renewals" value="3×" sub="Per book allowed" color={t.success} theme={t} />
              </div>
              <SectionHeader title="Currently Borrowed" />
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(300px,1fr))", gap: 14, marginTop: 16 }}>
                {borrowed.length === 0 ? <EmptyState icon="📚" msg="No books currently borrowed" /> :
                  borrowed.map(tx => (
                    <div key={tx.id} className="card" style={{ padding: 18 }}>
                      <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, color: t.text, fontSize: 15, marginBottom: 8 }}>{tx.bookTitle}</div>
                      <div style={{ fontSize: 13, color: t.textMuted }}>Due: {formatDate(tx.dueDate)} · {daysLeft(tx.dueDate)} days left</div>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {active === "search" && (
            <div style={{ animation: "fadeIn 0.4s ease" }}>
              <input className="input" placeholder="Search books..." value={searchQ} onChange={e => setSearchQ(e.target.value)} style={{ marginBottom: 20 }} />
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(320px,1fr))", gap: 14 }}>
                {filteredBooks.map(b => <BookCard key={b.id} book={b} onBorrow={handleBorrow} theme={t} />)}
              </div>
            </div>
          )}

          {active === "borrowed" && (
            <div style={{ animation: "fadeIn 0.4s ease" }}>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(300px,1fr))", gap: 14 }}>
                {borrowed.length === 0 ? <EmptyState icon="📤" msg="No books borrowed" /> :
                  borrowed.map(tx => (
                    <div key={tx.id} className="card" style={{ padding: 20 }}>
                      <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, color: t.text, fontSize: 15, marginBottom: 8 }}>{tx.bookTitle}</div>
                      <div style={{ fontSize: 13, color: t.textMuted, marginBottom: 10 }}>
                        Issued: {formatDate(tx.issueDate)} · Due: {formatDate(tx.dueDate)}
                      </div>
                      <button onClick={() => {
                        setTransactions(prev => prev.map(tr => tr.id === tx.id ? { ...tr, status: "returned", returnDate: today.toISOString().split("T")[0] } : tr));
                        setBooks(prev => prev.map(b => b.id === tx.bookId ? { ...b, availableCopies: b.availableCopies + 1 } : b));
                        addToast("Book returned successfully", "success");
                      }} className="btn" style={{ background: t.danger, color: "#fff", padding: "8px 0", fontSize: 13, width: "100%" }}>Return Book</button>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {active === "recommend" && (
            <div style={{ animation: "fadeIn 0.4s ease", maxWidth: 560 }}>
              <div className="card" style={{ padding: 28 }}>
                <h3 style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: 18, color: t.text, marginBottom: 20 }}>📚 Recommend a Book for Purchase</h3>
                {[
                  { key: "title", label: "Book Title", ph: "Introduction to Machine Learning" },
                  { key: "author", label: "Author", ph: "Author name" },
                  { key: "reason", label: "Reason / Course Relevance", ph: "This book is relevant to CS-401 curriculum..." },
                  { key: "course", label: "Course Code", ph: "CS-401" },
                ].map(f => (
                  <div key={f.key} style={{ marginBottom: 16 }}>
                    <label style={{ fontSize: 13, color: t.textMuted, display: "block", marginBottom: 6, fontFamily: "'Syne',sans-serif", fontWeight: 600 }}>{f.label}</label>
                    {f.key === "reason"
                      ? <textarea className="input" placeholder={f.ph} value={recForm[f.key]} onChange={e => setRecForm(p => ({ ...p, [f.key]: e.target.value }))} style={{ height: 80, resize: "vertical" }} />
                      : <input className="input" placeholder={f.ph} value={recForm[f.key] || ""} onChange={e => setRecForm(p => ({ ...p, [f.key]: e.target.value }))} />
                    }
                  </div>
                ))}
                <button onClick={() => { addToast("Recommendation submitted to librarian! ✅", "success"); setRecForm({ title: "", reason: "", course: "" }); }} className="btn" style={{ background: t.brandGradient, color: "#fff", padding: "12px 0", fontSize: 15, width: "100%" }}>
                  Submit Recommendation
                </button>
              </div>
            </div>
          )}

          {active === "reserve" && (
            <div style={{ animation: "fadeIn 0.4s ease", maxWidth: 560 }}>
              <div className="card" style={{ padding: 28 }}>
                <h3 style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: 18, color: t.text, marginBottom: 6 }}>🔖 Reserve Books for Semester</h3>
                <p style={{ color: t.textMuted, fontSize: 14, marginBottom: 20 }}>Reserve books for upcoming courses. The library will ensure availability.</p>
                {[
                  { label: "Book Title / ISBN", ph: "Introduction to Algorithms (978-...)" },
                  { label: "Semester", ph: "Fall 2025" },
                  { label: "Course Name", ph: "Data Structures & Algorithms" },
                  { label: "Copies Needed", ph: "30" },
                ].map(f => (
                  <div key={f.label} style={{ marginBottom: 14 }}>
                    <label style={{ fontSize: 13, color: t.textMuted, display: "block", marginBottom: 6, fontFamily: "'Syne',sans-serif", fontWeight: 600 }}>{f.label}</label>
                    <input className="input" placeholder={f.ph} />
                  </div>
                ))}
                <button onClick={() => addToast("Reservation request submitted! Librarian will confirm.", "success")} className="btn" style={{ background: t.accent, color: "#fff", padding: "12px 0", fontSize: 15, width: "100%" }}>
                  Submit Reservation Request
                </button>
              </div>
            </div>
          )}

          {active === "profile" && <ProfileView user={user} theme={t} />}
        </div>
      </div>
    </div>
  );
}

// ─── LIBRARIAN PANEL ──────────────────────────────────────────────────────────
function LibrarianPanel({ theme: t, onLogout }) {
  const { user, books, setBooks, transactions, setTransactions, users, setUsers, fines, setFines } = useContext(AuthContext);
  const { setDark, theme } = useContext(ThemeContext);
  const addToast = useContext(ToastContext);
  const [active, setActive] = useState("dashboard");

  const navItems = [
    { key: "dashboard", icon: "📊", label: "Dashboard" },
    { key: "books", icon: "📚", label: "Manage Books" },
    { key: "issue", icon: "📤", label: "Issue Book" },
    { key: "return", icon: "📥", label: "Process Return" },
    { key: "users", icon: "👥", label: "Manage Users" },
    { key: "fines", icon: "💰", label: "Fine Management", badge: fines.filter(f => f.status === "pending").length || null },
    { key: "reports", icon: "📋", label: "Reports" },
    { key: "settings", icon: "⚙️", label: "Settings" },
  ];

  const totalBorrowed = transactions.filter(tx => tx.status === "borrowed" || tx.status === "overdue").length;
  const totalOverdue = transactions.filter(tx => tx.status === "overdue").length;
  const totalReturned = transactions.filter(tx => tx.status === "returned").length;
  const pendingFines = fines.filter(f => f.status === "pending").reduce((s, f) => s + f.amount, 0);
  const pendingApprovals = users.filter(u => !u.approved && u.role !== "librarian").length;

  return (
    <div className="app-shell" style={{ display: "flex", minHeight: "100vh", background: t.bg }}>
      <Sidebar items={navItems} active={active} setActive={setActive} theme={t} user={user} />
      <div className="main-shell" style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <TopBar title={navItems.find(n => n.key === active)?.label || ""} theme={t} onLogout={onLogout} setDark={setDark} dark={theme.dark} />
        <div className="page-body" style={{ flex: 1, overflow: "auto", padding: 28 }}>

          {active === "dashboard" && <AdminDashboard t={t} books={books} transactions={transactions} users={users} totalBorrowed={totalBorrowed} totalOverdue={totalOverdue} totalReturned={totalReturned} pendingFines={pendingFines} pendingApprovals={pendingApprovals} setActive={setActive} />}
          {active === "books" && <ManageBooks t={t} books={books} setBooks={setBooks} addToast={addToast} />}
          {active === "issue" && <IssueBook t={t} books={books} setBooks={setBooks} users={users} transactions={transactions} setTransactions={setTransactions} addToast={addToast} />}
          {active === "return" && <ProcessReturn t={t} transactions={transactions} setTransactions={setTransactions} setBooks={setBooks} books={books} setFines={setFines} addToast={addToast} />}
          {active === "users" && <ManageUsers t={t} users={users} setUsers={setUsers} transactions={transactions} addToast={addToast} />}
          {active === "fines" && <FineManagement t={t} fines={fines} setFines={setFines} addToast={addToast} />}
          {active === "reports" && <Reports t={t} books={books} transactions={transactions} users={users} fines={fines} addToast={addToast} />}
          {active === "settings" && <LibrarySettings t={t} addToast={addToast} />}
        </div>
      </div>
    </div>
  );
}

function AdminDashboard({ t, books, transactions, users, totalBorrowed, totalOverdue, totalReturned, pendingFines, pendingApprovals, setActive }) {
  const mostBorrowed = [...books].sort((a, b) => (b.totalCopies - b.availableCopies) - (a.totalCopies - a.availableCopies)).slice(0, 5);
  const recentTx = [...transactions].reverse().slice(0, 6);

  return (
    <div style={{ animation: "fadeIn 0.4s ease" }}>
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: 22, color: t.text }}>Library Control Center</h2>
        <p style={{ color: t.textMuted, fontSize: 14 }}>Real-time overview of all library operations</p>
      </div>

      {pendingApprovals > 0 && (
        <div style={{ background: "rgba(245,158,11,0.1)", border: "1px solid rgba(245,158,11,0.3)", borderRadius: 12, padding: "14px 18px", marginBottom: 20, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ color: t.accent2, fontFamily: "'Syne',sans-serif", fontWeight: 600 }}>🔔 {pendingApprovals} user registration(s) pending approval</div>
          <button onClick={() => setActive("users")} className="btn" style={{ background: t.accent2, color: "#fff", padding: "6px 14px", fontSize: 13 }}>Review →</button>
        </div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))", gap: 16, marginBottom: 28 }}>
        <StatCard icon="📚" label="Total Books" value={books.length} sub={`${books.reduce((s, b) => s + b.availableCopies, 0)} available`} color={t.accent} theme={t} />
        <StatCard icon="📤" label="Issued" value={totalBorrowed} sub="Currently out" color="#8b5cf6" theme={t} />
        <StatCard icon="⚠️" label="Overdue" value={totalOverdue} sub="Need attention" color={t.danger} theme={t} />
        <StatCard icon="📥" label="Returned" value={totalReturned} sub="This month" color={t.success} theme={t} />
        <StatCard icon="💰" label="Pending Fines" value={`Rs.${pendingFines}`} sub="Uncollected" color={t.accent2} theme={t} />
        <StatCard icon="👥" label="Total Users" value={users.length - 1} sub={`${users.filter(u => u.role === "student").length} students`} color="#06b6d4" theme={t} />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 24 }}>
        {/* Mini Chart */}
        <div className="card" style={{ padding: 22 }}>
          <h3 style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: 16, color: t.text, marginBottom: 16 }}>📊 Transaction Overview</h3>
          <MiniBarChart data={[
            { label: "Borrowed", value: totalBorrowed, color: t.accent },
            { label: "Overdue", value: totalOverdue, color: t.danger },
            { label: "Returned", value: totalReturned, color: t.success },
          ]} theme={t} />
        </div>

        {/* Most Borrowed */}
        <div className="card" style={{ padding: 22 }}>
          <h3 style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: 16, color: t.text, marginBottom: 16 }}>🔥 Most Borrowed Books</h3>
          {mostBorrowed.map((b, i) => (
            <div key={b.id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "6px 0", borderBottom: i < 4 ? `1px solid ${t.border}` : "none" }}>
              <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 11, color: t.textMuted, width: 18 }}>#{i + 1}</span>
              <span style={{ fontSize: 20 }}>{b.cover}</span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13, fontFamily: "'Syne',sans-serif", fontWeight: 600, color: t.text, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{b.title}</div>
                <div style={{ fontSize: 11, color: t.textMuted }}>{b.totalCopies - b.availableCopies} issued of {b.totalCopies}</div>
              </div>
              <div style={{ width: 60, height: 6, background: t.surface2, borderRadius: 3, overflow: "hidden" }}>
                <div style={{ width: `${((b.totalCopies - b.availableCopies) / b.totalCopies) * 100}%`, height: "100%", background: t.accent, borderRadius: 3 }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="card" style={{ overflow: "hidden" }}>
        <div style={{ padding: "18px 20px 14px", borderBottom: `1px solid ${t.border}` }}>
          <h3 style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: 16, color: t.text }}>📋 Recent Transactions</h3>
        </div>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: t.surface2 }}>
              {["User", "Book", "Issue Date", "Due Date", "Status"].map(h => (
                <th key={h} style={{ padding: "12px 16px", textAlign: "left", fontSize: 11, color: t.textMuted, fontFamily: "'Syne',sans-serif", fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.8 }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {recentTx.map(tx => (
              <tr key={tx.id} style={{ borderTop: `1px solid ${t.border}` }}>
                <td style={{ padding: "11px 16px", color: t.text, fontSize: 13, fontFamily: "'Syne',sans-serif", fontWeight: 600 }}>{tx.userName}</td>
                <td style={{ padding: "11px 16px", color: t.textMuted, fontSize: 13 }}>{tx.bookTitle}</td>
                <td style={{ padding: "11px 16px", color: t.textMuted, fontSize: 12, fontFamily: "'JetBrains Mono',monospace" }}>{formatDate(tx.issueDate)}</td>
                <td style={{ padding: "11px 16px", color: t.textMuted, fontSize: 12, fontFamily: "'JetBrains Mono',monospace" }}>{formatDate(tx.dueDate)}</td>
                <td style={{ padding: "11px 16px" }}>
                  <span className="badge" style={{ background: tx.status === "returned" ? "rgba(95,159,100,0.15)" : tx.status === "overdue" ? "rgba(239,68,68,0.15)" : t.accentSoft, color: tx.status === "returned" ? t.success : tx.status === "overdue" ? t.danger : t.accent }}>
                    {tx.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function MiniBarChart({ data, theme: t }) {
  const max = Math.max(...data.map(d => d.value), 1);
  return (
    <div style={{ display: "flex", alignItems: "flex-end", gap: 16, height: 120 }}>
      {data.map(d => (
        <div key={d.label} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
          <div style={{ fontSize: 13, fontFamily: "'Syne',sans-serif", fontWeight: 700, color: t.text }}>{d.value}</div>
          <div style={{ width: "100%", height: 80, background: t.surface2, borderRadius: 6, display: "flex", alignItems: "flex-end", overflow: "hidden" }}>
            <div style={{ width: "100%", height: `${(d.value / max) * 100}%`, background: d.color, borderRadius: 6, transition: "height 0.8s ease", minHeight: 4 }} />
          </div>
          <div style={{ fontSize: 11, color: t.textMuted, textAlign: "center" }}>{d.label}</div>
        </div>
      ))}
    </div>
  );
}

function ManageBooks({ t, books, setBooks, addToast }) {
  const [showAdd, setShowAdd] = useState(false);
  const [search, setSearch] = useState("");
  const [editBook, setEditBook] = useState(null);
  const [form, setForm] = useState({ title: "", author: "", isbn: "", publisher: "", year: "", genre: "Computer Science", totalCopies: "", shelf: "", description: "", cover: "📖" });

  const filtered = books.filter(b => !search || b.title.toLowerCase().includes(search.toLowerCase()) || b.author.toLowerCase().includes(search.toLowerCase()));

  const handleAdd = () => {
    if (!form.title || !form.author) { addToast("Title and Author are required", "error"); return; }
    const newBook = { ...form, id: `B${Date.now()}`, totalCopies: parseInt(form.totalCopies) || 1, availableCopies: parseInt(form.totalCopies) || 1, year: parseInt(form.year) || 2024, featured: false };
    setBooks(prev => [...prev, newBook]);
    addToast(`"${form.title}" added to library! ✅`, "success");
    setShowAdd(false);
    setForm({ title: "", author: "", isbn: "", publisher: "", year: "", genre: "Computer Science", totalCopies: "", shelf: "", description: "", cover: "📖" });
  };

  const handleDelete = (id, title) => {
    setBooks(prev => prev.filter(b => b.id !== id));
    addToast(`"${title}" removed from library`, "warning");
  };

  const COVERS = ["📖", "💻", "🧹", "🌍", "👁️", "🔭", "⚡", "⚛️", "🥂", "🧠", "🚀", "✨", "📕", "📗", "📘", "📙"];

  return (
    <div style={{ animation: "fadeIn 0.4s ease" }}>
      <div style={{ display: "flex", gap: 12, marginBottom: 20 }}>
        <input className="input" placeholder="Search books..." value={search} onChange={e => setSearch(e.target.value)} style={{ flex: 1 }} />
        <button onClick={() => setShowAdd(!showAdd)} className="btn" style={{ background: t.accent, color: "#fff", padding: "10px 20px", fontSize: 14, whiteSpace: "nowrap" }}>
          {showAdd ? "✕ Cancel" : "+ Add Book"}
        </button>
      </div>

      {showAdd && (
        <div className="card" style={{ padding: 24, marginBottom: 20, animation: "slideUp 0.3s ease" }}>
          <h3 style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, color: t.text, marginBottom: 18 }}>Add New Book</h3>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            {[["title", "Book Title *"], ["author", "Author *"], ["isbn", "ISBN"], ["publisher", "Publisher"], ["year", "Year"], ["shelf", "Shelf Location"], ["totalCopies", "Total Copies"]].map(([key, label]) => (
              <div key={key}>
                <label style={{ fontSize: 12, color: t.textMuted, display: "block", marginBottom: 5, fontFamily: "'Syne',sans-serif", fontWeight: 600 }}>{label}</label>
                <input className="input" value={form[key]} onChange={e => setForm(p => ({ ...p, [key]: e.target.value }))} />
              </div>
            ))}
            <div>
              <label style={{ fontSize: 12, color: t.textMuted, display: "block", marginBottom: 5, fontFamily: "'Syne',sans-serif", fontWeight: 600 }}>Genre</label>
              <select className="input" value={form.genre} onChange={e => setForm(p => ({ ...p, genre: e.target.value }))}>
                {GENRES.filter(g => g !== "All").map(g => <option key={g}>{g}</option>)}
              </select>
            </div>
          </div>
          <div style={{ marginTop: 12 }}>
            <label style={{ fontSize: 12, color: t.textMuted, display: "block", marginBottom: 5, fontFamily: "'Syne',sans-serif", fontWeight: 600 }}>Description</label>
            <textarea className="input" value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} style={{ height: 70, resize: "vertical" }} />
          </div>
          <div style={{ marginTop: 12 }}>
            <label style={{ fontSize: 12, color: t.textMuted, display: "block", marginBottom: 8, fontFamily: "'Syne',sans-serif", fontWeight: 600 }}>Cover Icon</label>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {COVERS.map(c => (
                <button key={c} onClick={() => setForm(p => ({ ...p, cover: c }))} className="btn" style={{ background: form.cover === c ? t.accent : t.surface2, border: form.cover === c ? "none" : `1px solid ${t.border}`, padding: "6px 10px", fontSize: 20 }}>{c}</button>
              ))}
            </div>
          </div>
          <button onClick={handleAdd} className="btn" style={{ background: t.brandGradient, color: "#fff", padding: "12px 24px", fontSize: 15, marginTop: 16 }}>
            Add Book to Library
          </button>
        </div>
      )}

      <div style={{ color: t.textMuted, fontSize: 13, marginBottom: 12, fontFamily: "'JetBrains Mono',monospace" }}>{filtered.length} books in inventory</div>
      <div className="card" style={{ overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: t.surface2 }}>
              {["Cover", "Title", "Author", "Genre", "Copies", "Shelf", "Actions"].map(h => (
                <th key={h} style={{ padding: "13px 14px", textAlign: "left", fontSize: 11, color: t.textMuted, fontFamily: "'Syne',sans-serif", fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.8 }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map(b => (
              <tr key={b.id} style={{ borderTop: `1px solid ${t.border}` }}>
                <td style={{ padding: "10px 14px", fontSize: 24 }}>{b.cover}</td>
                <td style={{ padding: "10px 14px" }}>
                  <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: 13, color: t.text }}>{b.title}</div>
                  <div style={{ fontSize: 11, color: t.textMuted, fontFamily: "'JetBrains Mono',monospace" }}>{b.isbn}</div>
                </td>
                <td style={{ padding: "10px 14px", color: t.textMuted, fontSize: 13 }}>{b.author}</td>
                <td style={{ padding: "10px 14px" }}><span className="badge" style={{ background: t.surface2, color: t.accent }}>{b.genre}</span></td>
                <td style={{ padding: "10px 14px", fontFamily: "'JetBrains Mono',monospace", fontSize: 13 }}>
                  <span style={{ color: b.availableCopies > 0 ? t.success : t.danger }}>{b.availableCopies}</span>
                  <span style={{ color: t.textMuted }}>/{b.totalCopies}</span>
                </td>
                <td style={{ padding: "10px 14px", color: t.textMuted, fontSize: 12, fontFamily: "'JetBrains Mono',monospace" }}>{b.shelf}</td>
                <td style={{ padding: "10px 14px" }}>
                  <div style={{ display: "flex", gap: 6 }}>
                    <button onClick={() => { addToast(`Editing "${b.title}" (demo)`, "info"); }} className="btn" style={{ background: t.accentSoft, color: t.accent, padding: "5px 10px", fontSize: 12, border: `1px solid ${t.accentBorder}` }}>Edit</button>
                    <button onClick={() => handleDelete(b.id, b.title)} className="btn" style={{ background: "rgba(239,68,68,0.1)", color: t.danger, padding: "5px 10px", fontSize: 12, border: "1px solid rgba(239,68,68,0.2)" }}>Delete</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function IssueBook({ t, books, setBooks, users, transactions, setTransactions, addToast }) {
  const [bookId, setBookId] = useState("");
  const [userId, setUserId] = useState("");
  const foundBook = books.find(b => b.id.toLowerCase() === bookId.toLowerCase() || b.isbn === bookId || b.title.toLowerCase().includes(bookId.toLowerCase()));
  const foundUser = users.find(u => u.id.toLowerCase() === userId.toLowerCase() || u.email.toLowerCase() === userId.toLowerCase());

  const handleIssue = () => {
    if (!foundBook || !foundUser) { addToast("Book or User not found", "error"); return; }
    if (foundBook.availableCopies === 0) { addToast("No copies available", "error"); return; }
    if (foundUser.role === "librarian") { addToast("Books can only be issued to students or faculty", "error"); return; }
    if (foundUser.blocked || !foundUser.approved) { addToast("User account must be active and approved before issuing", "error"); return; }
    const activeLoans = transactions.filter(tx => tx.userId === foundUser.id && (tx.status === "borrowed" || tx.status === "overdue"));
    const limit = foundUser.role === "teacher" ? TEACHER_BOOK_LIMIT : STUDENT_BOOK_LIMIT;
    if (activeLoans.length >= limit) { addToast(`Issue limit reached for this user (${limit} books)`, "error"); return; }
    const loanDays = foundUser.role === "teacher" ? TEACHER_LOAN_DAYS : STUDENT_LOAN_DAYS;
    const due = new Date(today); due.setDate(due.getDate() + loanDays);
    const newTx = { id: `TR${Date.now()}`, bookId: foundBook.id, userId: foundUser.id, bookTitle: foundBook.title, userName: foundUser.name, issueDate: today.toISOString().split("T")[0], dueDate: due.toISOString().split("T")[0], returnDate: null, status: "borrowed", fine: 0, renewCount: 0 };
    setTransactions(prev => [...prev, newTx]);
    setBooks(prev => prev.map(b => b.id === foundBook.id ? { ...b, availableCopies: b.availableCopies - 1 } : b));
    addToast(`Issued "${foundBook.title}" to ${foundUser.name}. Due: ${formatDate(due.toISOString().split("T")[0])}`, "success");
    setBookId(""); setUserId("");
  };

  return (
    <div style={{ animation: "fadeIn 0.4s ease", maxWidth: 600 }}>
      <div className="card" style={{ padding: 28 }}>
        <h3 style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: 18, color: t.text, marginBottom: 6 }}>📤 Issue Book to User</h3>
        <p style={{ color: t.textMuted, fontSize: 14, marginBottom: 24 }}>Enter Book ID/ISBN/Title and User ID/Email to issue a book</p>

        <div style={{ marginBottom: 16 }}>
          <label style={{ fontSize: 13, color: t.textMuted, display: "block", marginBottom: 6, fontFamily: "'Syne',sans-serif", fontWeight: 600 }}>Book ID / ISBN / Title</label>
          <input className="input" placeholder="e.g. B001 or 978-... or Clean Code" value={bookId} onChange={e => setBookId(e.target.value)} />
          {foundBook && (
            <div style={{ marginTop: 8, background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.2)", borderRadius: 8, padding: "10px 14px" }}>
              <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                <span style={{ fontSize: 24 }}>{foundBook.cover}</span>
                <div>
                  <div style={{ color: t.text, fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: 14 }}>{foundBook.title}</div>
                  <div style={{ color: t.textMuted, fontSize: 12 }}>by {foundBook.author} · Available: {foundBook.availableCopies}/{foundBook.totalCopies} · Shelf: {foundBook.shelf}</div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div style={{ marginBottom: 24 }}>
          <label style={{ fontSize: 13, color: t.textMuted, display: "block", marginBottom: 6, fontFamily: "'Syne',sans-serif", fontWeight: 600 }}>User ID / Email</label>
          <input className="input" placeholder="e.g. S001 or ahmed@uni.edu" value={userId} onChange={e => setUserId(e.target.value)} />
          {foundUser && (
            <div style={{ marginTop: 8, background: t.accentSoft, border: `1px solid ${t.accentBorder}`, borderRadius: 8, padding: "10px 14px" }}>
              <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                <div style={{ width: 32, height: 32, background: t.brandGradient, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 12, fontFamily: "'Syne',sans-serif", fontWeight: 700 }}>{foundUser.avatar}</div>
                <div>
                  <div style={{ color: t.text, fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: 14 }}>{foundUser.name}</div>
                  <div style={{ color: t.textMuted, fontSize: 12 }}>{foundUser.role} · {foundUser.email}</div>
                </div>
              </div>
            </div>
          )}
        </div>

        {foundBook && foundUser && (
          <div style={{ background: t.surface2, borderRadius: 10, padding: 14, marginBottom: 16, fontSize: 14, color: t.textMuted }}>
            <div>📅 Loan duration: <strong style={{ color: t.text }}>{foundUser.role === "teacher" ? TEACHER_LOAN_DAYS : STUDENT_LOAN_DAYS} days</strong></div>
            <div>💸 Fine rate: <strong style={{ color: t.text }}>Rs. {FINE_PER_DAY}/day</strong></div>
          </div>
        )}

        <button onClick={handleIssue} className="btn" disabled={!foundBook || !foundUser} style={{ background: foundBook && foundUser ? t.brandGradient : t.surface2, color: foundBook && foundUser ? "#fff" : t.textMuted, padding: "13px 0", fontSize: 15, width: "100%" }}>
          Issue Book
        </button>

        <div style={{ marginTop: 20 }}>
          <div style={{ fontSize: 12, color: t.textMuted, fontFamily: "'Syne',sans-serif", fontWeight: 600, marginBottom: 8 }}>QUICK REFERENCE</div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {["B001", "B002", "B003", "S001", "T001"].map(id => (
              <button key={id} onClick={() => id.startsWith("B") ? setBookId(id) : setUserId(id)} className="btn" style={{ background: t.surface2, border: `1px solid ${t.border}`, color: t.textMuted, padding: "4px 10px", fontSize: 11, fontFamily: "'JetBrains Mono',monospace" }}>{id}</button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function ProcessReturn({ t, transactions, setTransactions, setBooks, books, setFines, addToast }) {
  const [txId, setTxId] = useState("");
  const active = transactions.filter(tx => tx.status === "borrowed" || tx.status === "overdue");
  const found = txId ? active.find(tx => tx.id === txId || tx.bookTitle.toLowerCase().includes(txId.toLowerCase()) || tx.userName.toLowerCase().includes(txId.toLowerCase())) : null;

  const handleReturn = (tx) => {
    const fine = calcFine(tx.dueDate);
    setTransactions(prev => prev.map(t => t.id === tx.id ? { ...t, status: "returned", returnDate: today.toISOString().split("T")[0], fine } : t));
    setBooks(prev => prev.map(b => b.id === tx.bookId ? { ...b, availableCopies: b.availableCopies + 1 } : b));
    if (fine > 0) {
      setFines(prev => {
        const existing = prev.find(f => f.transactionId === tx.id);
        if (existing) {
          return prev.map(f => f.transactionId === tx.id ? { ...f, amount: fine, daysOverdue: Math.abs(daysLeft(tx.dueDate)), status: "paid" } : f);
        }
        return [...prev, {
          id: `F${Date.now()}`,
          userId: tx.userId,
          userName: tx.userName,
          bookTitle: tx.bookTitle,
          amount: fine,
          daysOverdue: Math.abs(daysLeft(tx.dueDate)),
          status: "paid",
          transactionId: tx.id,
        }];
      });
    }
    addToast(fine > 0 ? `Returned. Fine collected: Rs. ${fine}` : "Book returned successfully!", fine > 0 ? "warning" : "success");
    setTxId("");
  };

  return (
    <div style={{ animation: "fadeIn 0.4s ease" }}>
      <div style={{ maxWidth: 560, marginBottom: 24 }}>
        <div className="card" style={{ padding: 24 }}>
          <h3 style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: 16, color: t.text, marginBottom: 16 }}>📥 Process Book Return</h3>
          <input className="input" placeholder="Transaction ID, book title, or user name..." value={txId} onChange={e => setTxId(e.target.value)} />
          {found && (
            <div style={{ marginTop: 14, background: t.surface2, borderRadius: 10, padding: 16 }}>
              <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, color: t.text, marginBottom: 6 }}>{found.bookTitle}</div>
              <div style={{ fontSize: 13, color: t.textMuted, marginBottom: 10 }}>
                Borrower: {found.userName} · Due: {formatDate(found.dueDate)}
              </div>
              {calcFine(found.dueDate) > 0 && (
                <div style={{ color: t.danger, fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: 16, marginBottom: 10 }}>
                  Fine: Rs. {calcFine(found.dueDate)} ({Math.abs(daysLeft(found.dueDate))} days overdue)
                </div>
              )}
              <button onClick={() => handleReturn(found)} className="btn" style={{ background: t.success, color: "#fff", padding: "10px 20px", fontSize: 14, width: "100%" }}>
                Confirm Return & {calcFine(found.dueDate) > 0 ? `Collect Rs. ${calcFine(found.dueDate)}` : "Clear Record"}
              </button>
            </div>
          )}
        </div>
      </div>

      <SectionHeader title="Active Loans" subtitle={`${active.length} books currently out`} />
      <div className="card" style={{ overflow: "hidden", marginTop: 16 }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: t.surface2 }}>
              {["Tx ID", "Book", "Borrower", "Due Date", "Fine", "Action"].map(h => (
                <th key={h} style={{ padding: "12px 14px", textAlign: "left", fontSize: 11, color: t.textMuted, fontFamily: "'Syne',sans-serif", fontWeight: 700, textTransform: "uppercase" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {active.map(tx => {
              const fine = calcFine(tx.dueDate);
              return (
                <tr key={tx.id} style={{ borderTop: `1px solid ${t.border}`, background: fine > 0 ? "rgba(239,68,68,0.03)" : "" }}>
                  <td style={{ padding: "10px 14px", fontFamily: "'JetBrains Mono',monospace", fontSize: 11, color: t.textMuted }}>{tx.id}</td>
                  <td style={{ padding: "10px 14px", color: t.text, fontSize: 13 }}>{tx.bookTitle}</td>
                  <td style={{ padding: "10px 14px", color: t.textMuted, fontSize: 13 }}>{tx.userName}</td>
                  <td style={{ padding: "10px 14px", color: fine > 0 ? t.danger : t.textMuted, fontSize: 12, fontFamily: "'JetBrains Mono',monospace" }}>{formatDate(tx.dueDate)}</td>
                  <td style={{ padding: "10px 14px", color: fine > 0 ? t.danger : t.success, fontSize: 13, fontFamily: "'JetBrains Mono',monospace" }}>Rs. {fine}</td>
                  <td style={{ padding: "10px 14px" }}>
                    <button onClick={() => handleReturn(tx)} className="btn" style={{ background: "rgba(16,185,129,0.1)", color: t.success, border: "1px solid rgba(16,185,129,0.2)", padding: "5px 12px", fontSize: 12 }}>Return</button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function ManageUsers({ t, users, setUsers, transactions, addToast }) {
  const [filter, setFilter] = useState("all");
  const filtered = users.filter(u => u.role !== "librarian" && (filter === "all" || u.role === filter || (filter === "pending" && !u.approved)));

  const handleApprove = (id) => { setUsers(prev => prev.map(u => u.id === id ? { ...u, approved: true } : u)); addToast("User approved successfully ✅", "success"); };
  const handleBlock = (id, name, blocked) => { setUsers(prev => prev.map(u => u.id === id ? { ...u, blocked: !blocked } : u)); addToast(`${name} has been ${blocked ? "unblocked" : "blocked"}`, blocked ? "success" : "warning"); };

  return (
    <div style={{ animation: "fadeIn 0.4s ease" }}>
      <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
        {[["all", "All Users"], ["student", "Students"], ["teacher", "Faculty"], ["pending", "Pending"]].map(([v, l]) => (
          <button key={v} onClick={() => setFilter(v)} className="btn" style={{ background: filter === v ? t.accent : t.surface2, color: filter === v ? "#fff" : t.textMuted, padding: "8px 16px", fontSize: 13, border: filter === v ? "none" : `1px solid ${t.border}` }}>{l}</button>
        ))}
      </div>

      <div className="card" style={{ overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: t.surface2 }}>
              {["User", "Role", "ID", "Registered", "Status", "Books", "Actions"].map(h => (
                <th key={h} style={{ padding: "12px 14px", textAlign: "left", fontSize: 11, color: t.textMuted, fontFamily: "'Syne',sans-serif", fontWeight: 700, textTransform: "uppercase" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map(u => {
              const userTx = transactions.filter(tx => tx.userId === u.id && (tx.status === "borrowed" || tx.status === "overdue")).length;
              return (
                <tr key={u.id} style={{ borderTop: `1px solid ${t.border}`, opacity: u.blocked ? 0.6 : 1 }}>
                  <td style={{ padding: "10px 14px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <div style={{ width: 30, height: 30, background: t.brandGradient, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontFamily: "'Syne',sans-serif", fontWeight: 700, color: "#fff" }}>{u.avatar}</div>
                      <div>
                        <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: 13, color: t.text }}>{u.name}</div>
                        <div style={{ fontSize: 11, color: t.textMuted }}>{u.email}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: "10px 14px" }}><span className="badge" style={{ background: u.role === "teacher" ? "rgba(139,92,246,0.15)" : t.accentSoft, color: u.role === "teacher" ? "#8b5cf6" : t.accent }}>{u.role}</span></td>
                  <td style={{ padding: "10px 14px", fontFamily: "'JetBrains Mono',monospace", fontSize: 12, color: t.textMuted }}>{u.studentId || u.facultyId}</td>
                  <td style={{ padding: "10px 14px", fontSize: 12, color: t.textMuted }}>{formatDate(u.registered)}</td>
                  <td style={{ padding: "10px 14px" }}>
                    <span className="badge" style={{ background: u.blocked ? "rgba(239,68,68,0.15)" : !u.approved ? "rgba(245,158,11,0.15)" : "rgba(16,185,129,0.15)", color: u.blocked ? t.danger : !u.approved ? t.accent2 : t.success }}>
                      {u.blocked ? "Blocked" : !u.approved ? "Pending" : "Active"}
                    </span>
                  </td>
                  <td style={{ padding: "10px 14px", fontFamily: "'JetBrains Mono',monospace", fontSize: 13, color: t.textMuted }}>{userTx}</td>
                  <td style={{ padding: "10px 14px" }}>
                    <div style={{ display: "flex", gap: 5 }}>
                      {!u.approved && <button onClick={() => handleApprove(u.id)} className="btn" style={{ background: "rgba(16,185,129,0.1)", color: t.success, border: "1px solid rgba(16,185,129,0.2)", padding: "4px 9px", fontSize: 11 }}>Approve</button>}
                      <button onClick={() => handleBlock(u.id, u.name, u.blocked)} className="btn" style={{ background: u.blocked ? "rgba(16,185,129,0.1)" : "rgba(239,68,68,0.1)", color: u.blocked ? t.success : t.danger, border: `1px solid ${u.blocked ? "rgba(16,185,129,0.2)" : "rgba(239,68,68,0.2)"}`, padding: "4px 9px", fontSize: 11 }}>
                        {u.blocked ? "Unblock" : "Block"}
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function FineManagement({ t, fines, setFines, addToast }) {
  const pending = fines.filter(f => f.status === "pending");
  const paid = fines.filter(f => f.status === "paid");
  const totalPending = pending.reduce((s, f) => s + f.amount, 0);

  const markPaid = (id) => { setFines(prev => prev.map(f => f.id === id ? { ...f, status: "paid" } : f)); addToast("Fine marked as paid ✅", "success"); };
  const sendReminder = (name) => { addToast(`Reminder sent to ${name} via email/SMS`, "info"); };

  return (
    <div style={{ animation: "fadeIn 0.4s ease" }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))", gap: 16, marginBottom: 24 }}>
        <StatCard icon="⏳" label="Pending Fines" value={pending.length} sub={`Rs. ${totalPending} total`} color={t.danger} theme={t} />
        <StatCard icon="✅" label="Fines Collected" value={paid.length} sub="This month" color={t.success} theme={t} />
        <StatCard icon="💰" label="Total Collected" value={`Rs. ${paid.reduce((s, f) => s + f.amount, 0)}`} color={t.accent} theme={t} />
      </div>

      <SectionHeader title="Pending Fines" />
      <div style={{ display: "grid", gap: 12, marginTop: 16, marginBottom: 28 }}>
        {pending.length === 0 ? <EmptyState icon="✅" msg="No pending fines!" /> :
          pending.map(f => (
            <div key={f.id} className="card" style={{ padding: 18, borderLeft: `3px solid ${t.danger}`, display: "flex", alignItems: "center", gap: 16 }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, color: t.text, fontSize: 15 }}>{f.userName}</div>
                <div style={{ color: t.textMuted, fontSize: 13 }}>{f.bookTitle} · {f.daysOverdue} days overdue</div>
              </div>
              <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: 22, color: t.danger }}>Rs. {f.amount}</div>
              <div style={{ display: "flex", gap: 8 }}>
                <button onClick={() => sendReminder(f.userName)} className="btn" style={{ background: "rgba(245,158,11,0.1)", color: t.accent2, border: "1px solid rgba(245,158,11,0.2)", padding: "7px 12px", fontSize: 12 }}>📨 Remind</button>
                <button onClick={() => markPaid(f.id)} className="btn" style={{ background: t.success, color: "#fff", padding: "7px 12px", fontSize: 12 }}>✓ Mark Paid</button>
              </div>
            </div>
          ))}
      </div>

      <SectionHeader title="Collected Fines" />
      <div className="card" style={{ overflow: "hidden", marginTop: 16 }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead><tr style={{ background: t.surface2 }}>
            {["User", "Book", "Amount", "Status"].map(h => <th key={h} style={{ padding: "12px 14px", textAlign: "left", fontSize: 11, color: t.textMuted, fontFamily: "'Syne',sans-serif", fontWeight: 700, textTransform: "uppercase" }}>{h}</th>)}
          </tr></thead>
          <tbody>
            {paid.map(f => (
              <tr key={f.id} style={{ borderTop: `1px solid ${t.border}` }}>
                <td style={{ padding: "10px 14px", color: t.text, fontSize: 13, fontFamily: "'Syne',sans-serif", fontWeight: 600 }}>{f.userName}</td>
                <td style={{ padding: "10px 14px", color: t.textMuted, fontSize: 13 }}>{f.bookTitle}</td>
                <td style={{ padding: "10px 14px", color: t.success, fontFamily: "'JetBrains Mono',monospace", fontSize: 13 }}>Rs. {f.amount}</td>
                <td style={{ padding: "10px 14px" }}><span className="badge" style={{ background: "rgba(16,185,129,0.15)", color: t.success }}>Paid</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Reports({ t, books, transactions, users, fines, addToast }) {
  const topBooks = [...books].sort((a, b) => (b.totalCopies - b.availableCopies) - (a.totalCopies - a.availableCopies)).slice(0, 5);
  const overdueUsers = users.filter(u => transactions.some(tx => tx.userId === u.id && tx.status === "overdue"));

  return (
    <div style={{ animation: "fadeIn 0.4s ease" }}>
      <div style={{ display: "flex", gap: 10, marginBottom: 24 }}>
        {["Generate PDF Report", "Export to Excel", "Email Report"].map(label => (
          <button key={label} onClick={() => addToast(`${label} — (Demo: report generated successfully)`, "success")} className="btn" style={{ background: t.accent, color: "#fff", padding: "10px 18px", fontSize: 13 }}>
            {label === "Generate PDF Report" ? "📄" : label === "Export to Excel" ? "📊" : "📧"} {label}
          </button>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
        <div className="card" style={{ padding: 22 }}>
          <h3 style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: 16, color: t.text, marginBottom: 16 }}>📈 Most Borrowed Books</h3>
          {topBooks.map((b, i) => (
            <div key={b.id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 0", borderBottom: i < 4 ? `1px solid ${t.border}` : "none" }}>
              <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 12, color: t.textMuted, width: 20 }}>#{i + 1}</span>
              <span>{b.cover}</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontFamily: "'Syne',sans-serif", fontWeight: 700, color: t.text }}>{b.title}</div>
                <div style={{ height: 4, background: t.surface2, borderRadius: 2, marginTop: 4 }}>
                  <div style={{ width: `${((b.totalCopies - b.availableCopies) / b.totalCopies) * 100}%`, height: "100%", background: t.accent, borderRadius: 2 }} />
                </div>
              </div>
              <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 12, color: t.accent }}>{b.totalCopies - b.availableCopies}</span>
            </div>
          ))}
        </div>

        <div className="card" style={{ padding: 22 }}>
          <h3 style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: 16, color: t.text, marginBottom: 16 }}>⚠️ Users with Overdue Books</h3>
          {overdueUsers.length === 0 ? <EmptyState icon="✅" msg="No overdue users" /> :
            overdueUsers.map(u => {
              const userOverdue = transactions.filter(tx => tx.userId === u.id && tx.status === "overdue");
              return (
                <div key={u.id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 0", borderBottom: `1px solid ${t.border}` }}>
                  <div style={{ width: 28, height: 28, background: "rgba(239,68,68,0.2)", borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontFamily: "'Syne',sans-serif", fontWeight: 700, color: t.danger }}>{u.avatar}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontFamily: "'Syne',sans-serif", fontWeight: 700, color: t.text }}>{u.name}</div>
                    <div style={{ fontSize: 11, color: t.textMuted }}>{userOverdue.length} overdue book(s)</div>
                  </div>
                  <span style={{ color: t.danger, fontFamily: "'JetBrains Mono',monospace", fontSize: 12 }}>Rs. {userOverdue.reduce((s, tx) => s + calcFine(tx.dueDate), 0)}</span>
                </div>
              );
            })}
        </div>

        <div className="card" style={{ padding: 22 }}>
          <h3 style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: 16, color: t.text, marginBottom: 16 }}>📊 Genre Distribution</h3>
          {Object.entries(books.reduce((acc, b) => { acc[b.genre] = (acc[b.genre] || 0) + 1; return acc; }, {})).map(([genre, count]) => (
            <div key={genre} style={{ marginBottom: 10 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                <span style={{ fontSize: 13, color: t.text }}>{genre}</span>
                <span style={{ fontSize: 12, color: t.textMuted, fontFamily: "'JetBrains Mono',monospace" }}>{count}</span>
              </div>
              <div style={{ height: 6, background: t.surface2, borderRadius: 3 }}>
                <div style={{ width: `${(count / books.length) * 100}%`, height: "100%", background: t.brandGradient, borderRadius: 3 }} />
              </div>
            </div>
          ))}
        </div>

        <div className="card" style={{ padding: 22 }}>
          <h3 style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: 16, color: t.text, marginBottom: 16 }}>💰 Fine Summary</h3>
          {[
            ["Total Fines Issued", fines.length, t.text],
            ["Pending Collection", fines.filter(f => f.status === "pending").length, t.danger],
            ["Collected", fines.filter(f => f.status === "paid").length, t.success],
            ["Total Pending Amount", `Rs. ${fines.filter(f => f.status === "pending").reduce((s, f) => s + f.amount, 0)}`, t.accent2],
            ["Total Collected", `Rs. ${fines.filter(f => f.status === "paid").reduce((s, f) => s + f.amount, 0)}`, t.success],
          ].map(([label, value, color]) => (
            <div key={label} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: `1px solid ${t.border}` }}>
              <span style={{ fontSize: 14, color: t.textMuted }}>{label}</span>
              <span style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: 14, color }}>{value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function LibrarySettings({ t, addToast }) {
  const [settings, setSettings] = useState({ studentLimit: 3, teacherLimit: 10, studentDays: 14, teacherDays: 30, finePerDay: 5, renewalLimit: 2, gracePeriod: 1 });

  return (
    <div style={{ animation: "fadeIn 0.4s ease", maxWidth: 600 }}>
      <div className="card" style={{ padding: 28 }}>
        <h3 style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: 18, color: t.text, marginBottom: 24 }}>⚙️ Library Rules & Settings</h3>
        <div style={{ display: "grid", gap: 18 }}>
          {[
            ["studentLimit", "Max Books — Student", "books"],
            ["teacherLimit", "Max Books — Faculty", "books"],
            ["studentDays", "Loan Duration — Student", "days"],
            ["teacherDays", "Loan Duration — Faculty", "days"],
            ["finePerDay", "Fine Rate", "Rs/day"],
            ["renewalLimit", "Max Renewals", "times"],
            ["gracePeriod", "Grace Period", "days"],
          ].map(([key, label, unit]) => (
            <div key={key} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16 }}>
              <div>
                <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 600, color: t.text, fontSize: 15 }}>{label}</div>
                <div style={{ fontSize: 12, color: t.textMuted }}>Current: {settings[key]} {unit}</div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <button onClick={() => setSettings(p => ({ ...p, [key]: Math.max(0, p[key] - 1) }))} className="btn" style={{ background: t.surface2, color: t.text, padding: "6px 12px", fontSize: 16, border: `1px solid ${t.border}` }}>−</button>
                <input type="number" value={settings[key]} onChange={e => setSettings(p => ({ ...p, [key]: parseInt(e.target.value) || 0 }))} style={{ width: 60, textAlign: "center", background: t.surface2, border: `1px solid ${t.border}`, color: t.text, borderRadius: 8, padding: "6px 8px", fontFamily: "'JetBrains Mono',monospace", fontSize: 15 }} />
                <button onClick={() => setSettings(p => ({ ...p, [key]: p[key] + 1 }))} className="btn" style={{ background: t.surface2, color: t.text, padding: "6px 12px", fontSize: 16, border: `1px solid ${t.border}` }}>+</button>
              </div>
            </div>
          ))}
        </div>
        <button onClick={() => addToast("Settings saved successfully! ✅", "success")} className="btn" style={{ background: t.brandGradient, color: "#fff", padding: "13px 0", fontSize: 15, width: "100%", marginTop: 24 }}>
          Save Settings
        </button>
      </div>
    </div>
  );
}

function ProfileView({ user, theme: t }) {
  const addToast = useContext(ToastContext);
  const [edit, setEdit] = useState(false);
  const [form, setForm] = useState({ name: user.name, email: user.email });

  return (
    <div style={{ animation: "fadeIn 0.4s ease", maxWidth: 500 }}>
      <div className="card" style={{ padding: 32 }}>
        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <div style={{ width: 72, height: 72, background: t.brandGradient, borderRadius: 20, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: 26, color: "#fff", margin: "0 auto 14px" }}>{user.avatar}</div>
          <h2 style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: 22, color: t.text }}>{user.name}</h2>
          <p style={{ color: t.textMuted, fontSize: 14 }}>{user.email}</p>
          <span className="badge" style={{ background: t.accentSoft, color: t.accent, marginTop: 8, display: "inline-block" }}>{user.role}</span>
        </div>

        {[
          ["User ID", user.id],
          user.studentId && ["Student ID", user.studentId],
          user.facultyId && ["Faculty ID", user.facultyId],
          user.department && ["Department", user.department],
          ["Member Since", formatDate(user.registered)],
        ].filter(Boolean).map(([label, value]) => (
          <div key={label} style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: `1px solid ${t.border}` }}>
            <span style={{ color: t.textMuted, fontSize: 14 }}>{label}</span>
            <span style={{ color: t.text, fontFamily: "'JetBrains Mono',monospace", fontSize: 13 }}>{value}</span>
          </div>
        ))}

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginTop: 20 }}>
          <button onClick={() => setEdit(!edit)} className="btn" style={{ background: t.accent, color: "#fff", padding: "10px 0", fontSize: 14 }}>Edit Profile</button>
          <button onClick={() => addToast("Password reset link sent to your email ✉️", "info")} className="btn" style={{ background: t.surface2, color: t.text, padding: "10px 0", fontSize: 14, border: `1px solid ${t.border}` }}>Change Password</button>
        </div>

        {edit && (
          <div style={{ marginTop: 20, paddingTop: 20, borderTop: `1px solid ${t.border}`, display: "flex", flexDirection: "column", gap: 12, animation: "slideUp 0.3s ease" }}>
            <input className="input" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} placeholder="Full Name" />
            <input className="input" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} placeholder="Email" type="email" />
            <button onClick={() => { addToast("Profile updated successfully! ✅", "success"); setEdit(false); }} className="btn" style={{ background: t.success, color: "#fff", padding: "10px 0" }}>Save Changes</button>
          </div>
        )}
      </div>
    </div>
  );
}

function EmptyState({ icon, msg }) {
  const { theme: t } = useContext(ThemeContext);
  return (
    <div style={{ padding: "48px 24px", textAlign: "center", color: t.textMuted }}>
      <div style={{ fontSize: 48, marginBottom: 12 }}>{icon}</div>
      <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 600, fontSize: 16 }}>{msg}</div>
    </div>
  );
}
