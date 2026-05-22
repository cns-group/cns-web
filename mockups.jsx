/* mockups.jsx — small inline mockups that decorate each service / case card.
   Pure presentation; no state. */

function MockShop() {
  return (
    <div className="mock">
      <div className="mock-hd">
        <span>la-posta.com.ar</span>
        <span className="dotgroup"><i /><i /><i /></span>
      </div>
      <div className="cards-mini">
        <div className="card-mini">
          <div className="ph" />
          <div className="t">Malbec Reserva</div>
          <div className="p">$ 14.800</div>
        </div>
        <div className="card-mini">
          <div className="ph" style={{background:'linear-gradient(135deg, #d97757 0%, #7a8f5c 100%)', opacity:.35}} />
          <div className="t">Torrontés 2024</div>
          <div className="p">$ 9.200</div>
        </div>
      </div>
      <div className="mock-row" style={{marginTop:8}}>
        <span className="l">3 ítems · Envío</span>
        <span className="v">$ 28.400</span>
      </div>
    </div>
  );
}

function MockOrders() {
  return (
    <div className="mock">
      <div className="mock-hd">
        <span>Cocina · Salón A</span>
        <span>14:32</span>
      </div>
      <div className="orders">
        <div className="order"><span className="mn">#142</span><span className="it">Milanesa napolitana ×2</span><span className="st ok">listo</span></div>
        <div className="order"><span className="mn">#143</span><span className="it">Empanadas salteñas ×6</span><span className="st pend">cocina</span></div>
        <div className="order"><span className="mn">#144</span><span className="it">Locro · Vino tinto</span><span className="st pend">cocina</span></div>
      </div>
    </div>
  );
}

function MockGym() {
  return (
    <div className="mock">
      <div className="mock-hd">
        <span>Hoy · Martes</span>
        <span>4 clases</span>
      </div>
      <div className="gym-row"><span className="h">07:00</span><span className="c">Funcional</span><span className="b">12/15</span></div>
      <div className="gym-row"><span className="h">09:00</span><span className="c">Spinning</span><span className="b full">20/20</span></div>
      <div className="gym-row"><span className="h">18:00</span><span className="c">Pilates</span><span className="b">8/12</span></div>
      <div className="gym-row"><span className="h">20:00</span><span className="c">CrossTraining</span><span className="b">14/18</span></div>
    </div>
  );
}

function MockTicket() {
  return (
    <div className="ticket">
      <div className="qr" />
      <div className="info">
        <div className="ev">Festival Pachamama</div>
        <div className="meta">15 ago · Anfiteatro Humahuaca</div>
        <div className="seat">Sector A · Fila 12 · Asiento 04</div>
        <div className="meta">CN-TKT-08821 · validado · ✓</div>
      </div>
    </div>
  );
}

function MockQueue() {
  return (
    <div className="mock">
      <div className="mock-hd">
        <span>Atención al público</span>
        <span>14 en espera</span>
      </div>
      <div className="queue-grid">
        <div className="queue-cell"><span className="num">A12</span><span className="lbl">Box 01</span></div>
        <div className="queue-cell active"><span className="num">B07</span><span className="lbl">Box 02 ←</span></div>
        <div className="queue-cell"><span className="num">A14</span><span className="lbl">Box 03</span></div>
      </div>
      <div className="mock-row" style={{marginTop:10}}>
        <span className="l">Tiempo promedio</span>
        <span className="v mut">7 min 12 s</span>
      </div>
    </div>
  );
}

function MockChart() {
  return (
    <div className="mock">
      <div className="mock-hd">
        <span>Tráfico · 30 días</span>
        <span className="v" style={{color:'var(--accent-2)'}}>↑ 218 %</span>
      </div>
      <div className="chart">
        <svg viewBox="0 0 200 80" preserveAspectRatio="none">
          <defs>
            <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%"  stopColor="#d97757" stopOpacity=".45" />
              <stop offset="100%" stopColor="#d97757" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path d="M0,60 L20,55 L40,58 L60,48 L80,42 L100,38 L120,30 L140,28 L160,18 L180,14 L200,8 L200,80 L0,80 Z" fill="url(#g1)" />
          <path d="M0,60 L20,55 L40,58 L60,48 L80,42 L100,38 L120,30 L140,28 L160,18 L180,14 L200,8" fill="none" stroke="#d97757" strokeWidth="1.5" />
        </svg>
      </div>
      <div className="mock-row" style={{marginTop:6}}>
        <span className="l">Sesiones</span>
        <span className="v">12.487</span>
      </div>
    </div>
  );
}

function Mock({ kind }) {
  switch (kind) {
    case 'shop':   return <MockShop />;
    case 'orders': return <MockOrders />;
    case 'gym':    return <MockGym />;
    case 'ticket': return <MockTicket />;
    case 'queue':  return <MockQueue />;
    case 'chart':  return <MockChart />;
    default: return null;
  }
}

