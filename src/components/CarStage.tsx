import { useRef, type PointerEvent, type ReactNode } from 'react';
import { useReducedMotion } from '../hooks/useReducedMotion';

interface Props {
  children: ReactNode;
  className?: string;
}

// Inclinação sutil acompanhando o mouse. Desligada com prefers-reduced-motion e em toque.
export default function CarStage({ children, className = '' }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  function onMove(e: PointerEvent<HTMLDivElement>) {
    if (reduced || e.pointerType === 'touch') return;
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    el.style.transform = `perspective(1200px) rotateY(${(x * 7).toFixed(2)}deg) rotateX(${(-y * 4).toFixed(2)}deg)`;
  }

  function reset() {
    if (ref.current) ref.current.style.transform = '';
  }

  return (
    <div className={className} onPointerMove={onMove} onPointerLeave={reset}>
      <div ref={ref} style={{ transition: 'transform 250ms ease-out', willChange: 'transform' }}>
        {children}
      </div>
    </div>
  );
}
