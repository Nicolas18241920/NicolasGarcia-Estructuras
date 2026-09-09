import { useState, useEffect, useCallback } from "react";

// --- ESTRUCTURAS DE DATOS (Intactas) ---
class NodoSimple { constructor(dato) { this.dato = dato; this.siguiente = null; } }
class ListaSimple {
  constructor() { this.cabeza = null; this.tamanio = 0; }
  agregar(dato) { const n = new NodoSimple(dato); if (!this.cabeza) { this.cabeza = n; } else { let a = this.cabeza; while (a.siguiente) a = a.siguiente; a.siguiente = n; } this.tamanio++; }
  eliminarPrimero() { if (!this.cabeza) return null; const d = this.cabeza.dato; this.cabeza = this.cabeza.siguiente; this.tamanio--; return d; }
  eliminarPorId(id) { if (!this.cabeza) return null; if (this.cabeza.dato.id === id) return this.eliminarPrimero(); let a = this.cabeza; while (a.siguiente && a.siguiente.dato.id !== id) a = a.siguiente; if (!a.siguiente) return null; const d = a.siguiente.dato; a.siguiente = a.siguiente.siguiente; this.tamanio--; return d; }
  aArreglo() { const r = []; let a = this.cabeza; while (a) { r.push(a.dato); a = a.siguiente; } return r; }
}

class NodoDoble { constructor(dato) { this.dato = dato; this.siguiente = null; this.anterior = null; } }
class ListaDoble {
  constructor() { this.cabeza = null; this.cola = null; this.tamanio = 0; }
  agregarAlFinal(dato) { const n = new NodoDoble(dato); if (!this.cola) { this.cabeza = this.cola = n; } else { n.anterior = this.cola; this.cola.siguiente = n; this.cola = n; } this.tamanio++; }
  aArreglo() { const r = []; let a = this.cabeza; while (a) { r.push(a.dato); a = a.siguiente; } return r; }
  aArregloInverso() { const r = []; let a = this.cola; while (a) { r.push(a.dato); a = a.anterior; } return r; }
}

class NodoCircular { constructor(dato) { this.dato = dato; this.siguiente = null; } }
class ListaCircular {
  constructor() { this.actual = null; this.tamanio = 0; }
  agregar(dato) { const n = new NodoCircular(dato); if (!this.actual) { n.siguiente = n; this.actual = n; } else { let u = this.actual; while (u.siguiente !== this.actual) u = u.siguiente; u.siguiente = n; n.siguiente = this.actual; } this.tamanio++; }
  rotar() { if (this.actual) this.actual = this.actual.siguiente; }
  getMedico() { return this.actual ? this.actual.dato : null; }
  aArreglo() { if (!this.actual) return []; const r = []; let n = this.actual; do { r.push(n.dato); n = n.siguiente; } while (n !== this.actual); return r; }
}

class NodoCircularDoble { constructor(dato) { this.dato = dato; this.siguiente = null; this.anterior = null; } }
class ListaCircularDoble {
  constructor() { this.actual = null; this.tamanio = 0; }
  agregar(dato) { const n = new NodoCircularDoble(dato); if (!this.actual) { n.siguiente = n; n.anterior = n; this.actual = n; } else { const u = this.actual.anterior; u.siguiente = n; n.anterior = u; n.siguiente = this.actual; this.actual.anterior = n; } this.tamanio++; }
  rotar(dir = 1) { if (this.actual) this.actual = dir > 0 ? this.actual.siguiente : this.actual.anterior; }
  getActual() { return this.actual ? this.actual.dato : null; }
  aArreglo() { if (!this.actual) return []; const r = []; let n = this.actual; do { r.push(n.dato); n = n.siguiente; } while (n !== this.actual); return r; }
}

