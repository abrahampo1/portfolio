import { Formula } from '../../components/Kepler/Formula';
import HohmannDiagram from '../../components/Kepler/HohmannDiagram';
import {
  EARTH, MARS,
  circularSpeed, transferSpeeds, transferEllipse,
  transferTimeDays, leadAngleOutbound, lagAngleReturn, waitTimeOnMarsDays,
} from '../../lib/kepler/physics';

export default function Hohmann() {
  const r1 = EARTH.orbitRadius;
  const r2 = MARS.orbitRadius;
  const vt = circularSpeed(r1);
  const vm = circularSpeed(r2);
  const { v1, v2 } = transferSpeeds(r1, r2);
  const { a, e } = transferEllipse(r1, r2);
  const halfP = transferTimeDays(r1, r2);
  const fullP = halfP * 2;
  const lead = leadAngleOutbound() * 180 / Math.PI;
  const lag = lagAngleReturn() * 180 / Math.PI;
  const wait = waitTimeOnMarsDays();
  const total = halfP + wait + halfP;

  return (
    <div>
      <h1 className="text-3xl tinos-bold mb-4">2. Órbita de transferencia de Hohmann</h1>

      <p className="mb-4">
        La nave describe una órbita elíptica con el Sol en uno de sus focos. El{' '}
        <strong>perihelio</strong> coincide con la órbita de la Tierra y el{' '}
        <strong>afelio</strong> con la de Marte. Conociendo r₁ y r₂, podemos
        determinar las velocidades de la nave en ambos puntos aplicando dos leyes de conservación.
      </p>

      <h2 className="text-xl tinos-bold mt-6 mb-2">Conservación del momento angular y la energía</h2>

      <p className="mb-2">La fuerza es central, luego el momento angular se conserva:</p>
      <Formula block tex={String.raw`m\, r_1\, v_1 = m\, r_2\, v_2`} />

      <p className="mb-2">La fuerza es conservativa, luego la energía total se conserva:</p>
      <Formula block tex={String.raw`\tfrac{1}{2} v_1^2 - \frac{GM}{r_1} = \tfrac{1}{2} v_2^2 - \frac{GM}{r_2}`} />

      <p className="mb-2">Resolviendo el sistema:</p>
      <Formula block tex={String.raw`v_1 = \sqrt{\frac{2GM\, r_2}{r_1(r_1+r_2)}},\qquad v_2 = \sqrt{\frac{2GM\, r_1}{r_2(r_1+r_2)}}`} />

      <div className="border-black border-1 border-r-3 border-b-3 p-4 bg-white grid sm:grid-cols-2 gap-4 mt-4">
        <Result label="v₁ (perihelio)" value={`${v1.toFixed(1)} m/s`} />
        <Result label="v₂ (afelio)" value={`${v2.toFixed(1)} m/s`} />
        <Result label="Semieje mayor a" value={`${(a / 1e11).toFixed(3)}·10¹¹ m`} />
        <Result label="Excentricidad ε" value={e.toFixed(2)} />
      </div>

      <p className="mt-4 mb-2">
        Al lanzar la nave en las proximidades de la Tierra y en la dirección de su movimiento
        orbital, hay que <strong>incrementar</strong> su velocidad en{' '}
        <Formula tex={`v_1 - v_t = ${(v1 - vt).toFixed(1)}\\ \\text{m/s}`} />.
        En el regreso, en las proximidades de Marte, hay que <strong>disminuirla</strong> en{' '}
        <Formula tex={`v_2 - v_m = ${(v2 - vm).toFixed(1)}\\ \\text{m/s}`} />.
      </p>

      <h2 className="text-xl tinos-bold mt-8 mb-2">Periodo y tiempo de tránsito</h2>

      <p className="mb-2">Por la tercera ley de Kepler:</p>
      <Formula block tex={String.raw`P^2 = \frac{4\pi^2 a^3}{GM}`} />

      <p className="mb-4">
        Con <Formula tex={`2a = r_1 + r_2`} />, sale{' '}
        <Formula tex={`P = ${fullP.toFixed(1)}\\ \\text{días}`} />.
        Entre la Tierra y Marte se emplea exactamente medio periodo:{' '}
        <strong>{halfP.toFixed(1)} días</strong>.
      </p>

      <h2 className="text-xl tinos-bold mt-8 mb-2">Posiciones de los planetas en el lanzamiento</h2>

      <div className="grid md:grid-cols-2 gap-4 items-start">
        <HohmannDiagram phase="outbound" leadDeg={lead} />
        <div>
          <p className="tinos-bold">Viaje de ida</p>
          <p className="mb-2">
            La nave necesita {halfP.toFixed(1)} días para ir del perihelio al afelio. Durante ese
            tiempo, Marte recorre <Formula tex={String.raw`\omega_m\cdot P/2`} /> = {(180 - lead).toFixed(1)}°.
            Para que ambos coincidan en el afelio, Marte tiene que ir adelantado a la Tierra:
          </p>
          <p className="text-2xl tinos-bold">θ ≈ {lead.toFixed(1)}°</p>
        </div>

        <HohmannDiagram phase="return" lagDeg={lag} />
        <div>
          <p className="tinos-bold">Viaje de vuelta</p>
          <p className="mb-2">
            La Tierra recorre <Formula tex={String.raw`\omega_t\cdot P/2`} /> = {(180 + lag).toFixed(1)}°
            durante el tránsito de regreso. Tiene que ir <em>por detrás</em> de Marte:
          </p>
          <p className="text-2xl tinos-bold">θ ≈ {lag.toFixed(1)}°</p>
        </div>
      </div>

      <h2 className="text-xl tinos-bold mt-8 mb-2">Duración del viaje completo</h2>
      <ul className="list-disc pl-6 space-y-1">
        <li>Viaje de ida a Marte: <strong>{halfP.toFixed(1)} días</strong></li>
        <li>Estancia en Marte (espera de la ventana de regreso): <strong>{wait.toFixed(1)} días</strong></li>
        <li>Viaje de vuelta a la Tierra: <strong>{halfP.toFixed(1)} días</strong></li>
        <li>Total: <strong>{total.toFixed(1)} días</strong> (~ {(total / 365.25).toFixed(2)} años)</li>
      </ul>
      <p className="text-sm text-gray-600 mt-2">
        A esto hay que sumar el tiempo de despegue y aterrizaje en la superficie de ambos planetas.
      </p>
    </div>
  );
}

function Result({ label, value }) {
  return (
    <div>
      <p className="text-sm uppercase tracking-wide tinos-bold">{label}</p>
      <p className="text-2xl tabular-nums">{value}</p>
    </div>
  );
}
