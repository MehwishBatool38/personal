export default function About({ info }) {
  return (
    <section id="about" className="section" style={{ borderTop:"1px solid var(--border)" }}>
      <div className="container">

        {/* Section label */}
        <div style={{ display:"flex", flexDirection:"column", alignItems:"center", textAlign:"center", marginBottom:64 }}>
          <div className="label rv" style={{ marginBottom: 12, justifyContent: "center" }}>Who I Am</div>
          <h2 className="display-sm rv rv-d1" style={{ marginBottom: 24 }}>About <span className="red">Me.</span></h2>
          <div className="rv rv-d2" style={{ width: 1, height: 40, background: "var(--border)" }} />
        </div>

        <div className="about-grid" style={{ display:"grid", gridTemplateColumns:"1.1fr 0.9fr", gap:80, alignItems:"start" }}>
          {/* Left */}
          <div>
            <p style={{ fontSize:20, fontFamily:"var(--font-serif)", fontStyle:"italic", color:"var(--ink2)", lineHeight:1.75, marginBottom:40 }} className="rv">
              "{info?.bio}"
            </p>
            <hr className="hr" style={{ marginBottom:36 }} />
            <div className="about-info-grid" style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:0 }}>
              {[
                { l:"University", v: info?.university, i:"🎓" },
                { l:"Location",   v: info?.location,   i:"📍" },
                { l:"Email",      v: info?.email,      i:"✉️" },
                { l:"Experience", v:`${info?.years_exp ?? 2}+ Years`, i:"⚡" },
              ].map((item, idx) => (
                <div key={item.l} className="rv" style={{
                  padding:"20px 0",
                  borderBottom:"1px solid var(--border)",
                  borderRight: idx % 2 === 0 ? "1px solid var(--border)" : "none",
                  paddingRight: idx % 2 === 0 ? 24 : 0,
                  paddingLeft: idx % 2 === 1 ? 24 : 0,
                  animationDelay: `${idx * 0.1}s`,
                }}>
                  <div style={{ fontSize:10, fontWeight:600, letterSpacing:"0.15em", textTransform:"uppercase", color:"var(--muted)", marginBottom:6 }}>{item.l}</div>
                  <div style={{ fontSize:14, color:"var(--ink)", fontWeight:500, wordBreak:"break-word" }}>{item.v}</div>
                </div>
              ))}
            </div>
            <div style={{ marginTop:36 }} className="rv rv-d2">
              <a href={info?.github} target="_blank" rel="noreferrer" className="btn-dark">
                <span>View GitHub</span><span>↗</span>
              </a>
            </div>
          </div>

          {/* Right — Timeline */}
          <div className="rv-r">
            <div style={{ fontSize:10, fontWeight:600, letterSpacing:"0.15em", textTransform:"uppercase", color:"var(--muted)", marginBottom:28 }}>Experience</div>
            <div style={{ position:"relative" }}>
              {/* Vertical line */}
              <div style={{ position:"absolute", left:0, top:0, bottom:0, width:1, background:"var(--border)" }} />

              {[
                { period:"2022 — Present", role:"B.S. Software Engineering", company:"COMSATS University", desc:"Focusing on Web & Mobile development, Backend systems, and UI/UX.", accent:"var(--red)" },
                { period:"2024",           role:"Web Developer & Writer",    company:"Largify Solutions",    desc:"Internship — developing web applications and creating high-quality content.", accent:"var(--ink3)" },
                { period:"2023 — Present", role:"Freelance Developer",       company:"Self-Employed",        desc:"Building BMI calculators, Management systems, and Dice apps using Flutter & React.", accent:"var(--ink3)" },
              ].map((t, i) => (
                <div key={i} style={{ paddingLeft:28, paddingBottom: i < 2 ? 36 : 0, position:"relative" }}>
                  <div style={{ position:"absolute", left:-4, top:4, width:9, height:9, borderRadius:"50%", background: i===0 ? "var(--red)" : "var(--muted2)", border:"2px solid var(--cream)" }} />
                  <div style={{ fontSize:10, fontWeight:600, letterSpacing:"0.12em", textTransform:"uppercase", color:"var(--muted2)", marginBottom:6 }}>{t.period}</div>
                  <div style={{ fontFamily:"var(--font-body)", fontSize:15, fontWeight:600, color:"var(--ink)", marginBottom:4 }}>{t.role}</div>
                  <div style={{ fontSize:12, color: t.accent, fontWeight:600, letterSpacing:"0.04em", marginBottom:6 }}>{t.company}</div>
                  <div style={{ fontSize:13, color:"var(--muted)", lineHeight:1.7 }}>{t.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
