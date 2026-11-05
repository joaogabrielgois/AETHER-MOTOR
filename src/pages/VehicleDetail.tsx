import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import VehicleSvg from '../components/VehicleSvg';
import CarStage from '../components/CarStage';
import { DEMO_NOTICE, getVehicle, palette, vehicles } from '../data/vehicles';
import { formatBRL } from '../lib/configurator';

export default function VehicleDetail() {
  const { id } = useParams();
  const vehicle = getVehicle(id);
  const [colorId, setColorId] = useState<string>('glacier');

  if (!vehicle) {
    return (
      <section className="flex min-h-[70vh] flex-col items-center justify-center gap-6 px-5 pt-24 text-center">
        <h1 className="font-display text-4xl font-bold text-white">Modelo não encontrado</h1>
        <Link to="/veiculos" className="btn-ghost">
          Ver todos os modelos
        </Link>
      </section>
    );
  }

  const color = palette.find((c) => c.id === colorId) ?? palette[1];
  const index = vehicles.findIndex((v) => v.id === vehicle.id);
  const next = vehicles[(index + 1) % vehicles.length];
  const headline = vehicle.specs.slice(0, 3);
  const rest = vehicle.specs.slice(3);

  return (
    <article className="pb-24 pt-28">
      <header className="mx-auto max-w-7xl px-5 lg:px-8">
        <nav aria-label="Caminho" className="text-xs uppercase tracking-[0.2em] text-silver">
          <Link to="/veiculos" className="hover:text-white">
            Modelos
          </Link>
          <span className="mx-2">/</span>
          <span className="text-steel">{vehicle.name}</span>
        </nav>
        <p className="eyebrow mt-8">{vehicle.tagline}</p>
        <h1 className="mt-3 font-display text-5xl font-bold tracking-monument text-white md:text-8xl">{vehicle.name}</h1>
      </header>

      <div className="relative mx-auto mt-8 max-w-6xl px-5 lg:px-8">
        <div
          className="pointer-events-none absolute inset-x-0 top-1/4 h-2/3 bg-[radial-gradient(ellipse_at_50%_50%,rgba(62,166,255,0.14),transparent_65%)]"
          aria-hidden="true"
        />
        <CarStage className="relative">
          <VehicleSvg
            body={vehicle.body}
            color={color.hex}
            finish="gloss"
            title={`Ilustração do ${vehicle.name} na cor ${color.name}`}
          />
        </CarStage>

        <div role="radiogroup" aria-label="Cor de pré-visualização" className="relative mt-4 flex flex-wrap items-center justify-center gap-3">
          {palette.map((c) => (
            <button
              key={c.id}
              type="button"
              role="radio"
              aria-checked={c.id === colorId}
              aria-label={c.name}
              onClick={() => setColorId(c.id)}
              className={`h-9 w-9 rounded-full border-2 transition ${
                c.id === colorId ? 'scale-110 border-electric' : 'border-white/20 hover:border-white/60'
              }`}
              style={{ background: c.hex }}
            />
          ))}
        </div>
        <p className="relative mt-3 text-center text-xs uppercase tracking-[0.2em] text-silver">{color.name}</p>
      </div>

      <div className="mx-auto mt-20 max-w-7xl px-5 lg:px-8">
        <dl className="grid gap-px overflow-hidden rounded-2xl border border-white/5 bg-white/5 md:grid-cols-3">
          {headline.map((s) => (
            <div key={s.label} className="bg-graphite p-8">
              <dd className="font-display text-4xl font-bold text-white md:text-5xl">{s.value}</dd>
              <dt className="mt-2 text-xs uppercase tracking-[0.2em] text-silver">{s.label}</dt>
            </div>
          ))}
        </dl>
      </div>

      <div className="mx-auto mt-16 grid max-w-7xl gap-14 px-5 lg:grid-cols-[1.2fr_1fr] lg:px-8">
        <div>
          <h2 className="font-display text-3xl font-bold text-white">Sobre o modelo</h2>
          <p className="mt-5 text-lg leading-relaxed text-steel/80">{vehicle.summary}</p>
          <dl className="mt-10 divide-y divide-white/5 border-y border-white/5">
            {rest.map((s) => (
              <div key={s.label} className="flex justify-between gap-4 py-4">
                <dt className="text-sm text-silver">{s.label}</dt>
                <dd className="text-sm font-semibold text-white">{s.value}</dd>
              </div>
            ))}
          </dl>
          <p className="mt-8 text-xs text-silver/70">{DEMO_NOTICE} Especificações declaradas, fictícias.</p>
        </div>

        <aside className="h-fit rounded-2xl border border-white/5 bg-graphite p-8">
          <p className="text-sm text-silver">Preço base ilustrativo</p>
          <p className="font-display text-4xl font-bold text-white">{formatBRL(vehicle.basePrice)}</p>
          <div className="mt-8 flex flex-col gap-3">
            <Link to={`/configurador?modelo=${vehicle.id}`} className="btn-primary">
              Configurar este modelo
            </Link>
            <Link to={`/veiculos/${next.id}`} className="btn-ghost">
              Ver {next.name}
            </Link>
          </div>
        </aside>
      </div>
    </article>
  );
}
