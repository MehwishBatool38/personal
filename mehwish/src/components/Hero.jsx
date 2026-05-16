import { useState, useEffect } from "react";

const ROLES = ["Web Developer", "Frontend Expert", "UI/UX Designer", "Content Writer"];

export default function Hero({ info }) {
  const [roleIdx, setRoleIdx] = useState(0);
  const [displayed, setDisplayed] = useState("");
  const [typing, setTyping] = useState(true);

  useEffect(() => {
    const role = ROLES[roleIdx];
    let t;
    if (typing) {
      if (displayed.length < role.length) {
        t = setTimeout(() => setDisplayed(role.slice(0, displayed.length + 1)), 75);
      } else {
        t = setTimeout(() => setTyping(false), 2200);
      }
    } else {
      if (displayed.length > 0) {
        t = setTimeout(() => setDisplayed(displayed.slice(0, -1)), 35);
      } else {
        // Move state updates into a timeout to avoid synchronous setState in effect body
        t = setTimeout(() => {
          setRoleIdx((i) => (i + 1) % ROLES.length);
          setTyping(true);
        }, 0);
      }
    }
    return () => clearTimeout(t);
  }, [displayed, typing, roleIdx]);

  const esc = (s) => (s ?? "").replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));

  const generateCV = () => {
    const w = window.open("", "_blank");
    if (!w) return;
    w.document.write(`<!DOCTYPE html><html><head><meta charset="UTF-8"><title>${esc(info?.name)} — CV</title>
<style>*{margin:0;padding:0;box-sizing:border-box;}body{font-family:'Segoe UI',Arial,sans-serif;background:#fff;color:#111;font-size:13px;line-height:1.6;}.page{max-width:780px;margin:0 auto;padding:48px;}.header{border-bottom:3px solid #C8372D;padding-bottom:24px;margin-bottom:24px;display:flex;justify-content:space-between;align-items:flex-start;}.name{font-size:36px;font-weight:900;letter-spacing:-1px;}.tagline{font-size:13px;color:#555;margin-top:4px;}.contact-info{text-align:right;font-size:12px;color:#444;line-height:1.9;}.contact-info a{color:#C8372D;}.section{margin-bottom:26px;}.section-title{font-size:10px;font-weight:700;letter-spacing:0.14em;text-transform:uppercase;color:#C8372D;border-bottom:1px solid #eee;padding-bottom:6px;margin-bottom:12px;}.bio{font-size:13px;color:#444;line-height:1.85;}.skill-tag{font-size:11px;background:#fff3f2;color:#C8372D;padding:3px 10px;border:1px solid #fccac7;display:inline-block;margin:2px;}@media print{body{-webkit-print-color-adjust:exact;print-color-adjust:exact;}}</style></head><body>
<div class="page"><div class="header"><div><div class="name">${esc(info?.name ?? "Mehwish Batool")}</div><div class="tagline">${esc(info?.tagline ?? "")}</div><div class="tagline" style="margin-top:3px;color:#888;">Professional Web Developer · ${esc(info?.university ?? "COMSATS University")}</div></div><div class="contact-info"><div><a href="mailto:${esc(info?.email)}">${esc(info?.email)}</a></div><div><a href="${esc(info?.linkedin)}">LinkedIn</a></div><div><a href="${esc(info?.github)}">GitHub</a></div><div>${esc(info?.location)}</div></div></div>
<div class="section"><div class="section-title">Profile</div><p class="bio">${esc(info?.bio ?? "")}</p></div>
<div class="section"><div class="section-title">Technical Skills</div><div style="display:flex;flex-wrap:wrap;gap:4px;"><span class="skill-tag">HTML</span><span class="skill-tag">CSS</span><span class="skill-tag">JavaScript</span><span class="skill-tag">SQL</span><span class="skill-tag">Python</span><span class="skill-tag">C++</span><span class="skill-tag">Flutter</span><span class="skill-tag">UI/UX</span></div></div>
</div><script>window.onload=()=>window.print();</script></body></html>`);
    w.document.close();
  };

  return (
    <section id="hero" style={{ minHeight:"100vh", display:"flex", flexDirection:"column", justifyContent:"flex-end", paddingTop:64, position:"relative", overflow:"hidden" }}>

      {/* Big number bg */}


      <div className="container" style={{ position:"relative", zIndex:1, paddingBottom:80 }}>
        {/* Main headline */}
        <div className="hero-grid" style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:48, alignItems:"center" }}>
          
          {/* Left Block */}
          <div style={{ paddingTop: 8 }}>
            <div className="rv" style={{ padding: "8px 24px", background: "var(--cream2)", borderRadius: 30, fontSize: 13, fontWeight: 600, color: "var(--ink)", marginBottom: 24, display: "inline-flex", alignItems: "center", gap: 10 }}>
              <span style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--red)", animation: "blink 2s infinite" }} />
              Open to Work
            </div>

            <h1 className="display rv" style={{ marginBottom:24, whiteSpace: "nowrap" }}>
              MEHWISH <span className="red">BATOOL</span>
            </h1>

            <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:32 }} className="rv rv-d1">
              <span style={{ fontFamily:"var(--font-body)", fontSize:18, fontWeight:400, color:"var(--ink3)", letterSpacing:"0.02em" }}>
                {displayed}<span style={{ borderRight:"2px solid var(--red)", marginLeft:1, animation:"blink 0.5s step-end infinite" }}>&nbsp;</span>
              </span>
            </div>

            <p style={{ fontSize:15, color:"var(--muted)", lineHeight:1.85, maxWidth:480, marginBottom:40 }} className="rv rv-d2">
              {info?.bio ?? "Building modern digital experiences at COMSATS University, Vehari. React · Node.js · Android."}
            </p>

            <div style={{ display:"flex", alignItems:"center", gap:14, flexWrap:"wrap" }} className="rv rv-d3">
              <a href="#contact" className="btn-dark"
                onClick={e => { e.preventDefault(); document.getElementById("contact")?.scrollIntoView({ behavior:"smooth" }); }}>
                <span>Let's Talk</span><span>→</span>
              </a>
              {info?.cv_url ? (
                <a href={info.cv_url} download target="_blank" rel="noreferrer" className="btn-outline">
                  Download CV
                </a>
              ) : (
                <button onClick={generateCV} className="btn-outline">
                  Generate CV
                </button>
              )}
              <a href="#projects" className="btn-outline"
                onClick={e => { e.preventDefault(); document.getElementById("projects")?.scrollIntoView({ behavior:"smooth" }); }}>
                View Work
              </a>
            </div>

            {/* Socials row */}
            <div style={{ display:"flex", gap:14, marginTop:40, flexWrap:"wrap" }} className="rv rv-d4">
              {[
                { label:"LinkedIn",  href: info?.linkedin,  icon:"🔗" },
                { label:"Instagram", href: info?.instagram, icon:"📸" },
                { label:"Facebook",  href: info?.facebook,  icon:"👤" },
                { label:"WhatsApp",  href: `https://wa.me/923197420679`, icon:"💬" },
              ].map(s => (
                <a key={s.label} href={s.href} target="_blank" rel="noreferrer"
                  style={{ 
                    fontSize: 12, fontWeight: 700, color: "var(--cream)", 
                    textDecoration: "none", padding: "12px 24px", 
                    borderRadius: 4, background: "var(--ink)", 
                    transition: "all 0.3s ease", display: "flex", alignItems: "center", gap: 8 
                  }}
                  onMouseEnter={e => {e.currentTarget.style.background = "var(--red)"}}
                  onMouseLeave={e => {e.currentTarget.style.background = "var(--ink)"}}>
                  <span>{s.icon}</span> {s.label}
                </a>
              ))}
            </div>
          </div>

          <div className="hero-photo rv-r" style={{ display: "flex", justifyContent: "flex-end", alignItems: "center" }}>
            <div style={{
              width: "min(420px, 80vw)",
              height: "min(420px, 80vw)",
              borderRadius: "50%",
              overflow: "hidden",
              boxShadow: "0 24px 60px rgba(0,0,0,0.12)",
              border: "4px solid var(--cream)",
              background: "var(--cream2)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}>
              <img src={info?.profile_pic || "/mishi.jpeg"} alt={info?.name || "Mehwish Batool"} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            </div>
          </div>
        </div>
      </div>

    </section>
  );
}
