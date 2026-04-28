// SVG estático de las órbitas y la elipse de transferencia.
// Tierra (perihelio) a la derecha, Marte (afelio) a la izquierda.
import { EARTH, MARS, transferEllipse } from '../../lib/kepler/physics';

export default function HohmannDiagram({ phase = 'outbound', leadDeg = 44.7, lagDeg = 76.1 }) {
  const W = 480;
  const H = 480;
  const cx = W / 2;
  const cy = H / 2;
  const scale = 180 / MARS.orbitRadius; // px/m
  const rt = EARTH.orbitRadius * scale;
  const rm = MARS.orbitRadius * scale;
  const { a, e } = transferEllipse(EARTH.orbitRadius, MARS.orbitRadius);
  const aPx = a * scale;
  const bPx = aPx * Math.sqrt(1 - e * e);
  // Centro de la elipse desplazado del Sol por c = a·e hacia el perihelio (derecha).
  const c = aPx * e;
  const ellipseCx = cx + c;

  // Posiciones planetas. Convención: ángulos medidos desde +x antihorario.
  const tierraTheta = 0; // perihelio derecha
  const marteTheta = phase === 'outbound'
    ? (leadDeg * Math.PI) / 180
    : Math.PI; // en llegada, Marte en afelio (izquierda)
  const tx = cx + rt * Math.cos(tierraTheta);
  const ty = cy - rt * Math.sin(tierraTheta);
  const mx = cx + rm * Math.cos(marteTheta);
  const my = cy - rm * Math.sin(marteTheta);

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-md border-black border-1 border-r-3 border-b-3 bg-white">
      {/* Órbita Tierra */}
      <circle cx={cx} cy={cy} r={rt} fill="none" stroke="#1f6feb" strokeWidth={1} strokeDasharray="3,3" />
      {/* Órbita Marte */}
      <circle cx={cx} cy={cy} r={rm} fill="none" stroke="#c0392b" strokeWidth={1} strokeDasharray="3,3" />
      {/* Elipse de transferencia */}
      <ellipse cx={ellipseCx} cy={cy} rx={aPx} ry={bPx} fill="none" stroke="black" strokeWidth={1.5} />
      {/* Eje mayor */}
      <line x1={cx + rt} y1={cy} x2={cx - rm} y2={cy} stroke="#999" strokeDasharray="2,4" />
      {/* Sol */}
      <circle cx={cx} cy={cy} r={8} fill="#f39c12" stroke="black" />
      <text x={cx + 12} y={cy + 4} fontSize={11} fontFamily="Tinos, serif">Sol</text>
      {/* Tierra */}
      <circle cx={tx} cy={ty} r={6} fill="#1f6feb" stroke="black" />
      <text x={tx + 8} y={ty + 4} fontSize={11} fontFamily="Tinos, serif">Tierra</text>
      {/* Marte */}
      <circle cx={mx} cy={my} r={5} fill="#c0392b" stroke="black" />
      <text x={mx - 36} y={my - 8} fontSize={11} fontFamily="Tinos, serif">Marte</text>
      {/* Indicador ángulo de adelanto */}
      {phase === 'outbound' && (
        <>
          <path
            d={`M ${cx + 60} ${cy} A 60 60 0 0 0 ${cx + 60 * Math.cos(marteTheta)} ${cy - 60 * Math.sin(marteTheta)}`}
            fill="none"
            stroke="black"
            strokeWidth={1}
          />
          <text x={cx + 70} y={cy - 30} fontSize={11} fontFamily="Tinos, serif">θ ≈ {leadDeg.toFixed(1)}°</text>
        </>
      )}
      {phase === 'return' && (
        <text x={cx - 80} y={cy - rm - 10} fontSize={11} fontFamily="Tinos, serif">
          Tierra retrasada {lagDeg.toFixed(1)}° respecto a Marte
        </text>
      )}
    </svg>
  );
}
