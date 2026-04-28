import { useEffect, useReducer, useRef } from 'react';
import {
  EARTH, MARS, G, M_SUN, SECONDS_PER_DAY,
  circularSpeed, transferEllipse, transferTimeDays,
  angularSpeed, leadAngleOutbound, lagAngleReturn,
  keplerPosition,
} from '../../lib/kepler/physics';

const HALF_P_DAYS = transferTimeDays(EARTH.orbitRadius, MARS.orbitRadius);
const HALF_P_SEC = HALF_P_DAYS * SECONDS_PER_DAY;
const { a: A_TX, e: E_TX } = transferEllipse(EARTH.orbitRadius, MARS.orbitRadius);
const W_T = angularSpeed(EARTH.orbitRadius);
const W_M = angularSpeed(MARS.orbitRadius);
const V_T = circularSpeed(EARTH.orbitRadius);
const V_M = circularSpeed(MARS.orbitRadius);

const TWO_PI = 2 * Math.PI;
const norm = (a) => ((a % TWO_PI) + TWO_PI) % TWO_PI;

function shipPosition(state) {
  const tau = state.t - state.launchT; // days since departure
  if (state.mode === 'outbound') {
    const tauSec = Math.min(tau, HALF_P_DAYS) * SECONDS_PER_DAY;
    const { r, theta } = keplerPosition(tauSec, A_TX, E_TX);
    return { r, angle: state.launchThetaShip + theta, onPlanet: null };
  }
  if (state.mode === 'inbound') {
    const tauSec = Math.min(tau, HALF_P_DAYS) * SECONDS_PER_DAY;
    const { r, theta } = keplerPosition(HALF_P_SEC + tauSec, A_TX, E_TX);
    return { r, angle: state.launchThetaShip - Math.PI + theta, onPlanet: null };
  }
  // idle, on-mars (waiting), home: anclar al planeta actual
  const thetaT = state.thetaT0 + W_T * state.t * SECONDS_PER_DAY;
  const thetaM = state.thetaM0 + W_M * state.t * SECONDS_PER_DAY;
  if (state.mode === 'on-mars') return { r: MARS.orbitRadius, angle: thetaM, onPlanet: 'mars' };
  return { r: EARTH.orbitRadius, angle: thetaT, onPlanet: 'earth' };
}

function shipSpeed(state) {
  const tau = state.t - state.launchT;
  if ((state.mode === 'outbound' || state.mode === 'inbound') && tau < HALF_P_DAYS) {
    const { r } = shipPosition(state);
    return Math.sqrt(G * M_SUN * (2 / r - 1 / A_TX));
  }
  if (state.mode === 'on-mars') return V_M;
  if (state.mode === 'home') return V_T;
  return V_T;
}

function initial() {
  return {
    t: 0,
    running: false,
    speed: 2, // simulated days per real second
    mode: 'idle',
    thetaT0: Math.random() * TWO_PI,
    thetaM0: Math.random() * TWO_PI,
    launchT: 0,
    launchThetaShip: 0,
    message: 'Pulsa Nuevo para aleatorizar las posiciones, luego Lanzar para iniciar el viaje.',
  };
}

function reducer(state, action) {
  switch (action.type) {
    case 'reset': return initial();
    case 'tick': {
      const dt = action.dt;
      let t = state.t + dt;
      let mode = state.mode;
      let message = state.message;
      let running = state.running;
      if (mode === 'outbound' && t - state.launchT >= HALF_P_DAYS) {
        t = state.launchT + HALF_P_DAYS;
        mode = 'on-mars';
        running = false;
        message = `Llegada a Marte tras ${HALF_P_DAYS.toFixed(1)} días. Espera la ventana de regreso (Tierra ~76° por detrás de Marte).`;
      } else if (mode === 'inbound' && t - state.launchT >= HALF_P_DAYS) {
        t = state.launchT + HALF_P_DAYS;
        mode = 'home';
        running = false;
        message = '¡Regreso completado!';
      }
      return { ...state, t, mode, running, message };
    }
    case 'play': return { ...state, running: true };
    case 'pause': return { ...state, running: false };
    case 'step': return reducer({ ...state, running: false }, { type: 'tick', dt: 1 });
    case 'speed': return { ...state, speed: action.speed };
    case 'launch-out': {
      if (state.mode !== 'idle') return state;
      const thetaT = norm(state.thetaT0 + W_T * state.t * SECONDS_PER_DAY);
      const thetaM = norm(state.thetaM0 + W_M * state.t * SECONDS_PER_DAY);
      const diff = norm(thetaM - thetaT);
      const target = leadAngleOutbound();
      const ok = Math.abs(diff - target) < 0.05;
      return {
        ...state,
        mode: 'outbound',
        running: true,
        launchT: state.t,
        launchThetaShip: thetaT,
        message: ok
          ? `Lanzamiento óptimo (Δ=${(diff * 180 / Math.PI).toFixed(1)}°). Llegada en ${HALF_P_DAYS.toFixed(0)} días.`
          : `Ventana fuera de tolerancia: Δ=${(diff * 180 / Math.PI).toFixed(1)}° vs ideal ${(target * 180 / Math.PI).toFixed(1)}°. La nave parte de todos modos.`,
      };
    }
    case 'launch-in': {
      if (state.mode !== 'on-mars') return state;
      const thetaT = norm(state.thetaT0 + W_T * state.t * SECONDS_PER_DAY);
      const thetaM = norm(state.thetaM0 + W_M * state.t * SECONDS_PER_DAY);
      const lag = norm(thetaM - thetaT);
      const target = lagAngleReturn();
      const ok = Math.abs(lag - target) < 0.05;
      return {
        ...state,
        mode: 'inbound',
        running: true,
        launchT: state.t,
        launchThetaShip: thetaM,
        message: ok
          ? `Regreso óptimo (lag=${(lag * 180 / Math.PI).toFixed(1)}°). Vuelta en ${HALF_P_DAYS.toFixed(0)} días.`
          : `Ventana fuera de tolerancia: lag=${(lag * 180 / Math.PI).toFixed(1)}° vs ideal ${(target * 180 / Math.PI).toFixed(1)}°.`,
      };
    }
    default: return state;
  }
}