// --- DATOS INICIALES ---
const MEDICOS_DATA = [
  { id:1, nombre:"Dra. Lucía Vargas",  especialidad:"Medicina General", iniciales:"LV" },
  { id:2, nombre:"Dr. Andrés Molina",  especialidad:"Cardiología",      iniciales:"AM" },
  { id:3, nombre:"Dra. Paola Ríos",    especialidad:"Pediatría",        iniciales:"PR" },
  { id:4, nombre:"Dr. Felipe Herrera", especialidad:"Urgencias",        iniciales:"FH" },
];
const COMITE_DATA = [
  { id:1, nombre:"Dra. Carmen López",  cargo:"Directora Médica",    iniciales:"CL" },
  { id:2, nombre:"Ricardo Patiño",     cargo:"Gerente General",     iniciales:"RP" },
  { id:3, nombre:"Dra. Sandra Torres", cargo:"Jefa de Enfermería",  iniciales:"ST" },
  { id:4, nombre:"Mauricio Gómez",     cargo:"Director Financiero", iniciales:"MG" },
];
const MOTIVOS = ["Consulta general","Control Médico","Urgencia menor","Seguimiento","Exámenes","Dolor agudo"];
function hora() { return new Date().toLocaleTimeString("es-CO",{hour:"2-digit",minute:"2-digit"}); }
function ini(n) { return n.split(" ").filter(w=>w.length>2&&w[0]===w[0].toUpperCase()).slice(0,2).map(w=>w[0]).join("") || n.slice(0,2).toUpperCase(); }

let idCnt = 200; let turnoG = 4;
const listaEspera = new ListaSimple();
const historial   = new ListaDoble();
const rotacion    = new ListaCircular();
const comite      = new ListaCircularDoble();
MEDICOS_DATA.forEach(m => rotacion.agregar(m));
COMITE_DATA.forEach(c => comite.agregar(c));
[
  {id:idCnt++,nombre:"Ana Gómez",     edad:34,motivo:"Consulta general",hora:"08:15",turno:1},
  {id:idCnt++,nombre:"Luis Martínez", edad:52,motivo:"Control Médico",  hora:"08:30",turno:2},
  {id:idCnt++,nombre:"María Pérez",   edad:28,motivo:"Urgencia menor",  hora:"08:45",turno:3},
].forEach(p => listaEspera.agregar(p));

// --- COMPONENTES UI PREMIUM ---
const PAL = [
  {bg:"#F8FAFC", text:"#0F172A", border:"#E2E8F0"}, 
  {bg:"#F0FDF4", text:"#166534", border:"#DCFCE7"}, 
  {bg:"#FEFCE8", text:"#854D0E", border:"#FEF08A"}, 
  {bg:"#F1F5F9", text:"#334155", border:"#CBD5E1"},
];
function aColor(id) { return PAL[id % PAL.length]; }

