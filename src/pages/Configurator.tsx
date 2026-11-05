import { useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import VehicleSvg from '../components/VehicleSvg';
import CarStage from '../components/CarStage';
import { DEMO_NOTICE, finishes, getVehicle, optionCatalog, palette, vehicles } from '../data/vehicles';
import {
  buildSummary,
  calculatePrice,
  formatBRL,
  isComplete,
  missingFields,
  type Configuration,
} from '../lib/configurator';

const fieldNames: Record<string, string> = { modelo: 'modelo', cor: 'cor', acabamento: 'acabamento' };

export default function Configurator() {
  const [params] = useSearchParams();
  const navigate = useNavigate();

  const requestedModel = params.get('modelo');
  const [config, setConfig] = useState<Configuration>({
    vehicleId: getVehicle(requestedModel) ? requestedModel : null,
    colorId: null,
    finishId: null,
    optionIds: [],
  });
  const [attempted, setAttempted] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  const price = useMemo(() => calculatePrice(config), [config]);
  const selectedVehicle = getVehicle(config.vehicleId);
  const previewVehicle = selectedVehicle ?? vehicles[0];
  const colorObj = palette.find((c) => c.id === config.colorId);
  const finishObj = finishes.find((f) => f.id === config.finishId);
  const previewColor = colorObj?.hex ?? '#4a5059';
  const missing = missingFields(config);
  const complete = isComplete(config);

  function toggleOption(id: string) {
    setConfig((c) => ({
      ...c,
      optionIds: c.optionIds.includes(id) ? c.optionIds.filter((x) => x !== id) : [...c.optionIds, id],
    }));
    setNotice(null);
  }

  function validationMessage(): string {
    return `Falta selecionar: ${missing.map((m) => fieldNames[m]).join(', ')}.`;
  }

  function downloadSummary() {
    setAttempted(true);
    const text = buildSummary(config);
    if (!text) {
      setNotice(validationMessage());
      return;
    }
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `aether-configuracao-${config.vehicleId}.txt`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    setNotice('Resumo baixado.');
  }

  function requestProposal() {
    setAttempted(true);
    const text = buildSummary(config);
    if (!text) {
      setNotice(validationMessage());
      return;
    }
    navigate('/contato', { state: { configuration: text } });
  }

  return (
    <section className="mx-auto max-w-7xl px-5 pb-24 pt-28 lg:px-8">
      <p className="eyebrow">Configurador</p>
      <h1 className="mt-3 font-display text-5xl font-bold text-white md:text-7xl">Monte o seu</h1>
      <p className="mt-3 max-w-2xl text-sm text-silver">{DEMO_NOTICE} Preços ilustrativos, sem valor de oferta.</p>

      <div className="mt-12 grid gap-10 lg:grid-cols-[1.4fr_1fr]">
        <div className="space-y-10">
          {/* Visual */}
          <div className="relative overflow-hidden rounded-2xl border border-white/5 bg-graphite p-6">
            <div
              className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_80%,rgba(62,166,255,0.16),transparent_65%)]"
              aria-hidden="true"
            />
            <CarStage className="relative">
              <VehicleSvg
                body={previewVehicle.body}
                color={previewColor}
                finish={config.finishId}
                bigWheels={config.optionIds.includes('wheels21')}
                panoramic={config.optionIds.includes('roof')}
                title={
                  selectedVehicle
                    ? `${selectedVehicle.name} na cor ${colorObj?.name ?? 'não selecionada'}`
                    : 'Selecione um modelo'
                }
              />
            </CarStage>
            <p className="relative mt-2 text-center text-xs uppercase tracking-[0.2em] text-silver">
              {selectedVehicle ? selectedVehicle.name : 'Selecione um modelo'}
              {colorObj ? ` · ${colorObj.name}` : ''}
              {finishObj ? ` · ${finishObj.name}` : ''}
            </p>
          </div>

          {/* Modelo */}
          <fieldset>
            <legend className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-white">1. Modelo</legend>
            <div role="radiogroup" aria-label="Modelo" className="grid gap-3 md:grid-cols-3">
              {vehicles.map((v) => {
                const checked = config.vehicleId === v.id;
                return (
                  <button
                    key={v.id}
                    type="button"
                    role="radio"
                    aria-checked={checked}
                    onClick={() => {
                      setConfig((c) => ({ ...c, vehicleId: v.id }));
                      setNotice(null);
                    }}
                    className={`rounded-xl border p-4 text-left transition ${
                      checked ? 'border-electric bg-electric/10 text-white' : 'border-white/10 text-steel hover:border-white/30'
                    }`}
                  >
                    <span className="block font-semibold">{v.name}</span>
                    <span className="block text-xs text-silver">{formatBRL(v.basePrice)}</span>
                  </button>
                );
              })}
            </div>
          </fieldset>

          {/* Cor */}
          <fieldset>
            <legend className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-white">2. Cor</legend>
            <div role="radiogroup" aria-label="Cor" className="flex flex-wrap gap-3">
              {palette.map((c) => {
                const checked = config.colorId === c.id;
                return (
                  <button
                    key={c.id}
                    type="button"
                    role="radio"
                    aria-checked={checked}
                    aria-label={`${c.name}${c.extra ? `, +${formatBRL(c.extra)}` : ''}`}
                    onClick={() => {
                      setConfig((cfg) => ({ ...cfg, colorId: c.id }));
                      setNotice(null);
                    }}
                    className={`flex items-center gap-3 rounded-full border py-2 pl-2 pr-4 text-sm transition ${
                      checked ? 'border-electric text-white' : 'border-white/10 text-steel hover:border-white/30'
                    }`}
                  >
                    <span className="h-6 w-6 rounded-full border border-white/20" style={{ background: c.hex }} aria-hidden="true" />
                    {c.name}
                    {c.extra > 0 && <span className="text-xs text-silver">+{formatBRL(c.extra)}</span>}
                  </button>
                );
              })}
            </div>
          </fieldset>

          {/* Acabamento */}
          <fieldset>
            <legend className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-white">3. Acabamento</legend>
            <div role="radiogroup" aria-label="Acabamento" className="grid gap-3 md:grid-cols-3">
              {finishes.map((f) => {
                const checked = config.finishId === f.id;
                return (
                  <button
                    key={f.id}
                    type="button"
                    role="radio"
                    aria-checked={checked}
                    onClick={() => {
                      setConfig((c) => ({ ...c, finishId: f.id }));
                      setNotice(null);
                    }}
                    className={`rounded-xl border p-4 text-left transition ${
                      checked ? 'border-electric bg-electric/10 text-white' : 'border-white/10 text-steel hover:border-white/30'
                    }`}
                  >
                    <span className="block font-semibold">
                      {f.name}
                      {f.extra > 0 && <span className="ml-2 text-xs font-normal text-silver">+{formatBRL(f.extra)}</span>}
                    </span>
                    <span className="mt-1 block text-xs text-silver">{f.description}</span>
                  </button>
                );
              })}
            </div>
          </fieldset>

          {/* Opcionais */}
          <fieldset>
            <legend className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-white">4. Opcionais</legend>
            <div className="grid gap-3 md:grid-cols-2">
              {optionCatalog.map((o) => {
                const checked = config.optionIds.includes(o.id);
                return (
                  <label
                    key={o.id}
                    className={`flex cursor-pointer items-center justify-between gap-4 rounded-xl border p-4 transition ${
                      checked ? 'border-electric bg-electric/10 text-white' : 'border-white/10 text-steel hover:border-white/30'
                    }`}
                  >
                    <span className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        className="h-4 w-4 accent-electric"
                        checked={checked}
                        onChange={() => toggleOption(o.id)}
                      />
                      {o.name}
                    </span>
                    <span className="text-xs text-silver">+{formatBRL(o.price)}</span>
                  </label>
                );
              })}
            </div>
          </fieldset>
        </div>

        {/* Resumo */}
        <aside aria-labelledby="resumo-titulo" className="h-fit rounded-2xl border border-white/5 bg-graphite p-8 lg:sticky lg:top-24">
          <h2 id="resumo-titulo" className="font-display text-2xl font-bold text-white">
            Resumo
          </h2>

          {!price ? (
            <p className="mt-6 text-sm text-silver">Escolha um modelo para ver o preço ilustrativo.</p>
          ) : (
            <ul className="mt-6 space-y-3 text-sm" aria-live="polite">
              {price.lines.map((l) => (
                <li key={l.label} className="flex justify-between gap-4">
                  <span className="text-steel">{l.label}</span>
                  <span className="text-white">{formatBRL(l.amount)}</span>
                </li>
              ))}
            </ul>
          )}

          {price && (
            <div className="mt-6 flex items-end justify-between border-t border-white/10 pt-5">
              <span className="text-sm text-silver">Total ilustrativo</span>
              <span className="font-display text-3xl font-bold text-white" aria-live="polite">
                {formatBRL(price.total)}
              </span>
            </div>
          )}

          {attempted && !complete && (
            <p role="alert" className="mt-6 rounded-lg border border-amber-400/30 bg-amber-400/10 p-3 text-sm text-amber-200">
              {validationMessage()}
            </p>
          )}

          {notice && complete && (
            <p role="status" className="mt-6 text-sm text-electric">
              {notice}
            </p>
          )}

          <div className="mt-8 flex flex-col gap-3">
            <button type="button" className="btn-primary" onClick={requestProposal}>
              Solicitar proposta
            </button>
            <button type="button" className="btn-ghost" onClick={downloadSummary}>
              Baixar resumo (.txt)
            </button>
          </div>
          <p className="mt-6 text-xs text-silver/70">
            O resumo inclui modelo, opções, preços ilustrativos e especificações fictícias. A solicitação de proposta
            segue para o formulário de contato, que exige seus dados antes de qualquer envio.
          </p>
        </aside>
      </div>
    </section>
  );
}
