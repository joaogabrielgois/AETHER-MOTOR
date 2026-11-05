import { DEMO_NOTICE } from '../data/vehicles';

const pillars = [
  {
    t: 'Bateria',
    d: 'Módulos de células cilíndricas de alta densidade, com gerenciamento térmico líquido e monitoramento individual de célula. Valores declarados são fictícios.',
    items: ['Capacidade de 82 a 104 kWh (conceito)', 'Recarga 10–80% em 16 a 22 min (conceito)', 'Pré-condicionamento térmico automático'],
  },
  {
    t: 'Materiais',
    d: 'Chassi híbrido de alumínio fundido e fibra de carbono nas áreas de maior rigidez, com foco em redução de massa e reparabilidade.',
    items: ['Alumínio de baixa emissão (conceito)', 'Fibra de carbono nas longarinas', 'Vidros laminados acústicos'],
  },
  {
    t: 'Experiência de condução',
    d: 'Tração integral com controle de torque por roda e suspensão adaptativa que responde a cada irregularidade da pista.',
    items: ['Modos de condução configuráveis', 'Direção de resposta variável', 'Assistência à condução de nível 2 (conceito)'],
  },
];

export default function Technology() {
  return (
    <section className="mx-auto max-w-7xl px-5 pb-24 pt-32 lg:px-8">
      <p className="eyebrow">Tecnologia</p>
      <h1 className="mt-4 font-display text-5xl font-bold text-white md:text-7xl">Engenharia do conceito</h1>
      <p className="mt-4 max-w-2xl text-silver">{DEMO_NOTICE}</p>

      <div className="mt-16 grid gap-6 lg:grid-cols-3">
        {pillars.map((p) => (
          <article key={p.t} className="rounded-2xl border border-white/5 bg-graphite p-8">
            <h2 className="font-display text-3xl font-bold text-white">{p.t}</h2>
            <p className="mt-4 text-sm leading-relaxed text-steel/80">{p.d}</p>
            <ul className="mt-6 space-y-2 border-t border-white/5 pt-6 text-sm text-silver">
              {p.items.map((i) => (
                <li key={i} className="flex gap-3">
                  <span aria-hidden="true" className="text-electric">
                    —
                  </span>
                  {i}
                </li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </section>
  );
}
