import { lazy, Suspense, useEffect } from 'react';
import { Link, Route, Routes, useLocation } from 'react-router-dom';
import Layout from './components/Layout';

const Home = lazy(() => import('./pages/Home'));
const Vehicles = lazy(() => import('./pages/Vehicles'));
const VehicleDetail = lazy(() => import('./pages/VehicleDetail'));
const Configurator = lazy(() => import('./pages/Configurator'));
const Technology = lazy(() => import('./pages/Technology'));
const About = lazy(() => import('./pages/About'));
const Contact = lazy(() => import('./pages/Contact'));

function ScrollReset() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  }, [pathname]);
  return null;
}

function NotFound() {
  return (
    <section className="flex min-h-[70vh] flex-col items-center justify-center gap-6 px-5 pt-16 text-center">
      <p className="eyebrow">Erro 404</p>
      <h1 className="font-display text-5xl font-bold text-white">Página não encontrada</h1>
      <Link to="/" className="btn-ghost">
        Voltar ao início
      </Link>
    </section>
  );
}

export default function App() {
  return (
    <>
      <ScrollReset />
      <Suspense fallback={<div className="flex min-h-screen items-center justify-center text-silver">Carregando…</div>}>
        <Routes>
          <Route element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="veiculos" element={<Vehicles />} />
            <Route path="veiculos/:id" element={<VehicleDetail />} />
            <Route path="configurador" element={<Configurator />} />
            <Route path="tecnologia" element={<Technology />} />
            <Route path="sobre" element={<About />} />
            <Route path="contato" element={<Contact />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </Suspense>
    </>
  );
}
