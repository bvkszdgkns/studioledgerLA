import { useState, useRef, useEffect } from "react";

// ── TOKENS
const T = {
  bg: "#0a0a0c", c1: "#111115", c2: "#18181d", c3: "#1f1f25", c4: "#27272e", c5: "#303038",
  ln: "rgba(255,255,255,0.06)", ln2: "rgba(255,255,255,0.11)", ln3: "rgba(255,255,255,0.18)",
  tx: "#f0f0f4", t2: "#a0a0b0", t3: "#505060",
  ac: "#d95f45", ach: "#bf5038", acs: "rgba(217,95,69,0.12)", acs2: "rgba(217,95,69,0.20)",
  gr: "#30d17a", grs: "rgba(48,209,122,0.12)",
  bl: "#4a9df0", bls: "rgba(74,157,240,0.12)",
  ye: "#f5c030", yes: "rgba(245,192,48,0.12)",
  re: "#e05050", res: "rgba(224,80,80,0.12)",
  pu: "#9d78e8", pus: "rgba(157,120,232,0.12)",
  ff: "-apple-system,BlinkMacSystemFont,'SF Pro Display','Helvetica Neue',sans-serif",
  r: "9px", rM: "13px", rL: "17px", rXL: "22px",
};
const CM = { ac: "#d95f45", green: "#30d17a", blue: "#4a9df0", yellow: "#f5c030", red: "#e05050", purple: "#9d78e8", default: "#f0f0f4" };
const AVC = [["#0c1a2e","#4a9df0"],["#051a0d","#30d17a"],["#1c0e06","#e87a4a"],["#160a24","#9d78e8"],["#1a1200","#f5c030"]];

// ── STORAGE
const SK = "editdesk_v5";
function load() { try { const s = localStorage.getItem(SK); return s ? JSON.parse(s) : null; } catch { return null; } }
function save(s) { try { localStorage.setItem(SK, JSON.stringify(s)); } catch {} }

// ── SEED DATA
const SEED_CLIENTS = [
  { id:1, name:"Alex Rivera",  av:"AR", email:"alex@riveramedia.com",   phone:"+1 305 555 0123", type:"YouTube",     rate:850,  status:"Active",   joined:"Jan 2024", contract:"Signed",  lastMsg:"2h ago" },
  { id:2, name:"Zoe Chen",     av:"ZC", email:"zoe@zoechen.co",         phone:"+1 407 555 0187", type:"Instagram",   rate:600,  status:"Active",   joined:"Mar 2024", contract:"Signed",  lastMsg:"1d ago" },
  { id:3, name:"Marcus Webb",  av:"MW", email:"m.webb@webbprod.io",     phone:"+1 212 555 0041", type:"Corporate",   rate:1200, status:"Active",   joined:"Nov 2023", contract:"Signed",  lastMsg:"3d ago" },
  { id:4, name:"Priya Nair",   av:"PN", email:"priya@naircreative.com", phone:"+1 310 555 0098", type:"YouTube",     rate:750,  status:"Inactive", joined:"Feb 2024", contract:"Expired", lastMsg:"3w ago" },
  { id:5, name:"Jake Torres",  av:"JT", email:"jake@torresfilm.com",    phone:"+1 512 555 0214", type:"Documentary", rate:1800, status:"Active",   joined:"Oct 2023", contract:"Signed",  lastMsg:"Today"  },
];
const SEED_PROJECTS = [
  { id:1, client:"Alex Rivera", title:"Episode 47 — Tech Talk",   status:"In Progress", due:"May 14", progress:65,  type:"YouTube",     value:850,  tasks:[{t:"Rough cut",d:true},{t:"Color grade",d:false},{t:"Sound mix",d:false},{t:"Export",d:false}] },
  { id:2, client:"Jake Torres", title:"Documentary — Act II",      status:"Review",      due:"May 12", progress:90,  type:"Documentary", value:1800, tasks:[{t:"Rough cut",d:true},{t:"Color grade",d:true},{t:"Sound mix",d:true},{t:"Client review",d:false}] },
  { id:3, client:"Zoe Chen",    title:"May Lifestyle Reel",        status:"In Progress", due:"May 15", progress:40,  type:"Instagram",   value:600,  tasks:[{t:"Rough cut",d:true},{t:"Color grade",d:false},{t:"Music sync",d:false},{t:"Export",d:false}] },
  { id:4, client:"Marcus Webb", title:"Company Annual Recap",      status:"Completed",   due:"May 1",  progress:100, type:"Corporate",   value:1200, tasks:[{t:"Rough cut",d:true},{t:"Color grade",d:true},{t:"Sound mix",d:true},{t:"Delivered",d:true}] },
  { id:5, client:"Alex Rivera", title:"Episode 46 — Deep Dive",   status:"Completed",   due:"Apr 28", progress:100, type:"YouTube",     value:850,  tasks:[{t:"Rough cut",d:true},{t:"Color grade",d:true},{t:"Sound mix",d:true},{t:"Delivered",d:true}] },
  { id:6, client:"Priya Nair",  title:"Spring Collection Video",   status:"On Hold",     due:"Jun 1",  progress:20,  type:"YouTube",     value:750,  tasks:[{t:"Rough cut",d:true},{t:"Color grade",d:false},{t:"Sound mix",d:false},{t:"Export",d:false}] },
];
const SEED_PURCHASES = [
  { id:1, name:"Adobe Creative Cloud",   cat:"Software", amount:54.99,  date:"May 1",  recurring:true  },
  { id:2, name:"Epidemic Sound",          cat:"Music",    amount:15.00,  date:"May 1",  recurring:true  },
  { id:3, name:"SSD 2TB WD Black",        cat:"Hardware", amount:129.99, date:"Apr 28", recurring:false },
  { id:4, name:"Frame.io Pro",            cat:"Software", amount:25.00,  date:"May 1",  recurring:true  },
  { id:5, name:"DaVinci Resolve Studio",  cat:"Software", amount:295.00, date:"Apr 15", recurring:false },
  { id:6, name:"Artlist License",         cat:"Music",    amount:199.00, date:"Apr 10", recurring:false },
];
const SEED_INCOME = [
  { month:"Jan", earned:2800 }, { month:"Feb", earned:3400 }, { month:"Mar", earned:2900 },
  { month:"Apr", earned:4050 }, { month:"May", earned:3250 },
];
const SEED_PORTFOLIO = [
  { id:1, client:"Alex Rivera", title:"AI Tools That Changed My Workflow", url:"https://youtube.com", views:"284K", earned:850,  date:"Apr 2026", av:"AR" },
  { id:2, client:"Jake Torres", title:"Into the Amazon — Documentary Teaser", url:"https://youtube.com", views:"91K",  earned:1800, date:"Mar 2026", av:"JT" },
  { id:3, client:"Zoe Chen",    title:"Spring Capsule Wardrobe 2026",        url:"https://youtube.com", views:"173K", earned:600,  date:"Mar 2026", av:"ZC" },
  { id:4, client:"Marcus Webb", title:"WebbProd Annual Company Recap",       url:"https://youtube.com", views:"12K",  earned:1200, date:"May 2026", av:"MW" },
];
const TMPL = [
  { label:"Project delivered", body:"Hi {name}, your project is ready! Files have been uploaded to your Drive folder. Let me know if you'd like any revisions — looking forward to your feedback!" },
  { label:"Revision received",  body:"Hi {name}, thanks for the notes! I'll have the updated version to you within 48 hours. Feel free to reach out if anything else comes up." },
  { label:"Invoice reminder",   body:"Hi {name}, just a friendly reminder that invoice #{inv} for ${amount} is due on {date}. Please let me know if you have any questions!" },
  { label:"Project kickoff",    body:"Hi {name}, excited to get started! I'll have a rough cut ready by {date}. Let me know if you have any reference material or direction in mind." },
];

// ── HELPERS
const nowTime = () => new Date().toLocaleTimeString("en-US", { hour:"numeric", minute:"2-digit", second:"2-digit" });
const nowFull = () => new Date().toLocaleDateString("en-US", { weekday:"long", month:"long", day:"numeric", year:"numeric" });
const nowMY   = () => new Date().toLocaleDateString("en-US", { month:"long", year:"numeric" });
const todayN  = () => new Date().getDate();
const fdow    = () => new Date(new Date().getFullYear(), new Date().getMonth(), 1).getDay();
const dimth   = () => new Date(new Date().getFullYear(), new Date().getMonth()+1, 0).getDate();
const fmtSec  = (s) => { const h=Math.floor(s/3600), m=Math.floor((s%3600)/60), sc=s%60; return `${String(h).padStart(2,"0")}:${String(m).padStart(2,"0")}:${String(sc).padStart(2,"0")}`; };
const fmtHr   = (s) => (s/3600).toFixed(2)+"h";

// ── PRIMITIVES
function Av({ label="", idx=0, size=38 }) {
  const [bg,fg] = AVC[idx % AVC.length];
  return <div style={{ width:size, height:size, borderRadius:"50%", background:bg, color:fg, display:"flex", alignItems:"center", justifyContent:"center", fontWeight:600, fontSize:size*0.29, flexShrink:0 }}>{label}</div>;
}

function Chip({ children, color="dim" }) {
  const m = { green:[T.grs,T.gr], blue:[T.bls,T.bl], yellow:[T.yes,T.ye], red:[T.res,T.re], ac:[T.acs,T.ac], purple:[T.pus,T.pu], dim:["rgba(255,255,255,0.05)",T.t3] };
  const [bg,fg] = m[color] || m.dim;
  return <span style={{ background:bg, color:fg, fontSize:10, fontWeight:600, padding:"2px 8px", borderRadius:20, letterSpacing:".04em", textTransform:"uppercase", whiteSpace:"nowrap" }}>{children}</span>;
}

function SChip({ s }) {
  const m = { "Active":"green","Inactive":"dim","In Progress":"blue","Review":"yellow","Completed":"green","On Hold":"red","Signed":"green","Expired":"red","Pending":"yellow" };
  return <Chip color={m[s]||"dim"}>{s}</Chip>;
}

function Bar({ v, color }) {
  return <div style={{ background:"rgba(255,255,255,0.05)", borderRadius:4, height:4, overflow:"hidden" }}>
    <div style={{ width:`${Math.min(v,100)}%`, height:"100%", background:color||T.ac, borderRadius:4, transition:"width .5s ease" }} />
  </div>;
}

function Card({ children, style={}, onClick }) {
  const [hov, sh] = useState(false);
  return <div onClick={onClick} onMouseEnter={()=>sh(true)} onMouseLeave={()=>sh(false)}
    style={{ background:T.c2, border:`1px solid ${hov&&onClick?T.ln2:T.ln}`, borderRadius:T.rL, padding:"1.1rem 1.3rem", transition:"all .2s", cursor:onClick?"pointer":"default", transform:hov&&onClick?"translateY(-1px)":"none", ...style }}>
    {children}
  </div>;
}

function FI({ style={}, ...p }) {
  return <input {...p} style={{ background:T.c3, border:`1px solid ${T.ln2}`, borderRadius:T.r, color:T.tx, fontSize:13, padding:"9px 13px", outline:"none", width:"100%", boxSizing:"border-box", fontFamily:T.ff, transition:"border-color .15s", ...style }}
    onFocus={e => e.target.style.borderColor = T.ac}
    onBlur={e => e.target.style.borderColor = T.ln2} />;
}

function FS({ children, style={}, ...p }) {
  return <select {...p} style={{ background:T.c3, border:`1px solid ${T.ln2}`, borderRadius:T.r, color:T.tx, fontSize:13, padding:"9px 13px", outline:"none", width:"100%", boxSizing:"border-box", fontFamily:T.ff, ...style }}>{children}</select>;
}

