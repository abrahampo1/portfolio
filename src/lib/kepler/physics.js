// Constantes físicas y datos planetarios. Valores tomados de la fuente original
// (UPV/EHU, sbweb/fisica/celeste/kepler2) para reproducir sus resultados numéricos.

export const G = 6.67e-11; // N·m²/kg²
export const M_SUN = 1.98e30; // kg
export const SECONDS_PER_DAY = 86400;

export const EARTH = {
  name: 'Tierra',
  mass: 5.98e24, // kg
  radius: 6.37e6, // m
  orbitRadius: 1.49e11, // m (perihelio en la transferencia)
};

export const MARS = {
  name: 'Marte',
  mass: 6.578e23,
  radius: 3.394e6,
  orbitRadius: 2.28e11, // m (afelio en la transferencia)
};

// Velocidad orbital circular alrededor del Sol.
export function circularSpeed(r) {
  return Math.sqrt((G * M_SUN) / r);
}

// Velocidades de la nave en perihelio (r1) y afelio (r2) de la elipse de transferencia.
// Derivadas de conservación de momento angular y energía.
export function transferSpeeds(r1, r2) {
  const v1 = Math.sqrt((2 * G * M_SUN * r2) / (r1 * (r1 + r2)));
  const v2 = Math.sqrt((2 * G * M_SUN * r1) / (r2 * (r1 + r2)));
  return { v1, v2 };
}

// Semieje mayor y excentricidad de la elipse de Hohmann.
export function transferEllipse(r1, r2) {
  const a = (r1 + r2) / 2;
  const e = (r2 - r1) / (r2 + r1);
  return { a, e };
}

// Tercera ley de Kepler. Devuelve periodo en segundos.
export function orbitalPeriod(a) {
  return 2 * Math.PI * Math.sqrt((a * a * a) / (G * M_SUN));
}

// Tiempo de tránsito (medio periodo) en días.
export function transferTimeDays(r1, r2) {
  const { a } = transferEllipse(r1, r2);
  return orbitalPeriod(a) / 2 / SECONDS_PER_DAY;
}

// Velocidad angular de un planeta (rad/s).
export function angularSpeed(r) {
  return circularSpeed(r) / r;
}

// Ángulo (rad) que Marte ha de adelantar a la Tierra al lanzar la ida.
export function leadAngleOutbound() {
  const transferDays = transferTimeDays(EARTH.orbitRadius, MARS.orbitRadius);
  const wm = angularSpeed(MARS.orbitRadius); // rad/s
  const sweep = wm * transferDays * SECONDS_PER_DAY; // rad
  return Math.PI - sweep;
}

// Ángulo (rad) que la Tierra ha de retrasar respecto a Marte al lanzar la vuelta.
export function lagAngleReturn() {
  const transferDays = transferTimeDays(EARTH.orbitRadius, MARS.orbitRadius);
  const wt = angularSpeed(EARTH.orbitRadius);
  const sweep = wt * transferDays * SECONDS_PER_DAY; // rad
  return sweep - Math.PI;
}

// Tiempo mínimo de espera en Marte (días) antes de lanzar el regreso.
// Resuelve la ecuación de fase: theta_m - lag + 2π·n = theta_t.
export function waitTimeOnMarsDays() {
  const transferDays = transferTimeDays(EARTH.orbitRadius, MARS.orbitRadius);
  const wt = angularSpeed(EARTH.orbitRadius);
  const wm = angularSpeed(MARS.orbitRadius);
  const lead0 = leadAngleOutbound();
  const lag = lagAngleReturn();
  // En t = P/2 (llegada a Marte): theta_t = wt·P/2, theta_m = lead0 + wm·P/2.
  // Buscamos Δt mínimo > 0 con n=1 tal que (theta_m + wm·Δt) - lag = (theta_t + wt·Δt) + 2π·n
  const halfP = transferDays * SECONDS_PER_DAY;
  const thetaT = wt * halfP;
  const thetaM = lead0 + wm * halfP;
  // (thetaM - lag - thetaT) + (wm - wt)·Δt = 2π·n
  const base = thetaM - lag - thetaT;
  const slope = wm - wt; // negativo (wt > wm)
  // Δt = (2π·n - base) / slope, mínimo positivo.
  let best = Infinity;
  for (let n = -5; n <= 5; n++) {
    const dt = (2 * Math.PI * n - base) / slope;
    if (dt > 0 && dt < best) best = dt;
  }
  return best / SECONDS_PER_DAY;
}

// Radio de la esfera de influencia (Laplace).
export function sphereOfInfluence(d, planetMass) {
  return d * Math.pow(planetMass / M_SUN, 2 / 5);
}

// Velocidad de escape desde la superficie de un cuerpo.
export function escapeSpeed(mass, radius) {
  return Math.sqrt((2 * G * mass) / radius);
}

// Velocidad necesaria para alcanzar el borde de la esfera de influencia desde la superficie
// del planeta (energía cinética = trabajo contra gravedad del planeta hasta R_e).
export function speedToReachSOI(planetMass, planetRadius, soi) {
  return Math.sqrt(2 * G * planetMass * (1 / planetRadius - 1 / soi));
}

// Presupuesto de Δv del viaje completo (m/s).
export function deltaVBudget() {
  const vt = circularSpeed(EARTH.orbitRadius);
  const vm = circularSpeed(MARS.orbitRadius);
  const { v1, v2 } = transferSpeeds(EARTH.orbitRadius, MARS.orbitRadius);

  const earthSOI = sphereOfInfluence(EARTH.orbitRadius, EARTH.mass);
  const marsSOI = sphereOfInfluence(MARS.orbitRadius, MARS.mass);
  const vEarthToSOI = speedToReachSOI(EARTH.mass, EARTH.radius, earthSOI);
  const vMarsToSOI = speedToReachSOI(MARS.mass, MARS.radius, marsSOI);

  const dv1 = vEarthToSOI + (v1 - vt); // ida: salir de Tierra + acelerar al perihelio
  const dv2 = vMarsToSOI - Math.abs(v2 - vm); // ida: frenar para aterrizar en Marte
  const dvTotal = 2 * (dv1 + dv2); // ida + vuelta simétrico

  return { vt, vm, v1, v2, vEarthToSOI, vMarsToSOI, dv1, dv2, dvTotal };
}

// Resuelve la ecuación de Kepler M = E - e·sin(E) con Newton.
export function solveKepler(M, e, tol = 1e-10) {
  let E = e < 0.8 ? M : Math.PI;
  for (let i = 0; i < 50; i++) {
    const f = E - e * Math.sin(E) - M;
    const fp = 1 - e * Math.cos(E);
    const dE = f / fp;
    E -= dE;
    if (Math.abs(dE) < tol) break;
  }
  return E;
}

// Posición en una elipse kepleriana en función del tiempo (segundos desde paso por perihelio).
// Devuelve {r, theta} con theta=0 en el perihelio.
export function keplerPosition(tSec, a, e) {
  const n = Math.sqrt((G * M_SUN) / (a * a * a)); // movimiento medio
  const M = n * tSec;
  const E = solveKepler(M, e);
  const cosE = Math.cos(E);
  const sinE = Math.sin(E);
  const theta = 2 * Math.atan2(
    Math.sqrt(1 + e) * Math.sin(E / 2),
    Math.sqrt(1 - e) * Math.cos(E / 2),
  );
  const r = a * (1 - e * cosE);
  return { r, theta, E, M, sinE, cosE };
}