export default function OrbitSimulator() {
  const [state, dispatch] = useReducer(reducer, undefined, initial);
  const canvasRef = useRef(null);
  const lastTimeRef = useRef(null);
  const stateRef = useRef(state);
  stateRef.current = state;

  // Animation loop
  useEffect(() => {
    let raf;
    const loop = (time) => {
      const last = lastTimeRef.current ?? time;
      const dtReal = (time - last) / 1000;
      lastTimeRef.current = time;
      const cur = stateRef.current;
      if (cur.running) {
        const dtDays = dtReal * cur.speed;
        if (dtDays > 0) dispatch({ type: 'tick', dt: dtDays });
      }
      draw(canvasRef.current, stateRef.current);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);

  const thetaT = norm(state.thetaT0 + W_T * state.t * SECONDS_PER_DAY);
  const thetaM = norm(state.thetaM0 + W_M * state.t * SECONDS_PER_DAY);
  const vShip = shipSpeed(state);

  return (
    <div className="grid md:grid-cols-[1fr_240px] gap-4">
      <div className="border-black border-1 border-r-3 border-b-3 bg-black">
        <canvas
          ref={canvasRef}
          className="w-full block"
          style={{ aspectRatio: '1 / 1', maxWidth: '560px', margin: '0 auto' }}
          width={560}
          height={560}
        />
      </div>

      <div className="border-black border-1 border-r-3 border-b-3 bg-white p-3 tinos-regular text-sm">
        <p className="tinos-bold uppercase text-xs tracking-wide mb-2">Datos</p>
        <dl aria-live="polite" className="space-y-1">
          <Row label="Tiempo" value={`${state.t.toFixed(1)} días`} />
          <Row label="Modo" value={state.mode} />
          <Row label="θ Tierra" value={`${(thetaT * 180 / Math.PI).toFixed(1)}°`} />
          <Row label="θ Marte" value={`${(thetaM * 180 / Math.PI).toFixed(1)}°`} />
          <Row label="v Tierra" value={`${(V_T / 1000).toFixed(2)} km/s`} />
          <Row label="v Marte" value={`${(V_M / 1000).toFixed(2)} km/s`} />
          <Row label="v Nave" value={`${(vShip / 1000).toFixed(2)} km/s`} />
        </dl>
        <p className="text-xs mt-3 italic" aria-live="polite">{state.message}</p>

        <div className="grid grid-cols-2 gap-2 mt-4">
          <Btn onClick={() => dispatch({ type: 'reset' })}>Nuevo</Btn>
          {state.running ? (
            <Btn onClick={() => dispatch({ type: 'pause' })}>Pausa</Btn>
          ) : (
            <Btn onClick={() => dispatch({ type: 'play' })}>Continuar</Btn>
          )}
          <Btn onClick={() => dispatch({ type: 'step' })}>Paso</Btn>
          {state.mode === 'idle' && (
            <Btn onClick={() => dispatch({ type: 'launch-out' })} primary>Lanzar</Btn>
          )}
          {state.mode === 'on-mars' && (
            <Btn onClick={() => dispatch({ type: 'launch-in' })} primary>Regresar</Btn>
          )}
        </div>

        <div className="mt-3">
          <label className="text-xs block">Velocidad: {state.speed} días/s</label>
          <input
            type="range"
            min={0.5}
            max={20}
            step={0.5}
            value={state.speed}
            onChange={(e) => dispatch({ type: 'speed', speed: Number(e.target.value) })}
            className="w-full"
          />
        </div>
      </div>
    </div>
  );
}

function Row({ label, value }) {
  return (
    <div className="flex justify-between gap-2">
      <dt>{label}</dt>
      <dd className="tabular-nums">{value}</dd>
    </div>
  );
}

function Btn({ children, onClick, primary }) {
  return (
    <button
      onClick={onClick}
      className={`border-black border-1 border-r-3 border-b-3 px-2 py-1 text-sm hover:bg-black hover:text-white ${primary ? 'bg-black text-white' : ''}`}
    >
      {children}
    </button>
  );
}

// --- Canvas drawing ---
function draw(canvas, state) {
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const dpr = window.devicePixelRatio || 1;
  const cssW = canvas.clientWidth;
  const cssH = canvas.clientHeight;
  if (canvas.width !== cssW * dpr) {
    canvas.width = cssW * dpr;
    canvas.height = cssH * dpr;
  }
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.clearRect(0, 0, cssW, cssH);
  ctx.fillStyle = '#000';
  ctx.fillRect(0, 0, cssW, cssH);

  const cx = cssW / 2;
  const cy = cssH / 2;
  const margin = 30;
  const scale = (Math.min(cssW, cssH) / 2 - margin) / MARS.orbitRadius;
  const rt = EARTH.orbitRadius * scale;
  const rm = MARS.orbitRadius * scale;

  // Stars background
  ctx.fillStyle = 'rgba(255,255,255,0.4)';
  for (let i = 0; i < 80; i++) {
    const sx = (i * 9301 + 49297) % cssW;
    const sy = (i * 233 + 999) % cssH;
    ctx.fillRect(sx, sy, 1, 1);
  }

  // Orbits
  ctx.strokeStyle = '#3b6dc9';
  ctx.setLineDash([3, 4]);
  ctx.beginPath(); ctx.arc(cx, cy, rt, 0, TWO_PI); ctx.stroke();
  ctx.strokeStyle = '#c0392b';
  ctx.beginPath(); ctx.arc(cx, cy, rm, 0, TWO_PI); ctx.stroke();
  ctx.setLineDash([]);

  // Sun
  ctx.fillStyle = '#f39c12';
  ctx.beginPath(); ctx.arc(cx, cy, 8, 0, TWO_PI); ctx.fill();
  ctx.strokeStyle = '#fff'; ctx.lineWidth = 0.5; ctx.stroke();

  // Planets
  const thetaT = state.thetaT0 + W_T * state.t * SECONDS_PER_DAY;
  const thetaM = state.thetaM0 + W_M * state.t * SECONDS_PER_DAY;
  const tx = cx + rt * Math.cos(thetaT);
  const ty = cy - rt * Math.sin(thetaT);
  const mx = cx + rm * Math.cos(thetaM);
  const my = cy - rm * Math.sin(thetaM);

  ctx.fillStyle = '#3b6dc9';
  ctx.beginPath(); ctx.arc(tx, ty, 6, 0, TWO_PI); ctx.fill();
  ctx.fillStyle = '#fff'; ctx.font = '11px Tinos, serif';
  ctx.fillText('Tierra', tx + 8, ty + 4);

  ctx.fillStyle = '#e74c3c';
  ctx.beginPath(); ctx.arc(mx, my, 5, 0, TWO_PI); ctx.fill();
  ctx.fillStyle = '#fff';
  ctx.fillText('Marte', mx + 8, my + 4);

  // Transfer ellipse path (when in cruise)
  if (state.mode === 'outbound' || state.mode === 'inbound') {
    const pathStart = state.launchThetaShip;
    const offset = state.mode === 'outbound' ? 0 : -Math.PI;
    ctx.strokeStyle = 'rgba(255,255,255,0.5)';
    ctx.setLineDash([2, 3]);
    ctx.beginPath();
    const N = 80;
    const tauSec0 = state.mode === 'outbound' ? 0 : HALF_P_SEC;
    for (let i = 0; i <= N; i++) {
      const tauSec = tauSec0 + (HALF_P_SEC * i) / N;
      const { r, theta } = keplerPosition(tauSec, A_TX, E_TX);
      const ang = pathStart + offset + theta;
      const px = cx + r * scale * Math.cos(ang);
      const py = cy - r * scale * Math.sin(ang);
      if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
    }
    ctx.stroke();
    ctx.setLineDash([]);
  }

  // Ship
  const ship = shipPosition(state);
  const sx = cx + ship.r * scale * Math.cos(ship.angle);
  const sy = cy - ship.r * scale * Math.sin(ship.angle);
  ctx.fillStyle = '#fff';
  ctx.beginPath();
  ctx.arc(sx, sy, 3, 0, TWO_PI);
  ctx.fill();
  ctx.strokeStyle = '#fff';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.arc(sx, sy, 6, 0, TWO_PI);
  ctx.stroke();
}
