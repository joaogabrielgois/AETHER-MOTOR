import { useLayoutEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import VehicleSvg from '../components/VehicleSvg';
import campaignPhoto from './campaign.jpg';
import Counter from '../components/Counter';
import { useReducedMotion } from '../hooks/useReducedMotion';
import { DEMO_NOTICE, vehicles } from '../data/vehicles';
import { formatBRL } from '../lib/configurator';

gsap.registerPlugin(ScrollTrigger);

const chapters = [
  {
    title: 'Silêncio em movimento',
    text: 'Três motores elétricos independentes e uma suspensão adaptativa reduzem a vibração a níveis que você só percebe pelo que não ouve.',
  },
  {
    title: 'Energia que acompanha a viagem',
    text: 'Um pacote de bateria de 96 kWh com gerenciamento térmico ativo mantém o desempenho constante, da cidade à estrada.',
  },
  {
    title: 'Linhas desenhadas pela luz',
    text: 'Superfícies em alumínio e fibra de carbono, acabamentos em três tratamentos e iluminação que se revela ao aproximar-se.',
  },
];

const showcase: Record<string, string> = {
  vela: '#c8cdd4',
  orbis: '#1f5fd6',
  nova: '#eeeeea',
};

export default function Home() {
  const scope = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  useLayoutEffect(() => {
    if (reduced) return;

    const ctx = gsap.context(() => {
      gsap
        .timeline({ defaults: { ease: 'power4.out' } })
        .from('[data-hero-line]', { yPercent: 110, duration: 1.1, stagger: 0.12 })
        .from('[data-hero-car]', { opacity: 0, x: 120, duration: 1.5, ease: 'power3.out' }, '-=0.8')
        .from('[data-hero-fade]', { opacity: 0, y: 20, duration: 0.8, stagger: 0.1 }, '-=0.8');

      const panels = gsap.utils.toArray<HTMLElement>('[data-chapter]');
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: '[data-story]',
          start: 'top top',
          end: '+=2400',
          pin: true,
          scrub: 0.6,
        },
      });

      tl.fromTo('[data-story-car]', { xPercent: -10 }, { xPercent: 10, ease: 'none', duration: panels.length }, 0);

      panels.forEach((panel, i) => {
        tl.fromTo(panel, { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.6 }, i);
        if (i < panels.length - 1) {
          tl.to(panel, { opacity: 0, y: -40, duration: 0.4 }, i + 0.8);
        }
      });

      gsap.from('[data-reveal]', {
        opacity: 0,
        y: 50,
        duration: 0.9,
        ease: 'power3.out',
        stagger: 0.15,
        scrollTrigger: { trigger: '[data-lineup]', start: 'top 80%', once: true },
      });
    }, scope);

    return () => ctx.revert();
  }, [reduced]);

  return (
    <div ref={scope}>
      {/* Hero */}
      <section className="relative flex min-h-screen flex-col justify-end overflow-hidden pb-10 pt-24">
        <div className="bg-grid absolute inset-0" aria-hidden="true" />
        <div
          className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_35%,rgba(62,166,255,0.2),transparent_60%)]"
          aria-hidden="true"
        />

        <div className="relative mx-auto w-full max-w-7xl px-5 lg:px-8">
          <p data-hero-fade className="eyebrow mb-5">
            Conceito · Elétrico premium
          </p>
          <h1 className="font-display text-[16vw] font-bold leading-[0.88] tracking-monument md:text-[10vw]">
            <span className="block overflow-hidden pb-[0.04em]">
              <span data-hero-line className="text-chrome block">
                AETHER
              </span>
            </span>
            <span className="block overflow-hidden pb-[0.04em]">
              <span data-hero-line className="block text-electric/90">
                MOTORS
              </span>
            </span>
          </h1>
        </div>

        <div data-hero-car className="relative mx-auto mt-2 w-full max-w-6xl px-2">
          <img src={campaignPhoto} alt="Desenho conceitual de um hipercarro elétrico futurista azul" fetchPriority="high" width={1600} height={900} className="block h-auto w-full rounded-xl" />
        </div>

        <div className="relative mx-auto mt-2 flex w-full max-w-7xl flex-col gap-8 px-5 lg:flex-row lg:items-end lg:justify-between lg:px-8">
          <div data-hero-fade>
            <div className="flex flex-col gap-4 sm:flex-row">
              <Link to="/veiculos" className="btn-primary">
                Explorar modelos
              </Link>
              <Link to="/configurador" className="btn-ghost">
                Configurar um veículo
              </Link>
            </div>
            <p className="mt-5 max-w-md text-xs text-silver/70">{DEMO_NOTICE}</p>
          </div>

          <dl data-hero-fade className="grid grid-cols-3 gap-8 text-left lg:text-right">
            {[
              { v: 640, s: ' km', l: 'Autonomia' },
              { v: 2.8, s: ' s', l: '0–100 km/h', d: 1 },
              { v: 18, s: ' min', l: 'Recarga 10–80%' },
            ].map((x) => (
              <div key={x.l}>
                <dt className="text-[10px] uppercase tracking-[0.2em] text-silver">{x.l}</dt>
                <dd className="font-display text-3xl font-bold text-white md:text-4xl">
                  <Counter to={x.v} suffix={x.s} decimals={x.d ?? 0} />
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* Narrativa com scroll */}
      <section data-story className="relative h-screen overflow-hidden bg-graphite">
        <div
          className={
            reduced
              ? 'mx-auto grid max-w-5xl gap-10 px-5 py-24'
              : 'relative mx-auto flex h-full max-w-5xl flex-col justify-center px-5'
          }
        >
          {!reduced && (
            <div data-story-car className="pointer-events-none absolute inset-x-0 top-1/2 -translate-y-1/2 opacity-20">
              <VehicleSvg body="sedan" color="#8b929c" title="" reflection={false} />
            </div>
          )}
          <div className={reduced ? 'grid gap-10' : 'relative h-[50vh]'}>
            {chapters.map((c, i) => (
              <article key={c.title} data-chapter className={reduced ? '' : 'absolute inset-0 flex flex-col justify-center'}>
                <p className="eyebrow">{String(i + 1).padStart(2, '0')}</p>
                <h2 className="mt-4 font-display text-4xl font-bold text-white md:text-6xl">{c.title}</h2>
                <p className="mt-6 max-w-xl text-lg leading-relaxed text-steel/80">{c.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Linha de modelos */}
      <section data-lineup className="mx-auto max-w-7xl px-5 py-28 lg:px-8">
        <p className="eyebrow">A linha</p>
        <h2 className="mt-4 font-display text-4xl font-bold text-white md:text-6xl">Três formas de chegar</h2>
        <ul className="mt-14 grid gap-6 lg:grid-cols-3">
          {vehicles.map((v) => (
            <li key={v.id} data-reveal>
              <Link
                to={`/veiculos/${v.id}`}
                className="group relative block overflow-hidden rounded-2xl border border-white/5 bg-graphite p-6 transition hover:border-electric/40"
              >
                <div
                  className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_70%,rgba(62,166,255,0.12),transparent_65%)] opacity-0 transition group-hover:opacity-100"
                  aria-hidden="true"
                />
                <VehicleSvg
                  body={v.body}
                  color={showcase[v.id] ?? '#c8cdd4'}
                  title={`Ilustração do ${v.name}`}
                  className="relative transition duration-700 group-hover:scale-[1.04]"
                />
                <h3 className="relative mt-4 font-display text-2xl font-bold text-white">{v.name}</h3>
                <p className="relative text-sm text-silver">{v.tagline}</p>
                <p className="relative mt-3 text-sm text-steel">
                  A partir de {formatBRL(v.basePrice)} <span className="text-xs text-silver/70">(ilustrativo)</span>
                </p>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {/* Números */}
      <section className="border-y border-white/5 bg-graphite">
        <div className="mx-auto max-w-7xl px-5 py-20 lg:px-8">
          <dl className="grid grid-cols-2 gap-10 lg:grid-cols-4">
            {[
              { v: 610, s: ' kW', l: 'Potência máxima' },
              { v: 104, s: ' kWh', l: 'Bateria máxima' },
              { v: 2.8, s: ' s', l: 'Melhor 0–100 km/h', d: 1 },
              { v: 7, s: ' lugares', l: 'Na versão SUV' },
            ].map((x) => (
              <div key={x.l}>
                <dd className="font-display text-5xl font-bold text-white md:text-6xl">
                  <Counter to={x.v} suffix={x.s} decimals={x.d ?? 0} />
                </dd>
                <dt className="mt-2 text-xs uppercase tracking-[0.2em] text-silver">{x.l}</dt>
              </div>
            ))}
          </dl>
          <p className="mt-10 text-xs text-silver/70">Todos os valores são fictícios, para demonstração.</p>
        </div>
      </section>

      {/* Chamada final */}
      <section className="relative overflow-hidden">
        <div
          className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_100%,rgba(62,166,255,0.18),transparent_65%)]"
          aria-hidden="true"
        />
        <div className="relative mx-auto max-w-4xl px-5 py-32 text-center lg:px-8">
          <h2 className="font-display text-5xl font-bold tracking-monument text-white md:text-7xl">Monte o seu.</h2>
          <p className="mx-auto mt-6 max-w-xl text-steel/80">
            Escolha modelo, cor, acabamento e opcionais e veja o preço ilustrativo mudar em tempo real.
          </p>
          <div className="mt-10 flex flex-col justify-center gap-4 sm:flex-row">
            <Link to="/configurador" className="btn-primary">
              Abrir configurador
            </Link>
            <Link to="/tecnologia" className="btn-ghost">
              Ver a tecnologia
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
