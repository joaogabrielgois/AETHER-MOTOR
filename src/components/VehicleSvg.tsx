import { useId, useMemo } from 'react';
import type { BodyType } from '../data/vehicles';
import { vehicleSvg } from '../lib/vehicleArt';

interface Props {
  body: BodyType;
  color: string;
  title: string;
  className?: string;
  finish?: string | null;
  bigWheels?: boolean;
  panoramic?: boolean;
  reflection?: boolean;
}

// Ilustração vetorial original. Não é render fotográfico nem modelo 3D.
// O SVG é gerado a partir de dados internos (cores hex fixas e título escapado).
export default function VehicleSvg({ body, color, title, className = '', finish, bigWheels, panoramic, reflection }: Props) {
  const uid = useId().replace(/[^a-zA-Z0-9]/g, '');
  const html = useMemo(
    () => vehicleSvg({ body, color, title, uid, finish, bigWheels, panoramic, reflection }),
    [body, color, title, uid, finish, bigWheels, panoramic, reflection],
  );

  return (
    <div
      className={`[&>svg]:block [&>svg]:h-auto [&>svg]:w-full ${className}`}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
