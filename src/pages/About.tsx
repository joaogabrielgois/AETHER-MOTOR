import { Link } from 'react-router-dom';
import { DEMO_NOTICE } from '../data/vehicles';

export default function About() {
  return (
    <section className="mx-auto max-w-4xl px-5 pb-24 pt-32 lg:px-8">
      <p className="eyebrow">Sobre a marca</p>
      <h1 className="mt-4 font-display text-5xl font-bold text-white md:text-7xl">Uma marca fictícia</h1>
      <p className="mt-4 text-sm text-silver">{DEMO_NOTICE}</p>

      <div className="mt-14 space-y-8 text-lg leading-relaxed text-steel/85">
        <p>
          A AETHER MOTORS existe apenas como conceito de design e engenharia: uma fabricante imaginária de veículos
          elétricos premium, desenhada para demonstrar linguagem visual, narrativa de produto e experiência digital.
        </p>
        <p>
          Os três modelos do catálogo, suas especificações, cores, opcionais e preços são invenções. Nenhum deles
          corresponde a produto, oferta ou disponibilidade real.
        </p>
        <p>
          Este projeto não utiliza marcas, logotipos ou modelos de fabricantes existentes e não se apresenta como
          site oficial de qualquer empresa.
        </p>
      </div>

      <div className="mt-14">
        <Link to="/contato" className="btn-ghost">
          Falar com a marca (demonstração)
        </Link>
      </div>
    </section>
  );
}
