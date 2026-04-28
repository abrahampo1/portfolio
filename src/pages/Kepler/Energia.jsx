import { Formula } from '../../components/Kepler/Formula';
import { deltaVBudget } from '../../lib/kepler/physics';

export default function Energia() {
  const dv = deltaVBudget();

  return (
    <div>
      <h1 className="text-3xl tinos-bold mb-4">4. Energía necesaria para completar el viaje</h1>

      <p className="mb-4">
        La velocidad necesaria para llevar la nave hasta el borde de la esfera de influencia de la
        Tierra es <Formula tex={`${dv.vEarthToSOI.toFixed(1)}\\ \\text{m/s}`} />. Una vez fuera, en
        la dirección del movimiento orbital de la Tierra, hay que <strong>incrementar</strong> la
        velocidad en{' '}
        <Formula tex={`v_1 - v_t = ${(dv.v1 - dv.vt).toFixed(1)}\\ \\text{m/s}`} /> para alcanzar
        el perihelio de la órbita de Hohmann.
      </p>

      <Formula block tex={String.raw`\Delta v_1 = ${dv.vEarthToSOI.toFixed(1)} + ${(dv.v1 - dv.vt).toFixed(1)} = ${dv.dv1.toFixed(1)}\ \text{m/s}`} />

      <p className="mt-4 mb-4">
        La nave llega a las proximidades de Marte con velocidad{' '}
        <Formula tex={`v_2 = ${dv.v2.toFixed(1)}\\ \\text{m/s}`} />, mientras que el planeta se
        mueve a <Formula tex={`v_m = ${dv.vm.toFixed(1)}\\ \\text{m/s}`} />. La diferencia es{' '}
        <Formula tex={`v_2 - v_m = ${(dv.v2 - dv.vm).toFixed(1)}\\ \\text{m/s}`} />: la nave va
        más despacio que Marte y es capturada cuando entra en su esfera de influencia. La velocidad
        de escape desde la superficie de Marte es{' '}
        <Formula tex={`${dv.vMarsToSOI.toFixed(1)}\\ \\text{m/s}`} />, así que los retropropulsores
        deben aplicar:
      </p>

      <Formula block tex={String.raw`\Delta v_2 = ${dv.vMarsToSOI.toFixed(1)} - ${Math.abs(dv.v2 - dv.vm).toFixed(1)} = ${dv.dv2.toFixed(1)}\ \text{m/s}`} />

      <p className="mt-4 mb-2">
        El cambio de velocidad total para el viaje completo de ida y vuelta:
      </p>
      <Formula block tex={String.raw`\Delta v = 2(\Delta v_1 + \Delta v_2) = ${dv.dvTotal.toFixed(1)}\ \text{m/s}`} />

      <div className="border-black border-1 border-r-3 border-b-3 p-4 bg-white grid sm:grid-cols-2 gap-4 mt-6">
        <Result label="Δv ida (escape Tierra + acelerar)" value={`${dv.dv1.toFixed(1)} m/s`} />
        <Result label="Δv ida (frenar y aterrizar Marte)" value={`${dv.dv2.toFixed(1)} m/s`} />
        <Result label="Δv subtotal ida" value={`${(dv.dv1 + dv.dv2).toFixed(1)} m/s`} />
        <Result label="Δv total (ida + vuelta)" value={`${dv.dvTotal.toFixed(1)} m/s`} />
      </div>

      <p className="text-sm text-gray-600 mt-4">
        Cuando la nave desciende en las atmósferas de la Tierra y de Marte, el rozamiento ayuda a
        frenar y reduce la energía necesaria en esas dos etapas del vuelo.
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