function Btn({ children, v="ghost", style={}, ...p }) {
  const [hov, sh] = useState(false);
  const base = { display:"inline-flex", alignItems:"center", gap:6, padding:"8px 16px", borderRadius:T.r, fontSize:13, fontWeight:500, cursor:"pointer", border:"none", transition:"all .15s", fontFamily:T.ff };
  const vs = {
    primary: { background:hov?T.ach:T.ac, color:"#fff", boxShadow:hov?"0 4px 14px rgba(217,95,69,.3)":"none" },
    ghost:   { background:hov?"rgba(255,255,255,.07)":"rgba(255,255,255,.03)", color:T.t2, border:`1px solid ${T.ln2}` },
    save:    { background:hov?"#158a3a":"#1a9e44", color:"#fff", boxShadow:hov?"0 4px 14px rgba(26,158,68,.3)":"none" },
    danger:  { background:hov?T.res:"transparent", color:T.re, border:`1px solid ${T.res}` },
  };
  return <button {...p} onMouseEnter={()=>sh(true)} onMouseLeave={()=>sh(false)} style={{ ...base, ...(vs[v]||vs.ghost), ...style }}>{children}</button>;
}

function Modal({ children, onClose }) {
  return <div onClick={onClose} style={{ position:"fixed", inset:0, background:"rgba(0,0,0,.82)", zIndex:400, display:"flex", alignItems:"center", justifyContent:"center", backdropFilter:"blur(10px)" }}>
    <div onClick={e=>e.stopPropagation()} style={{ background:T.c1, border:`1px solid ${T.ln2}`, borderRadius:T.rXL, padding:"1.75rem", width:420, maxWidth:"93vw", maxHeight:"88vh", overflowY:"auto", boxShadow:"0 40px 80px rgba(0,0,0,.6)" }}>
      {children}
    </div>
  </div>;
}

function Hdiv() { return <div style={{ height:".5px", background:T.ln, margin:".75rem 0" }} />; }
function SL({ children }) { return <p style={{ margin:"0 0 .7rem", fontSize:10, fontWeight:600, color:T.t3, textTransform:"uppercase", letterSpacing:".09em" }}>{children}</p>; }

// ── EDITABLE VALUE
function EV({ value, onChange, num=false }) {
  const [ed, se] = useState(false);
  const [dr, sd] = useState(String(value));
  const ref = useRef();
  const start = () => { sd(String(value)); se(true); setTimeout(()=>ref.current?.select(),20); };
  const commit = () => { se(false); if(num) { const n=parseFloat(dr.replace(/[^0-9.]/g,"")); if(!isNaN(n)) onChange(n); } else { if(dr.trim()) onChange(dr.trim()); } };
  if(ed) return <input ref={ref} value={dr} onChange={e=>sd(e.target.value)} onBlur={commit} onKeyDown={e=>{if(e.key==="Enter")commit(); if(e.key==="Escape")se(false);}}
    style={{ background:"transparent", border:"none", borderBottom:`1px solid ${T.ac}`, color:"inherit", fontSize:"inherit", fontWeight:"inherit", fontFamily:T.ff, outline:"none", minWidth:20, padding:"0 0 1px" }} />;
  return <span onClick={start} title="Click to edit" style={{ cursor:"text", borderBottom:"1px dashed transparent", transition:"border-color .15s" }}
    onMouseEnter={e=>e.currentTarget.style.borderBottomColor=T.t3}
    onMouseLeave={e=>e.currentTarget.style.borderBottomColor="transparent"}>{typeof value==="number"?value.toLocaleString():value}</span>;
}

// ── STAT CARD (editable + removable)
function SC2({ card, onUpdate, onRemove }) {
  const [hov, sh] = useState(false);
  const vc = CM[card.color] || T.tx;
  return <div onMouseEnter={()=>sh(true)} onMouseLeave={()=>sh(false)} style={{ background:T.c2, border:`1px solid ${hov?T.ln2:T.ln}`, borderRadius:T.rL, padding:"1rem 1.1rem", position:"relative", transition:"all .2s", transform:hov?"translateY(-1px)":"none" }}>
    {hov && onRemove && <button onClick={()=>onRemove(card.id)} style={{ position:"absolute", top:8, right:8, background:"none", border:"none", color:T.t3, cursor:"pointer", fontSize:13, padding:2 }} onMouseEnter={e=>e.currentTarget.style.color=T.re} onMouseLeave={e=>e.currentTarget.style.color=T.t3}><i className="ti ti-x" /></button>}
    <p style={{ margin:"0 0 5px", fontSize:10, color:T.t3, textTransform:"uppercase", letterSpacing:".09em", fontWeight:500 }}>
      <EV value={card.label} onChange={v=>onUpdate({...card,label:v})} />
    </p>
    <p style={{ margin:0, fontSize:22, fontWeight:700, color:vc, letterSpacing:"-.025em", lineHeight:1.1 }}>
      {card.pre&&<span style={{ fontSize:13, fontWeight:500, opacity:.7 }}>{card.pre}</span>}
      <EV value={card.value} onChange={v=>onUpdate({...card,value:v})} num={card.num} />
      {card.suf&&<span style={{ fontSize:12, fontWeight:400, color:T.t3 }}>{card.suf}</span>}
    </p>
    {card.sub&&<p style={{ margin:"4px 0 0", fontSize:11, color:T.t3 }}>{card.sub}</p>}
  </div>;
}

// ── STAT GRID
function SGrid({ cards, setCards }) {
  const [showAdd, sa] = useState(false);
  const [form, sf] = useState({ label:"", value:"", sub:"", pre:"", color:"default" });
  const cols = ["default","green","blue","yellow","ac","red","purple"];
  const addCard = () => {
    if (!form.label.trim()) return;
    const n = parseFloat(form.value.replace(/[^0-9.]/g,""));
    setCards(c=>[...c,{ id:Date.now(), label:form.label, value:isNaN(n)?form.value:n, sub:form.sub, pre:form.pre, color:form.color, num:!isNaN(n) }]);
    sf({ label:"", value:"", sub:"", pre:"", color:"default" }); sa(false);
  };
  return <>
    <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(140px,1fr))", gap:10, marginBottom:"1.3rem" }}>
      {cards.map(card=><SC2 key={card.id} card={card} onUpdate={u=>setCards(c=>c.map(x=>x.id===u.id?u:x))} onRemove={id=>setCards(c=>c.filter(x=>x.id!==id))} />)}
      <button onClick={()=>sa(true)} style={{ background:"rgba(255,255,255,.02)", border:`1px dashed ${T.ln2}`, borderRadius:T.rL, padding:"1rem", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:6, cursor:"pointer", color:T.t3, transition:"all .15s", minHeight:78 }}
        onMouseEnter={e=>{e.currentTarget.style.background="rgba(255,255,255,.04)"; e.currentTarget.style.borderColor=T.ln3;}}
        onMouseLeave={e=>{e.currentTarget.style.background="rgba(255,255,255,.02)"; e.currentTarget.style.borderColor=T.ln2;}}>
        <i className="ti ti-plus" style={{ fontSize:16 }} /><span style={{ fontSize:10, fontWeight:500, textTransform:"uppercase", letterSpacing:".05em" }}>Add card</span>
      </button>
    </div>
    {showAdd && <Modal onClose={()=>sa(false)}>
      <p style={{ margin:"0 0 1.2rem", fontSize:17, fontWeight:600, color:T.tx }}>Add metric card</p>
      <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
        <FI placeholder="Label (e.g. Net Revenue)" value={form.label} onChange={e=>sf(f=>({...f,label:e.target.value}))} />
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8 }}>
          <FI placeholder='Prefix e.g. "$"' value={form.pre} onChange={e=>sf(f=>({...f,pre:e.target.value}))} />
          <FI placeholder="Value e.g. 4200" value={form.value} onChange={e=>sf(f=>({...f,value:e.target.value}))} />
        </div>
        <FI placeholder="Subtitle (optional)" value={form.sub} onChange={e=>sf(f=>({...f,sub:e.target.value}))} />
        <div style={{ display:"flex", gap:6 }}>
          {cols.map(col=><button key={col} onClick={()=>sf(f=>({...f,color:col}))} style={{ width:22, height:22, borderRadius:"50%", background:CM[col]||T.tx, border:`2.5px solid ${form.color===col?"#fff":"transparent"}`, cursor:"pointer", opacity:form.color===col?1:.4, transition:"all .15s" }} />)}
        </div>
      </div>
      <div style={{ display:"flex", gap:8, marginTop:"1.2rem" }}>
        <Btn v="primary" onClick={addCard} style={{ flex:1, justifyContent:"center" }}>Add card</Btn>
        <Btn v="ghost" onClick={()=>sa(false)}>Cancel</Btn>
      </div>
    </Modal>}
  </>;
}

// ── NAV
const PAGES = [
  { id:"home",      icon:"ti-layout-dashboard", label:"Dashboard"   },
  { id:"clients",   icon:"ti-users",            label:"Clients"     },
  { id:"projects",  icon:"ti-layout-kanban",    label:"Projects"    },
  { id:"finance",   icon:"ti-chart-bar",        label:"Earnings"    },
  { id:"expenses",  icon:"ti-receipt",          label:"Expenses"    },
  { id:"calendar",  icon:"ti-calendar",         label:"Calendar"    },
  { id:"templates", icon:"ti-template",         label:"Templates"   },
  { id:"delivery",  icon:"ti-package",          label:"Delivery"    },
  { id:"timer",     icon:"ti-clock",            label:"Time Tracker"},
  { id:"portfolio", icon:"ti-player-play",      label:"Portfolio"   },
];

function Nav({ page, setPage }) {
  return <div style={{ display:"flex", gap:2, padding:"0 0 1.2rem", borderBottom:`1px solid ${T.ln}`, marginBottom:"1.75rem", flexWrap:"wrap" }}>
    {PAGES.map(n => {
      const a = page===n.id;
      return <button key={n.id} onClick={()=>setPage(n.id)} style={{ display:"flex", alignItems:"center", gap:6, padding:"6px 13px", borderRadius:T.r, border:a?`1px solid rgba(217,95,69,.28)`:"1px solid transparent", background:a?T.acs:"transparent", color:a?T.ac:T.t3, fontSize:12, fontWeight:a?600:400, cursor:"pointer", transition:"all .15s", fontFamily:T.ff }}>
        <i className={`ti ${n.icon}`} style={{ fontSize:14 }} />{n.label}
      </button>;
    })}
  </div>;
}

// ── SAVE BAR
function SaveBar({ dirty, onSave, onDiscard }) {
  if (!dirty) return null;
  return <div style={{ position:"fixed", bottom:24, left:"50%", transform:"translateX(-50%)", zIndex:500, background:T.c1, border:`1px solid ${T.ln2}`, borderRadius:T.rXL, padding:"10px 18px", display:"flex", alignItems:"center", gap:12, boxShadow:"0 20px 60px rgba(0,0,0,.7)", backdropFilter:"blur(20px)", whiteSpace:"nowrap" }}>
    <div style={{ width:7, height:7, borderRadius:"50%", background:T.ye, boxShadow:`0 0 8px ${T.ye}`, flexShrink:0 }} />
    <span style={{ fontSize:13, color:T.t2, fontFamily:T.ff }}>Unsaved changes</span>
    <Btn v="ghost" onClick={onDiscard} style={{ padding:"5px 12px", fontSize:12 }}>Discard</Btn>
    <Btn v="save" onClick={onSave} style={{ padding:"5px 14px", fontSize:12 }}><i className="ti ti-device-floppy" style={{ fontSize:13 }} />Save</Btn>
  </div>;
}

