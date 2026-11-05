import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useReducedMotion } from '../hooks/useReducedMotion';

gsap.registerPlugin(ScrollTrigger);

interface Props {
  to: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
}

function format(v: number, decimals: number, prefix: string, suffix: string): string {
  return (
    prefix +
    v.toLocaleString('pt-BR', { minimumFractionDigits: decimals, maximumFractionDigits: decimals }) +
    suffix
  );
}

export default function Counter({ to, decimals = 0, prefix = '', suffix = '' }: Props) {
  const ref = useRef<HTMLSpanElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el || reduced) return;

    const state = { v: 0 };
    el.textContent = format(0, decimals, prefix, suffix);
    const tween = gsap.to(state, {
      v: to,
      duration: 1.8,
      ease: 'power2.out',
      scrollTrigger: { trigger: el, start: 'top 90%', once: true },
      onUpdate: () => {
        el.textContent = format(state.v, decimals, prefix, suffix);
      },
    });

    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
      el.textContent = format(to, decimals, prefix, suffix);
    };
  }, [to, decimals, prefix, suffix, reduced]);

  return <span ref={ref}>{format(to, decimals, prefix, suffix)}</span>;
}
