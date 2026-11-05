// DADOS FICTÍCIOS: conteúdo de demonstração para um conceito de marca inexistente.
// Nenhum valor aqui representa produto real, oferta ou especificação verificada.

export type BodyType = 'sedan' | 'suv' | 'coupe';

export interface Vehicle {
  id: string;
  name: string;
  tagline: string;
  body: BodyType;
  basePrice: number;
  summary: string;
  specs: { label: string; value: string }[];
}

export interface Color {
  id: string;
  name: string;
  hex: string;
  extra: number;
}

export interface Finish {
  id: string;
  name: string;
  extra: number;
  description: string;
}

export interface OptionItem {
  id: string;
  name: string;
  price: number;
}

export const DEMO_NOTICE =
  'Demonstração conceitual: veículos, especificações, imagens e preços são fictícios.';

export const palette: Color[] = [
  { id: 'obsidian', name: 'Obsidian Black', hex: '#0b0c0f', extra: 0 },
  { id: 'glacier', name: 'Glacier Silver', hex: '#c8cdd4', extra: 0 },
  { id: 'pearl', name: 'Pearl White', hex: '#eeeeea', extra: 0 },
  { id: 'graphite', name: 'Graphite Grey', hex: '#3a3f47', extra: 2500 },
  { id: 'volt', name: 'Volt Blue', hex: '#1f5fd6', extra: 4000 },
];

export const finishes: Finish[] = [
  { id: 'satin', name: 'Cetim', extra: 0, description: 'Acabamento acetinado de baixo reflexo.' },
  { id: 'gloss', name: 'Espelhado', extra: 3000, description: 'Verniz de alto brilho com camada cerâmica.' },
  { id: 'matte', name: 'Fosco Premium', extra: 5000, description: 'Textura fosca com proteção antirrisco reforçada.' },
];

export const optionCatalog: OptionItem[] = [
  { id: 'roof', name: 'Teto panorâmico', price: 6500 },
  { id: 'wheels21', name: 'Rodas de 21"', price: 4200 },
  { id: 'interior', name: 'Interior em couro premium', price: 7800 },
  { id: 'audio', name: 'Sistema de áudio imersivo', price: 9000 },
  { id: 'adas', name: 'Pacote de assistência à condução', price: 5400 },
];

export const vehicles: Vehicle[] = [
  {
    id: 'vela',
    name: 'Aether Vela',
    tagline: 'Sedã de longo alcance',
    body: 'sedan',
    basePrice: 389000,
    summary:
      'Um sedã de proporções longas e linhas contínuas, pensado para viagens silenciosas e recargas rápidas entre cidades.',
    specs: [
      { label: 'Autonomia (ciclo fictício)', value: '640 km' },
      { label: '0–100 km/h', value: '3,4 s' },
      { label: 'Potência', value: '520 kW' },
      { label: 'Bateria', value: '96 kWh' },
      { label: 'Recarga 10–80%', value: '18 min' },
      { label: 'Tração', value: 'Integral' },
    ],
  },
  {
    id: 'orbis',
    name: 'Aether Orbis',
    tagline: 'SUV de sete lugares',
    body: 'suv',
    basePrice: 459000,
    summary:
      'Um utilitário de alta elevação com cabine ampla, teto de vidro e espaço para sete ocupantes sem abrir mão da esportividade.',
    specs: [
      { label: 'Autonomia (ciclo fictício)', value: '580 km' },
      { label: '0–100 km/h', value: '3,9 s' },
      { label: 'Potência', value: '480 kW' },
      { label: 'Bateria', value: '104 kWh' },
      { label: 'Recarga 10–80%', value: '22 min' },
      { label: 'Lugares', value: '7' },
    ],
  },
  {
    id: 'nova',
    name: 'Aether Nova GT',
    tagline: 'Coupé de alta performance',
    body: 'coupe',
    basePrice: 529000,
    summary:
      'Um coupé baixo e largo, com a menor resistência aerodinâmica da linha e resposta imediata do sistema de tração.',
    specs: [
      { label: 'Autonomia (ciclo fictício)', value: '420 km' },
      { label: '0–100 km/h', value: '2,8 s' },
      { label: 'Potência', value: '610 kW' },
      { label: 'Bateria', value: '82 kWh' },
      { label: 'Recarga 10–80%', value: '16 min' },
      { label: 'Tração', value: 'Integral' },
    ],
  },
];

export function getVehicle(id: string | null | undefined): Vehicle | undefined {
  if (!id) return undefined;
  return vehicles.find((v) => v.id === id);
}
