export default function Referencias() {
  return (
    <div>
      <h1 className="text-3xl tinos-bold mb-4">Referencias</h1>

      <h2 className="text-lg tinos-bold mt-4 mb-2">Fuente original</h2>
      <p className="mb-4">
        Ángel Franco García, <em>Física con ordenador. Curso interactivo de Física en Internet</em>.
        Universidad del País Vasco / Euskal Herriko Unibertsitatea (UPV/EHU). Sección «Encuentros
        espaciales — Órbita de transferencia de Hohmann».{' '}
        <a
          href="http://www.sc.ehu.es/sbweb/fisica/celeste/kepler2/kepler2.htm"
          className="underline"
          target="_blank"
          rel="noopener noreferrer"
        >
          sc.ehu.es/sbweb/fisica/celeste/kepler2
        </a>
      </p>

      <h2 className="text-lg tinos-bold mt-6 mb-2">Bibliografía</h2>
      <ul className="list-disc pl-6 space-y-2">
        <li>
          Stinner A., Bergoray J. <em>Journey to Mars: the physics of travelling to the red planet</em>.
          Physics Education, 40 (1), enero 2005, pp. 35–45.
        </li>
        <li>
          Curtis H. D. <em>Orbital Mechanics for Engineering Students</em>. Butterworth-Heinemann.
        </li>
      </ul>

      <h2 className="text-lg tinos-bold mt-8 mb-2">Sobre esta versión</h2>
      <p className="text-sm">
        Esta página adapta y moderniza el material original. El applet Java (JDK 1.1) ha sido
        sustituido por un simulador en <code>&lt;canvas&gt;</code> + React 19, las fórmulas se
        renderizan con KaTeX y los valores numéricos se calculan en vivo a partir de las
        constantes definidas en <code>src/lib/kepler/physics.js</code>.
      </p>
    </div>
  );
}
