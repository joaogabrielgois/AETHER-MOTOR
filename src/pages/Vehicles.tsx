import { Link } from 'react-router-dom';
import VehicleSvg from '../components/VehicleSvg';
import { DEMO_NOTICE, vehicles } from '../data/vehicles';
import { formatBRL } from '../lib/configurator';

const showcase: Record<string, string> = {
  vela: '#c8cdd4',
  orbis: '#1f5fd6',
  nova: '#eeeeea',
};

export default function Vehicles() {
  return (
    <section className="mx-auto max-w-7xl px-5 pb-24 pt-32 lg:px-8">
      <p className="eyebrow">Catálogo conceitual</p>
      <h1 className="mt-4 font-display text-5xl font-bold text-white md:text-7xl">Modelos</h1>
      <p className="mt-4 max-w-2xl text-silver">{DEMO_NOTICE}</p>

      <ul className="mt-14 grid gap-8 md:grid-cols-2 xl:grid-cols-3">
        {vehicles.map((v) => (
          <li key={v.id}>
            <Link
              to={`/veiculos/${v.id}`}
              className="group relative block overflow-hidden rounded-2xl border border-white/5 bg-graphite p-6 transition hover:border-electric/40"
            >
              <div
                className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_70%,rgba(62,166,255,0.14),transparent_65%)] opacity-0 transition group-hover:opacity-100"
                aria-hidden="true"
              />
              <VehicleSvg
                body={v.body}
                color={showcase[v.id] ?? '#c8cdd4'}
                title={`Ilustração do ${v.name}`}
                className="relative transition duration-700 group-hover:scale-[1.04]"
              />
              <div className="relative mt-5 flex items-end justify-between gap-4">
                <div>
                  <h2 className="font-display text-2xl font-bold text-white">{v.name}</h2>
                  <p className="text-sm text-silver">{v.tagline}</p>
                </div>
                <span className="text-xs uppercase tracking-[0.2em] text-electric group-hover:underline">Ver →</span>
              </div>
              <p className="relative mt-4 text-sm text-steel">
                A partir de <span className="font-semibold text-white">{formatBRL(v.basePrice)}</span>
                <span className="ml-2 text-xs text-silver/70">(ilustrativo)</span>
              </p>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
