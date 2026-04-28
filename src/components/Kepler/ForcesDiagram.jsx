// Diagrama F_S (constante) vs F_planeta (1/r²) en el rango ±N·R sobre el centro del planeta.
// Reproduce el espíritu de Image5/6.gif del original.
import { useMemo } from 'react';
import { G, M_SUN } from '../../lib/kepler/physics';

export default function ForcesDiagram({ planet, range = 150, soiRadii }) {
  const { name, mass, radius, orbitRadius } = planet;
  const data = useMemo(() => {
    const points = [];
    const N = 400;
    for (let i = 0; i <= N; i++) {
      const x = -range + (2 * range * i) / N; // en radios planetarios
      const r = Math.abs(x) * radius;
      const fS = (G * M_SUN) / (orbitRadius * orbitRadius); // por kg
      const fP = r > radius * 0.5 ? (G * mass) / (r * r) : (G * mass) / (radius * radius * 0.25);
      points.push({ x, fS, fP });
    }
    return points;
  }, [range, radius, mass, orbitRadius]);

  const W = 520;
  const H = 280;
  const padL = 50;
  const padR = 16;
  const padT = 20;
  const padB = 36;
  const plotW = W - padL - padR;
  const plotH = H - padT - padB;

  const fMax = Math.max(...data.map((d) => d.fP).filter((v) => isFinite(v)));
  const fSConst = data[0].fS;
  const yMax = Math.max(fMax, fSConst) * 1.1;

  const xScale = (x) => padL + ((x + range) / (2 * range)) * plotW;
  const yScale = (f) => padT + plotH - (f / yMax) * plotH;

  const pathFP = data
    .map((d, i) => `${i === 0 ? 'M' : 'L'} ${xScale(d.x).toFixed(1)} ${yScale(d.fP).toFixed(1)}`)
    .join(' ');
  const ySConst = yScale(fSConst);

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-xl border-black border-1 border-r-3 border-b-3 bg-white">
      {/* Ejes */}
      <line x1={padL} y1={padT + plotH} x2={W - padR} y2={padT + plotH} stroke="black" />
      <line x1={padL} y1={padT} x2={padL} y2={padT + plotH} stroke="black" />
      {/* Líneas SOI */}
      {soiRadii != null && (
        <>
          <line x1={xScale(-soiRadii)} y1={padT} x2={xScale(-soiRadii)} y2={padT + plotH} stroke="#888" strokeDasharray="3,3" />
          <line x1={xScale(soiRadii)} y1={padT} x2={xScale(soiRadii)} y2={padT + plotH} stroke="#888" strokeDasharray="3,3" />
          <text x={xScale(soiRadii) + 4} y={padT + 12} fontSize={10} fontFamily="Tinos, serif" fill="#555">
            R_e = {soiRadii.toFixed(0)} R_{name[0]}
          </text>
        </>
      )}
      {/* F_Sol constante */}
      <line x1={padL} y1={ySConst} x2={W - padR} y2={ySConst} stroke="#f39c12" strokeWidth={2} />
      <text x={W - padR - 60} y={ySConst - 6} fontSize={11} fontFamily="Tinos, serif" fill="#b8860b">F_Sol</text>
      {/* F_planeta */}
      <path d={pathFP} fill="none" stroke="black" strokeWidth={1.5} />
      <text x={padL + 10} y={padT + 14} fontSize={11} fontFamily="Tinos, serif">F_{name}</text>
      {/* Etiqueta eje X */}
      <text x={W / 2} y={H - 8} fontSize={11} fontFamily="Tinos, serif" textAnchor="middle">
        Distancia al centro de {name} (radios planetarios)
      </text>
      {/* Marca centro */}
      <line x1={xScale(0)} y1={padT + plotH} x2={xScale(0)} y2={padT + plotH + 4} stroke="black" />
      <text x={xScale(0)} y={padT + plotH + 16} fontSize={10} textAnchor="middle" fontFamily="Tinos, serif">0</text>
      <text x={xScale(-range)} y={padT + plotH + 16} fontSize={10} textAnchor="middle" fontFamily="Tinos, serif">−{range}</text>
      <text x={xScale(range)} y={padT + plotH + 16} fontSize={10} textAnchor="middle" fontFamily="Tinos, serif">{range}</text>
    </svg>
  );
}
