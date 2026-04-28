import { Formula } from '../../components/Kepler/Formula';
import ForcesDiagram from '../../components/Kepler/ForcesDiagram';
import {
  EARTH, MARS, M_SUN,
  sphereOfInfluence, escapeSpeed, speedToReachSOI,
} from '../../lib/kepler/physics';

export default function Influencia() {
  const earthSOI = sphereOfInfluence(EARTH.orbitRadius, EARTH.mass);
  const marsSOI = sphereOfInfluence(MARS.orbitRadius, MARS.mass);
  const earthSOIRadii = earthSOI / EARTH.radius;
  const marsSOIRadii = marsSOI / MARS.radius;
  const vEarthEsc = escapeSpeed(EARTH.mass, EARTH.radius);
  const vMarsEsc = escapeSpeed(MARS.mass, MARS.radius);
  const vEarthToSOI = speedToReachSOI(EARTH.mass, EARTH.radius, earthSOI);
  const vMarsToSOI = speedToReachSOI(MARS.mass, MARS.radius, marsSOI);

  return (
    <div>
      <h1 className="text-3xl tinos-bold mb-4">3. Esfera de influencia</h1>

      <p className="mb-4">
        Cuando se lanza una nave desde la Tierra hacia Marte, atraviesa tres etapas:
      </p>
      <ol className="list-decimal pl-6 mb-4 space-y-1">
        <li>Salida bajo la acción de la Tierra y del Sol; predomina la atracción terrestre.</li>
        <li>Fase heliocéntrica, la mayor parte del trayecto.</li>
        <li>Llegada a Marte: la atracción de Marte predomina sobre la del Sol.</li>
      </ol>

      <p className="mb-2">
        El <strong>radio de la esfera de influencia</strong> de un planeta es la distancia a la
        que la atracción del planeta se puede considerar despreciable frente a la del Sol. Fórmula
        de Laplace:
      </p>
      <Formula block tex={String.raw`R_e = d \left(\frac{M}{M_\odot}\right)^{2/5}`} />

      <h2 className="text-xl tinos-bold mt-8 mb-2">Esfera de influencia de la Tierra</h2>
      <p className="mb-4">
        Con <Formula tex={String.raw`M = 5{,}98\cdot 10^{24}\ \text{kg}`} />,{' '}
        <Formula tex={String.raw`R_T = 6{,}37\cdot 10^{6}\ \text{m}`} />,{' '}
        <Formula tex={String.raw`d = 1{,}496\cdot 10^{11}\ \text{m}`} /> y{' '}
        <Formula tex={String.raw`M_\odot = 1{,}98\cdot 10^{30}\ \text{kg}`} />:
      </p>

      <div className="border-black border-1 border-r-3 border-b-3 p-4 bg-white grid sm:grid-cols-2 gap-4 mb-4">
        <Result label="Radio de influencia" value={`${(earthSOI / 1e6).toFixed(1)}·10⁶ m`} />
        <Result label="En radios terrestres" value={`${earthSOIRadii.toFixed(1)} R_T`} />
      </div>

      <p className="mb-4">
        La esfera es muy pequeña comparada con la distancia Tierra–Sol. La nave seguirá una
        trayectoria heliocéntrica determinada casi exclusivamente por las condiciones iniciales y
        la atracción del Sol.
      </p>

      <ForcesDiagram planet={EARTH} range={150} soiRadii={earthSOIRadii} />

      <p className="mt-4 mb-4">
        Para llevar la nave desde la superficie de la Tierra al borde de su esfera de influencia
        es necesaria una velocidad muy próxima a la velocidad de escape:
      </p>
      <div className="border-black border-1 border-r-3 border-b-3 p-4 bg-white grid sm:grid-cols-2 gap-4">
        <Result label="v hasta R_e" value={`${vEarthToSOI.toFixed(1)} m/s`} />
        <Result label="v de escape" value={`${vEarthEsc.toFixed(1)} m/s`} />
      </div>

      <h2 className="text-xl tinos-bold mt-12 mb-2">Esfera de influencia de Marte</h2>
      <p className="mb-4">
        Con <Formula tex={String.raw`M = 6{,}578\cdot 10^{23}\ \text{kg}`} />,{' '}
        <Formula tex={String.raw`R_M = 3{,}394\cdot 10^{6}\ \text{m}`} />,{' '}
        <Formula tex={String.raw`d = 2{,}28\cdot 10^{11}\ \text{m}`} />:
      </p>

      <div className="border-black border-1 border-r-3 border-b-3 p-4 bg-white grid sm:grid-cols-2 gap-4 mb-4">
        <Result label="Radio de influencia" value={`${(marsSOI / 1e6).toFixed(1)}·10⁶ m`} />
        <Result label="En radios marcianos" value={`${marsSOIRadii.toFixed(1)} R_M`} />
      </div>

      <ForcesDiagram planet={MARS} range={175} soiRadii={marsSOIRadii} />

      <p className="mt-4">
        Para alcanzar el borde de la esfera de influencia de Marte desde su superficie:
      </p>
      <div className="border-black border-1 border-r-3 border-b-3 p-4 bg-white grid sm:grid-cols-2 gap-4 mt-2">
        <Result label="v hasta R_e" value={`${vMarsToSOI.toFixed(1)} m/s`} />
        <Result label="v de escape" value={`${vMarsEsc.toFixed(1)} m/s`} />
      </div>
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
