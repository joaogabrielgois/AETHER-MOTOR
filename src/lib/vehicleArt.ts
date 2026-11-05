// Ilustração vetorial ORIGINAL de veículos (vista lateral). Não é render fotográfico nem modelo 3D.
// Função pura que devolve SVG como texto: facilita testar e reutilizar. Entradas são só dados nossos
// (cores hex, ids fixos); o título é escapado.
import type { BodyType } from '../data/vehicles';

export interface CarArtOptions {
  body: BodyType;
  color: string;
  title: string;
  uid: string;
  finish?: string | null;
  bigWheels?: boolean;
  panoramic?: boolean;
  reflection?: boolean;
}

interface Shape {
  body: string;
  glass: string;
  pillars: string[];
  belt: string;
  seams: string[];
  handles: string[];
  head: string;
  tail: string;
  extra: string;
  wheels: [number, number, number][];
}

const GROUND = 274;

const shapes: Record<BodyType, Shape> = {
  sedan: {
    body:
      'M84 262 C76 250 76 232 88 222 L104 214 C140 208 180 204 222 196 C268 150 336 118 424 112 C510 106 584 122 636 154 C668 174 706 192 748 200 C792 208 824 220 832 240 C836 252 834 260 828 264 Z',
    glass: 'M240 192 C284 156 342 128 424 122 C496 117 552 130 594 156 L630 186 Z',
    pillars: ['M430 121 L434 188'],
    belt: 'M108 222 C200 214 300 207 430 204 C560 201 680 206 772 216',
    seams: ['M434 190 L430 258', 'M302 198 L296 258', 'M574 196 L584 258'],
    handles: ['M372 210 L402 209', 'M478 208 L508 207'],
    head: 'M776 214 L826 232',
    tail: 'M90 226 L120 218',
    extra: '',
    wheels: [
      [236, 242, 32],
      [700, 242, 32],
    ],
  },
  suv: {
    body:
      'M92 262 C84 250 82 218 90 186 C96 154 114 128 150 118 C200 104 280 100 350 100 L470 100 C540 102 596 118 632 144 L682 164 C752 168 806 186 828 224 C834 244 834 258 828 264 Z',
    glass: 'M182 172 C186 140 206 120 258 112 L468 106 C530 108 580 122 608 144 L630 170 Z',
    pillars: ['M262 111 L266 174', 'M398 106 L400 174'],
    belt: 'M108 192 C200 184 330 180 470 178 C580 176 690 176 774 192',
    seams: ['M400 176 L396 258', 'M266 176 L260 258', 'M598 178 L608 258'],
    handles: ['M336 192 L364 192', 'M448 191 L476 191'],
    head: 'M780 196 L826 216',
    tail: 'M94 168 L96 210',
    extra: '',
    wheels: [
      [240, 236, 38],
      [702, 236, 38],
    ],
  },
  coupe: {
    body:
      'M80 262 C72 250 74 236 88 226 L112 218 C158 212 212 204 270 190 C332 160 404 134 474 128 C534 124 584 134 624 154 L692 188 C764 198 808 210 828 228 C836 240 834 254 828 264 Z',
    glass: 'M302 188 C348 162 406 142 470 136 C526 132 568 140 600 158 L636 186 Z',
    pillars: ['M440 138 L448 188'],
    belt: 'M104 226 C200 214 330 202 460 198 C580 194 690 202 776 214',
    seams: ['M448 190 L444 258', 'M590 194 L600 258'],
    handles: ['M396 206 L424 205'],
    head: 'M778 210 L828 228',
    tail: 'M86 232 L116 222',
    extra: 'M94 224 L84 214 L146 208 Z',
    wheels: [
      [226, 240, 34],
      [706, 240, 34],
    ],
  },
};

const clamp = (n: number): number => Math.max(0, Math.min(255, Math.round(n)));

