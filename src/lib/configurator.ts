import { DEMO_NOTICE, finishes, getVehicle, optionCatalog, palette } from '../data/vehicles';

export interface Configuration {
  vehicleId: string | null;
  colorId: string | null;
  finishId: string | null;
  optionIds: string[];
}

export interface PriceLine {
  label: string;
  amount: number;
}

const brl = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });

export const formatBRL = (value: number): string => brl.format(value);

export function missingFields(c: Configuration): string[] {
  const missing: string[] = [];
  if (!c.vehicleId) missing.push('modelo');
  if (!c.colorId) missing.push('cor');
  if (!c.finishId) missing.push('acabamento');
  return missing;
}

export function isComplete(c: Configuration): boolean {
  return missingFields(c).length === 0;
}

export function calculatePrice(c: Configuration): { lines: PriceLine[]; total: number } | null {
  const vehicle = getVehicle(c.vehicleId);
  if (!vehicle) return null;

  const lines: PriceLine[] = [{ label: vehicle.name, amount: vehicle.basePrice }];

  const color = palette.find((x) => x.id === c.colorId);
  if (color && color.extra > 0) {
    lines.push({ label: `Cor: ${color.name}`, amount: color.extra });
  }

  const finish = finishes.find((x) => x.id === c.finishId);
  if (finish && finish.extra > 0) {
    lines.push({ label: `Acabamento: ${finish.name}`, amount: finish.extra });
  }

  for (const id of c.optionIds) {
    const option = optionCatalog.find((o) => o.id === id);
    if (option) lines.push({ label: `Opcional: ${option.name}`, amount: option.price });
  }

  const total = lines.reduce((sum, line) => sum + line.amount, 0);
  return { lines, total };
}

/** Texto do download e da solicitação de proposta. Retorna null se a configuração estiver incompleta. */
export function buildSummary(c: Configuration): string | null {
  const price = calculatePrice(c);
  const vehicle = getVehicle(c.vehicleId);
  if (!price || !vehicle || !isComplete(c)) return null;

  const color = palette.find((x) => x.id === c.colorId);
  const finish = finishes.find((x) => x.id === c.finishId);
  const options = c.optionIds
    .map((id) => optionCatalog.find((o) => o.id === id))
    .filter((o): o is NonNullable<typeof o> => Boolean(o));

  return [
    'AETHER MOTORS: Resumo da configuração',
    DEMO_NOTICE,
    '',
    `Modelo: ${vehicle.name} (${vehicle.tagline})`,
    `Cor: ${color?.name ?? '-'}`,
    `Acabamento: ${finish?.name ?? '-'}`,
    'Opcionais:',
    ...(options.length ? options.map((o) => `  - ${o.name}`) : ['  - Nenhum']),
    '',
    'Valores ilustrativos:',
    ...price.lines.map((l) => `  ${l.label}: ${formatBRL(l.amount)}`),
    `Total ilustrativo: ${formatBRL(price.total)}`,
    '',
    'Especificações declaradas (fictícias):',
    ...vehicle.specs.map((s) => `  ${s.label}: ${s.value}`),
    '',
    `Gerado em: ${new Date().toLocaleString('pt-BR')}`,
  ].join('\n');
}
