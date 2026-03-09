import { useState, useRef, useCallback } from "react";

const DEFAULT_DESIGN = {
  // Colors
  bgColor: "#0f2557", bgColor2: "#1a3a8f", accentColor: "#f0c040",
  textColor: "#ffffff", idColor: "#f0c040",
  backBgColor: "#0a1a3a", backBgColor2: "#0f2557",
  // Brand
  orgName: "ACME CORPORATION", orgSub: "Official Identification Card", logoText: "AC",
  // Front element positions
  photoX: 6, photoY: 22, photoSize: 22,
  nameX: 35, nameY: 38,
  idLabelX: 35, idLabelY: 52, idValX: 35, idValY: 58,
  nameFontSize: 13, idFontSize: 9,
  // Back element positions
  backGuardianX: 8, backGuardianY: 28,
  backAddressX: 8, backAddressY: 48,
  backContactX: 8, backContactY: 68,
  backFontSize: 8,
  // Individual back font sizes
  backGuardianFontSize: 8,
  backAddressFontSize: 8,
  backContactFontSize: 8,
  // Style
  pattern: "circles", showBorder: true, borderColor: "#f0c040",
  roundness: 10, fontFamily: "Georgia",
  bgImage: null, useImageBg: false,
  bgImageBack: null, useImageBgBack: false,
  photoShape: "circle", showOrgHeader: true, showBarcode: true,
  photoBorderColor: "#f0c040", photoBorderWidth: 2,
  textShadow: false, nameBold: true,
  orientation: "landscape",
};

const PATTERNS = ["circles", "lines", "dots", "none"];
const FONTS = ["Georgia", "Trebuchet MS", "Palatino", "Courier New", "Tahoma","Arial", "Verdana", "Times New Roman"];

