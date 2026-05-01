import { useState, useEffect, useRef } from "react";

const groups = [
  { name:"Frontend Dev.", num:"01", skills:[{n:"HTML/CSS",p:95},{n:"JavaScript",p:88},{n:"Responsive Design",p:92},{n:"React",p:80}] },
  { name:"Backend & DB",    num:"02", skills:[{n:"SQL",p:85},{n:"Python",p:82},{n:"Node.js",p:75},{n:"Database Management",p:80}] },
  { name:"Programming",     num:"03", skills:[{n:"C++",p:85},{n:"Problem Solving",p:90},{n:"Algorithms",p:78}] },
  { name:"Specialization",  num:"04", skills:[{n:"Flutter",p:90},{n:"Mobile App Dev",p:88},{n:"UI/UX Design",p:85},{n:"Content Writing",p:90}] }
];

export default function Skills() {
  const [animated, setAnimated] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setAnimated(true); }, { threshold:0.15 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  return (
    <section id="skills" className="section" style={{ background:"var(--cream2)", borderTop:"1px solid var(--border)" }}>
      <div className="container" ref={ref}>
        {/* Header */}
        <div style={{ display:"flex", flexDirection:"column", alignItems:"center", textAlign:"center", marginBottom:64 }}>
          <div className="label rv" style={{ marginBottom: 12, justifyContent: "center", color:"var(--muted)" }}>
            <span style={{ "--before-bg":"var(--muted)" }}>Capabilities</span>
          </div>
          <h2 className="display-sm rv rv-d1" style={{ marginBottom: 24, color:"var(--ink)" }}>
            Skills &amp; <span style={{ color:"var(--red)" }}>Tech.</span>
          </h2>
          <div className="rv rv-d2" style={{ width: 1, height: 40, background: "var(--border)" }} />
        </div>

        <div className="skills-grid" style={{ display:"grid", gridTemplateColumns:"repeat(2,1fr)", gap:0 }}>
          {groups.map((g, gi) => (
            <div key={g.name} className="rv" style={{
              padding:"32px 28px",
              borderBottom: gi < 2 ? "1px solid var(--border)" : "none",
              borderRight: gi % 2 === 0 ? "1px solid var(--border)" : "none",
              transitionDelay: `${(gi%2)*0.1}s`,
            }}>
              <div style={{ display:"flex", alignItems:"baseline", gap:12, marginBottom:24 }}>
                <span style={{ fontFamily:"var(--font-display)", fontSize:36, color:"var(--red)", lineHeight:1 }}>{g.num}</span>
                <span style={{ fontSize:13, fontWeight:600, color:"var(--ink)", letterSpacing:"0.04em" }}>{g.name}</span>
              </div>
              <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
                {g.skills.map(s => (
                  <div key={s.n}>
                    <div style={{ display:"flex", justifyContent:"space-between", marginBottom:6 }}>
                      <span style={{ fontSize:12, color:"var(--muted)", fontWeight:500 }}>{s.n}</span>
                      <span style={{ fontSize:10, color:"var(--muted2)", fontFamily:"monospace" }}>{s.p}%</span>
                    </div>
                    <div style={{ width:"100%", height:2, background:"var(--border)", overflow:"hidden" }}>
                      <div style={{
                        height:"100%", background:"var(--red)",
                        width: animated ? `${s.p}%` : "0%",
                        transition:`width 1.4s cubic-bezier(0.16,1,0.3,1) ${gi*0.12+0.2}s`,
                      }}/>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Also familiar with */}
        <div className="rv" style={{ borderTop:"1px solid var(--border)", paddingTop:40, marginTop:0 }}>
          <div style={{ fontSize:10, fontWeight:600, letterSpacing:"0.18em", textTransform:"uppercase", color:"var(--muted2)", marginBottom:20 }}>Also know</div>
          <div style={{ display:"flex", flexWrap:"wrap", gap:10 }}>
            {["Git","GitHub","VS Code","Figma","Responsive Design","SEO","Vite","Technical Writing","Problem Solving"].map(t => (
              <span key={t} style={{
                padding:"5px 14px", border:"1px solid var(--border)",
                fontSize:11, fontWeight:500, color:"var(--muted)",
                letterSpacing:"0.04em",
                transition:"all 0.2s",
                cursor:"default",
              }}
                onMouseEnter={e=>{ e.currentTarget.style.borderColor="var(--red)"; e.currentTarget.style.color="var(--red)"; }}
                onMouseLeave={e=>{ e.currentTarget.style.borderColor="var(--border)"; e.currentTarget.style.color="var(--muted)"; }}
              >{t}</span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
