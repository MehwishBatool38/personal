import { useState, useEffect } from "react";
import Nav from "./components/Nav";
import Footer from "./components/Footer";
import Hero from "./components/Hero";
import About from "./components/About";
import Projects from "./components/Projects";
import Skills from "./components/Skills";
import Contact from "./components/Contact";
import AdminPage from "./pages/AdminPage";
import { getProfile } from "./services/profileService";
import { getProjects } from "./services/projectsService";

const DEFAULT_INFO = {
  name: "Mehwish Batool",
  tagline: "Professional Web Developer | UI/UX Designer",
  bio: "I am Mehwish Batool, a passionate and dedicated Web Developer currently pursuing my studies at COMSATS University. I have a strong foundation in both frontend and backend development, along with a keen eye for modern UI/UX design. I specialize in building efficient, scalable web applications and creating engaging, user-focused content.",
  university: "COMSATS University Islamabad",
  location: "Vehari, Punjab, Pakistan",
  email: "mehwishkhan2438@gmail.com",
  phone: "03197420679",
  instagram: "https://www.instagram.com/meh.wishbatool786",
  linkedin: "https://www.linkedin.com/in/mehwish-batool-77029837b",
  facebook: "https://www.facebook.com/share/18d29dpQcg/",
  github: "https://github.com/mehwish-batool",
  available: true,
  years_exp: 1,
  projects_count: 9,
  cv_url: "",
  profile_pic: "/mishi.jpeg"
};