// ── MSG MODAL
function MsgModal({ client, msgs, onClose, onSend }) {
  const [inp, si] = useState("");
  const bot = useRef();
  useEffect(()=>{ bot.current?.scrollIntoView({behavior:"smooth"}); }, [msgs]);
  const send = () => { if(!inp.trim()) return; onSend(client.id, inp.trim()); si(""); };
  return <Modal onClose={onClose}>
    <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:"1rem", paddingBottom:"1rem", borderBottom:`1px solid ${T.ln}` }}>
      <Av label={client.av} idx={client.id-1} />
      <div style={{ flex:1 }}><p style={{ margin:0, fontWeight:600, fontSize:15, color:T.tx }}>{client.name}</p><p style={{ margin:0, fontSize:11, color:T.t3 }}>{client.type}</p></div>
      <button onClick={onClose} style={{ background:"none", border:"none", color:T.t3, fontSize:18, cursor:"pointer" }}><i className="ti ti-x" /></button>
    </div>
    <div style={{ maxHeight:260, overflowY:"auto", display:"flex", flexDirection:"column", gap:10, marginBottom:"1rem" }}>
      {msgs.map((m,i)=><div key={i} style={{ display:"flex", flexDirection:m.from==="me"?"row-reverse":"row", alignItems:"flex-end", gap:8 }}>
        <div style={{ background:m.from==="me"?T.ac:T.c3, color:"#fff", borderRadius:m.from==="me"?"14px 14px 3px 14px":"14px 14px 14px 3px", padding:"9px 13px", fontSize:13, maxWidth:"78%", lineHeight:1.55 }}>
          <p style={{ margin:0 }}>{m.text}</p>
          <p style={{ margin:"4px 0 0", fontSize:10, opacity:.5, textAlign:m.from==="me"?"right":"left" }}>{m.time}</p>
        </div>
      </div>)}
      <div ref={bot} />
    </div>
    <div style={{ display:"flex", gap:8 }}>
      <FI value={inp} onChange={e=>si(e.target.value)} onKeyDown={e=>e.key==="Enter"&&send()} placeholder="Message…" style={{ flex:1 }} />
      <Btn v="primary" onClick={send}><i className="ti ti-send" style={{ fontSize:13 }} /></Btn>
    </div>
  </Modal>;
}

// ── INV MODAL
function InvModal({ client, project, onClose }) {
  const [paid, sp] = useState(false);
  const inv = `INV-${String(client.id).padStart(3,"0")}${Date.now().toString().slice(-4)}`;
  const due = new Date(); due.setDate(due.getDate()+14);
  const ds = due.toLocaleDateString("en-US",{month:"short",day:"numeric",year:"numeric"});
  return <Modal onClose={onClose}>
    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:"1.2rem" }}>
      <div><p style={{ margin:"0 0 2px", fontSize:10, color:T.t3, textTransform:"uppercase", letterSpacing:".09em" }}>Invoice</p><p style={{ margin:0, fontWeight:700, fontSize:22, color:T.tx, letterSpacing:"-.025em" }}>{inv}</p></div>
      <div style={{ textAlign:"right" }}><SChip s={paid?"Active":"Pending"} /><p style={{ margin:"6px 0 0", fontSize:11, color:T.t3 }}>Due {ds}</p></div>
    </div>
    <Hdiv />
    <div style={{ display:"flex", justifyContent:"space-between", marginBottom:".5rem" }}>
      <div><p style={{ margin:"0 0 2px", fontSize:10, color:T.t3, textTransform:"uppercase" }}>Bill to</p><p style={{ margin:0, fontWeight:600, color:T.tx }}>{client.name}</p><p style={{ margin:0, fontSize:12, color:T.t3 }}>{client.email}</p></div>
      <div style={{ textAlign:"right" }}><p style={{ margin:"0 0 2px", fontSize:10, color:T.t3, textTransform:"uppercase" }}>Project</p><p style={{ margin:0, fontSize:13, color:T.tx }}>{project||"Video editing services"}</p></div>
    </div>
    <Hdiv />
    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"1.2rem" }}>
      <p style={{ margin:0, color:T.t2, fontSize:14 }}>Video editing services</p>
      <p style={{ margin:0, fontWeight:700, fontSize:22, color:T.ac, letterSpacing:"-.025em" }}>${client.rate.toLocaleString()}</p>
    </div>
    <div style={{ display:"flex", gap:8 }}>
      <Btn v="primary" style={{ flex:1, justifyContent:"center" }} onClick={()=>navigator.clipboard?.writeText(`Invoice ${inv}\nTo: ${client.name}\nAmount: $${client.rate}\nDue: ${ds}`)}>
        <i className="ti ti-copy" style={{ fontSize:13 }} />Copy Invoice
      </Btn>
      <Btn v="ghost" onClick={()=>sp(p=>!p)}>{paid?<><i className="ti ti-x" style={{ fontSize:13 }} />Unpaid</>:<><i className="ti ti-check" style={{ fontSize:13 }} />Mark Paid</>}</Btn>
      <button onClick={onClose} style={{ background:"none", border:"none", color:T.t3, cursor:"pointer", fontSize:18 }}><i className="ti ti-x" /></button>
    </div>
  </Modal>;
}

// ══ PAGES ══════════════════════════════════════════════════════════════════════

// ── HOME
function HomePage({ clients, projects, setPage, cards, setCards }) {
  const [time, st] = useState(nowTime());
  useEffect(()=>{ const i=setInterval(()=>st(nowTime()),1000); return ()=>clearInterval(i); },[]);
  const ap = projects.filter(p=>p.status==="In Progress"||p.status==="Review");
  const nc = clients.filter(c=>c.lastMsg==="3w ago");
  return <div>
    <div style={{ marginBottom:"1.75rem" }}>
      <p style={{ margin:"0 0 2px", fontSize:11, color:T.t3 }}>{nowFull()}</p>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-end" }}>
        <h2 style={{ margin:0, fontSize:26, fontWeight:700, color:T.tx, letterSpacing:"-.035em" }}>Good morning</h2>
        <p style={{ margin:0, fontSize:22, fontWeight:300, color:T.t3, letterSpacing:"-.02em", fontVariantNumeric:"tabular-nums" }}>{time}</p>
      </div>
    </div>
    <SGrid cards={cards} setCards={setCards} />
    <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12, marginBottom:"1.25rem" }}>
      <Card><SL>Active Projects</SL>
        {ap.slice(0,3).map(p=><div key={p.id} style={{ marginBottom:10 }}>
          <div style={{ display:"flex", justifyContent:"space-between", marginBottom:5 }}>
            <p style={{ margin:0, fontSize:12, color:T.tx, fontWeight:500 }}>{p.title.slice(0,26)}{p.title.length>26?"…":""}</p>
            <p style={{ margin:0, fontSize:11, color:T.t3 }}>Due {p.due}</p>
          </div>
          <Bar v={p.progress} color={p.status==="Review"?T.ye:T.bl} />
        </div>)}
        {ap.length===0&&<p style={{ margin:0, fontSize:12, color:T.t3 }}>No active projects</p>}
      </Card>
      <Card><SL>Alerts</SL>
        {nc.map(cl=><div key={cl.id} style={{ display:"flex", gap:9, alignItems:"flex-start", marginBottom:8 }}>
          <i className="ti ti-clock" style={{ fontSize:13, color:T.t3, marginTop:1 }} />
          <p style={{ margin:0, fontSize:12, color:T.tx }}>No contact: <span style={{ color:T.t2 }}>{cl.name}</span> — {cl.lastMsg}</p>
        </div>)}
        {nc.length===0&&<p style={{ margin:0, fontSize:12, color:T.t3 }}>All clear ✓</p>}
      </Card>
    </div>
    <Card><SL>Quick Actions</SL>
      <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
        {[["ti-users","Clients","clients"],["ti-layout-kanban","Projects","projects"],["ti-chart-bar","Earnings","finance"],["ti-package","Delivery","delivery"],["ti-clock","Timer","timer"],["ti-player-play","Portfolio","portfolio"]].map(([ic,lb,pg])=>(
          <Btn key={pg} v="ghost" onClick={()=>setPage(pg)}><i className={`ti ${ic}`} style={{ fontSize:13 }} />{lb}</Btn>
        ))}
      </div>
    </Card>
  </div>;
}

// ── CLIENTS
function ClientsPage({ clients, setClients, onMsg, onInv, cards, setCards }) {
  const [srch, ss] = useState("");
  const [filt, sf] = useState("All");
  const fil = clients.filter(c=>{
    const q=srch.toLowerCase();
    return (c.name.toLowerCase().includes(q)||c.type.toLowerCase().includes(q)) && (filt==="All"||c.status===filt);
  });
  return <div>
    <h2 style={{ margin:"0 0 1.25rem", fontSize:22, fontWeight:700, color:T.tx, letterSpacing:"-.03em" }}>Clients</h2>
    <SGrid cards={cards} setCards={setCards} />
    <div style={{ display:"flex", gap:8, marginBottom:"1.25rem", flexWrap:"wrap" }}>
      <FI value={srch} onChange={e=>ss(e.target.value)} placeholder="Search clients…" style={{ flex:1, minWidth:160 }} />
      {["All","Active","Inactive"].map(x=><Btn key={x} v={filt===x?"primary":"ghost"} onClick={()=>sf(x)}>{x}</Btn>)}
    </div>
    <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
      {fil.map((cl,i)=><Card key={cl.id} style={{ padding:"1rem 1.25rem" }}>
        <div style={{ display:"flex", alignItems:"center", gap:14 }}>
          <Av label={cl.av} idx={i} />
          <div style={{ flex:1, minWidth:0 }}>
            <div style={{ display:"flex", alignItems:"center", gap:8, flexWrap:"wrap", marginBottom:4 }}>
              <p style={{ margin:0, fontWeight:600, fontSize:14, color:T.tx }}><EV value={cl.name} onChange={v=>setClients(p=>p.map(x=>x.id===cl.id?{...x,name:v}:x))} /></p>
              <SChip s={cl.status} /><Chip color="dim">{cl.type}</Chip>
            </div>
            <p style={{ margin:0, fontSize:11, color:T.t3 }}>{cl.email} · {cl.phone}</p>
            <div style={{ display:"flex", gap:8, alignItems:"center", marginTop:4 }}>
              <span style={{ fontSize:10, color:T.t3 }}>Contract:</span><SChip s={cl.contract} />
              <span style={{ fontSize:10, color:T.t3 }}>Last: {cl.lastMsg}</span>
            </div>
          </div>
          <div style={{ textAlign:"right", flexShrink:0, display:"flex", flexDirection:"column", gap:6, alignItems:"flex-end" }}>
            <p style={{ margin:0, fontWeight:700, fontSize:15, color:T.tx }}>
              $<EV value={cl.rate} onChange={v=>setClients(p=>p.map(x=>x.id===cl.id?{...x,rate:Number(v)}:x))} num />
              <span style={{ fontWeight:400, color:T.t3, fontSize:11 }}>/mo</span>
            </p>
            <div style={{ display:"flex", gap:6 }}>
              <Btn v="ghost" onClick={()=>onMsg(cl)} style={{ fontSize:11, padding:"4px 10px" }}><i className="ti ti-message" style={{ fontSize:12 }} />Chat</Btn>
              <Btn v="ghost" onClick={()=>onInv(cl)} style={{ fontSize:11, padding:"4px 10px" }}><i className="ti ti-file-invoice" style={{ fontSize:12 }} />Invoice</Btn>
            </div>
          </div>
        </div>
      </Card>)}
    </div>
  </div>;
}

