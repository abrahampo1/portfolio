import OrbitSimulator from '../../components/Kepler/OrbitSimulator';

export default function Simulador() {
  return (
    <div>
      <h1 className="text-3xl tinos-bold mb-4">5. Simulador interactivo</h1>

      <p className="mb-4">
        Reemplazo del applet Java original (KeplerApplet2). La Tierra y Marte se mueven en órbitas
        circulares alrededor del Sol. Cuando lances la nave, recorrerá una trayectoria semielíptica
        siguiendo las leyes de Kepler (la velocidad <em>no</em> es uniforme: máxima en el perihelio,
        mínima en el afelio).
      </p>

      <OrbitSimulator />

      <h2 className="text-lg tinos-bold mt-6 mb-2">Cómo usar</h2>
      <ol className="list-decimal pl-6 space-y-1 text-sm">
        <li><strong>Nuevo</strong>: aleatoriza las posiciones iniciales de los planetas.</li>
        <li>Pulsa <strong>Continuar</strong> y observa las velocidades angulares.</li>
        <li><strong>Pausa</strong> y <strong>Paso</strong> permiten avanzar día a día.</li>
        <li>Cuando Marte esté ~44.7° por delante de la Tierra, pulsa <strong>Lanzar</strong>.</li>
        <li>La nave llegará a Marte tras ~259 días. Allí espera la ventana de regreso (Tierra ~76° por detrás de Marte) y pulsa <strong>Regresar</strong>.</li>
      </ol>

      <p className="text-sm tinos-regular-italic text-gray-600 mt-4">
        Si lanzas fuera de ventana, la nave parte igualmente — pero no se encontrará con el planeta destino
        (eso es parte de la lección).
      </p>
    </div>
  );
}
