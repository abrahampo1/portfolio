import { NavLink, Outlet, Link, useLocation } from 'react-router-dom';
import 'katex/dist/katex.min.css';

const SECTIONS = [
  { to: '/kepler', label: 'Introducción', end: true },
  { to: '/kepler/movimiento', label: '1. Movimiento de los planetas' },
  { to: '/kepler/hohmann', label: '2. Órbita de Hohmann' },
  { to: '/kepler/influencia', label: '3. Esfera de influencia' },
  { to: '/kepler/energia', label: '4. Energía del viaje' },
  { to: '/kepler/simulador', label: '5. Simulador' },
  { to: '/kepler/referencias', label: 'Referencias' },
];

export default function KeplerLayout() {
  const { pathname } = useLocation();
  const idx = SECTIONS.findIndex((s) =>
    s.end ? pathname === s.to : pathname === s.to,
  );
  const prev = idx > 0 ? SECTIONS[idx - 1] : null;
  const next = idx >= 0 && idx < SECTIONS.length - 1 ? SECTIONS[idx + 1] : null;

  return (
    <div className="mt-8">
      <div className="text-sm tinos-regular-italic mb-4">
        <Link to="/" className="hover:underline">Portfolio</Link>
        <span className="mx-2">/</span>
        <Link to="/kepler" className="hover:underline">Encuentros espaciales</Link>
      </div>

      <div className="grid md:grid-cols-[240px_1fr] gap-8">
        <nav className="border-black border-1 border-r-3 border-b-3 p-4 h-fit md:sticky md:top-4">
          <p className="tinos-bold text-sm uppercase tracking-wide mb-2">Secciones</p>
          <ul className="tinos-regular text-sm space-y-1">
            {SECTIONS.map((s) => (
              <li key={s.to}>
                <NavLink
                  to={s.to}
                  end={s.end}
                  className={({ isActive }) =>
                    isActive
                      ? 'block bg-black text-white px-2 py-1'
                      : 'block px-2 py-1 hover:underline'
                  }
                >
                  {s.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <article className="tinos-regular max-w-3xl leading-relaxed">
          <Outlet />

          <div className="flex justify-between mt-12 pt-6 border-t-1 border-black gap-4">
            {prev ? (
              <Link
                to={prev.to}
                className="border-black border-1 border-r-3 border-b-3 px-3 py-2 hover:bg-black hover:text-white"
              >
                ← {prev.label}
              </Link>
            ) : <span />}
            {next ? (
              <Link
                to={next.to}
                className="border-black border-1 border-r-3 border-b-3 px-3 py-2 hover:bg-black hover:text-white text-right"
              >
                {next.label} →
              </Link>
            ) : <span />}
          </div>
        </article>
      </div>
    </div>
  );
}