// ── PROJECTS
function ProjectsPage({ projects, setProjects, cards, setCards }) {
  const [filt, sf] = useState("All");
  const [exp, se] = useState(null);
  const fil = filt==="All"?projects:projects.filter(p=>p.status===filt);
  const SC = { "In Progress":T.bl,"Review":T.ye,"Completed":T.gr,"On Hold":T.re };
  const tog = (pid,ti)=>setProjects(prev=>prev.map(p=>{
    if(p.id!==pid) return p;
    const tasks=p.tasks.map((t,i)=>i===ti?{...t,d:!t.d}:t);
    return {...p, tasks, progress:Math.round(tasks.filter(t=>t.d).length/tasks.length*100)};
  }));
  return <div>
    <h2 style={{ margin:"0 0 1.25rem", fontSize:22, fontWeight:700, color:T.tx, letterSpacing:"-.03em" }}>Projects</h2>
    <SGrid cards={cards} setCards={setCards} />
    <div style={{ display:"flex", gap:6, marginBottom:"1.25rem", flexWrap:"wrap" }}>
      {["All","In Progress","Review","Completed","On Hold"].map(x=><Btn key={x} v={filt===x?"primary":"ghost"} onClick={()=>sf(x)}>{x}</Btn>)}
    </div>
    <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
      {fil.map(p=><div key={p.id}>
        <Card onClick={()=>se(exp===p.id?null:p.id)} style={{ padding:"1rem 1.25rem", borderRadius:exp===p.id?`${T.rL} ${T.rL} 0 0`:T.rL }}>
          <div style={{ display:"flex", alignItems:"flex-start", gap:12 }}>
            <div style={{ flex:1, minWidth:0 }}>
              <div style={{ display:"flex", gap:8, alignItems:"center", flexWrap:"wrap", marginBottom:4 }}>
                <p style={{ margin:0, fontWeight:600, fontSize:14, color:T.tx }}>{p.title}</p>
                <SChip s={p.status} /><Chip color="dim">{p.type}</Chip>
              </div>
              <p style={{ margin:"0 0 8px", fontSize:11, color:T.t3 }}>{p.client} · Due {p.due}</p>
              <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                <div style={{ flex:1 }}><Bar v={p.progress} color={SC[p.status]||T.ac} /></div>
                <p style={{ margin:0, fontSize:10, color:T.t3, minWidth:28 }}>{p.progress}%</p>
              </div>
            </div>
            <div style={{ textAlign:"right", flexShrink:0 }}>
              <p style={{ margin:0, fontWeight:700, fontSize:15, color:T.tx }}>${p.value.toLocaleString()}</p>
              <p style={{ margin:"3px 0 5px", fontSize:10, color:T.t3 }}>{p.tasks.filter(t=>t.d).length}/{p.tasks.length} tasks</p>
              <i className={`ti ${exp===p.id?"ti-chevron-up":"ti-chevron-down"}`} style={{ fontSize:11, color:T.t3 }} />
            </div>
          </div>
        </Card>
        {exp===p.id&&<div style={{ background:T.c3, border:`1px solid ${T.ln}`, borderTop:"none", borderRadius:`0 0 ${T.rL} ${T.rL}`, padding:".875rem 1.25rem" }}>
          {p.tasks.map((t,i)=><div key={i} onClick={()=>tog(p.id,i)} style={{ display:"flex", alignItems:"center", gap:12, padding:"8px 0", cursor:"pointer", borderBottom:i<p.tasks.length-1?`1px solid ${T.ln}`:"none" }}>
            <div style={{ width:17, height:17, borderRadius:5, border:`1.5px solid ${t.d?T.gr:T.t3}`, background:t.d?T.gr:"transparent", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, transition:"all .2s" }}>
              {t.d&&<i className="ti ti-check" style={{ fontSize:10, color:"#000" }} />}
            </div>
            <p style={{ margin:0, fontSize:13, color:t.d?T.t3:T.tx, textDecoration:t.d?"line-through":"none" }}>{t.t}</p>
          </div>)}
        </div>}
      </div>)}
    </div>
  </div>;
}

// ── FINANCE
function FinancePage({ clients, income, setIncome, cards, setCards }) {
  const [goal, sg] = useState(5000);
  const [cr, scr] = useState(clients.filter(c=>c.status==="Active").map((c,i)=>({id:c.id,name:c.name,rate:c.rate,idx:i})));
  const total=income.reduce((a,b)=>a+b.earned,0);
  const cur=income[income.length-1].earned;
  const prev=income[income.length-2].earned;
  const maxV=Math.max(...income.map(m=>m.earned));
  const pct=Math.round(((cur-prev)/prev)*100);
  return <div>
    <h2 style={{ margin:"0 0 1.25rem", fontSize:22, fontWeight:700, color:T.tx, letterSpacing:"-.03em" }}>Earnings</h2>
    <SGrid cards={cards} setCards={setCards} />
    <Card style={{ marginBottom:"1rem" }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:".875rem" }}>
        <SL>Monthly goal</SL>
        <div style={{ display:"flex", alignItems:"center", gap:8 }}><span style={{ fontSize:11, color:T.t3 }}>Target: $</span><FI type="number" value={goal} onChange={e=>sg(Number(e.target.value))} style={{ width:90, padding:"4px 8px" }} /></div>
      </div>
      <Bar v={Math.min(Math.round(cur/goal*100),100)} color={cur>=goal?T.gr:T.ac} />
      <p style={{ margin:"6px 0 0", fontSize:11, color:T.t3 }}>${cur.toLocaleString()} of ${goal.toLocaleString()} — {Math.min(Math.round(cur/goal*100),100)}%</p>
    </Card>
    <Card style={{ marginBottom:"1rem" }}>
      <SL>Monthly earnings — click values to edit</SL>
      <div style={{ display:"flex", alignItems:"flex-end", gap:8, height:140 }}>
        {income.map((m,i)=>{
          const h=Math.round(m.earned/maxV*118); const isL=i===income.length-1;
          return <div key={m.month} style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", gap:5 }}>
            <p style={{ margin:0, fontSize:9, color:T.t3 }}><EV value={m.earned} onChange={v=>setIncome(d=>d.map((x,j)=>j===i?{...x,earned:Number(v)}:x))} num /></p>
            <div style={{ width:"100%", height:h, background:isL?T.ac:"rgba(255,255,255,.07)", borderRadius:"5px 5px 0 0", border:`1px solid ${isL?"rgba(217,95,69,.4)":T.ln}`, transition:"height .4s ease" }} />
            <p style={{ margin:0, fontSize:10, color:isL?T.ac:T.t3, fontWeight:isL?600:400 }}>{m.month}</p>
          </div>;
        })}
      </div>
    </Card>
    <Card>
      <SL>Revenue by client — click to edit</SL>
      {cr.map((cl,i)=><div key={cl.id} style={{ display:"flex", alignItems:"center", gap:10, marginBottom:10 }}>
        <Av label={cl.name.slice(0,2)} idx={i} size={28} />
        <p style={{ flex:1, margin:0, fontSize:13, color:T.tx }}><EV value={cl.name} onChange={v=>scr(r=>r.map(x=>x.id===cl.id?{...x,name:v}:x))} /></p>
        <div style={{ width:90 }}><Bar v={Math.round(cl.rate/1800*100)} color={T.ac} /></div>
        <p style={{ margin:0, fontSize:12, color:T.t3, minWidth:64, textAlign:"right" }}>$<EV value={cl.rate} onChange={v=>scr(r=>r.map(x=>x.id===cl.id?{...x,rate:Number(v)}:x))} num />/mo</p>
      </div>)}
    </Card>
  </div>;
}