const DEFAULT_PROJECTS = [
  { id: 1, title: "Mini Calculator", description: "Sleek, responsive calculator featuring advanced mathematical functions.", type: "web", technologies: "JavaScript, HTML, CSS", image_url: "https://images.unsplash.com/photo-1587145820266-a5951ee6f620?auto=format&fit=crop&q=80&w=800" },
  { id: 2, title: "CGPA Calculator", description: "Academic performance tracking tool for university students.", type: "web", technologies: "JavaScript, React", image_url: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&q=80&w=800" },
  { id: 3, title: "Dice App", description: "Interactive digital dice simulation with smooth animations.", type: "app", technologies: "Flutter, Dart", screenshots: ["https://images.unsplash.com/photo-1553481187-be93c21490a9?auto=format&fit=crop&q=80&w=800"] },
  { id: 4, title: "BMI Calculator", description: "Health tracking tool providing personalized fitness insights.", type: "app", technologies: "Flutter, Dart", screenshots: ["https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&q=80&w=800"] },
  { id: 5, title: "Task Manager", description: "Productivity application for organizing daily workflows.", type: "web", technologies: "React, Node.js", image_url: "https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?auto=format&fit=crop&q=80&w=800" },
  { id: 6, title: "Library Management", description: "System for book tracking and member registration.", type: "web", technologies: "SQL, Python", image_url: "https://images.unsplash.com/photo-1507842217343-583bb7270b66?auto=format&fit=crop&q=80&w=800" },
  { id: 7, title: "Gym Management", description: "Platform for membership tracking and workout scheduling.", type: "web", technologies: "SQL, React", image_url: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=800" },
  { id: 8, title: "Fee Management", description: "System for tracking student fees and records.", type: "web", technologies: "React, Node.js", year: "2024", category: "In Progress", image_url: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&q=80&w=800" },
  { id: 9, title: "Car Showroom", description: "Inventory tracking system for vehicle dealerships.", type: "web", technologies: "SQL, Python", year: "2024", category: "In Progress", image_url: "https://images.unsplash.com/photo-1542362567-b05503f35259?auto=format&fit=crop&q=80&w=800" },
];

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Serif+Display:ital@0;1&family=Inter:wght@300;400;500;600&display=swap');

:root {
  --cream: #ffffff;
  --cream2: #fff5f8;
  --ink: #4a001a;
  --ink2: #6b0026;
  --ink3: #8b003d;
  --muted: #8b5d6e;
  --muted2: #b48e9d;
  --red: #ff4d94;
  --red2: #ff1a75;
  --border: rgba(74,0,26,0.1);
  --border2: rgba(74,0,26,0.05);
  --font-display: 'Bebas Neue', 'Arial Black', sans-serif;
  --font-serif: 'DM Serif Display', Georgia, serif;
  --font-body: 'Inter', system-ui, sans-serif;
  --section-pad: 120px;
}

*, *::before, *::after { margin:0; padding:0; box-sizing:border-box; }
html { scroll-behavior:smooth; overflow-x:hidden; }

body {
  background: var(--cream);
  color: var(--ink);
  font-family: var(--font-body);
  overflow-x: hidden;
  -webkit-font-smoothing: antialiased;
  cursor: none;
}

/* CUSTOM CURSOR */
.cursor-dot {
  width: 8px; height: 8px; background: var(--red);
  border-radius: 50%; position: fixed; pointer-events: none;
  z-index: 99999; transition: transform 0.1s ease;
  transform: translate(-50%, -50%);
}
.cursor-ring {
  width: 36px; height: 36px;
  border: 1.5px solid var(--ink); border-radius: 50%;
  position: fixed; pointer-events: none; z-index: 99998;
  transition: transform 0.18s ease, width 0.25s, height 0.25s, border-color 0.25s;
  transform: translate(-50%, -50%);
}
.cursor-ring.hovering {
  width: 56px; height: 56px;
  border-color: var(--red);
}

a, button { cursor: none; }

/* SCROLLBAR */
::-webkit-scrollbar { width: 4px; }
::-webkit-scrollbar-track { background: var(--cream2); }
::-webkit-scrollbar-thumb { background: var(--ink); border-radius: 0; }

/* ANIMATIONS */
@keyframes marquee {
  from { transform: translateX(0); }
  to   { transform: translateX(-50%); }
}
@keyframes revealUp {
  from { clip-path: inset(100% 0 0 0); transform: translateY(20px); }
  to   { clip-path: inset(0% 0 0 0); transform: translateY(0); }
}
@keyframes fadeIn {
  from { opacity:0; } to { opacity:1; }
}
@keyframes slideLeft {
  from { opacity:0; transform: translateX(40px); }
  to   { opacity:1; transform: translateX(0); }
}
@keyframes scaleX {
  from { transform: scaleX(0); }
  to   { transform: scaleX(1); }
}
@keyframes countUp {
  from { opacity:0; transform:translateY(20px); }
  to   { opacity:1; transform:translateY(0); }
}
@keyframes spin {
  from { transform: rotate(0deg); }
  to   { transform: rotate(360deg); }
}
@keyframes blink {
  0%,100% { opacity:1; } 50% { opacity:0; }
}
@keyframes lineGrow {
  from { height: 0; }
  to   { height: 100%; }
}

/* REVEAL ON SCROLL */
.rv {
  opacity:0; transform: translateY(50px);
  transition: opacity 0.85s cubic-bezier(0.16,1,0.3,1), transform 0.85s cubic-bezier(0.16,1,0.3,1);
}
.rv.in { opacity:1; transform: translateY(0); }
.rv-l {
  opacity:0; transform: translateX(-50px);
  transition: opacity 0.85s cubic-bezier(0.16,1,0.3,1), transform 0.85s cubic-bezier(0.16,1,0.3,1);
}
.rv-l.in { opacity:1; transform: translateX(0); }
.rv-r {
  opacity:0; transform: translateX(50px);
  transition: opacity 0.85s cubic-bezier(0.16,1,0.3,1), transform 0.85s cubic-bezier(0.16,1,0.3,1);
}
.rv-r.in { opacity:1; transform: translateX(0); }

.rv-d1 { transition-delay: 0.1s !important; }
.rv-d2 { transition-delay: 0.2s !important; }
.rv-d3 { transition-delay: 0.3s !important; }
.rv-d4 { transition-delay: 0.4s !important; }

/* LAYOUT */
.section { padding: var(--section-pad) 0; position: relative; }
.container { max-width: 1180px; margin: 0 auto; padding: 0 40px; }

/* LABEL */
.label {
  font-family: var(--font-body); font-size: 10px; font-weight: 600;
  letter-spacing: 0.2em; text-transform: uppercase; color: var(--muted);
  display: flex; align-items: center; gap: 10px;
}
.label::before {
  content: ''; display: block; width: 28px; height: 1px; background: var(--muted);
}

/* DISPLAY HEADING */
.display {
  font-family: var(--font-display);
  letter-spacing: 0.02em; line-height: 0.9; color: var(--ink);
  font-size: clamp(72px, 9vw, 130px);
}
.display-sm {
  font-family: var(--font-display);
  letter-spacing: 0.02em; line-height: 0.9; color: var(--ink);
  font-size: clamp(52px, 6vw, 88px);
}
.display .red { color: var(--red); }
.display-sm .red { color: var(--red); }

/* SERIF HEADING */
.serif { font-family: var(--font-serif); }

/* BUTTONS */
.btn-dark {
  display: inline-flex; align-items: center; gap: 10px;
  background: var(--ink); color: var(--cream);
  padding: 14px 32px; border-radius: 0;
  font-family: var(--font-body); font-size: 13px; font-weight: 500;
  letter-spacing: 0.08em; text-transform: uppercase;
  text-decoration: none; border: none; cursor: none;
  transition: all 0.3s ease; position: relative; overflow: hidden;
}
.btn-dark::before {
  content: ''; position: absolute; inset: 0;
  background: var(--red); transform: scaleX(0); transform-origin: left;
  transition: transform 0.4s cubic-bezier(0.16,1,0.3,1);
}
.btn-dark:hover { color: var(--ink); letter-spacing: 0.12em; }
.btn-dark:hover::before { transform: scaleX(1); }
.btn-dark span { position: relative; z-index: 1; }

.btn-outline {
  display: inline-flex; align-items: center; gap: 10px;
  background: transparent; color: var(--ink);
  padding: 13px 30px;
  border: 1.5px solid var(--ink);
  font-family: var(--font-body); font-size: 13px; font-weight: 500;
  letter-spacing: 0.08em; text-transform: uppercase;
  text-decoration: none; cursor: none;
  transition: all 0.3s ease;
}
.btn-outline:hover { background: var(--ink); color: var(--cream); }

/* CARDS */
.card-editorial {
  background: var(--cream2); border: 1px solid var(--border);
  padding: 28px 28px; position: relative;
  transition: all 0.4s cubic-bezier(0.16,1,0.3,1);
}
.card-editorial::after {
  content: ''; position: absolute; bottom: 0; left: 0; right: 0;
  height: 3px; background: var(--red); transform: scaleX(0); transform-origin: left;
  transition: transform 0.4s cubic-bezier(0.16,1,0.3,1);
}
.card-editorial:hover { transform: translateY(-4px); box-shadow: 0 20px 60px rgba(0,0,0,0.1); }
.card-editorial:hover::after { transform: scaleX(1); }

/* PROJECT CARDS */
.project-card {
  display: flex; flex-direction: column;
  overflow: hidden; background: var(--cream);
  border: 1px solid var(--border);
  transition: transform 0.4s cubic-bezier(0.16,1,0.3,1), box-shadow 0.4s;
}
.project-card:hover { transform: translateY(-4px); box-shadow: 0 20px 60px rgba(0,0,0,0.06); }
.project-card .project-media { height: 280px; }
@media (min-width: 900px) {
  .project-card.has-media {
    flex-direction: row;
  }
  .project-card.has-media > div:first-child { flex: 4; }
  .project-card.has-media > .project-media { flex: 3; height: auto; border-left: 1px solid var(--border); border-top: none; }
  .project-screenshots-scroll { border-left: 1px solid var(--border); }
}

/* TAG */
.tag-pill {
  display: inline-flex; align-items: center;
  padding: 4px 12px;
  border: 1px solid var(--border);
  font-size: 11px; font-weight: 500; color: var(--muted);
  letter-spacing: 0.04em;
  transition: all 0.2s;
}
.tag-pill:hover { border-color: var(--red); color: var(--red); }

/* NAV */
.nav-link {
  font-size: 12px; font-weight: 500; color: var(--ink);
  letter-spacing: 0.08em; text-transform: uppercase;
  background: none; border: none; cursor: none;
  padding: 4px 0; position: relative;
  transition: color 0.2s;
}
.nav-link::after {
  content: ''; position: absolute; bottom: -2px; left: 0;
  width: 0; height: 1.5px; background: var(--red);
  transition: width 0.3s ease;
}
.nav-link:hover, .nav-link.active { color: var(--red); }
.nav-link:hover::after, .nav-link.active::after { width: 100%; }

/* HAMBURGER */
.hamburger { display:none; flex-direction:column; gap:5px; cursor:none; padding:6px; }
.hamburger span { width:22px; height:1.5px; background:var(--ink); transition:all 0.3s; display:block; }

/* FORM */
input, textarea, select {
  width: 100%; background: transparent;
  border: none; border-bottom: 1.5px solid var(--border);
  padding: 14px 0; color: var(--ink);
  font-family: var(--font-body); font-size: 15px; font-weight: 400;
  outline: none; transition: border-color 0.3s;
}
input:focus, textarea:focus { border-color: var(--red); }
input::placeholder, textarea::placeholder { color: var(--muted2); }
textarea { resize: none; }

/* HORIZONTAL RULE */
.hr { border: none; border-top: 1px solid var(--border); }

/* MARQUEE STRIP */
.marquee-wrap {
  overflow: hidden; border-top: 1px solid var(--border); border-bottom: 1px solid var(--border);
  padding: 14px 0; background: var(--ink); white-space: nowrap;
}
.marquee-track {
  display: inline-flex; gap: 0;
  animation: marquee 20s linear infinite;
}
.marquee-item {
  font-family: var(--font-display); font-size: 22px; color: var(--cream);
  padding: 0 32px; letter-spacing: 0.06em;
  display: flex; align-items: center; gap: 32px;
}
.marquee-dot { width: 6px; height: 6px; border-radius: 50%; background: var(--red); }

/* RESPONSIVE */
@media (max-width: 1000px) {
  :root { --section-pad: 80px; }
  .skills-grid { grid-template-columns: repeat(2,1fr) !important; }
}
@media (max-width: 900px) {
  .hero-grid { grid-template-columns: 1fr !important; }
  .about-grid { grid-template-columns: 1fr !important; }
  .contact-grid { grid-template-columns: 1fr !important; }
  :root { --section-pad: 60px; }
}
@media (max-width: 640px) {
  .skills-grid { grid-template-columns: 1fr !important; }
  .skills-grid > div { border-right: none !important; border-bottom: 1px solid var(--border) !important; }
  .skills-grid > div:last-child { border-bottom: none !important; }
  .nav-links-desktop { display: none !important; }
  .nav-links {
    display: none; flex-direction: column;
    position: fixed; top: 0; right: 0; bottom: 0; width: 80%;
    background: var(--cream); padding: 100px 32px 40px;
    gap: 4px; z-index: 1100; border-left: 1px solid var(--border);
  }
  .nav-links.open { display: flex; }
  .nav-links .nav-link { font-size: 18px; padding: 16px 0; border-bottom: 1px solid var(--border2); }
  .hamburger { display: flex; }
  .nav-name { display: none !important; }
  .hero-photo { justify-content: center !important; margin-top: 30px; }
  :root { --section-pad: 50px; }
  .container { padding: 0 20px; }
  .display { font-size: clamp(60px, 16vw, 90px); }
  .display-sm { font-size: clamp(44px, 12vw, 70px); }
}
`;

export default function App() {
  const [page, setPage] = useState("home");
  const [active, setActive] = useState("hero");
  const [showTop, setShowTop] = useState(false);
  const [info, setInfo] = useState(DEFAULT_INFO);
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    async function load() {
      const [prof, web, app] = await Promise.all([
        getProfile(), getProjects("web"), getProjects("app"),
      ]);
      if (prof) setInfo(prof);
      const allProjects = [
        ...app.map(p => ({ ...p, type: "app" })),
        ...web.map(p => ({ ...p, type: "web" }))
      ].sort((a, b) => parseInt(b.year || 0) - parseInt(a.year || 0));
      
      setProjects(allProjects.length > 0 ? allProjects : DEFAULT_PROJECTS);
    }
    load();
  }, []);

  useEffect(() => {
    if (page !== "home") return;
    const sections = ["hero","about","projects","skills","contact"];
    const obs = new IntersectionObserver(
      (entries) => { entries.forEach((e) => { if (e.isIntersecting) setActive(e.target.id); }); },
      { threshold: 0.2 }
    );
    sections.forEach((id) => { const el = document.getElementById(id); if (el) obs.observe(el); });
    return () => obs.disconnect();
  }, [page]);

  useEffect(() => {
    const fn = () => setShowTop(window.scrollY > 400);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  // Scroll reveal
  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add("in"); }),
      { threshold: 0.08, rootMargin: "0px 0px -40px 0px" }
    );
    document.querySelectorAll(".rv, .rv-l, .rv-r").forEach(el => obs.observe(el));
    return () => obs.disconnect();
  });

  // Custom cursor
  useEffect(() => {
    const dot = document.getElementById("cur-dot");
    const ring = document.getElementById("cur-ring");
    if (!dot || !ring) return;
    const move = (e) => {
      dot.style.left = e.clientX + "px"; dot.style.top = e.clientY + "px";
      ring.style.left = e.clientX + "px"; ring.style.top = e.clientY + "px";
    };
    const hover = () => ring.classList.add("hovering");
    const leave = () => ring.classList.remove("hovering");
    document.addEventListener("mousemove", move);
    document.querySelectorAll("a, button, .card-editorial").forEach(el => {
      el.addEventListener("mouseenter", hover);
      el.addEventListener("mouseleave", leave);
    });
    return () => document.removeEventListener("mousemove", move);
  });

  return (
    <>
      <style>{CSS}</style>
      <div id="cur-dot" className="cursor-dot" />
      <div id="cur-ring" className="cursor-ring" />
      <Nav active={active} page={page} onPageChange={(p) => { setPage(p); window.scrollTo({ top: 0 }); }} />

      {page === "home" && (
        <main>
          <Hero info={info} />
          <About info={info} />
          <Projects projects={projects} />
          <Skills />
          <Contact info={info} />
        </main>
      )}
      {page === "admin" && <AdminPage onBack={() => { setPage("home"); window.scrollTo({ top: 0 }); }} />}
      {page === "home" && <Footer info={info} />}

      {showTop && (
        <button onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          style={{ position:"fixed", bottom:32, right:32, zIndex:999, width:48, height:48,
            background:"var(--ink)", border:"none", color:"var(--cream)", fontSize:20,
            cursor:"none", display:"flex", alignItems:"center", justifyContent:"center",
            transition:"background 0.2s" }}
          onMouseEnter={e=>e.currentTarget.style.background="var(--red)"}
          onMouseLeave={e=>e.currentTarget.style.background="var(--ink)"}
        >↑</button>
      )}
    </>
  );
}