// ── FRONT CARD ───────────────────────────────────────────────
function CardFront({ design, person }) {
  const {
    bgColor, bgColor2, accentColor, textColor, idColor,
    orgName, orgSub, logoText,
    photoX, photoY, photoSize, nameX, nameY,
    idLabelX, idLabelY, idValX, idValY, nameFontSize, idFontSize,
    pattern, showBorder, borderColor, roundness, fontFamily,
    bgImage, useImageBg, photoShape, showOrgHeader, showBarcode, textShadow, nameBold,
    orientation, photoBorderColor, photoBorderWidth,
  } = design;

  const isPortrait = orientation === "portrait";
  const W = isPortrait ? 204 : 323;
  const H = isPortrait ? 323 : 204;
  const px = v => `${(v/100)*W}px`;
  const py = v => `${(v/100)*H}px`;
  const ps = v => `${(v/100)*W}px`;
  const tShadow = textShadow ? "0 1px 4px rgba(0,0,0,0.9)" : "none";
  const photoRadius = photoShape==="circle"?"50%":photoShape==="square"?"4px":"12px";

  const renderPattern = () => {
    if (useImageBg || pattern==="none") return null;
    if (pattern==="circles") return (<>
      <div style={{ position:"absolute",top:"-30%",right:"-10%",width:"55%",height:"87%",borderRadius:"50%",border:`1.5px solid ${accentColor}25`,pointerEvents:"none"}} />
      <div style={{ position:"absolute",top:"10%",right:"5%",width:"35%",height:"55%",borderRadius:"50%",border:`1px solid ${accentColor}18`,pointerEvents:"none"}} />
      <div style={{ position:"absolute",bottom:"-20%",left:"-5%",width:"40%",height:"63%",borderRadius:"50%",border:`1px solid ${accentColor}15`,pointerEvents:"none"}} />
    </>);
    if (pattern==="lines") return (
      <svg style={{position:"absolute",inset:0,width:"100%",height:"100%",opacity:0.08,pointerEvents:"none"}}>
        {Array.from({length:12}).map((_,i)=><line key={i} x1={i*30} y1="0" x2={i*30+80} y2={H} stroke={accentColor} strokeWidth="1"/>)}
      </svg>);
    if (pattern==="dots") return (
      <svg style={{position:"absolute",inset:0,width:"100%",height:"100%",opacity:0.12,pointerEvents:"none"}}>
        {Array.from({length:10}).map((_,i)=>Array.from({length:8}).map((__,j)=><circle key={`${i}-${j}`} cx={i*36+10} cy={j*32+10} r="1.5" fill={accentColor}/>))}
      </svg>);
  };

  const cardBg = useImageBg && bgImage
    ? {backgroundImage:`url(${bgImage})`,backgroundSize:"cover",backgroundPosition:"center"}
    : {background:`linear-gradient(135deg, ${bgColor} 0%, ${bgColor2} 100%)`};

  return (
    <div style={{width:`${W}px`,height:`${H}px`,borderRadius:`${roundness}px`,transition:"all 0.3s",...cardBg,position:"relative",overflow:"hidden",flexShrink:0,border:showBorder?`2px solid ${borderColor}`:"none",boxShadow:"0 8px 28px rgba(0,0,0,0.5)",fontFamily}}>
      {renderPattern()}
      {!useImageBg && <div style={{position:"absolute",top:0,left:0,right:0,height:"5px",background:`linear-gradient(90deg, ${accentColor}, ${accentColor}44)`}} />}
      {showOrgHeader && !useImageBg && (<>
        <div style={{position:"absolute",top:"10px",left:"10px",width:"28px",height:"28px",borderRadius:"50%",background:accentColor,display:"flex",alignItems:"center",justifyContent:"center"}}>
          <span style={{color:bgColor,fontSize:"10px",fontWeight:900}}>{logoText.slice(0,2)}</span>
        </div>
        <div style={{position:"absolute",top:"12px",left:"44px",right:"8px"}}>
          <div style={{color:accentColor,fontSize:"8px",fontWeight:700,letterSpacing:"2px",textTransform:"uppercase",whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{orgName}</div>
          <div style={{color:`${textColor}88`,fontSize:"6px",letterSpacing:"1px",marginTop:"1px"}}>{orgSub}</div>
        </div>
      </>)}
      <div style={{position:"absolute",left:px(photoX),top:py(photoY),width:ps(photoSize),height:ps(photoSize),borderRadius:photoRadius,border:`${photoBorderWidth}px solid ${photoBorderColor}`,overflow:"hidden",background:`${photoBorderColor}22`,display:"flex",alignItems:"center",justifyContent:"center",boxShadow:textShadow?"0 2px 8px rgba(0,0,0,0.5)":"none"}}>
        {person?.photo
          ? <img src={person.photo} alt="" style={{width:"100%",height:"100%",objectFit:"cover"}} onError={e=>e.target.style.display="none"} />
          : <span style={{color:photoBorderColor,fontSize:`${photoSize*0.25}px`,fontWeight:700}}>
              {person?.name?person.name.split(" ").map(n=>n[0]).join("").slice(0,2).toUpperCase():"ID"}
            </span>}
      </div>
      <div style={{position:"absolute",left:px(nameX),top:py(nameY),right:"8px"}}>
        <div style={{color:textColor,fontSize:`${nameFontSize}px`,fontWeight:nameBold?700:400,lineHeight:1.2,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis",textShadow:tShadow}}>
          {person?.name||"Juan Dela Cruz"}
        </div>
      </div>
      <div style={{position:"absolute",left:px(idLabelX),top:py(idLabelY)}}>
        <div style={{color:`${textColor}88`,fontSize:"6px",letterSpacing:"1.5px",textTransform:"uppercase",textShadow:tShadow}}>Employee ID</div>
      </div>
      <div style={{position:"absolute",left:px(idValX),top:py(idValY)}}>
        <div style={{color:idColor,fontSize:`${idFontSize}px`,fontWeight:700,letterSpacing:"2px",fontFamily:"Courier New",textShadow:tShadow}}>
          {person?.id||"EMP-2024-001"}
        </div>
      </div>
      {!useImageBg && <div style={{position:"absolute",bottom:0,left:0,right:0,height:"4px",background:`linear-gradient(90deg, transparent, ${accentColor}88)`}} />}
      {showBarcode && (
        <div style={{position:"absolute",bottom:"8px",right:"8px",display:"flex",gap:"1px",alignItems:"center"}}>
          {[3,5,2,6,4,7,3,5,6,4,3].map((h,i)=><div key={i} style={{width:"1.5px",height:`${h*2}px`,background:`${accentColor}88`,borderRadius:"1px"}} />)}
        </div>
      )}
    </div>
  );
}

// ── BACK CARD ────────────────────────────────────────────────
function CardBack({ design, person }) {
  const {
    backBgColor, backBgColor2, accentColor, textColor,
    orgName, showBorder, borderColor, roundness, fontFamily,
    bgImageBack, useImageBgBack, textShadow,
    backGuardianX, backGuardianY,
    backAddressX, backAddressY,
    backContactX, backContactY,
    backGuardianFontSize, backAddressFontSize, backContactFontSize,
    orientation,
  } = design;

  const isPortrait = orientation === "portrait";
  const W = isPortrait ? 204 : 323;
  const H = isPortrait ? 323 : 204;
  const px = v => `${(v/100)*W}px`;
  const py = v => `${(v/100)*H}px`;
  const tShadow = textShadow ? "0 1px 4px rgba(0,0,0,0.9)" : "none";

  const cardBg = useImageBgBack && bgImageBack
    ? {backgroundImage:`url(${bgImageBack})`,backgroundSize:"cover",backgroundPosition:"center"}
    : {background:`linear-gradient(135deg, ${backBgColor} 0%, ${backBgColor2} 100%)`};

  return (
    <div style={{width:`${W}px`,height:`${H}px`,borderRadius:`${roundness}px`,transition:"all 0.3s",...cardBg,position:"relative",overflow:"hidden",flexShrink:0,border:showBorder?`2px solid ${borderColor}`:"none",boxShadow:"0 8px 28px rgba(0,0,0,0.5)",fontFamily}}>

      {/* Magnetic stripe */}
      {!useImageBgBack && <div style={{position:"absolute",top:"18px",left:0,right:0,height:"26px",background:"#00000088"}} />}

      {/* Bottom accent */}
      {!useImageBgBack && <div style={{position:"absolute",bottom:0,left:0,right:0,height:"4px",background:`linear-gradient(90deg, ${accentColor}88, transparent)`}} />}

      {/* Guardian */}
      <div style={{position:"absolute",left:px(backGuardianX),top:py(backGuardianY),right:"8px"}}>
        <div style={{color:`${textColor}66`,fontSize:"6px",letterSpacing:"1.5px",textTransform:"uppercase",textShadow:tShadow,marginBottom:"2px"}}>Guardian / Emergency Contact</div>
        <div style={{color:textColor,fontSize:`${backGuardianFontSize}px`,fontWeight:600,textShadow:tShadow,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>
          {person?.guardian||"—"}
        </div>
      </div>

      {/* Address */}
      <div style={{position:"absolute",left:px(backAddressX),top:py(backAddressY),right:"8px"}}>
        <div style={{color:`${textColor}66`,fontSize:"6px",letterSpacing:"1.5px",textTransform:"uppercase",textShadow:tShadow,marginBottom:"2px"}}>Address</div>
        <div style={{color:textColor,fontSize:`${backAddressFontSize}px`,fontWeight:400,textShadow:tShadow,lineHeight:1.4,overflow:"hidden",display:"-webkit-box",WebkitLineClamp:2,WebkitBoxOrient:"vertical"}}>
          {person?.address||"—"}
        </div>
      </div>

      {/* Contact */}
      <div style={{position:"absolute",left:px(backContactX),top:py(backContactY),right:"8px"}}>
        <div style={{color:`${textColor}66`,fontSize:"6px",letterSpacing:"1.5px",textTransform:"uppercase",textShadow:tShadow,marginBottom:"2px"}}>Contact Number</div>
        <div style={{color:accentColor,fontSize:`${backContactFontSize}px`,fontWeight:700,fontFamily:"Courier New",letterSpacing:"1px",textShadow:tShadow}}>
          {person?.contact||"—"}
        </div>
      </div>

      {/* Return notice */}
      {!useImageBgBack && (
        <div style={{position:"absolute",bottom:"10px",left:"8px",right:"8px"}}>
          <div style={{color:`${textColor}33`,fontSize:"6px",lineHeight:1.5}}>
            If found, please return to: {orgName}
          </div>
        </div>
      )}

      {/* QR placeholder */}
      <div style={{position:"absolute",bottom:"18px",right:"8px",width:"44px",height:"44px",background:"#fff",borderRadius:"5px",padding:"4px",display:"flex",flexWrap:"wrap",gap:"1px"}}>
        {[1,1,1,1,1,0,1,1,0,0,1,0,1,1,1,1,0,0,1,0,1,1,1,1,1].map((v,i)=>(
          <div key={i} style={{width:"7px",height:"7px",background:v?backBgColor:"transparent",borderRadius:"1px"}} />
        ))}
      </div>
    </div>
  );
}

// ── UI Helpers ───────────────────────────────────────────────
const Section = ({title, children}) => (
  <div style={{marginBottom:"20px"}}>
    <div style={{fontSize:"10px",color:"#f0c04088",letterSpacing:"2px",textTransform:"uppercase",marginBottom:"10px",borderBottom:"1px solid #2a2a2a",paddingBottom:"6px"}}>{title}</div>
    {children}
  </div>
);
const Row = ({label, children}) => (
  <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:"8px",gap:"8px"}}>
    <label style={{fontSize:"11px",color:"#888",minWidth:"80px",flexShrink:0}}>{label}</label>
    <div style={{flex:1}}>{children}</div>
  </div>
);
const Slider = ({value, onChange, min=0, max=100, step=1}) => (
  <input type="range" min={min} max={max} step={step} value={value} onChange={e=>onChange(Number(e.target.value))} style={{width:"100%",accentColor:"#f0c040",cursor:"pointer"}} />
);
const ColorPick = ({value, onChange}) => (
  <div style={{display:"flex",alignItems:"center",gap:"6px"}}>
    <input type="color" value={value} onChange={e=>onChange(e.target.value)} style={{width:"28px",height:"28px",border:"none",borderRadius:"6px",cursor:"pointer",background:"none"}} />
    <span style={{fontSize:"10px",color:"#666",fontFamily:"monospace"}}>{value}</span>
  </div>
);
const TextInp = ({value, onChange, placeholder=""}) => (
  <input type="text" value={value} placeholder={placeholder} onChange={e=>onChange(e.target.value)}
    style={{width:"100%",padding:"6px 10px",borderRadius:"6px",background:"#1a1a1a",border:"1px solid #2a2a2a",color:"#fff",fontSize:"12px",outline:"none",boxSizing:"border-box"}} />
);
const Toggle = ({checked, onChange}) => (
  <input type="checkbox" checked={checked} onChange={e=>onChange(e.target.checked)} style={{accentColor:"#f0c040",width:"14px",height:"14px",cursor:"pointer"}} />
);
const SelectInp = ({value, onChange, options}) => (
  <select value={value} onChange={e=>onChange(e.target.value)}
    style={{width:"100%",padding:"6px",background:"#1a1a1a",border:"1px solid #2a2a2a",color:"#fff",borderRadius:"6px",fontSize:"12px"}}>
    {options.map(o=><option key={o.value||o} value={o.value||o}>{o.label||o}</option>)}
  </select>
);

// Font size display badge
const FontSizeBadge = ({value}) => (
  <span style={{fontSize:"10px",color:"#f0c040",fontFamily:"monospace",background:"#f0c04011",borderRadius:"4px",padding:"1px 5px",marginLeft:"4px"}}>{value}px</span>
);

// ── Main App ─────────────────────────────────────────────────
export default function IDCardStudio() {
  const [tab, setTab] = useState("design");
  const [designTab, setDesignTab] = useState("front"); // front | back
  const [design, setDesign] = useState(DEFAULT_DESIGN);
  const [apiKey, setApiKey] = useState("AIzaSyAEt8qUfGyJha7BNnPTOy5WWjxrK-ONuP4");
  const [sheetId, setSheetId] = useState("1btF66wESO53_dFnMduKgK90xkgHtxLKg2hB-Cm2uPDw");
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [previewPerson, setPreviewPerson] = useState(null);
  const [showKey, setShowKey] = useState(false);
  const [imgDragging, setImgDragging] = useState(false);
  const [imgDraggingBack, setImgDraggingBack] = useState(false);
  const bgUploadRef = useRef();
  const bgUploadBackRef = useRef();

  const set = useCallback((key, val) => setDesign(d => ({...d, [key]: val})), []);

  const handleBgImage = (file, isBack=false) => {
    if (!file || !file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      if (isBack) { set("bgImageBack", e.target.result); set("useImageBgBack", true); }
      else { set("bgImage", e.target.result); set("useImageBg", true); }
    };
    reader.readAsDataURL(file);
  };

  const fetchData = async () => {
    if (!apiKey.trim() || !sheetId.trim()) { setError("Enter API Key and Spreadsheet ID."); return; }
    setError(""); setLoading(true);
    try {
      const url = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId.trim()}/values/Sheet1!A1:Z1000?key=${apiKey.trim()}`;
      const res = await fetch(url);
      const data = await res.json();
      if (data.error) { setError(`API Error: ${data.error.message}`); setLoading(false); return; }
      const rows = data.values || [];
      if (rows.length < 2) { setError("No data found in Sheet1."); setLoading(false); return; }
      const headers = rows[0].map(h => h.trim().toLowerCase());

      const fi = (keywords) => headers.findIndex(h => keywords.some(k => h.includes(k)));
      const ni  = fi(["full name","name"]);
      const ii  = fi(["employee id","emp id","id"]);
      const pi  = fi(["photo"]);
      const gi  = fi(["guardian"]);
      const ai  = fi(["address"]);
      const ci  = fi(["contact","phone","mobile","number"]);

      if (ni===-1||ii===-1) { setError('Headers must include "Full Name" and "Employee ID".'); setLoading(false); return; }

      const parsed = rows.slice(1).map(r => ({
        name:     r[ni]  || "—",
        id:       r[ii]  || "—",
        photo:    pi>=0  ? r[pi]  || "" : "",
        guardian: gi>=0  ? r[gi]  || "" : "",
        address:  ai>=0  ? r[ai]  || "" : "",
        contact:  ci>=0  ? r[ci]  || "" : "",
      })).filter(e => e.name !== "—");

      setEmployees(parsed);
      setPreviewPerson(parsed[0] || null);
      setTab("print");
    } catch(e) { setError("Network error. Check credentials and sheet sharing."); }
    setLoading(false);
  };

  const handlePrint = () => {
    const style = document.createElement("style");
    style.innerHTML = `
      * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; color-adjust: exact !important; }
      @media print {
        body * { visibility: hidden !important; }
        #print-area, #print-area * { visibility: visible !important; }
        #print-area { position: fixed !important; top: 0 !important; left: 0 !important; width: 100% !important; background: white !important; }
        #print-area div { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
        @page { size: A4; margin: 8mm; }
      }
    `;
    document.head.appendChild(style);
    window.print();
    setTimeout(() => document.head.removeChild(style), 1500);
  };

  const tabStyle = t => ({
    padding:"8px 16px", borderRadius:"6px", cursor:"pointer", fontSize:"12px", fontWeight:600,
    border:"none", transition:"all 0.15s",
    background: tab===t ? "#f0c040" : "transparent",
    color: tab===t ? "#0a0a0a" : "#666",
  });

  const dTabStyle = t => ({
    padding:"5px 14px", borderRadius:"5px", cursor:"pointer", fontSize:"11px", fontWeight:600,
    border:"none", transition:"all 0.15s",
    background: designTab===t ? "#f0c04022" : "transparent",
    color: designTab===t ? "#f0c040" : "#555",
    borderBottom: designTab===t ? "2px solid #f0c040" : "2px solid transparent",
  });

  return (
    <div style={{height:"100vh",background:"#0a0a0a",color:"#fff",fontFamily:"'Trebuchet MS', sans-serif",display:"flex",flexDirection:"column",overflow:"hidden"}}>

      {/* Top bar */}
      <div style={{background:"#111",borderBottom:"1px solid #1e1e1e",padding:"12px 24px",display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:"10px"}}>
        <div>
          <div style={{fontSize:"9px",color:"#f0c04088",letterSpacing:"3px",textTransform:"uppercase"}}>● ID CARD STUDIO</div>
          <div style={{fontSize:"18px",fontWeight:800,background:"linear-gradient(90deg, #f0c040, #e0a020)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>CardForge</div>
        </div>
        <div style={{display:"flex",alignItems:"center",gap:"12px"}}>
          <div style={{display:"flex",gap:"4px",background:"#1a1a1a",padding:"4px",borderRadius:"8px"}}>
            {[["design","🎨 Design"],["data","🔗 Data"],["print","🖨️ Print"]].map(([t,l])=>(
              <button key={t} onClick={()=>setTab(t)} style={tabStyle(t)}>{l}</button>
            ))}
          </div>
        </div>
      </div>

      <div style={{display:"flex",flex:1,minHeight:0,overflow:"hidden"}}>

        {/* LEFT PANEL */}
        <div style={{width:"290px",background:"#111",borderRight:"1px solid #1e1e1e",padding:"16px",overflowY:"auto",overflowX:"hidden",flexShrink:0,height:"100%"}}>

          {/* ══ DESIGN TAB ══ */}
          {tab === "design" && <>
            {/* Front / Back sub-tabs */}
            <div style={{display:"flex",gap:"2px",marginBottom:"18px",borderBottom:"1px solid #1a1a1a",paddingBottom:"0"}}>
              <button onClick={()=>setDesignTab("front")} style={dTabStyle("front")}>⬛ Front</button>
              <button onClick={()=>setDesignTab("back")} style={dTabStyle("back")}>🔄 Back</button>
            </div>

            {/* ── FRONT PANEL ── */}
            {designTab === "front" && <>
              <Section title="🖼️ Background Image">
                {design.bgImage ? (
                  <div>
                    <div style={{position:"relative",borderRadius:"8px",overflow:"hidden",marginBottom:"8px"}}>
                      <img src={design.bgImage} alt="bg" style={{width:"100%",height:"70px",objectFit:"cover",display:"block",borderRadius:"8px",border:"1px solid #2a2a2a"}} />
                      <div style={{position:"absolute",inset:0,background:"linear-gradient(to bottom, transparent 40%, #000000bb)",borderRadius:"8px"}} />
                      <div style={{position:"absolute",bottom:"6px",left:"8px",fontSize:"9px",color:"#f0c040",letterSpacing:"1px",fontWeight:700}}>✓ Front BG loaded</div>
                      <button onClick={()=>{set("bgImage",null);set("useImageBg",false);}} style={{position:"absolute",top:"6px",right:"6px",background:"#e94560",border:"none",borderRadius:"50%",width:"20px",height:"20px",cursor:"pointer",color:"#fff",fontSize:"11px",fontWeight:700}}>✕</button>
                    </div>
                    <div style={{display:"flex",gap:"6px",marginBottom:"8px"}}>
                      <button onClick={()=>bgUploadRef.current.click()} style={{flex:1,padding:"6px",borderRadius:"6px",background:"#1a1a1a",border:"1px solid #2a2a2a",color:"#888",fontSize:"11px",cursor:"pointer"}}>🔄 Replace</button>
                    </div>
                    <Row label="Use as BG"><Toggle checked={design.useImageBg} onChange={v=>set("useImageBg",v)} /></Row>
                  </div>
                ) : (
                  <div onDragOver={e=>{e.preventDefault();setImgDragging(true);}} onDragLeave={()=>setImgDragging(false)}
                    onDrop={e=>{e.preventDefault();setImgDragging(false);handleBgImage(e.dataTransfer.files[0]);}}
                    onClick={()=>bgUploadRef.current.click()}
                    style={{border:`2px dashed ${imgDragging?"#f0c040":"#2a2a2a"}`,borderRadius:"10px",padding:"16px 12px",textAlign:"center",cursor:"pointer",background:imgDragging?"#1a1500":"#141414",transition:"all 0.2s",marginBottom:"8px"}}>
                    <div style={{fontSize:"24px",marginBottom:"4px"}}>🖼️</div>
                    <div style={{fontSize:"11px",color:"#888",fontWeight:600}}>Upload front design</div>
                    <div style={{fontSize:"10px",color:"#444",marginTop:"2px"}}>PNG / JPG · Drop or click</div>
                  </div>
                )}
                <input ref={bgUploadRef} type="file" accept="image/*" style={{display:"none"}} onChange={e=>handleBgImage(e.target.files[0])} />
              </Section>

              {!design.useImageBg && (<>
                <Section title="🎨 Colors">
                  <Row label="BG Start"><ColorPick value={design.bgColor} onChange={v=>set("bgColor",v)} /></Row>
                  <Row label="BG End"><ColorPick value={design.bgColor2} onChange={v=>set("bgColor2",v)} /></Row>
                  <Row label="Accent"><ColorPick value={design.accentColor} onChange={v=>set("accentColor",v)} /></Row>
                </Section>
                <Section title="Pattern">
                  <Row label="Pattern"><SelectInp value={design.pattern} onChange={v=>set("pattern",v)} options={PATTERNS} /></Row>
                  <Row label="Org Header"><Toggle checked={design.showOrgHeader} onChange={v=>set("showOrgHeader",v)} /></Row>
                </Section>
                <Section title="Brand">
                  <Row label="Org Name"><TextInp value={design.orgName} onChange={v=>set("orgName",v)} /></Row>
                  <Row label="Subtitle"><TextInp value={design.orgSub} onChange={v=>set("orgSub",v)} /></Row>
                  <Row label="Logo Text"><TextInp value={design.logoText} onChange={v=>set("logoText",v)} /></Row>
                </Section>
              </>)}

              <Section title="✏️ Text Style">
                <Row label="Text Color"><ColorPick value={design.textColor} onChange={v=>set("textColor",v)} /></Row>
                <Row label="ID Color"><ColorPick value={design.idColor} onChange={v=>set("idColor",v)} /></Row>
                <Row label="Font"><SelectInp value={design.fontFamily} onChange={v=>set("fontFamily",v)} options={FONTS} /></Row>
                <Row label="Name Bold"><Toggle checked={design.nameBold} onChange={v=>set("nameBold",v)} /></Row>
                <Row label="Text Shadow"><Toggle checked={design.textShadow} onChange={v=>set("textShadow",v)} /></Row>
              </Section>

              <Section title="🃏 Card Style">
                <Row label="Orientation">
                  <div style={{display:"flex",gap:"6px"}}>
                    {["landscape","portrait"].map(o=>(
                      <button key={o} onClick={()=>set("orientation",o)}
                        style={{flex:1,padding:"6px 4px",borderRadius:"6px",border:"none",cursor:"pointer",fontSize:"11px",fontWeight:600,
                          background:design.orientation===o?"#f0c040":"#1a1a1a",
                          color:design.orientation===o?"#0a0a0a":"#666",transition:"all 0.15s"}}>
                        {o==="landscape"?"⬛ Landscape":"📱 Portrait"}
                      </button>
                    ))}
                  </div>
                </Row>
                <Row label="Border"><Toggle checked={design.showBorder} onChange={v=>set("showBorder",v)} /></Row>
                {design.showBorder && <Row label="Border Color"><ColorPick value={design.borderColor} onChange={v=>set("borderColor",v)} /></Row>}
                <Row label="Roundness"><Slider value={design.roundness} onChange={v=>set("roundness",v)} min={0} max={24} /></Row>
                <Row label="Barcode"><Toggle checked={design.showBarcode} onChange={v=>set("showBarcode",v)} /></Row>
              </Section>

              <Section title="📸 Photo">
                <Row label="Left %"><Slider value={design.photoX} onChange={v=>set("photoX",v)} /></Row>
                <Row label="Top %"><Slider value={design.photoY} onChange={v=>set("photoY",v)} /></Row>
                <Row label="Size %"><Slider value={design.photoSize} onChange={v=>set("photoSize",v)} min={8} max={45} /></Row>
                <Row label="Shape"><SelectInp value={design.photoShape} onChange={v=>set("photoShape",v)}
                  options={[{value:"circle",label:"⭕ Circle"},{value:"square",label:"⬜ Square"},{value:"rounded",label:"▢ Rounded"}]} /></Row>
                <Row label="Border Color">
                  <div>
                    <div style={{display:"flex",flexWrap:"wrap",gap:"5px",marginBottom:"6px"}}>
                      {["#f0c040","#ffffff","#e94560","#74c0fc","#95e1a7","#a29bfe","#ffd166","#ff6b6b","#00cec9","#fd79a8","#000000","#c0c0c0"].map(c=>(
                        <div key={c} onClick={()=>set("photoBorderColor",c)}
                          style={{width:"20px",height:"20px",borderRadius:"50%",background:c,cursor:"pointer",
                            border:design.photoBorderColor===c?"3px solid #fff":"2px solid #333",
                            boxShadow:design.photoBorderColor===c?"0 0 0 2px #f0c040":"none",
                            transition:"all 0.15s",flexShrink:0}} />
                      ))}
                    </div>
                    <ColorPick value={design.photoBorderColor} onChange={v=>set("photoBorderColor",v)} />
                  </div>
                </Row>
                <Row label="Border Width"><Slider value={design.photoBorderWidth} onChange={v=>set("photoBorderWidth",v)} min={0} max={8} step={1} /></Row>
              </Section>

              <Section title="👤 Name Position">
                <Row label="Left %"><Slider value={design.nameX} onChange={v=>set("nameX",v)} /></Row>
                <Row label="Top %"><Slider value={design.nameY} onChange={v=>set("nameY",v)} /></Row>
                <Row label="Font Size"><Slider value={design.nameFontSize} onChange={v=>set("nameFontSize",v)} min={8} max={22} /></Row>
              </Section>

              <Section title="🪪 ID Position">
                <Row label="Left %"><Slider value={design.idValX} onChange={v=>{set("idValX",v);set("idLabelX",v);}} /></Row>
                <Row label="Top %"><Slider value={design.idValY} onChange={v=>{set("idValY",v);set("idLabelY",Math.max(0,v-8));}} /></Row>
                <Row label="Font Size"><Slider value={design.idFontSize} onChange={v=>set("idFontSize",v)} min={6} max={18} /></Row>
              </Section>
            </>}

            {/* ── BACK PANEL ── */}
            {designTab === "back" && <>
              <Section title="🖼️ Back Background Image">
                {design.bgImageBack ? (
                  <div>
                    <div style={{position:"relative",borderRadius:"8px",overflow:"hidden",marginBottom:"8px"}}>
                      <img src={design.bgImageBack} alt="bg-back" style={{width:"100%",height:"70px",objectFit:"cover",display:"block",borderRadius:"8px",border:"1px solid #2a2a2a"}} />
                      <div style={{position:"absolute",inset:0,background:"linear-gradient(to bottom, transparent 40%, #000000bb)",borderRadius:"8px"}} />
                      <div style={{position:"absolute",bottom:"6px",left:"8px",fontSize:"9px",color:"#f0c040",letterSpacing:"1px",fontWeight:700}}>✓ Back BG loaded</div>
                      <button onClick={()=>{set("bgImageBack",null);set("useImageBgBack",false);}} style={{position:"absolute",top:"6px",right:"6px",background:"#e94560",border:"none",borderRadius:"50%",width:"20px",height:"20px",cursor:"pointer",color:"#fff",fontSize:"11px",fontWeight:700}}>✕</button>
                    </div>
                    <div style={{display:"flex",gap:"6px",marginBottom:"8px"}}>
                      <button onClick={()=>bgUploadBackRef.current.click()} style={{flex:1,padding:"6px",borderRadius:"6px",background:"#1a1a1a",border:"1px solid #2a2a2a",color:"#888",fontSize:"11px",cursor:"pointer"}}>🔄 Replace</button>
                    </div>
                    <Row label="Use as BG"><Toggle checked={design.useImageBgBack} onChange={v=>set("useImageBgBack",v)} /></Row>
                  </div>
                ) : (
                  <div onDragOver={e=>{e.preventDefault();setImgDraggingBack(true);}} onDragLeave={()=>setImgDraggingBack(false)}
                    onDrop={e=>{e.preventDefault();setImgDraggingBack(false);handleBgImage(e.dataTransfer.files[0],true);}}
                    onClick={()=>bgUploadBackRef.current.click()}
                    style={{border:`2px dashed ${imgDraggingBack?"#f0c040":"#2a2a2a"}`,borderRadius:"10px",padding:"16px 12px",textAlign:"center",cursor:"pointer",background:imgDraggingBack?"#1a1500":"#141414",transition:"all 0.2s",marginBottom:"8px"}}>
                    <div style={{fontSize:"24px",marginBottom:"4px"}}>🖼️</div>
                    <div style={{fontSize:"11px",color:"#888",fontWeight:600}}>Upload back design</div>
                    <div style={{fontSize:"10px",color:"#444",marginTop:"2px"}}>PNG / JPG · Drop or click</div>
                  </div>
                )}
                <input ref={bgUploadBackRef} type="file" accept="image/*" style={{display:"none"}} onChange={e=>handleBgImage(e.target.files[0],true)} />
              </Section>

              {!design.useImageBgBack && (
                <Section title="🎨 Back Colors">
                  <Row label="BG Start"><ColorPick value={design.backBgColor} onChange={v=>set("backBgColor",v)} /></Row>
                  <Row label="BG End"><ColorPick value={design.backBgColor2} onChange={v=>set("backBgColor2",v)} /></Row>
                </Section>
              )}

              <Section title="👨‍👩‍👧 Guardian Position">
                <Row label="Left %"><Slider value={design.backGuardianX} onChange={v=>set("backGuardianX",v)} /></Row>
                <Row label="Top %"><Slider value={design.backGuardianY} onChange={v=>set("backGuardianY",v)} /></Row>
                <Row label={<span>Font Size <FontSizeBadge value={design.backGuardianFontSize} /></span>}>
                  <Slider value={design.backGuardianFontSize} onChange={v=>set("backGuardianFontSize",v)} min={6} max={18} />
                </Row>
              </Section>

              <Section title="🏠 Address Position">
                <Row label="Left %"><Slider value={design.backAddressX} onChange={v=>set("backAddressX",v)} /></Row>
                <Row label="Top %"><Slider value={design.backAddressY} onChange={v=>set("backAddressY",v)} /></Row>
                <Row label={<span>Font Size <FontSizeBadge value={design.backAddressFontSize} /></span>}>
                  <Slider value={design.backAddressFontSize} onChange={v=>set("backAddressFontSize",v)} min={6} max={18} />
                </Row>
              </Section>

              <Section title="📞 Contact Position">
                <Row label="Left %"><Slider value={design.backContactX} onChange={v=>set("backContactX",v)} /></Row>
                <Row label="Top %"><Slider value={design.backContactY} onChange={v=>set("backContactY",v)} /></Row>
                <Row label={<span>Font Size <FontSizeBadge value={design.backContactFontSize} /></span>}>
                  <Slider value={design.backContactFontSize} onChange={v=>set("backContactFontSize",v)} min={6} max={18} />
                </Row>
              </Section>

            </>}

            <button onClick={()=>setDesign(DEFAULT_DESIGN)} style={{width:"100%",padding:"8px",borderRadius:"6px",background:"#1a1a1a",border:"1px solid #2a2a2a",color:"#555",fontSize:"12px",cursor:"pointer",marginTop:"4px"}}>
              ↺ Reset to Default
            </button>
          </>}

          {/* ══ DATA TAB ══ */}
          {tab === "data" && <>
            <Section title="Google Sheets API">
              <div style={{marginBottom:"10px"}}>
                <div style={{fontSize:"11px",color:"#666",marginBottom:"5px"}}>API Key</div>
                <div style={{position:"relative"}}>
                  <input type={showKey?"text":"password"} value={apiKey} onChange={e=>setApiKey(e.target.value)} placeholder="AIzaSy..."
                    style={{width:"100%",padding:"7px 32px 7px 10px",borderRadius:"6px",background:"#1a1a1a",border:"1px solid #2a2a2a",color:"#fff",fontSize:"12px",outline:"none",boxSizing:"border-box"}} />
                  <button onClick={()=>setShowKey(!showKey)} style={{position:"absolute",right:"6px",top:"50%",transform:"translateY(-50%)",background:"none",border:"none",color:"#555",cursor:"pointer",fontSize:"13px"}}>{showKey?"🙈":"👁️"}</button>
                </div>
              </div>
              <div style={{marginBottom:"14px"}}>
                <div style={{fontSize:"11px",color:"#666",marginBottom:"5px"}}>Spreadsheet ID</div>
                <input type="text" value={sheetId} onChange={e=>setSheetId(e.target.value)} placeholder="1BxiMVs0XRA5n..."
                  style={{width:"100%",padding:"7px 10px",borderRadius:"6px",background:"#1a1a1a",border:"1px solid #2a2a2a",color:"#fff",fontSize:"12px",outline:"none",boxSizing:"border-box"}} />
                <div style={{fontSize:"10px",color:"#444",marginTop:"4px"}}>From URL: /spreadsheets/d/<span style={{color:"#a29bfe"}}>ID</span>/edit</div>
              </div>
              <div style={{background:"#0d1a0d",border:"1px solid #1b4332",borderRadius:"6px",padding:"10px",marginBottom:"14px",fontSize:"10px",color:"#95e1a7",lineHeight:1.9}}>
                ✅ Required columns:<br/>
                <strong>Full Name · Employee ID · Photo URL</strong><br/>
                ✅ New columns (back card):<br/>
                <strong>Guardian Name · Address · Contact Number</strong><br/>
                ✅ Sheet shared as Viewer
              </div>
              <button onClick={fetchData} disabled={loading} style={{width:"100%",padding:"10px",borderRadius:"7px",border:"none",cursor:loading?"not-allowed":"pointer",background:loading?"#333":"linear-gradient(135deg, #f0c040, #e0a020)",color:"#0a0a0a",fontWeight:700,fontSize:"13px"}}>
                {loading?"⏳ Fetching...":"⚡ Fetch Dataset"}
              </button>
              {error && <div style={{marginTop:"10px",background:"#2a0a0a",border:"1px solid #e9456033",borderRadius:"6px",padding:"8px",color:"#e94560",fontSize:"11px"}}>⚠️ {error}</div>}
              {employees.length > 0 && (
                <div style={{marginTop:"12px"}}>
                  <div style={{fontSize:"10px",color:"#95e1a7",marginBottom:"6px"}}>✅ {employees.length} employees loaded</div>
                  <div style={{maxHeight:"200px",overflowY:"auto"}}>
                    {employees.map((e,i)=>(
                      <div key={i} onClick={()=>{setPreviewPerson(e);setTab("design");}}
                        style={{padding:"6px 8px",borderRadius:"5px",cursor:"pointer",background:previewPerson?.id===e.id?"#f0c04022":"transparent",border:previewPerson?.id===e.id?"1px solid #f0c04044":"1px solid transparent",marginBottom:"3px"}}>
                        <div style={{fontSize:"11px",color:"#fff"}}>{e.name}</div>
                        <div style={{fontSize:"9px",color:"#666",fontFamily:"monospace"}}>{e.id}</div>
                        {e.guardian && <div style={{fontSize:"9px",color:"#555"}}>👨‍👩‍👧 {e.guardian}</div>}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </Section>
          </>}

          {/* ══ PRINT TAB ══ */}
          {tab === "print" && <>
            <Section title="Print">
              <div style={{fontSize:"11px",color:"#666",lineHeight:1.8,marginBottom:"12px"}}>
                Layout: <strong style={{color:"#fff"}}>Front + Back per employee</strong><br/>
                Size: <strong style={{color:"#fff"}}>CR80 (85.6 × 54mm)</strong><br/>
                Records: <strong style={{color:"#f0c040"}}>{employees.length} employees</strong>
              </div>
              {employees.length===0 && <div style={{fontSize:"11px",color:"#e94560",marginBottom:"12px"}}>⚠️ No data — go to Data tab first.</div>}
              <button onClick={handlePrint} disabled={employees.length===0}
                style={{width:"100%",padding:"10px",borderRadius:"7px",border:"none",cursor:employees.length===0?"not-allowed":"pointer",background:employees.length===0?"#333":"linear-gradient(135deg, #f0c040, #e0a020)",color:"#0a0a0a",fontWeight:700,fontSize:"13px",opacity:employees.length===0?0.5:1}}>
                🖨️ Print to PDF
              </button>
              <div style={{marginTop:"12px",background:"#161616",borderRadius:"6px",padding:"10px",fontSize:"10px",color:"#555",lineHeight:1.8}}>
                💡 Print dialog tips:<br/>
                • Destination: <strong style={{color:"#888"}}>Save as PDF</strong><br/>
                • Paper: <strong style={{color:"#888"}}>A4</strong><br/>
                • Margins: <strong style={{color:"#888"}}>None</strong><br/>
                • ✅ Enable <strong style={{color:"#888"}}>Background graphics</strong>
              </div>
            </Section>
          </>}
        </div>

        {/* MAIN CANVAS */}
        <div style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"flex-start",padding:"24px",overflowY:"auto",background:"#0d0d0d",height:"100%",minHeight:0}}>

          {(tab === "design" || tab === "data") && (
            <>
              <div style={{fontSize:"10px",color:"#444",letterSpacing:"2px",textTransform:"uppercase",marginBottom:"16px"}}>
                Live Preview — {designTab === "front" ? "⬛ Front" : "🔄 Back"}
              </div>
              <div style={{display:"flex",gap:"20px",flexWrap:"wrap",justifyContent:"center"}}>
                <div style={{textAlign:"center"}}>
                  <div style={{fontSize:"9px",color:"#555",letterSpacing:"1px",marginBottom:"8px",textTransform:"uppercase"}}>Front</div>
                  <CardFront design={design} person={previewPerson} />
                </div>
                <div style={{textAlign:"center"}}>
                  <div style={{fontSize:"9px",color:"#555",letterSpacing:"1px",marginBottom:"8px",textTransform:"uppercase"}}>Back</div>
                  <CardBack design={design} person={previewPerson} />
                </div>
              </div>
              {employees.length > 0 && (
                <div style={{marginTop:"14px",display:"flex",gap:"6px",flexWrap:"wrap",justifyContent:"center"}}>
                  {employees.slice(0,6).map((e,i)=>(
                    <div key={i} onClick={()=>setPreviewPerson(e)}
                      style={{padding:"5px 12px",borderRadius:"20px",cursor:"pointer",fontSize:"10px",
                        background:previewPerson?.id===e.id?"#f0c04022":"#161616",
                        border:previewPerson?.id===e.id?"1px solid #f0c040":"1px solid #2a2a2a",
                        color:previewPerson?.id===e.id?"#f0c040":"#666",transition:"all 0.15s"}}>
                      {e.name.split(" ")[0]}
                    </div>
                  ))}
                  {employees.length > 6 && <div style={{padding:"5px 10px",fontSize:"10px",color:"#444"}}>+{employees.length-6} more</div>}
                </div>
              )}
            </>
          )}

          {tab === "print" && (
            employees.length === 0 ? (
              <div style={{textAlign:"center",padding:"60px",color:"#2a2a2a"}}>
                <div style={{fontSize:"40px",marginBottom:"12px"}}>🪪</div>
                <div>Fetch employees from the Data tab first</div>
              </div>
            ) : (
              <>
                <div style={{fontSize:"10px",color:"#444",letterSpacing:"2px",textTransform:"uppercase",marginBottom:"16px"}}>
                  Print Preview — {employees.length} employees · Front & Back
                </div>
                <div id="print-area">
                  {Array.from({length: Math.ceil(employees.length / 4)}).map((_, pageIndex) => {
                    const pageEmployees = employees.slice(pageIndex * 4, pageIndex * 4 + 4);
                    return (
                      <div key={pageIndex} style={{background:"white",padding:"8mm",width:"210mm",minHeight:"297mm",boxSizing:"border-box",WebkitPrintColorAdjust:"exact",printColorAdjust:"exact",pageBreakAfter:"always",marginBottom:"8px"}}>
                        {pageEmployees.map((emp,i)=>{
                          const isPortrait = design.orientation === "portrait";
                          const CW = isPortrait ? 204 : 323;
                          const CH = isPortrait ? 323 : 204;
                          const containerStyle = isPortrait
                            ? {width:`${CH}px`,height:`${CW}px`,position:"relative",flexShrink:0,display:"inline-block"}
                            : {width:`${CW}px`,height:`${CH}px`,position:"relative",flexShrink:0,display:"inline-block"};
                          const frontWrapStyle = {position:"absolute",top:"50%",left:"50%",transform:isPortrait?"translate(-50%,-50%) rotate(90deg)":"translate(-50%,-50%)",transformOrigin:"center center"};
                          const backWrapStyle  = {position:"absolute",top:"50%",left:"50%",transform:isPortrait?"translate(-50%,-50%) rotate(270deg)":"translate(-50%,-50%)",transformOrigin:"center center"};
                          return (
                            <div key={i} style={{display:"flex",flexDirection:"row",gap:"4mm",alignItems:"center",justifyContent:"center",marginBottom:"4mm",pageBreakInside:"avoid"}}>
                              <div>
                                <div style={{fontSize:"6px",color:"#999",marginBottom:"1mm",fontFamily:"sans-serif",textAlign:"center"}}>#{pageIndex*4+i+1} {emp.name} — Back</div>
                                <div style={containerStyle}><div style={backWrapStyle}><CardBack design={design} person={emp}/></div></div>
                              </div>
                              <div>
                                <div style={{fontSize:"6px",color:"#999",marginBottom:"1mm",fontFamily:"sans-serif",textAlign:"center"}}>#{pageIndex*4+i+1} {emp.name} — Front</div>
                                <div style={containerStyle}><div style={frontWrapStyle}><CardFront design={design} person={emp}/></div></div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    );
                  })}
                </div>
              </>
            )
          )}
        </div>
      </div>
    </div>
  );
}