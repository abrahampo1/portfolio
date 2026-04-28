import { Link } from 'react-router-dom';

const CARDS = [
  { to: '/kepler/movimiento', title: 'Movimiento de los planetas', desc: 'Órbitas circulares de Tierra y Marte. Velocidad orbital.' },
  { to: '/kepler/hohmann', title: 'Órbita de Hohmann', desc: 'Trayectoria semielíptica entre los planetas. Posiciones de lanzamiento.' },
  { to: '/kepler/influencia', title: 'Esfera de influencia', desc: 'Dónde gana la gravedad del planeta a la del Sol.' },
  { to: '/kepler/energia', title: 'Energía del viaje', desc: 'Presupuesto Δv del viaje completo ida y vuelta.' },
  { to: '/kepler/simulador', title: 'Simulador interactivo', desc: 'Reemplazo del applet original. Lanza tu nave.' },
  { to: '/kepler/referencias', title: 'Referencias', desc: 'Fuente original y bibliografía.' },
];

export default function KeplerIndex() {
  return (
    <div>
      <h1 className="text-4xl tinos-bold mb-2">Encuentros espaciales</h1>
      <p className="tinos-regular-italic text-gray-600 mb-6">
        Viaje Tierra–Marte por órbita de transferencia de Hohmann
      </p>

      <p className="mb-4">
        El propósito de este recorrido es enviar una nave espacial desde la Tierra a Marte y de
        regreso a la Tierra siguiendo una trayectoria semielíptica denominada{' '}
        <strong>órbita de transferencia de Hohmann</strong>. Suponemos que las órbitas de la Tierra
        y Marte son circulares y que las únicas fuerzas sobre la nave son las debidas a la acción
        del Sol; despreciamos las influencias mutuas entre planetas y entre éstos y la nave.
      </p>
      <p className="mb-4">
        Primero, realizamos el viaje de ida desde la Tierra a Marte. Observaremos las velocidades
        angulares de ambos planetas. ¿Cuál ha de ser la distancia angular entre la Tierra y Marte
        en el momento del lanzamiento para que la nave llegue a Marte? ¿Qué planeta ha de ir por
        delante? Una vez se haya alcanzado Marte, nos haremos las mismas preguntas para el regreso.
      </p>

      <div className="grid sm:grid-cols-2 gap-3 mt-8">
        {CARDS.map((c) => (
          <Link
            key={c.to}
            to={c.to}
            className="border-black border-1 border-r-3 border-b-3 p-4 hover:bg-black hover:text-white transition-colors"
          >
            <p className="tinos-bold text-lg">{c.title}</p>
            <p className="text-sm">{c.desc}</p>
          </Link>
        ))}
      </div>

      <p className="text-xs tinos-regular-italic mt-8 text-gray-500">
        Adaptado y modernizado a partir del material académico de Ángel Franco García
        (UPV/EHU). Applet Java original sustituido por simulador en Canvas/React.
      </p>
    </div>
  );
}