// ── EXPENSES
function ExpensesPage({ purchases, setPurchases, balance, setBalance, cards, setCards }) {
  const [showAdd, sa] = useState(false);
  const [form, sf] = useState({ name:"", cat:"Software", amount:"", date:"" });
  const CC = { Software:"blue", Music:"purple", Hardware:"yellow", Other:"dim" };
  const add = () => {
    if(!form.name||!form.amount) return;
    const amt=parseFloat(form.amount);
    setPurchases(p=>[{id:Date.now(),...form,amount:amt,recurring:false},...p]);
    setBalance(b=>+(b-amt).toFixed(2));
    sf({ name:"", cat:"Software", amount:"", date:"" }); sa(false);
  };
  return <div>
    <h2 style={{ margin:"0 0 1.25rem", fontSize:22, fontWeight:700, color:T.tx, letterSpacing:"-.03em" }}>Expenses & Balance</h2>
    <SGrid cards={cards} setCards={setCards} />
    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:".875rem" }}>
      <SL>All purchases</SL>
      <Btn v="primary" onClick={()=>sa(s=>!s)}><i className="ti ti-plus" style={{ fontSize:13 }} />Add expense</Btn>
    </div>
    {showAdd&&<Card style={{ marginBottom:"1rem" }}>
      <SL>New expense</SL>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8, marginBottom:8 }}>
        <FI placeholder="Name" value={form.name} onChange={e=>sf(f=>({...f,name:e.target.value}))} />
        <FI placeholder="Amount ($)" type="number" value={form.amount} onChange={e=>sf(f=>({...f,amount:e.target.value}))} />
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8, marginBottom:"1rem" }}>
        <FS value={form.cat} onChange={e=>sf(f=>({...f,cat:e.target.value}))}><option>Software</option><option>Music</option><option>Hardware</option><option>Other</option></FS>
        <FI placeholder="Date e.g. May 9" value={form.date} onChange={e=>sf(f=>({...f,date:e.target.value}))} />
      </div>
      <div style={{ display:"flex", gap:8 }}><Btn v="primary" onClick={add}>Save</Btn><Btn v="ghost" onClick={()=>sa(false)}>Cancel</Btn></div>
    </Card>}
    <div style={{ display:"flex", flexDirection:"column", gap:7 }}>
      {purchases.map(p=><Card key={p.id} style={{ padding:".875rem 1.1rem", display:"flex", alignItems:"center", gap:12 }}>
        <div style={{ width:36, height:36, borderRadius:T.r, background:T.c3, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
          <i className={`ti ${p.cat==="Software"?"ti-device-laptop":p.cat==="Music"?"ti-music":p.cat==="Hardware"?"ti-cpu":"ti-tag"}`} style={{ fontSize:15, color:T.t3 }} />
        </div>
        <div style={{ flex:1, minWidth:0 }}>
          <p style={{ margin:"0 0 4px", fontSize:13, fontWeight:500, color:T.tx }}><EV value={p.name} onChange={v=>setPurchases(pp=>pp.map(x=>x.id===p.id?{...x,name:v}:x))} /></p>
          <div style={{ display:"flex", gap:6 }}><Chip color={CC[p.cat]||"dim"}>{p.cat}</Chip>{p.recurring&&<Chip color="yellow">Recurring</Chip>}</div>
        </div>
        <div style={{ textAlign:"right", flexShrink:0, display:"flex", alignItems:"center", gap:12 }}>
          <div>
            <p style={{ margin:0, fontWeight:700, fontSize:14, color:T.re }}>−$<EV value={p.amount} onChange={v=>setPurchases(pp=>pp.map(x=>x.id===p.id?{...x,amount:Number(v)}:x))} num /></p>
            <p style={{ margin:0, fontSize:10, color:T.t3 }}>{p.date}</p>
          </div>
          <button onClick={()=>setPurchases(pp=>pp.filter(x=>x.id!==p.id))} style={{ background:"none", border:"none", color:T.t3, cursor:"pointer", fontSize:14, opacity:.4 }} onMouseEnter={e=>e.currentTarget.style.opacity=1} onMouseLeave={e=>e.currentTarget.style.opacity=.4}><i className="ti ti-trash" /></button>
        </div>
      </Card>)}
    </div>
  </div>;
}

// ── CALENDAR
function CalendarPage({ projects, notes, setNotes }) {
  const [ed, se] = useState(null);
  const [dr, sd] = useState("");
  const dim=dimth(); const fd=fdow(); const td=todayN();
  const byDay={};
  projects.forEach(p=>{
    const parts=p.due.split(" ");
    const dn=parseInt(parts[parts.length-1]);
    if(!isNaN(dn)){ if(!byDay[dn]) byDay[dn]=[]; byDay[dn].push(p); }
  });
  const SC = { "In Progress":T.bl,"Review":T.ye,"Completed":T.gr,"On Hold":T.re };
  const cells = [...Array(fd).fill(null), ...Array(dim).fill(0).map((_,i)=>i+1)];
  const saveNote = () => { if(dr.trim()) setNotes(n=>({...n,[ed]:[...(n[ed]||[]),dr.trim()]})); se(null); sd(""); };
  return <div>
    <h2 style={{ margin:"0 0 .5rem", fontSize:22, fontWeight:700, color:T.tx, letterSpacing:"-.03em" }}>Calendar — {nowMY()}</h2>
    <p style={{ margin:"0 0 1.25rem", fontSize:12, color:T.t3 }}>Click any day to add a reminder</p>
    <div style={{ display:"grid", gridTemplateColumns:"repeat(7,1fr)", gap:3, marginBottom:3 }}>
      {["Sun","Mon","Tue","Wed","Thu","Fri","Sat"].map(dy=><p key={dy} style={{ margin:0, fontSize:10, color:T.t3, textAlign:"center", textTransform:"uppercase", letterSpacing:".07em", padding:"4px 0" }}>{dy}</p>)}
    </div>
    <div style={{ display:"grid", gridTemplateColumns:"repeat(7,1fr)", gap:3 }}>
      {cells.map((dy,i)=>{
        if(!dy) return <div key={i} />;
        const evs=byDay[dy]||[]; const dn=notes[dy]||[];
        const isT=dy===td; const hasC=evs.length>0||dn.length>0;
        return <div key={i} onClick={()=>{se(dy);sd("");}}
          style={{ background:isT?T.acs:T.c2, border:`1px solid ${isT?"rgba(217,95,69,.4)":hasC?T.ln2:T.ln}`, borderRadius:T.r, minHeight:72, padding:"6px 8px", cursor:"pointer", transition:"all .15s" }}
          onMouseEnter={e=>e.currentTarget.style.background=isT?T.acs2:T.c3}
          onMouseLeave={e=>e.currentTarget.style.background=isT?T.acs:T.c2}>
          <p style={{ margin:"0 0 4px", fontSize:11, fontWeight:isT?700:400, color:isT?T.ac:T.t2 }}>{dy}</p>
          {evs.slice(0,1).map((ev,j)=><div key={j} style={{ background:SC[ev.status]||T.t3, borderRadius:4, padding:"2px 5px", marginBottom:2 }}>
            <p style={{ margin:0, fontSize:9, color:"#000", fontWeight:700, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{ev.client.split(" ")[0]}</p>
          </div>)}
          {dn.map((nt,j)=><div key={j} style={{ background:"rgba(255,255,255,.06)", borderRadius:4, padding:"2px 5px", marginBottom:2, display:"flex", alignItems:"center", gap:3 }}>
            <p style={{ margin:0, fontSize:9, color:T.t2, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap", flex:1 }}>{nt}</p>
            <span onClick={ev=>{ ev.stopPropagation(); setNotes(n=>({...n,[dy]:n[dy].filter((_,k)=>k!==j)})); }} style={{ fontSize:10, color:T.t3, cursor:"pointer" }}>×</span>
          </div>)}
        </div>;
      })}
    </div>
    <div style={{ marginTop:"1rem", display:"flex", gap:12, flexWrap:"wrap" }}>
      {Object.entries(SC).map(([st,col])=><div key={st} style={{ display:"flex", alignItems:"center", gap:5 }}><div style={{ width:7, height:7, borderRadius:2, background:col }} /><p style={{ margin:0, fontSize:10, color:T.t3 }}>{st}</p></div>)}
    </div>
    {ed!==null&&<Modal onClose={()=>se(null)}>
      <p style={{ margin:"0 0 3px", fontSize:11, color:T.t3, textTransform:"uppercase", letterSpacing:".08em" }}>{nowMY().split(" ")[0]} {ed}</p>
      <p style={{ margin:"0 0 1.2rem", fontSize:17, fontWeight:600, color:T.tx }}>Add a reminder</p>
      <FI value={dr} onChange={e=>sd(e.target.value)} onKeyDown={e=>e.key==="Enter"&&saveNote()} placeholder="e.g. Marcus video due, client call…" style={{ marginBottom:10 }} autoFocus />
      {(notes[ed]||[]).length>0&&<div style={{ marginBottom:10 }}>
        {notes[ed].map((nt,i)=><div key={i} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"6px 0", borderBottom:`1px solid ${T.ln}` }}>
          <p style={{ margin:0, fontSize:12, color:T.t2 }}>{nt}</p>
          <button onClick={()=>setNotes(n=>({...n,[ed]:n[ed].filter((_,k)=>k!==i)}))} style={{ background:"none", border:"none", color:T.t3, cursor:"pointer", fontSize:15 }}>×</button>
        </div>)}
      </div>}
      <div style={{ display:"flex", gap:8 }}><Btn v="primary" onClick={saveNote} style={{ flex:1, justifyContent:"center" }}>Save</Btn><Btn v="ghost" onClick={()=>se(null)}>Cancel</Btn></div>
    </Modal>}
  </div>;
}

// ── TEMPLATES
function TemplatesPage({ clients }) {
  const [sel, ss] = useState(0); const [cid, sc] = useState(clients[0]?.id||1);
  const [custom, scu] = useState({}); const [copied, scp] = useState(false);
  const cl = clients.find(c=>c.id===cid)||clients[0];
  const key = `${sel}-${cid}`;
  const auto = TMPL[sel].body.replace(/{name}/g,cl?.name||"").replace(/{inv}/g,`INV-${String(cid).padStart(3,"0")}001`).replace(/{amount}/g,cl?.rate||"0").replace(/{date}/g,new Date(Date.now()+14*864e5).toLocaleDateString("en-US",{month:"short",day:"numeric"}));
  const txt = custom[key]!==undefined?custom[key]:auto;
  const isC = custom[key]!==undefined;
  const copy = () => { navigator.clipboard?.writeText(txt); scp(true); setTimeout(()=>scp(false),2000); };
  return <div>
    <h2 style={{ margin:"0 0 1.25rem", fontSize:22, fontWeight:700, color:T.tx, letterSpacing:"-.03em" }}>Message Templates</h2>
    <div style={{ display:"flex", gap:14 }}>
      <div style={{ width:186, flexShrink:0, display:"flex", flexDirection:"column", gap:6 }}>
        {TMPL.map((t,i)=><button key={i} onClick={()=>ss(i)} style={{ background:sel===i?T.acs:"rgba(255,255,255,.02)", border:`1px solid ${sel===i?"rgba(217,95,69,.3)":T.ln}`, borderRadius:T.r, padding:"11px 13px", cursor:"pointer", textAlign:"left", color:sel===i?T.ac:T.t2, fontSize:12, fontWeight:sel===i?600:400, fontFamily:T.ff }}>{t.label}</button>)}
      </div>
      <div style={{ flex:1, minWidth:0 }}>
        <Card>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"1rem", flexWrap:"wrap", gap:8 }}>
            <p style={{ margin:0, fontSize:14, fontWeight:600, color:T.tx }}>{TMPL[sel].label}</p>
            <div style={{ display:"flex", gap:8, alignItems:"center" }}>
              <span style={{ fontSize:11, color:T.t3 }}>Client:</span>
              <FS value={cid} onChange={e=>sc(Number(e.target.value))} style={{ width:"auto", padding:"5px 10px" }}>
                {clients.map(c=><option key={c.id} value={c.id}>{c.name}</option>)}
              </FS>
            </div>
          </div>
          <div style={{ position:"relative", marginBottom:".875rem" }}>
            <textarea value={txt} onChange={e=>scu(cu=>({...cu,[key]:e.target.value}))} rows={6}
              style={{ width:"100%", boxSizing:"border-box", background:T.c3, border:`1px solid ${isC?"rgba(217,95,69,.3)":T.ln2}`, borderRadius:T.r, color:T.tx, fontSize:13, lineHeight:1.7, padding:"13px", resize:"vertical", outline:"none", fontFamily:T.ff }} />
            {isC&&<span style={{ position:"absolute", top:10, right:10, fontSize:9, color:T.ac, textTransform:"uppercase", letterSpacing:".07em", fontWeight:600 }}>edited</span>}
          </div>
          <div style={{ display:"flex", gap:8 }}>
            <Btn v="primary" onClick={copy}><i className={`ti ${copied?"ti-check":"ti-copy"}`} style={{ fontSize:13 }} />{copied?"Copied!":"Copy message"}</Btn>
            {isC&&<Btn v="ghost" onClick={()=>scu(cu=>{const n={...cu};delete n[key];return n;})}><i className="ti ti-refresh" style={{ fontSize:13 }} />Reset</Btn>}
          </div>
          <p style={{ margin:"10px 0 0", fontSize:11, color:T.t3 }}>Click message to edit · auto-fills client name, invoice & date</p>
        </Card>
      </div>
    </div>
  </div>;
}

// ── DELIVERY
const DSTAGES = [
  { key:"uploaded", label:"Uploaded",           icon:"ti-upload",       color:"blue"   },
  { key:"sent",     label:"Sent to Client",     icon:"ti-send",         color:"purple" },
  { key:"revision", label:"Revision Requested", icon:"ti-rotate",       color:"yellow" },
  { key:"approved", label:"Approved",           icon:"ti-circle-check", color:"green"  },
];
const DC = { uploaded:T.bl, sent:T.pu, revision:T.ye, approved:T.gr };

function DeliveryPage({ deliveries, setDeliveries }) {
  const [showNote, sn] = useState(null);
  const [noteDr, snd] = useState("");
  const [filt, sf] = useState("All");
  const counts = { uploaded:0, sent:0, revision:0, approved:0 };
  deliveries.forEach(d=>{ if(counts[d.stage]!==undefined) counts[d.stage]++; });
  const fil = filt==="All"?deliveries:deliveries.filter(d=>d.stage===filt);
  const advance = (id, newStage) => setDeliveries(prev=>prev.map(d=>{
    if(d.id!==id) return d;
    const already=d.history.find(h=>h.stage===newStage);
    return { ...d, stage:newStage, history:already?d.history:[...d.history,{stage:newStage,ts:new Date().toLocaleString(),note:""}] };
  }));
  const saveNote = (id, stage, note) => {
    setDeliveries(prev=>prev.map(d=>{
      if(d.id!==id) return d;
      const h=d.history.find(x=>x.stage===stage);
      const history=h?d.history.map(x=>x.stage===stage?{...x,note}:x):[...d.history,{stage,ts:new Date().toLocaleString(),note}];
      return {...d,history};
    }));
    sn(null); snd("");
  };
  return <div>
    <h2 style={{ margin:"0 0 .4rem", fontSize:22, fontWeight:700, color:T.tx, letterSpacing:"-.03em" }}>File Delivery</h2>
    <p style={{ margin:"0 0 1.4rem", fontSize:12, color:T.t3 }}>Track every project through upload → sent → revision → approved</p>
    <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:10, marginBottom:"1.4rem" }}>
      {DSTAGES.map(s=><button key={s.key} onClick={()=>sf(filt===s.key?"All":s.key)} style={{ background:filt===s.key?DC[s.key]+"22":T.c2, border:`1px solid ${filt===s.key?DC[s.key]+"55":T.ln}`, borderRadius:T.rL, padding:"1rem", cursor:"pointer", textAlign:"left", transition:"all .2s" }}>
        <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:6 }}>
          <i className={`ti ${s.icon}`} style={{ fontSize:16, color:DC[s.key] }} />
          <span style={{ fontSize:10, color:DC[s.key], fontWeight:600, textTransform:"uppercase", letterSpacing:".06em" }}>{s.label}</span>
        </div>
        <p style={{ margin:0, fontSize:26, fontWeight:700, color:filt===s.key?DC[s.key]:T.tx, letterSpacing:"-.03em" }}>{counts[s.key]}</p>
      </button>)}
    </div>
    <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
      {fil.map(d=>{
        const si=DSTAGES.findIndex(s=>s.key===d.stage);
        const next=DSTAGES[si+1]; const prev2=si>0?DSTAGES[si-1]:null;
        return <div key={d.id} style={{ background:T.c2, border:`1px solid ${T.ln}`, borderRadius:T.rXL, overflow:"hidden" }}>
          <div style={{ padding:"1rem 1.25rem", borderBottom:`1px solid ${T.ln}`, display:"flex", alignItems:"flex-start", justifyContent:"space-between", gap:12 }}>
            <div style={{ flex:1, minWidth:0 }}>
              <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:3, flexWrap:"wrap" }}>
                <p style={{ margin:0, fontWeight:600, fontSize:14, color:T.tx }}>{d.project}</p>
                <Chip color={DSTAGES.find(s=>s.key===d.stage)?.color||"dim"}>{DSTAGES.find(s=>s.key===d.stage)?.label}</Chip>
              </div>
              <p style={{ margin:0, fontSize:11, color:T.t3 }}>{d.client} · {d.type} · <span style={{ color:T.gr }}>${d.value.toLocaleString()}</span></p>
            </div>
            <div style={{ display:"flex", gap:6, flexShrink:0 }}>
              {prev2&&<button onClick={()=>advance(d.id,prev2.key)} style={{ background:"rgba(255,255,255,.04)", border:`1px solid ${T.ln2}`, borderRadius:T.r, padding:"5px 10px", color:T.t3, fontSize:11, cursor:"pointer", fontFamily:T.ff }}>← {prev2.label}</button>}
              {next&&<button onClick={()=>advance(d.id,next.key)} style={{ background:DC[next.key]+"18", border:`1px solid ${DC[next.key]}44`, borderRadius:T.r, padding:"5px 12px", color:DC[next.key], fontSize:11, fontWeight:600, cursor:"pointer", fontFamily:T.ff }}>→ {next.label}</button>}
            </div>
          </div>
          <div style={{ padding:"1rem 1.25rem", display:"flex", alignItems:"center" }}>
            {DSTAGES.map((s,si2)=>{
              const done=DSTAGES.findIndex(x=>x.key===d.stage)>=si2;
              const isCur=d.stage===s.key;
              const h=d.history.find(x=>x.stage===s.key);
              return <div key={s.key} style={{ display:"flex", alignItems:"center", flex:si2<DSTAGES.length-1?1:"none" }}>
                <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:4 }}>
                  <button onClick={()=>{sn({id:d.id,stage:s.key});snd(h?.note||"");}} style={{ width:32, height:32, borderRadius:"50%", background:done?DC[s.key]+"22":"rgba(255,255,255,.04)", border:`2px solid ${done?DC[s.key]:T.t3}`, display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer", boxShadow:isCur?`0 0 0 3px ${DC[s.key]}33`:"none", transition:"all .3s" }}>
                    <i className={`ti ${done?"ti-check":s.icon}`} style={{ fontSize:13, color:done?DC[s.key]:T.t3 }} />
                  </button>
                  <p style={{ margin:0, fontSize:9, color:done?DC[s.key]:T.t3, fontWeight:done?600:400, textTransform:"uppercase", letterSpacing:".05em", textAlign:"center", whiteSpace:"nowrap" }}>{s.label}</p>
                  {h&&<p style={{ margin:0, fontSize:8, color:T.t3, textAlign:"center" }}>{h.ts.split(",")[0]}</p>}
                  {h?.note&&<p style={{ margin:0, fontSize:9, color:T.t2, textAlign:"center", maxWidth:70, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }} title={h.note}>"{h.note}"</p>}
                </div>
                {si2<DSTAGES.length-1&&<div style={{ flex:1, height:2, background:done&&DSTAGES.findIndex(x=>x.key===d.stage)>si2?DC[DSTAGES[si2+1].key]+"55":"rgba(255,255,255,.07)", margin:"0 8px", marginBottom:20 }} />}
              </div>;
            })}
          </div>
        </div>;
      })}
    </div>
    {showNote&&<Modal onClose={()=>sn(null)}>
      <p style={{ margin:"0 0 .4rem", fontSize:11, color:T.t3, textTransform:"uppercase", letterSpacing:".08em" }}>{DSTAGES.find(s=>s.key===showNote.stage)?.label}</p>
      <p style={{ margin:"0 0 1.1rem", fontSize:16, fontWeight:600, color:T.tx }}>Add a note</p>
      <FI value={noteDr} onChange={e=>snd(e.target.value)} placeholder="e.g. Sent via WeTransfer, v2 with color fixes…" style={{ marginBottom:"1rem" }} autoFocus />
      <div style={{ display:"flex", gap:8 }}>
        <Btn v="primary" onClick={()=>saveNote(showNote.id,showNote.stage,noteDr)} style={{ flex:1, justifyContent:"center" }}>Save note</Btn>
        <Btn v="ghost" onClick={()=>sn(null)}>Cancel</Btn>
      </div>
    </Modal>}
  </div>;
}

