import { useState, useEffect } from "react";

export default function Nav({ active, page, onPageChange }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  const links = [
    { label: "About", href: "#about", key: "about" },
    { label: "Projects", href: "#projects", key: "projects" },
    { label: "Skills", href: "#skills", key: "skills" },
    { label: "Contact", href: "#contact", key: "contact" },
  ];

  const handleLink = (link) => {
    setOpen(false);
    if (link.key === "blog") { onPageChange("blog"); window.scrollTo({ top:0, behavior:"smooth" }); return; }
    if (page !== "home") {
      onPageChange("home");
      setTimeout(() => document.querySelector(link.href)?.scrollIntoView({ behavior:"smooth" }), 100);
      return;
    }
    document.querySelector(link.href)?.scrollIntoView({ behavior:"smooth" });
  };

  return (
    <>
      <nav style={{
        position:"fixed", top:0, left:0, right:0, zIndex:1000,
        padding:"0 40px", height:64,
        display:"flex", alignItems:"center", justifyContent:"space-between",
        background: scrolled ? "rgba(245,240,232,0.96)" : "transparent",
        backdropFilter: scrolled ? "blur(16px)" : "none",
        borderBottom: scrolled ? "1px solid rgba(13,13,13,0.08)" : "none",
        transition:"all 0.4s ease",
      }}>
        <button onClick={() => { onPageChange("home"); window.scrollTo({top:0}); }}
          style={{ background:"none", border:"none", cursor:"none", display:"flex", alignItems:"center", gap:12 }}>
          <div style={{
            width:36, height:36, background:"var(--ink)",
            display:"flex", alignItems:"center", justifyContent:"center",
            fontFamily:"var(--font-display)", fontSize:14, color:"var(--cream)", letterSpacing:"0.05em",
          }}>MB</div>
          <span className="nav-name" style={{ fontFamily:"var(--font-body)", fontWeight:600, fontSize:14, color:"var(--ink)", letterSpacing:"0.04em" }}>
            Mehwish Batool
          </span>
        </button>

        <div className="nav-links-desktop" style={{ display:"flex", alignItems:"center", gap:36 }}>
          {links.map(l => (
            <button key={l.key} onClick={() => handleLink(l)}
              className={`nav-link${active===l.key||(l.key==="blog"&&page==="blog")?" active":""}`}>
              {l.label}
            </button>
          ))}
          <button onClick={() => onPageChange("admin")}
            style={{ padding:"8px 20px", background:"var(--ink)", color:"var(--cream)", border:"none", cursor:"none",
              fontFamily:"var(--font-body)", fontSize:11, fontWeight:500, letterSpacing:"0.1em", textTransform:"uppercase",
              transition:"background 0.2s" }}
            onMouseEnter={e=>e.currentTarget.style.background="var(--red)"}
            onMouseLeave={e=>e.currentTarget.style.background="var(--ink)"}>
            Admin
          </button>
        </div>

        <div className="hamburger" onClick={() => setOpen(!open)}>
          <span style={{ transform: open ? "rotate(45deg) translate(5px,5px)" : "none" }} />
          <span style={{ opacity: open ? 0 : 1 }} />
          <span style={{ transform: open ? "rotate(-45deg) translate(5px,-5px)" : "none" }} />
        </div>
      </nav>

      {open && <div onClick={() => setOpen(false)} style={{ position:"fixed", inset:0, zIndex:1099, background:"rgba(0,0,0,0.4)" }} />}
      {open && (
        <div className="nav-links open">
          {links.map(l => (
            <button key={l.key} onClick={() => handleLink(l)} className="nav-link"
              style={{ background:"none", border:"none", cursor:"none", width:"100%", textAlign:"left" }}>
              {l.label}
            </button>
          ))}
          <button onClick={() => { setOpen(false); onPageChange("admin"); }}
            className="btn-dark" style={{ marginTop:16 }}>
            <span>Admin Panel</span>
          </button>
        </div>
      )}
    </>
  );
}