function Avatar({ iniciales, id, size=38 }) {
  const c = aColor(id);
  return <div style={{width:size,height:size,borderRadius:"50%",background:c.bg,color:c.text,border:`1px solid ${c.border}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:size*0.35,fontWeight:500,flexShrink:0,boxShadow:"var(--shadow-sm)"}}>{iniciales}</div>;
}

function Badge({ children, variant="neutral" }) {
  const v = {
    accent: {bg:"var(--fill-accent)", color:"var(--on-accent)", border:"transparent"},
    success: {bg:"var(--bg-success)", color:"var(--text-success)", border:"var(--border-success)"},
    pro: {bg:"var(--bg-pro)", color:"var(--text-pro)", border:"var(--border-pro)"},
    neutral: {bg:"transparent", color:"var(--text-secondary)", border:"var(--border-strong)"}
  }[variant]||{};
  return <span style={{backgroundColor:v.bg, color:v.color, border:`1px solid ${v.border}`, fontSize:11, fontWeight:500, padding:"3px 10px", borderRadius:6, textTransform:"uppercase", letterSpacing:0.5}}>{children}</span>;
}

function Card({ children, style={} }) {
  return <div style={{background:"var(--surface-2)",borderRadius:"var(--radius)",padding:"1.5rem",boxShadow:"var(--shadow-md)",border:"1px solid rgba(0,0,0,0.03)",...style}}>{children}</div>;
}

function SectionHead({ icon, title, sub, right }) {
  return (
    <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:24}}>
      <div style={{display:"flex",alignItems:"center",gap:12}}>
        <div style={{background:"var(--surface-1)",padding:8,borderRadius:8,display:"flex"}}>
          <i className={`ti ${icon}`} style={{fontSize:20,color:"var(--fill-accent)"}} aria-hidden/>
        </div>
        <div>
          <div style={{fontWeight:600,fontSize:16,color:"var(--text-primary)"}}>{title}</div>
          {sub && <div style={{fontSize:12,color:"var(--text-secondary)",marginTop:2}}>{sub}</div>}
        </div>
      </div>
      {right}
    </div>
  );
}

// --- APP PRINCIPAL ---
export default function ClinicaApp() {
  const [espera,    setEspera]  = useState(() => listaEspera.aArreglo());
  const [hist,      setHist]    = useState(() => historial.aArreglo());
  const [medicos,   setMedicos] = useState(() => rotacion.aArreglo());
  const [guardia,   setGuardia] = useState(() => rotacion.getMedico());
  const [cArr,      setCArr]    = useState(() => comite.aArreglo());
  const [cAct,      setCAct]    = useState(() => comite.getActual());
  const [timer,     setTimer]   = useState(10);
  const [clock,     setClock]   = useState(hora());
  const [histDir,   setHistDir] = useState("desc");
  const [toasts,    setToasts]  = useState([]);
  const [form,      setForm]    = useState({nombre:"",edad:"",motivo:MOTIVOS[0]});
  const [tab,       setTab]     = useState("espera");

  useEffect(() => { const id = setInterval(() => setClock(hora()),1000); return () => clearInterval(id); },[]);

  const toast = useCallback((msg, type="default") => {
    const id = Date.now();
    setToasts(t => [...t,{id,msg,type}]);
    setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 4000);
  },[]);

  useEffect(() => {
    const id = setInterval(() => {
      setTimer(t => {
        if (t <= 1) {
          rotacion.rotar();
          const g = rotacion.getMedico();
          setGuardia({...g}); setMedicos([...rotacion.aArreglo()]);
          toast(`Guardia actualizada: ${g.nombre}`,"info");
          return 10;
        }
        return t-1;
      });
    },1000);
    return () => clearInterval(id);
  },[toast]);

  const syncE = () => setEspera([...listaEspera.aArreglo()]);
  const syncH = () => setHist([...historial.aArreglo()]);

  const agregar = () => {
    const nombre = form.nombre.trim();
    const edad   = parseInt(form.edad);
    if (!nombre || isNaN(edad) || edad < 1) { toast("Información incompleta","danger"); return; }
    const p = {id:idCnt++,nombre,edad,motivo:form.motivo,hora:hora(),turno:turnoG++};
    listaEspera.agregar(p); syncE();
    setForm({nombre:"",edad:"",motivo:MOTIVOS[0]});
    toast(`Paciente registrado: Turno #${p.turno}`,"success");
  };

  const atender = (id) => {
    const p = id ? listaEspera.eliminarPorId(id) : listaEspera.eliminarPrimero();
    if (!p) return;
    historial.agregarAlFinal({...p, medico:guardia?.nombre, horaAtencion:hora()});
    syncE(); syncH();
    toast(`Atendiendo a ${p.nombre}`,"success");
    setTab("historial");
  };

  const rotarC = (dir) => { comite.rotar(dir); setCArr([...comite.aArreglo()]); setCAct({...comite.getActual()}); };

  const histShow = histDir === "asc" ? hist : [...historial.aArregloInverso()];

  const TABS = [
    {id:"espera",    label:"Pacientes", icon:"ti-users", count:espera.length},
    {id:"historial", label:"Historial", icon:"ti-file-text", count:hist.length},
    {id:"medicos",   label:"Guardia",   icon:"ti-stethoscope", count:null},
    {id:"comite",    label:"Directiva", icon:"ti-building", count:null},
  ];

  const inputStyle = { padding:"12px 14px", borderRadius:8, border:"1px solid var(--border-strong)", outline:"none", fontSize:14, background:"var(--surface-1)", color:"var(--text-primary)", transition:"border 0.2s" };

  return (
    <div style={{minHeight:"100vh", paddingBottom:"2rem"}}>
      
      {/* HEADER LUXURY */}
      <div style={{background:"var(--surface-2)",borderBottom:"1px solid rgba(0,0,0,0.05)",padding:"1.2rem 2rem",display:"flex",alignItems:"center",justifyContent:"space-between",boxShadow:"var(--shadow-sm)"}}>
        <div style={{display:"flex",alignItems:"center",gap:14}}>
          <div style={{background:"var(--fill-accent)",color:"var(--on-accent)",padding:8,borderRadius:8}}>
            <i className="ti ti-activity" style={{fontSize:20}} aria-hidden/>
          </div>
          <div>
            <div style={{fontWeight:600,fontSize:15,letterSpacing:1.5,textTransform:"uppercase",color:"var(--text-primary)"}}>Clínica Privada</div>
            <div style={{fontSize:12,color:"var(--text-muted)",letterSpacing:0.5}}>SISTEMA DE GESTIÓN HOSPITALARIA</div>
          </div>
        </div>
        <div style={{display:"flex",alignItems:"center",gap:24}}>
          {guardia && (
            <div style={{display:"flex",alignItems:"center",gap:10,fontSize:13,color:"var(--text-secondary)",borderRight:"1px solid var(--border-strong)",paddingRight:24}}>
              <Avatar iniciales={guardia.iniciales} id={guardia.id} size={30}/>
              <div style={{display:"flex",flexDirection:"column"}}>
                <span style={{fontSize:11,textTransform:"uppercase",letterSpacing:0.5}}>Médico de Turno</span>
                <strong style={{color:"var(--text-primary)",fontWeight:500}}>{guardia.nombre}</strong>
              </div>
            </div>
          )}
          <div style={{fontSize:14,fontWeight:500,color:"var(--text-primary)",fontFamily:"var(--font-mono)"}}>{clock}</div>
        </div>
      </div>

      {/* TABS ELEGANTES */}
      <div style={{display:"flex",justifyContent:"center",padding:"2rem 0 1.5rem 0"}}>
        <div style={{background:"var(--surface-2)",padding:"6px",borderRadius:12,display:"inline-flex",gap:4,boxShadow:"var(--shadow-sm)",border:"1px solid rgba(0,0,0,0.03)"}}>
          {TABS.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)} style={{padding:"10px 20px",border:"none",background:tab===t.id?"var(--surface-1)":"transparent",borderRadius:8,cursor:"pointer",fontSize:13,fontWeight:500,color:tab===t.id?"var(--text-primary)":"var(--text-secondary)",display:"flex",alignItems:"center",gap:8,transition:"all 0.2s"}}>
              <i className={`ti ${t.icon}`} style={{fontSize:16,color:tab===t.id?"var(--fill-accent)":"inherit"}} aria-hidden/>
              {t.label}
              {t.count !== null && <span style={{background:tab===t.id?"#FFFFFF":"var(--surface-1)",color:tab===t.id?"var(--text-primary)":"var(--text-muted)",fontSize:11,padding:"2px 8px",borderRadius:6,border:tab===t.id?"1px solid var(--border-strong)":"none",fontWeight:600}}>{t.count}</span>}
            </button>
          ))}
        </div>
      </div>

      {/* CONTENEDOR PRINCIPAL */}
      <div style={{maxWidth:780,margin:"0 auto",padding:"0 1.5rem"}}>

        {/* --- TAB: PACIENTES --- */}
        {tab === "espera" && (
          <div style={{animation:"fadeIn 0.3s ease"}}>
            <Card style={{marginBottom:24}}>
              <SectionHead icon="ti-user-plus" title="Admisión de Pacientes" sub="Ingreso a Lista Enlazada Simple"/>
              <div style={{display:"grid",gridTemplateColumns:"2fr 1fr",gap:12,marginBottom:12}}>
                <input placeholder="Nombre completo del paciente" value={form.nombre} onChange={e=>setForm(f=>({...f,nombre:e.target.value}))} style={inputStyle}/>
                <input placeholder="Edad" type="number" value={form.edad} onChange={e=>setForm(f=>({...f,edad:e.target.value}))} style={inputStyle}/>
              </div>
              <div style={{display:"grid",gridTemplateColumns:"2fr 1fr",gap:12}}>
                <select value={form.motivo} onChange={e=>setForm(f=>({...f,motivo:e.target.value}))} style={inputStyle}>
                  {MOTIVOS.map(m=><option key={m}>{m}</option>)}
                </select>
                <button onClick={agregar} style={{background:"var(--fill-accent)",color:"var(--on-accent)",border:"none",borderRadius:8,fontWeight:500,cursor:"pointer",fontSize:14,transition:"opacity 0.2s"}}>
                  Registrar Ingreso
                </button>
              </div>
            </Card>

            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:16,padding:"0 4px"}}>
              <div style={{fontSize:13,fontWeight:500,color:"var(--text-secondary)",textTransform:"uppercase",letterSpacing:0.5}}>Cola de Espera</div>
              <Badge variant="neutral">{espera.length} pacientes</Badge>
            </div>

            {espera.length === 0 ? (
              <Card style={{textAlign:"center",padding:"4rem 0",boxShadow:"none",background:"transparent",border:"1px dashed var(--border-strong)"}}>
                <i className="ti ti-armchair" style={{fontSize:42,color:"var(--text-muted)",marginBottom:12,display:"block"}} aria-hidden/>
                <div style={{color:"var(--text-secondary)",fontSize:15}}>No hay pacientes en la sala de espera.</div>
              </Card>
            ) : (
              <div style={{display:"flex",flexDirection:"column",gap:12}}>
                {espera.map((p,i) => (
                  <Card key={p.id} style={{padding:"16px 20px",display:"flex",alignItems:"center",gap:16,borderLeft:i===0?"4px solid var(--fill-accent)":"1px solid rgba(0,0,0,0.03)"}}>
                    <div style={{width:40,height:40,borderRadius:8,background:"var(--surface-1)",color:"var(--text-secondary)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,fontWeight:600,flexShrink:0,border:"1px solid var(--border-strong)"}}>
                      #{p.turno}
                    </div>
                    <Avatar iniciales={ini(p.nombre)} id={p.id} size={42}/>
                    <div style={{flex:1,minWidth:0}}>
                      <div style={{fontWeight:500,fontSize:15}}>{p.nombre}</div>
                      <div style={{fontSize:13,color:"var(--text-secondary)",marginTop:4}}>{p.edad} años • {p.motivo} • Ingreso: {p.hora}</div>
                    </div>
                    <button onClick={()=>atender(p.id)} style={{background:i===0?"var(--fill-accent)":"transparent",color:i===0?"var(--on-accent)":"var(--text-primary)",border:`1px solid ${i===0?"transparent":"var(--border-strong)"}`,padding:"8px 16px",borderRadius:6,fontSize:13,fontWeight:500,cursor:"pointer",display:"flex",alignItems:"center",gap:6}}>
                      {i===0 && <i className="ti ti-stethoscope" style={{fontSize:15}} />}
                      Llamar
                    </button>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}

        {/* --- TAB: HISTORIAL --- */}
        {tab === "historial" && (
          <div style={{animation:"fadeIn 0.3s ease"}}>
            <Card>
              <SectionHead icon="ti-file-text" title="Registro Clínico" sub="Historial de atenciones (Lista Doble)" right={
                  <select value={histDir} onChange={e=>setHistDir(e.target.value)} style={{...inputStyle, padding:"6px 12px", fontSize:12, background:"transparent"}}>
                    <option value="desc">Más recientes primero</option>
                    <option value="asc">Más antiguos primero</option>
                  </select>
                }
              />
              {histShow.length === 0 ? (
                <div style={{textAlign:"center",padding:"3rem 0",color:"var(--text-muted)"}}>Aún no hay registros médicos.</div>
              ) : (
                <div style={{display:"flex",flexDirection:"column",gap:12}}>
                  {histShow.map(p => (
                    <div key={p.id+p.horaAtencion} style={{display:"flex",alignItems:"center",gap:16,padding:"16px",borderRadius:10,background:"var(--surface-1)",border:"1px solid var(--border-strong)"}}>
                      <Avatar iniciales={ini(p.nombre)} id={p.id} size={38}/>
                      <div style={{flex:1}}>
                        <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:4}}>
                          <span style={{fontWeight:500,fontSize:14,color:"var(--text-primary)"}}>{p.nombre}</span>
                          <Badge variant="success">Atendido</Badge>
                        </div>
                        <div style={{fontSize:12,color:"var(--text-secondary)"}}>
                          <i className="ti ti-clock" style={{verticalAlign:-1,marginRight:4}}/>{p.horaAtencion} • {p.motivo}
                        </div>
                      </div>
                      <div style={{textAlign:"right",fontSize:12,color:"var(--text-secondary)",borderLeft:"1px solid var(--border-strong)",paddingLeft:16}}>
                        <div style={{marginBottom:4,textTransform:"uppercase",letterSpacing:0.5,fontSize:10}}>Médico a cargo</div>
                        <div style={{fontWeight:500,color:"var(--text-primary)"}}>{p.medico}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </div>
        )}

        {/* --- TAB: MÉDICOS --- */}
        {tab === "medicos" && (
          <div style={{animation:"fadeIn 0.3s ease"}}>
            <Card>
              <SectionHead icon="ti-activity" title="Cuerpo Médico en Guardia" sub="Rotación automática (Lista Circular)"/>
              
              <div style={{display:"flex",alignItems:"center",gap:20,padding:"20px",borderRadius:12,background:"var(--surface-1)",border:"1px solid var(--border-strong)",marginBottom:24}}>
                <Avatar iniciales={guardia?.iniciales||""} id={guardia?.id||0} size={64}/>
                <div style={{flex:1}}>
                  <div style={{fontSize:11,textTransform:"uppercase",letterSpacing:1,color:"var(--fill-accent)",fontWeight:600,marginBottom:4}}>Guardia Actual</div>
                  <div style={{fontWeight:600,fontSize:18,color:"var(--text-primary)",marginBottom:2}}>{guardia?.nombre}</div>
                  <div style={{fontSize:14,color:"var(--text-secondary)",marginBottom:12}}>{guardia?.especialidad}</div>
                  
                  <div style={{display:"flex",alignItems:"center",gap:12}}>
                    <div style={{flex:1,background:"var(--border-strong)",borderRadius:99,height:4,overflow:"hidden"}}>
                      <div style={{height:"100%",width:`${(timer/10)*100}%`,background:"var(--fill-accent)",transition:"width 0.9s linear"}}/>
                    </div>
                    <span style={{fontSize:11,color:"var(--text-muted)",fontFamily:"var(--font-mono)",width:30}}>0:{timer.toString().padStart(2,'0')}</span>
                  </div>
                </div>
                <button onClick={()=>{rotacion.rotar();setGuardia({...rotacion.getMedico()});setMedicos([...rotacion.aArreglo()]);setTimer(10);}} style={{background:"var(--surface-2)",border:"1px solid var(--border-strong)",padding:"10px",borderRadius:"50%",cursor:"pointer",display:"flex",boxShadow:"var(--shadow-sm)"}}>
                  <i className="ti ti-player-skip-forward" style={{fontSize:18,color:"var(--text-primary)"}} />
                </button>
              </div>

              <div style={{fontSize:13,fontWeight:500,color:"var(--text-secondary)",textTransform:"uppercase",letterSpacing:0.5,marginBottom:12}}>Próximos en rotación</div>
              <div style={{display:"flex",flexDirection:"column",gap:8}}>
                {medicos.slice(1).map((m)=>(
                  <div key={m.id} style={{display:"flex",alignItems:"center",gap:12,padding:"12px 16px",borderRadius:8,border:"1px solid rgba(0,0,0,0.04)",background:"var(--surface-2)"}}>
                    <Avatar iniciales={m.iniciales} id={m.id} size={32}/>
                    <div style={{flex:1}}>
                      <div style={{fontSize:14,fontWeight:500}}>{m.nombre}</div>
                      <div style={{fontSize:12,color:"var(--text-secondary)"}}>{m.especialidad}</div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        )}

        {/* --- TAB: COMITÉ --- */}
        {tab === "comite" && (
          <div style={{animation:"fadeIn 0.3s ease"}}>
            <Card>
              <SectionHead icon="ti-building" title="Junta Directiva" sub="Navegación bidireccional (Lista Circular Doble)"/>
              
              <div style={{display:"flex",alignItems:"center",gap:20,padding:"20px",borderRadius:12,background:"var(--bg-pro)",border:"1px solid var(--border-pro)",marginBottom:24}}>
                <Avatar iniciales={cAct?.iniciales||""} id={cAct?.id||0} size={56}/>
                <div style={{flex:1}}>
                  <div style={{fontWeight:600,fontSize:17,color:"var(--text-primary)"}}>{cAct?.nombre}</div>
                  <div style={{fontSize:14,color:"var(--text-pro)",fontWeight:500,marginTop:2}}>{cAct?.cargo}</div>
                </div>
                <div style={{display:"flex",gap:8}}>
                  <button onClick={()=>rotarC(-1)} style={{background:"var(--surface-2)",border:"none",padding:"10px",borderRadius:"50%",cursor:"pointer",boxShadow:"var(--shadow-sm)"}}>
                    <i className="ti ti-chevron-left" style={{fontSize:18}} />
                  </button>
                  <button onClick={()=>rotarC(1)} style={{background:"var(--surface-2)",border:"none",padding:"10px",borderRadius:"50%",cursor:"pointer",boxShadow:"var(--shadow-sm)"}}>
                    <i className="ti ti-chevron-right" style={{fontSize:18}} />
                  </button>
                </div>
              </div>

              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
                {cArr.map(m=>{
                  const isA = m.id===cAct?.id;
                  return (
                    <div key={m.id} style={{display:"flex",alignItems:"center",gap:12,padding:"14px",borderRadius:10,border:`1px solid ${isA?"var(--border-pro)":"var(--border-strong)"}`,background:isA?"#FAFAF9":"var(--surface-1)",opacity:isA?1:0.6,transition:"all 0.3s"}}>
                      <Avatar iniciales={m.iniciales} id={m.id} size={36}/>
                      <div>
                        <div style={{fontSize:13,fontWeight:isA?600:400,color:"var(--text-primary)"}}>{m.nombre}</div>
                        <div style={{fontSize:11,color:"var(--text-secondary)"}}>{m.cargo}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>
          </div>
        )}
      </div>

      {/* TOASTS (Notificaciones refinadas) */}
      <div style={{position:"fixed",bottom:24,right:24,display:"flex",flexDirection:"column",gap:10,zIndex:999}}>
        {toasts.map(t=>(
          <div key={t.id} style={{background:"var(--surface-3)",color:"#FFFFFF",padding:"12px 20px",borderRadius:8,fontSize:13,minWidth:280,boxShadow:"var(--shadow-md)",display:"flex",alignItems:"center",gap:12,animation:"fadeIn 0.3s cubic-bezier(0.16, 1, 0.3, 1)"}}>
            <i className={`ti ${t.type==="success"?"ti-check":t.type==="danger"?"ti-alert-triangle":"ti-info-circle"}`} style={{fontSize:18,color:t.type==="success"?"#4ADE80":t.type==="danger"?"#F87171":"#60A5FA"}} aria-hidden/>
            {t.msg}
          </div>
        ))}
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}