// ── TIME TRACKER
function TimerPage({ projects, sessions, setSessions }) {
  const [running, sr] = useState(null);
  const [elapsed, se] = useState(0);
  const [showNew, sn] = useState(false);
  const [form, sf] = useState({ name:"", client:"", rate:"" });
  const [filt, sfilt] = useState("All");
  const [exp, sexp] = useState(null);
  const [copied, scp] = useState(null);
  const tick = useRef();

  useEffect(()=>{
    if(running){ tick.current=setInterval(()=>se(e=>e+1),1000); }
    else { clearInterval(tick.current); }
    return ()=>clearInterval(tick.current);
  },[running]);

  const start = () => {
    if(!form.name.trim()) return;
    const s={id:Date.now(),name:form.name.trim(),client:form.client,rate:Number(form.rate)||0,entries:[]};
    sr({...s,startTs:new Date().toLocaleString()}); se(0);
    sf({ name:"", client:"", rate:"" }); sn(false);
  };
  const stop = () => {
    if(!running) return;
    const entry={startTs:running.startTs,endTs:new Date().toLocaleString(),secs:elapsed};
    const exists=sessions.find(s=>s.id===running.id);
    if(exists){ setSessions(prev=>prev.map(s=>s.id===running.id?{...s,entries:[...s.entries,entry]}:s)); }
    else { setSessions(prev=>[{...running,entries:[entry]},...prev]); }
    sr(null); se(0);
  };
  const resume = (session) => { sr({...session,startTs:new Date().toLocaleString()}); se(0); };
  const del = (id) => setSessions(prev=>prev.filter(s=>s.id!==id));
  const exportR = (session) => {
    const total=session.entries.reduce((a,e)=>a+e.secs,0);
    const earned=(total/3600*session.rate).toFixed(2);
    let txt=`TIME REPORT — ${session.name}\n`;
    txt+=`Client: ${session.client||"—"} | Rate: $${session.rate}/hr\n`;
    txt+=`Total: ${fmtSec(total)} (${fmtHr(total)})`;
    if(session.rate>0) txt+=` | Earned: $${earned}`;
    txt+=`\n\nSESSION LOG:\n`;
    session.entries.forEach((e,i)=>{ txt+=`  #${i+1}: ${e.startTs} → ${e.endTs} (${fmtSec(e.secs)})\n`; });
    navigator.clipboard?.writeText(txt); scp(session.id); setTimeout(()=>scp(null),2000);
  };

  const clientNames=["All",...new Set([...projects.map(p=>p.client),...sessions.map(s=>s.client).filter(Boolean)])];
  const fil=filt==="All"?sessions:sessions.filter(s=>s.client===filt);
  const totalH=sessions.reduce((a,s)=>a+s.entries.reduce((b,e)=>b+e.secs,0),0);
  const totalE=sessions.reduce((a,s)=>a+s.entries.reduce((b,e)=>b+e.secs/3600*s.rate,0),0);
  const weekS=sessions.reduce((a,s)=>a+s.entries.filter(e=>{ const d=new Date(e.endTs); return !isNaN(d)&&(Date.now()-d)/864e5<=7; }).reduce((b,e)=>b+e.secs,0),0);

  return <div>
    <h2 style={{ margin:"0 0 .4rem", fontSize:22, fontWeight:700, color:T.tx, letterSpacing:"-.03em" }}>Time Tracker</h2>
    <p style={{ margin:"0 0 1.4rem", fontSize:12, color:T.t3 }}>Track edit time per project — generate client-ready reports</p>
    <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(150px,1fr))", gap:10, marginBottom:"1.4rem" }}>
      {[{l:"Total Hours",v:fmtHr(totalH),c:T.tx},{l:"This Week",v:fmtHr(weekS),c:T.bl},{l:"Total Earned",v:`$${totalE.toFixed(2)}`,c:T.gr},{l:"Sessions",v:sessions.length,c:T.t2}].map(x=><div key={x.l} style={{ background:T.c2, border:`1px solid ${T.ln}`, borderRadius:T.rL, padding:"1rem 1.1rem" }}>
        <p style={{ margin:"0 0 5px", fontSize:10, color:T.t3, textTransform:"uppercase", letterSpacing:".09em", fontWeight:500 }}>{x.l}</p>
        <p style={{ margin:0, fontSize:20, fontWeight:700, color:x.c, letterSpacing:"-.025em", fontVariantNumeric:"tabular-nums" }}>{x.v}</p>
      </div>)}
    </div>
    {running&&<div style={{ background:"rgba(217,95,69,.07)", border:`1px solid rgba(217,95,69,.3)`, borderRadius:T.rXL, padding:"1.5rem 1.75rem", marginBottom:"1.4rem", boxShadow:"0 0 0 3px rgba(217,95,69,.1), 0 8px 32px rgba(217,95,69,.12)" }}>
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", flexWrap:"wrap", gap:12 }}>
        <div>
          <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:4 }}>
            <div style={{ width:9, height:9, borderRadius:"50%", background:T.ac, boxShadow:`0 0 10px ${T.ac}` }} />
            <p style={{ margin:0, fontSize:11, color:T.ac, fontWeight:600, textTransform:"uppercase", letterSpacing:".07em" }}>Recording</p>
          </div>
          <p style={{ margin:"0 0 2px", fontSize:17, fontWeight:600, color:T.tx }}>{running.name}</p>
          {running.client&&<p style={{ margin:0, fontSize:12, color:T.t3 }}>{running.client}{running.rate?` · $${running.rate}/hr`:""}</p>}
        </div>
        <div style={{ display:"flex", alignItems:"center", gap:16 }}>
          <p style={{ margin:0, fontSize:42, fontWeight:300, color:T.tx, letterSpacing:".02em", fontVariantNumeric:"tabular-nums" }}>{fmtSec(elapsed)}</p>
          <button onClick={stop} style={{ width:52, height:52, borderRadius:"50%", background:T.ac, border:"none", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", boxShadow:"0 4px 16px rgba(217,95,69,.4)", transition:"all .2s" }} onMouseEnter={e=>e.currentTarget.style.transform="scale(1.06)"} onMouseLeave={e=>e.currentTarget.style.transform="scale(1)"}>
            <i className="ti ti-square-filled" style={{ fontSize:18, color:"#fff" }} />
          </button>
        </div>
      </div>
      {running.rate>0&&<p style={{ margin:"12px 0 0", fontSize:12, color:T.t3 }}>Earned so far: <span style={{ color:T.gr, fontWeight:600 }}>${(elapsed/3600*running.rate).toFixed(2)}</span></p>}
    </div>}
    {!running&&<div style={{ marginBottom:"1.25rem" }}>
      {!showNew
        ? <button onClick={()=>sn(true)} style={{ width:"100%", background:"rgba(217,95,69,.06)", border:`1px dashed rgba(217,95,69,.35)`, borderRadius:T.rXL, padding:"1.25rem", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", gap:10, color:T.ac, fontFamily:T.ff }} onMouseEnter={e=>e.currentTarget.style.background="rgba(217,95,69,.10)"} onMouseLeave={e=>e.currentTarget.style.background="rgba(217,95,69,.06)"}>
            <div style={{ width:36, height:36, borderRadius:"50%", background:"rgba(217,95,69,.15)", display:"flex", alignItems:"center", justifyContent:"center" }}><i className="ti ti-player-play-filled" style={{ fontSize:16, marginLeft:2 }} /></div>
            <span style={{ fontSize:14, fontWeight:600 }}>Start new timer</span>
          </button>
        : <Card style={{ padding:"1.25rem" }}>
            <p style={{ margin:"0 0 1rem", fontSize:14, fontWeight:600, color:T.tx }}>New timer session</p>
            <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
              <FI placeholder="Project / video name *" value={form.name} onChange={e=>sf(f=>({...f,name:e.target.value}))} autoFocus />
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8 }}>
                <FS value={form.client} onChange={e=>sf(f=>({...f,client:e.target.value}))}>
                  <option value="">Select client…</option>
                  {[...new Set(projects.map(p=>p.client))].map(c=><option key={c} value={c}>{c}</option>)}
                </FS>
                <FI placeholder="Hourly rate (optional)" type="number" value={form.rate} onChange={e=>sf(f=>({...f,rate:e.target.value}))} />
              </div>
              <div style={{ display:"flex", gap:8 }}>
                <button onClick={start} style={{ flex:1, background:T.ac, border:"none", borderRadius:T.r, padding:"10px", color:"#fff", fontSize:14, fontWeight:600, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", gap:8, fontFamily:T.ff }} onMouseEnter={e=>e.currentTarget.style.background=T.ach} onMouseLeave={e=>e.currentTarget.style.background=T.ac}>
                  <i className="ti ti-player-play-filled" style={{ fontSize:14 }} />Start Timer
                </button>
                <Btn v="ghost" onClick={()=>sn(false)}>Cancel</Btn>
              </div>
            </div>
          </Card>}
    </div>}
    <div style={{ display:"flex", gap:6, marginBottom:"1rem", flexWrap:"wrap" }}>
      {clientNames.map(n=><Btn key={n} v={filt===n?"primary":"ghost"} onClick={()=>sfilt(n)} style={{ fontSize:11, padding:"5px 12px" }}>{n}</Btn>)}
    </div>
    <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
      {fil.length===0&&<p style={{ margin:0, fontSize:13, color:T.t3, textAlign:"center", padding:"2rem 0" }}>No sessions yet — start your first timer above</p>}
      {fil.map(session=>{
        const total=session.entries.reduce((a,e)=>a+e.secs,0);
        const earned=total/3600*session.rate;
        const isExp=exp===session.id;
        return <div key={session.id}>
          <div style={{ background:T.c2, border:`1px solid ${isExp?T.ln2:T.ln}`, borderRadius:isExp?`${T.rL} ${T.rL} 0 0`:T.rL, padding:"1rem 1.25rem", cursor:"pointer" }} onClick={()=>sexp(isExp?null:session.id)}>
            <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", gap:12 }}>
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:3, flexWrap:"wrap" }}>
                  <p style={{ margin:0, fontWeight:600, fontSize:14, color:T.tx }}>{session.name}</p>
                  {session.client&&<Chip color="blue">{session.client}</Chip>}
                  {session.rate>0&&<Chip color="green">${session.rate}/hr</Chip>}
                </div>
                <p style={{ margin:0, fontSize:11, color:T.t3 }}>{session.entries.length} session{session.entries.length!==1?"s":""} · Started {session.entries[0]?.startTs||"—"}</p>
              </div>
              <div style={{ textAlign:"right", flexShrink:0 }}>
                <p style={{ margin:"0 0 2px", fontWeight:700, fontSize:18, color:T.tx, fontVariantNumeric:"tabular-nums" }}>{fmtSec(total)}</p>
                {session.rate>0&&<p style={{ margin:"0 0 6px", fontSize:12, color:T.gr, fontWeight:600 }}>${earned.toFixed(2)}</p>}
                <div style={{ display:"flex", gap:6, justifyContent:"flex-end" }} onClick={e=>e.stopPropagation()}>
                  {!running&&<button onClick={()=>resume(session)} style={{ background:T.acs, border:`1px solid rgba(217,95,69,.3)`, borderRadius:T.r, padding:"3px 9px", color:T.ac, fontSize:11, fontWeight:600, cursor:"pointer", fontFamily:T.ff }}><i className="ti ti-player-play" style={{ fontSize:11 }} /> Resume</button>}
                  <button onClick={()=>exportR(session)} style={{ background:"rgba(255,255,255,.04)", border:`1px solid ${T.ln2}`, borderRadius:T.r, padding:"3px 9px", color:copied===session.id?T.gr:T.t3, fontSize:11, cursor:"pointer", fontFamily:T.ff }}>
                    <i className={`ti ${copied===session.id?"ti-check":"ti-copy"}`} style={{ fontSize:11 }} /> {copied===session.id?"Copied":"Report"}
                  </button>
                  <button onClick={()=>del(session.id)} style={{ background:"none", border:"none", color:T.t3, cursor:"pointer", fontSize:13, opacity:.4 }} onMouseEnter={e=>e.currentTarget.style.opacity=1} onMouseLeave={e=>e.currentTarget.style.opacity=.4}><i className="ti ti-trash" /></button>
                </div>
              </div>
            </div>
          </div>
          {isExp&&<div style={{ background:T.c3, border:`1px solid ${T.ln}`, borderTop:"none", borderRadius:`0 0 ${T.rL} ${T.rL}`, padding:"1rem 1.25rem" }}>
            <p style={{ margin:"0 0 .75rem", fontSize:10, fontWeight:600, color:T.t3, textTransform:"uppercase", letterSpacing:".09em" }}>Session log</p>
            <div style={{ display:"flex", flexDirection:"column", gap:6, marginBottom:"1rem" }}>
              {session.entries.map((e,i)=><div key={i} style={{ display:"flex", alignItems:"center", gap:10, padding:"8px 10px", background:T.c2, borderRadius:T.r, border:`1px solid ${T.ln}` }}>
                <div style={{ width:28, height:28, borderRadius:"50%", background:T.acs, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                  <span style={{ fontSize:11, fontWeight:600, color:T.ac }}>#{i+1}</span>
                </div>
                <div style={{ flex:1 }}>
                  <p style={{ margin:0, fontSize:12, color:T.tx }}>{e.startTs} <span style={{ color:T.t3 }}>→</span> {e.endTs}</p>
                </div>
                <p style={{ margin:0, fontSize:13, fontWeight:600, color:T.tx, fontVariantNumeric:"tabular-nums" }}>{fmtSec(e.secs)}</p>
                {session.rate>0&&<p style={{ margin:0, fontSize:11, color:T.gr, minWidth:50, textAlign:"right" }}>${(e.secs/3600*session.rate).toFixed(2)}</p>}
              </div>)}
            </div>
            <div style={{ background:T.grs, border:`1px solid rgba(48,209,122,.2)`, borderRadius:T.r, padding:"10px 14px" }}>
              <p style={{ margin:"0 0 4px", fontSize:10, fontWeight:600, color:T.gr, textTransform:"uppercase", letterSpacing:".08em" }}>Client summary</p>
              <p style={{ margin:0, fontSize:13, color:T.tx }}><strong>{session.name}</strong> — {fmtHr(total)} total{session.rate>0?` @ $${session.rate}/hr = $${earned.toFixed(2)}`:""}</p>
              <p style={{ margin:"4px 0 0", fontSize:11, color:T.t3 }}>{session.entries.length} session{session.entries.length!==1?"s":""} logged · Click "Report" to copy to clipboard</p>
            </div>
          </div>}
        </div>;
      })}
    </div>
  </div>;
}

// ── PORTFOLIO
function PortfolioPage({ clients, portfolio, setPortfolio }) {
  const [showAdd, sa] = useState(false);
  const [form, sf] = useState({ client:"", title:"", url:"", views:"", earned:"", date:"" });
  const uniq=[...new Set(portfolio.map(p=>p.client))];
  const totalE=portfolio.reduce((a,p)=>a+p.earned,0);
  const maxE=Math.max(...uniq.map(n=>portfolio.filter(p=>p.client===n).reduce((a,p)=>a+p.earned,0)),1);
  const byC=uniq.map(name=>({name,count:portfolio.filter(p=>p.client===name).length,earned:portfolio.filter(p=>p.client===name).reduce((a,p)=>a+p.earned,0)})).sort((a,b)=>b.earned-a.earned);
  const cidx=(name)=>{ const i=clients.findIndex(c=>c.name===name); return i>=0?i:0; };
  const add=()=>{
    if(!form.title||!form.url) return;
    const av2=form.client.split(" ").map(w=>w[0]).join("").slice(0,2)||"ME";
    setPortfolio(p=>[{id:Date.now(),...form,earned:Number(form.earned)||0,av:av2},...p]);
    sf({ client:"", title:"", url:"", views:"", earned:"", date:"" }); sa(false);
  };
  return <div>
    <h2 style={{ margin:"0 0 1.25rem", fontSize:22, fontWeight:700, color:T.tx, letterSpacing:"-.03em" }}>Portfolio</h2>
    <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(130px,1fr))", gap:10, marginBottom:"1.3rem" }}>
      {[{l:"Total Videos",v:portfolio.length,c:T.tx},{l:"Total Earned",v:`$${totalE.toLocaleString()}`,c:T.gr},{l:"Creators",v:uniq.length,c:T.bl},{l:"Avg / Video",v:`$${Math.round(totalE/Math.max(portfolio.length,1)).toLocaleString()}`,c:T.ac}].map(x=><div key={x.l} style={{ background:T.c2, border:`1px solid ${T.ln}`, borderRadius:T.rL, padding:"1rem 1.1rem" }}>
        <p style={{ margin:"0 0 5px", fontSize:10, color:T.t3, textTransform:"uppercase", letterSpacing:".09em", fontWeight:500 }}>{x.l}</p>
        <p style={{ margin:0, fontSize:x.v.toString().length>7?16:22, fontWeight:700, color:x.c, letterSpacing:"-.025em" }}>{x.v}</p>
      </div>)}
    </div>
    <Card style={{ marginBottom:"1.25rem" }}>
      <SL>Earnings by creator</SL>
      {byC.map((cl,i)=><div key={cl.name} style={{ display:"flex", alignItems:"center", gap:10, marginBottom:10 }}>
        <Av label={cl.name.slice(0,2)} idx={cidx(cl.name)} size={30} />
        <div style={{ flex:1, minWidth:0 }}>
          <div style={{ display:"flex", justifyContent:"space-between", marginBottom:4 }}>
            <p style={{ margin:0, fontSize:13, color:T.tx, fontWeight:500 }}>{cl.name}</p>
            <p style={{ margin:0, fontSize:12, color:T.t3 }}>{cl.count} vid{cl.count!==1?"s":""} · <span style={{ color:T.gr }}>${cl.earned.toLocaleString()}</span></p>
          </div>
          <Bar v={Math.round(cl.earned/maxE*100)} color={T.ac} />
        </div>
      </div>)}
    </Card>
    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:".875rem" }}>
      <SL>Videos</SL>
      <Btn v="primary" onClick={()=>sa(s=>!s)}><i className="ti ti-plus" style={{ fontSize:13 }} />Add video</Btn>
    </div>
    {showAdd&&<Card style={{ marginBottom:"1rem" }}>
      <SL>New video</SL>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8, marginBottom:8 }}>
        <FI placeholder="Creator name" value={form.client} onChange={e=>sf(f=>({...f,client:e.target.value}))} />
        <FI placeholder="Video title" value={form.title} onChange={e=>sf(f=>({...f,title:e.target.value}))} />
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8, marginBottom:8 }}>
        <FI placeholder="YouTube URL" value={form.url} onChange={e=>sf(f=>({...f,url:e.target.value}))} />
        <FI placeholder='Views e.g. "284K"' value={form.views} onChange={e=>sf(f=>({...f,views:e.target.value}))} />
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8, marginBottom:"1rem" }}>
        <FI placeholder="Earned ($)" type="number" value={form.earned} onChange={e=>sf(f=>({...f,earned:e.target.value}))} />
        <FI placeholder='Date e.g. "Apr 2026"' value={form.date} onChange={e=>sf(f=>({...f,date:e.target.value}))} />
      </div>
      <div style={{ display:"flex", gap:8 }}><Btn v="primary" onClick={add}>Add</Btn><Btn v="ghost" onClick={()=>sa(false)}>Cancel</Btn></div>
    </Card>}
    <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(270px,1fr))", gap:12 }}>
      {portfolio.map((vid,i)=>(
        <a key={vid.id} href={vid.url} target="_blank" rel="noreferrer" style={{ textDecoration:"none" }}>
          <div style={{ background:T.c2, border:`1px solid ${T.ln}`, borderRadius:T.rL, overflow:"hidden", transition:"all .2s" }} onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-2px)";e.currentTarget.style.borderColor=T.ln2;}} onMouseLeave={e=>{e.currentTarget.style.transform="none";e.currentTarget.style.borderColor=T.ln;}}>
            <div style={{ height:140, background:`linear-gradient(135deg,${AVC[cidx(vid.client)%5][0]},${T.c3})`, display:"flex", alignItems:"center", justifyContent:"center", position:"relative" }}>
              <div style={{ width:44, height:44, borderRadius:"50%", background:"rgba(0,0,0,.6)", display:"flex", alignItems:"center", justifyContent:"center", border:"2px solid rgba(255,255,255,.2)" }}>
                <i className="ti ti-player-play-filled" style={{ fontSize:18, color:"#fff", marginLeft:2 }} />
              </div>
              <div style={{ position:"absolute", top:8, right:8 }}><Chip color="dim">{vid.views} views</Chip></div>
              <div style={{ position:"absolute", bottom:8, left:8 }}><Av label={vid.av} idx={cidx(vid.client)} size={28} /></div>
            </div>
            <div style={{ padding:"10px 12px" }}>
              <p style={{ margin:"0 0 3px", fontSize:13, fontWeight:600, color:T.tx, lineHeight:1.35 }}>{vid.title}</p>
              <p style={{ margin:"0 0 6px", fontSize:11, color:T.t3 }}>{vid.client} · {vid.date}</p>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                <span style={{ fontSize:12, color:T.gr, fontWeight:600 }}>${vid.earned.toLocaleString()} earned</span>
                <span style={{ fontSize:11, color:T.bl, display:"flex", alignItems:"center", gap:4 }}><i className="ti ti-external-link" style={{ fontSize:11 }} />Watch</span>
              </div>
            </div>
          </div>
        </a>
      ))}
    </div>
  </div>;
}