/* Larger / wider work-card mockups that fill the .work-screen frame */
function WorkScreen({ kind }) {
  if (kind === 'shop') return (
    <div style={{padding:20, height:'100%', display:'flex', flexDirection:'column', gap:14}}>
      <div className="mock-hd" style={{margin:0}}>
        <span style={{color:'var(--fg)', fontFamily:'var(--f-display)', fontSize:14}}>la-posta.com.ar</span>
        <span className="dotgroup"><i /><i /><i /></span>
      </div>
      <div style={{display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:10, flex:1}}>
        {[0,1,2,3,4,5].map(i => (
          <div key={i} className="card-mini" style={{padding:8}}>
            <div className="ph" style={{height:50, background:`linear-gradient(${135 + i*10}deg, #d97757${i%2?'55':'88'}, #7a8f5c${i%2?'33':'55'})`}} />
            <div className="t" style={{fontSize:9.5}}>Vino · Línea {i+1}</div>
            <div className="p" style={{fontSize:10.5}}>$ {(8 + i*1.7).toFixed(1)}k</div>
          </div>
        ))}
      </div>
    </div>
  );
  if (kind === 'orders') return (
    <div style={{padding:20, height:'100%', display:'flex', flexDirection:'column', gap:10}}>
      <div className="mock-hd" style={{margin:0}}>
        <span style={{color:'var(--fg)', fontFamily:'var(--f-display)', fontSize:14}}>Cocina · KDS</span>
        <span style={{color:'var(--muted)'}}>14:32</span>
      </div>
      <div className="orders" style={{flex:1}}>
        <div className="order"><span className="mn">#142</span><span className="it">Milanesa napolitana ×2 · papas</span><span className="st ok">listo</span></div>
        <div className="order"><span className="mn">#143</span><span className="it">Empanadas salteñas ×6</span><span className="st pend">cocina</span></div>
        <div className="order"><span className="mn">#144</span><span className="it">Locro tradicional ×1</span><span className="st pend">cocina</span></div>
        <div className="order"><span className="mn">#145</span><span className="it">Tabla picada · Cerveza ×2</span><span className="st pend">barra</span></div>
        <div className="order"><span className="mn">#146</span><span className="it">Postre flan · Café</span><span className="st ok">listo</span></div>
      </div>
    </div>
  );
  if (kind === 'gym') return (
    <div style={{padding:20, height:'100%', display:'flex', flexDirection:'column', gap:14}}>
      <div className="mock-hd" style={{margin:0}}>
        <span style={{color:'var(--fg)', fontFamily:'var(--f-display)', fontSize:14}}>Club San Pedro · Socios</span>
        <span style={{color:'var(--accent-2)'}}>● 1.214 activos</span>
      </div>
      <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:10}}>
        <div className="card-mini" style={{padding:14}}>
          <div style={{fontFamily:'var(--f-display)', fontSize:28, fontWeight:600, color:'var(--fg)', letterSpacing:'-0.02em'}}>92<span style={{color:'var(--accent)', fontSize:18}}>%</span></div>
          <div style={{fontSize:9.5, color:'var(--muted)', fontFamily:'var(--f-mono)', letterSpacing:'0.06em'}}>RETENCIÓN 12M</div>
        </div>
        <div className="card-mini" style={{padding:14}}>
          <div style={{fontFamily:'var(--f-display)', fontSize:28, fontWeight:600, color:'var(--fg)', letterSpacing:'-0.02em'}}>847</div>
          <div style={{fontSize:9.5, color:'var(--muted)', fontFamily:'var(--f-mono)', letterSpacing:'0.06em'}}>ACCESOS HOY</div>
        </div>
      </div>
      <div style={{flex:1}}>
        <div className="gym-row"><span className="h">07:00</span><span className="c">Funcional</span><span className="b">12/15</span></div>
        <div className="gym-row"><span className="h">09:00</span><span className="c">Spinning</span><span className="b full">20/20</span></div>
        <div className="gym-row"><span className="h">18:00</span><span className="c">Pilates</span><span className="b">8/12</span></div>
      </div>
    </div>
  );
  if (kind === 'ticket') return (
    <div style={{padding:20, height:'100%', display:'flex', flexDirection:'column', gap:14}}>
      <div className="mock-hd" style={{margin:0}}>
        <span style={{color:'var(--fg)', fontFamily:'var(--f-display)', fontSize:14}}>Pachamama · Validación</span>
        <span style={{color:'var(--accent)'}}>● en vivo</span>
      </div>
      <MockTicket />
      <div style={{display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:8}}>
        <div className="card-mini" style={{padding:10}}><div style={{fontFamily:'var(--f-display)', fontSize:22, fontWeight:600, color:'var(--fg)'}}>14.087</div><div style={{fontSize:9, color:'var(--muted)', fontFamily:'var(--f-mono)'}}>VALIDADOS</div></div>
        <div className="card-mini" style={{padding:10}}><div style={{fontFamily:'var(--f-display)', fontSize:22, fontWeight:600, color:'var(--accent)'}}>3</div><div style={{fontSize:9, color:'var(--muted)', fontFamily:'var(--f-mono)'}}>DUPLICADOS</div></div>
        <div className="card-mini" style={{padding:10}}><div style={{fontFamily:'var(--f-display)', fontSize:22, fontWeight:600, color:'var(--accent-2)'}}>4</div><div style={{fontSize:9, color:'var(--muted)', fontFamily:'var(--f-mono)'}}>PUERTAS</div></div>
      </div>
    </div>
  );
  return null;
}

Object.assign(window, { Mock, WorkScreen });
