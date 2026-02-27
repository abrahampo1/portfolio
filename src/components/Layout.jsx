import { Link, Outlet } from 'react-router-dom';

export default function Layout() {
  return (
    <>
      <div className="sm:p-16 p-8 select-none">
        <div>
          <Link to="/" className="text-4xl tinos-regular hover:underline">
            Abraham Leiro Fernández
          </Link>
          <div className="flex items-center gap-2 tinos-regular-italic flex-wrap">
            <p>Developer</p>
            <div className="w-[1px] bg-gray-500 h-4"></div>
            <a href="mailto:hola@leiro.dev">hola@leiro.dev</a>
            <div className="w-[1px] bg-gray-500 h-4"></div>
            <a href="https://github.com/abrahampo1">GitHub</a>
            <div className="w-[1px] bg-gray-500 h-4"></div>
            <a href="https://www.linkedin.com/in/abraham-leiro/">LinkedIn</a>
            <div className="w-[1px] bg-gray-500 h-4"></div>
            <a href="/public.key">Public PGP Key</a>
            <div className="w-[1px] bg-gray-500 h-4"></div>
            <Link to="/blog">Blog</Link>
          </div>
        </div>
        <Outlet />
      </div>
    </>
  );
}