// ══ APP ════════════════════════════════════════════════════════════════════════
export default function App() {
  const saved = load();
  const [page, sp]        = useState("home");
  const [clients, sc]     = useState(saved?.clients    || SEED_CLIENTS);
  const [projects, spj]   = useState(saved?.projects   || SEED_PROJECTS);
  const [purchases, spu]  = useState(saved?.purchases  || SEED_PURCHASES);
  const [income, sin]     = useState(saved?.income     || SEED_INCOME);
  const [portfolio, spor] = useState(saved?.portfolio  || SEED_PORTFOLIO);
  const [calNotes, scn]   = useState(saved?.calNotes   || {});
  const [balance, sb]     = useState(saved?.balance    || 4320);
  const [sessions, sse]   = useState(saved?.sessions   || []);
  const [deliveries, sd]  = useState(()=>{
    if(saved?.deliveries) return saved.deliveries;
    return SEED_PROJECTS.map(p=>({
      id:p.id, project:p.title, client:p.client, type:p.type, value:p.value,
      stage: p.status==="Completed"?"approved":p.status==="Review"?"sent":"uploaded",
      history:[{stage:"uploaded",ts:new Date(Date.now()-7*864e5).toLocaleString(),note:""}],
    }));
  });
  const [msgs, sm]        = useState(saved?.msgs || {
    1:[{from:"client",text:"Hey! Can you have ep 47 ready by Friday?",time:"10:23 AM"},{from:"me",text:"Rough cut by Thursday noon.",time:"10:31 AM"}],
    2:[{from:"client",text:"Love the reel! Can we tweak the color grade?",time:"Yesterday"},{from:"me",text:"On it — sending v2 tonight.",time:"Yesterday"}],
    3:[{from:"me",text:"Q3 recap done! Check your Drive.",time:"Mon"},{from:"client",text:"Excellent. Invoice approved.",time:"Mon"}],
    4:[{from:"client",text:"Taking a break, will reach out soon!",time:"Jun 3"}],
    5:[{from:"client",text:"Can we schedule a call for the rough cut?",time:"Today"},{from:"me",text:"Free at 3pm EST today.",time:"Today"}],
  });

  // Cards per tab
  const [hCards, shc] = useState(saved?.hCards||[{id:1,label:"Active Clients",value:4,color:"default",num:true},{id:2,label:"Active Projects",value:2,sub:"in progress",color:"blue",num:true},{id:3,label:"This Month",value:3250,sub:"May 2026",pre:"$",color:"green",num:true},{id:4,label:"Month Goal",value:65,suf:"%",sub:"$5,000 target",color:"yellow",num:true}]);
  const [cCards, scc] = useState(saved?.cCards||[{id:1,label:"Total Clients",value:5,color:"default",num:true},{id:2,label:"Active",value:4,color:"green",num:true},{id:3,label:"Monthly Value",value:4200,pre:"$",color:"ac",num:true}]);
  const [pCards, spc] = useState(saved?.pCards||[{id:1,label:"Total",value:6,color:"default",num:true},{id:2,label:"Active",value:2,color:"blue",num:true},{id:3,label:"Completed",value:2,color:"green",num:true},{id:4,label:"Pipeline",value:6050,pre:"$",color:"ac",num:true}]);
  const [fCards, sfc] = useState(saved?.fCards||[{id:1,label:"All Time",value:16400,pre:"$",color:"default",num:true},{id:2,label:"This Month",value:3250,pre:"$",color:"green",num:true},{id:3,label:"Projected",value:3510,pre:"$",color:"blue",num:true},{id:4,label:"Tax Aside 25%",value:813,pre:"$",color:"yellow",num:true},{id:5,label:"Net After Tax",value:2437,pre:"$",color:"ac",num:true}]);
  const [eCards, sec] = useState(saved?.eCards||[{id:1,label:"Balance",value:4320,pre:"$",sub:"Available",color:"green",num:true},{id:2,label:"Total Expenses",value:719,pre:"$",color:"default",num:true},{id:3,label:"Recurring/mo",value:95,pre:"$",color:"yellow",num:true}]);

  // Brand
  const [brand, sbr]  = useState(saved?.brand  || "EditDesk Pro");
  const [logo, slo]   = useState(saved?.logo   || null);
  const [edBrand, seb]= useState(false);
  const [brDr, sbd]   = useState(brand);
  const brandRef = useRef(); const logoRef = useRef();

  // Modals
  const [msgCl, smc]  = useState(null);
  const [invCl, sic]  = useState(null);

  // Dirty / save
  const [dirty, sdy]  = useState(false);
  const [savedAt, ssa]= useState(saved ? "Previously saved" : null);
  const deps = [clients,projects,purchases,income,portfolio,calNotes,balance,sessions,deliveries,hCards,cCards,pCards,fCards,eCards,brand,logo];
  const isFirst = useRef(true);
  useEffect(()=>{ if(isFirst.current){isFirst.current=false;return;} sdy(true); }, deps);

  const doSave = () => {
    save({ clients,projects,purchases,income,portfolio,calNotes,balance,sessions,deliveries,msgs,hCards,cCards,pCards,fCards,eCards,brand,logo });
    sdy(false); ssa(new Date().toLocaleTimeString());
  };
  const doDiscard = () => { const s=load(); if(s){ sc(s.clients); spj(s.projects); } sdy(false); };
  useEffect(()=>{ const h=()=>doSave(); window.addEventListener("beforeunload",h); return ()=>window.removeEventListener("beforeunload",h); });

  const sendMsg = (id, text) => sm(m=>({...m,[id]:[...(m[id]||[]),{from:"me",text,time:"Now"}]}));
  const logoUp = e => { const f=e.target.files?.[0]; if(!f) return; const r=new FileReader(); r.onload=ev=>slo(ev.target.result); r.readAsDataURL(f); };
  const saveBrand = () => { if(brDr.trim()) sbr(brDr.trim()); seb(false); };

  return <div style={{ minHeight:"100vh", background:T.bg }}>
    <style>{`*{box-sizing:border-box;} html,body,#root{background:${T.bg};margin:0;padding:0;} ::-webkit-scrollbar{width:4px;} ::-webkit-scrollbar-track{background:transparent;} ::-webkit-scrollbar-thumb{background:rgba(255,255,255,.1);border-radius:4px;} input[type=number]::-webkit-inner-spin-button{-webkit-appearance:none;} @keyframes pulse{0%,100%{opacity:1;}50%{opacity:.4;}}`}</style>
    <div style={{ maxWidth:860, margin:"0 auto", padding:"1.75rem 1.25rem", fontFamily:T.ff, color:T.tx }}>
      <div style={{ display:"flex", alignItems:"center", gap:13, marginBottom:"1.75rem" }}>
        <div onClick={()=>logoRef.current?.click()} title="Click to upload logo" style={{ width:40, height:40, borderRadius:T.rM, background:logo?"transparent":T.ac, overflow:"hidden", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, cursor:"pointer", border:`1px solid ${logo?T.ln:T.ac}`, boxShadow:logo?"none":"0 4px 14px rgba(217,95,69,.22)", transition:"all .2s" }}>
          {logo ? <img src={logo} alt="logo" style={{ width:"100%", height:"100%", objectFit:"cover" }} /> : <i className="ti ti-video" style={{ fontSize:18, color:"#fff" }} />}
        </div>
        <input ref={logoRef} type="file" accept="image/*" onChange={logoUp} style={{ display:"none" }} />
        <div>
          {edBrand
            ? <input ref={brandRef} value={brDr} onChange={e=>sbd(e.target.value)} onBlur={saveBrand} onKeyDown={e=>{if(e.key==="Enter")saveBrand();if(e.key==="Escape")seb(false);}} style={{ background:"transparent", border:"none", borderBottom:`1px solid ${T.ac}`, color:T.tx, fontSize:17, fontWeight:700, outline:"none", fontFamily:T.ff, letterSpacing:"-.025em", padding:"0 0 1px", width:220 }} autoFocus />
            : <p onClick={()=>{sbd(brand);seb(true);}} title="Click to rename" style={{ margin:0, fontSize:17, fontWeight:700, color:T.tx, letterSpacing:"-.025em", cursor:"text", borderBottom:"1px dashed transparent", display:"inline-block" }} onMouseEnter={e=>e.currentTarget.style.borderBottomColor=T.t3} onMouseLeave={e=>e.currentTarget.style.borderBottomColor="transparent"}>{brand}</p>}
          <p style={{ margin:0, fontSize:11, color:T.t3 }}>Video editor business hub{savedAt&&<span style={{ marginLeft:8 }}>· {savedAt}</span>}</p>
        </div>
      </div>
      <Nav page={page} setPage={sp} />
      {page==="home"      && <HomePage     clients={clients} projects={projects} setPage={sp} cards={hCards} setCards={shc} />}
      {page==="clients"   && <ClientsPage  clients={clients} setClients={sc} onMsg={smc} onInv={sic} cards={cCards} setCards={scc} />}
      {page==="projects"  && <ProjectsPage projects={projects} setProjects={spj} cards={pCards} setCards={spc} />}
      {page==="finance"   && <FinancePage  clients={clients} income={income} setIncome={sin} cards={fCards} setCards={sfc} />}
      {page==="expenses"  && <ExpensesPage purchases={purchases} setPurchases={spu} balance={balance} setBalance={sb} cards={eCards} setCards={sec} />}
      {page==="calendar"  && <CalendarPage projects={projects} notes={calNotes} setNotes={scn} />}
      {page==="templates" && <TemplatesPage clients={clients} />}
      {page==="delivery"  && <DeliveryPage deliveries={deliveries} setDeliveries={sd} />}
      {page==="timer"     && <TimerPage    projects={projects} sessions={sessions} setSessions={sse} />}
      {page==="portfolio" && <PortfolioPage clients={clients} portfolio={portfolio} setPortfolio={spor} />}
      {msgCl && <MsgModal client={msgCl} msgs={msgs[msgCl.id]||[]} onClose={()=>smc(null)} onSend={sendMsg} />}
      {invCl && <InvModal client={invCl} project={projects.find(p=>p.client===invCl.name)?.title} onClose={()=>sic(null)} />}
    </div>
    <SaveBar dirty={dirty} onSave={doSave} onDiscard={doDiscard} />
  </div>;
}