function parse(hex: string): [number, number, number] {
  const h = hex.replace('#', '');
  const f = h.length === 3 ? h.split('').map((c) => c + c).join('') : h;
  const n = parseInt(f, 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

function mix(hex: string, target: string, t: number): string {
  const a = parse(hex);
  const b = parse(target);
  return '#' + a.map((v, i) => clamp(v + (b[i] - v) * t).toString(16).padStart(2, '0')).join('');
}

const esc = (s: string): string =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

function wheel(cx: number, cy: number, r: number, rimRatio: number, u: string): string {
  const rim = r * rimRatio;
  let spokes = '';
  for (let i = 0; i < 10; i++) {
    const a = (i * 36 * Math.PI) / 180;
    const x1 = cx + Math.cos(a) * r * 0.2;
    const y1 = cy + Math.sin(a) * r * 0.2;
    const x2 = cx + Math.cos(a) * rim * 0.94;
    const y2 = cy + Math.sin(a) * rim * 0.94;
    spokes += `<line x1="${x1.toFixed(1)}" y1="${y1.toFixed(1)}" x2="${x2.toFixed(1)}" y2="${y2.toFixed(1)}" stroke="#10141a" stroke-width="${(r * 0.07).toFixed(1)}" stroke-linecap="round"/>`;
  }
  return `
  <g clip-path="url(#clip-${u})"><circle cx="${cx}" cy="${cy}" r="${r + 9}" fill="#040506"/></g>
  <circle cx="${cx}" cy="${cy}" r="${r}" fill="#0a0b0d"/>
  <circle cx="${cx}" cy="${cy}" r="${(r * 0.93).toFixed(1)}" fill="none" stroke="#1b1f25" stroke-width="1.5"/>
  <circle cx="${cx}" cy="${cy}" r="${rim.toFixed(1)}" fill="url(#rim-${u})"/>
  ${spokes}
  <circle cx="${cx}" cy="${cy}" r="${(r * 0.16).toFixed(1)}" fill="#0c1016" stroke="#3ea6ff" stroke-width="1.6"/>`;
}

export function vehicleSvg(o: CarArtOptions): string {
  const s = shapes[o.body];
  const u = o.uid;
  const finish = o.finish ?? 'satin';
  const sheen = finish === 'gloss' ? 0.38 : finish === 'matte' ? 0.05 : 0.2;
  const lum = (() => {
    const [r, g, b] = parse(o.color);
    return (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
  })();
  const dark = lum < 0.2;
  const top = mix(o.color, dark ? '#9fbfe0' : '#ffffff', finish === 'matte' ? 0.1 : dark ? 0.3 : 0.22);
  const mid = o.color;
  const bottom = mix(o.color, '#000000', 0.55);
  const rimRatio = o.bigWheels ? 0.8 : 0.7;
  const glassA = o.panoramic ? '#2b5b82' : '#1e2c39';
  const glassB = o.panoramic ? '#0c2236' : '#05080c';
  const showReflection = o.reflection !== false;

  const car = `
  <g id="car-${u}">
    <path d="${s.body}" fill="url(#body-${u})"/>
    ${s.extra ? `<path d="${s.extra}" fill="${bottom}"/>` : ''}
    <path d="${s.body}" fill="url(#sheen-${u})"/>
    <path d="${s.body}" fill="url(#shade-${u})"/>
    <path d="${s.body}" fill="none" stroke="${dark ? '#8fb8e8' : '#ffffff'}" stroke-opacity="${dark ? 0.4 : 0.14}" stroke-width="1.4"/>
    <path d="M120 256 L790 256 L790 264 L120 264 Z" fill="#000" opacity="0.45"/>
    <path d="${s.belt}" fill="none" stroke="#fff" stroke-opacity="${finish === 'matte' ? 0.1 : 0.34}" stroke-width="1.6" stroke-linecap="round"/>
    <path d="${s.glass}" fill="url(#glass-${u})"/>
    <path d="${s.glass}" fill="url(#glassref-${u})"/>
    ${s.pillars.map((p) => `<path d="${p}" stroke="${mix(o.color, '#000000', 0.35)}" stroke-width="7" fill="none"/>`).join('')}
    ${s.seams.map((p) => `<path d="${p}" stroke="#000" stroke-opacity="0.4" stroke-width="1.2" fill="none"/>`).join('')}
    ${s.handles.map((p) => `<path d="${p}" stroke="#fff" stroke-opacity="0.5" stroke-width="2.2" stroke-linecap="round" fill="none"/>`).join('')}
    <ellipse cx="832" cy="232" rx="64" ry="16" fill="url(#beam-${u})"/>
    <path d="${s.head}" stroke="#bfe3ff" stroke-width="4.5" stroke-linecap="round" fill="none" filter="url(#glow-${u})"/>
    <path d="${s.head}" stroke="#fff" stroke-width="2" stroke-linecap="round" fill="none"/>
    <path d="${s.tail}" stroke="#ff3d3d" stroke-width="4.5" stroke-linecap="round" fill="none" filter="url(#glow-${u})"/>
    ${s.wheels.map(([cx, cy, r]) => wheel(cx, cy, r, rimRatio, u)).join('')}
  </g>`;

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 340" role="img" aria-label="${esc(o.title)}" preserveAspectRatio="xMidYMid meet">
  <title>${esc(o.title)}</title>
  <defs>
    <linearGradient id="body-${u}" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="${top}"/><stop offset="0.45" stop-color="${mid}"/><stop offset="1" stop-color="${bottom}"/>
    </linearGradient>
    <linearGradient id="sheen-${u}" x1="0" y1="0" x2="1" y2="0.2">
      <stop offset="0.12" stop-color="#fff" stop-opacity="0"/>
      <stop offset="0.38" stop-color="#fff" stop-opacity="${sheen}"/>
      <stop offset="0.62" stop-color="#fff" stop-opacity="0"/>
      <stop offset="0.82" stop-color="#fff" stop-opacity="${(sheen * 0.5).toFixed(2)}"/>
      <stop offset="1" stop-color="#fff" stop-opacity="0"/>
    </linearGradient>
    <linearGradient id="shade-${u}" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0.7" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity="0.45"/>
    </linearGradient>
    <linearGradient id="glass-${u}" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="${glassA}"/><stop offset="1" stop-color="${glassB}"/>
    </linearGradient>
    <linearGradient id="glassref-${u}" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0.2" stop-color="#fff" stop-opacity="0"/><stop offset="0.45" stop-color="#fff" stop-opacity="0.16"/><stop offset="0.6" stop-color="#fff" stop-opacity="0"/>
    </linearGradient>
    <radialGradient id="rim-${u}" cx="0.4" cy="0.35" r="0.8">
      <stop offset="0" stop-color="#f3f5f8"/><stop offset="0.6" stop-color="#8d949e"/><stop offset="1" stop-color="#383d45"/>
    </radialGradient>
    <radialGradient id="beam-${u}">
      <stop offset="0" stop-color="#cfe9ff" stop-opacity="0.5"/><stop offset="1" stop-color="#cfe9ff" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="under-${u}">
      <stop offset="0" stop-color="#3ea6ff" stop-opacity="0.55"/><stop offset="1" stop-color="#3ea6ff" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="fade-${u}" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#fff" stop-opacity="0.5"/><stop offset="1" stop-color="#fff" stop-opacity="0"/>
    </linearGradient>
    <mask id="mask-${u}" maskUnits="userSpaceOnUse" x="0" y="${GROUND}" width="900" height="66">
      <rect x="0" y="${GROUND}" width="900" height="66" fill="url(#fade-${u})"/>
    </mask>
    <clipPath id="clip-${u}"><path d="${s.body}"/></clipPath>
    <filter id="glow-${u}" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="3"/></filter>
    <filter id="soft-${u}" x="-20%" y="-200%" width="140%" height="500%"><feGaussianBlur stdDeviation="6"/></filter>
  </defs>
  <ellipse cx="450" cy="${GROUND + 2}" rx="380" ry="16" fill="url(#under-${u})"/>
  <ellipse cx="450" cy="${GROUND + 1}" rx="360" ry="9" fill="#000" opacity="0.7" filter="url(#soft-${u})"/>
  ${showReflection ? `<g mask="url(#mask-${u})"><use href="#car-${u}" transform="translate(0 ${GROUND * 2}) scale(1 -1)" opacity="0.5"/></g>` : ''}
  ${car}
</svg>`;
}
