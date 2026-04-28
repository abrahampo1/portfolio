import { Formula } from '../../components/Kepler/Formula';
import { EARTH, MARS, circularSpeed } from '../../lib/kepler/physics';

export default function Movimiento() {
  const vt = circularSpeed(EARTH.orbitRadius);
  const vm = circularSpeed(MARS.orbitRadius);

  return (
    <div>
      <h1 className="text-3xl tinos-bold mb-4">1. Movimiento de los planetas</h1>

      <p className="mb-4">
        Suponemos que la Tierra y Marte describen órbitas circulares alrededor del Sol. Aplicando
        la ecuación de la dinámica del movimiento circular uniforme, la fuerza de atracción
        gravitatoria del Sol proporciona la fuerza centrípeta:
      </p>

      <Formula block tex={String.raw`m\frac{v^2}{r} = \frac{GMm}{r^2} \quad\Longrightarrow\quad v = \sqrt{\frac{GM}{r}}`} />

      <p className="mb-2">Con los datos:</p>
      <ul className="list-disc pl-6 mb-4 space-y-1">
        <li><Formula tex={String.raw`M = 1{,}98\cdot 10^{30}\ \text{kg}`} /> (masa del Sol)</li>
        <li><Formula tex={String.raw`G = 6{,}67\cdot 10^{-11}\ \text{N·m}^2/\text{kg}^2`} /></li>
        <li>Para la Tierra: <Formula tex={String.raw`r_t = 1{,}49\cdot 10^{11}\ \text{m}`} /></li>
        <li>Para Marte: <Formula tex={String.raw`r_m = 2{,}28\cdot 10^{11}\ \text{m}`} /></li>
      </ul>

      <div className="border-black border-1 border-r-3 border-b-3 p-4 bg-white grid sm:grid-cols-2 gap-4">
        <Result label="Velocidad orbital de la Tierra" value={`${vt.toFixed(1)} m/s`} sub={`${(vt / 1000).toFixed(2)} km/s`} />
        <Result label="Velocidad orbital de Marte" value={`${vm.toFixed(1)} m/s`} sub={`${(vm / 1000).toFixed(2)} km/s`} />
      </div>

      <p className="mt-4 text-sm tinos-regular-italic text-gray-600">
        Marte se mueve más despacio: en una vuelta al Sol, la Tierra le saca casi dos años de ventaja.
      </p>
    </div>
  );
}

function Result({ label, value, sub }) {
  return (
    <div>
      <p className="text-sm uppercase tracking-wide tinos-bold">{label}</p>
      <p className="text-2xl">{value}</p>
      {sub && <p className="text-sm text-gray-600">{sub}</p>}
    </div>
  );
}
