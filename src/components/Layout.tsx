import { useEffect, useState } from 'react';
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom';
import { DEMO_NOTICE } from '../data/vehicles';

const links = [
  { to: '/', label: 'Início' },
  { to: '/veiculos', label: 'Veículos' },
  { to: '/configurador', label: 'Configurador' },
  { to: '/tecnologia', label: 'Tecnologia' },
  { to: '/sobre', label: 'Sobre' },
  { to: '/contato', label: 'Contato' },
];

export default function Layout() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div className="flex min-h-screen flex-col">
      <a
        href="#conteudo"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded focus:bg-white focus:px-3 focus:py-2 focus:text-ink"
      >
        Pular para o conteúdo
      </a>

      <header
        className={`fixed inset-x-0 top-0 z-50 border-b transition-colors duration-300 ${
          scrolled || open ? 'border-white/10 bg-ink/85 backdrop-blur-md' : 'border-transparent bg-transparent'
        }`}
      >
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 lg:px-8">
          <Link to="/" className="font-display text-lg font-bold tracking-[0.35em] text-white">
            AETHER
          </Link>

          <nav aria-label="Principal" className="hidden lg:block">
            <ul className="flex items-center gap-7">
              {links.map((l) => (
                <li key={l.to}>
                  <NavLink
                    to={l.to}
                    end={l.to === '/'}
                    className={({ isActive }) =>
                      `text-xs font-medium uppercase tracking-[0.18em] transition ${
                        isActive ? 'text-white' : 'text-silver hover:text-white'
                      }`
                    }
                  >
                    {l.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>

          <Link to="/configurador" className="btn-primary hidden !px-5 !py-2 lg:inline-flex">
            Configurar
          </Link>

          <button
            type="button"
            className="btn-ghost !px-4 !py-2 lg:hidden"
            aria-expanded={open}
            aria-controls="menu-mobile"
            onClick={() => setOpen((v) => !v)}
          >
            {open ? 'Fechar' : 'Menu'}
          </button>
        </div>

        {open && (
          <nav id="menu-mobile" aria-label="Principal mobile" className="border-t border-white/5 bg-ink lg:hidden">
            <ul className="flex flex-col px-5 py-4">
              {links.map((l) => (
                <li key={l.to}>
                  <NavLink
                    to={l.to}
                    end={l.to === '/'}
                    onClick={() => setOpen(false)}
                    className="block py-3 text-sm uppercase tracking-[0.18em] text-steel hover:text-white"
                  >
                    {l.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>
        )}
      </header>

      <main id="conteudo" className="flex-1">
        <div key={location.pathname} className="page-enter">
          <Outlet />
        </div>
      </main>

      <footer className="border-t border-white/5 bg-graphite">
        <div className="mx-auto grid max-w-7xl gap-8 px-5 py-12 md:grid-cols-3 lg:px-8">
          <div>
            <p className="font-display text-lg font-bold tracking-[0.35em] text-white">AETHER</p>
            <p className="mt-3 max-w-xs text-sm text-silver">{DEMO_NOTICE}</p>
          </div>
          <nav aria-label="Rodapé">
            <ul className="grid grid-cols-2 gap-2 text-sm">
              {links.map((l) => (
                <li key={l.to}>
                  <Link to={l.to} className="text-silver hover:text-white">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <p className="text-xs leading-relaxed text-silver/70">
            Marca fictícia, sem relação com fabricantes existentes. Este site não oferece venda, reserva ou financiamento.
          </p>
        </div>
      </footer>
    </div>
  );
}
