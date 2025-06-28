import React, { SVGProps, useLayoutEffect, useRef, useState } from 'react';

import { SaciRoom } from '@/lib/saci/types';

interface SvgTextFitOptions {
  padding?: number; // espaço interno
  maxFontSize?: number; // tamanho máximo de fonte
  minFontSize?: number; // tamanho mínimo de fonte
  fontFamily?: string; // família tipográfica
}

interface FitResult {
  fontSize: number;
  fittedText: string;
}

/**
 * Hook para ajustar texto dentro de um box SVG:
 * - Encontra, por busca binária, o maior fontSize que caiba em width×height.
 * - Se mesmo no minFontSize o texto ultrapassar a largura, trunca com '…'.
 */
function useSvgTextFit(
  text: string,
  width: number,
  height: number,
  { padding = 4, maxFontSize = 14, minFontSize = 8, fontFamily = 'sans-serif' }: SvgTextFitOptions = {}
): FitResult {
  const [result, setResult] = useState<FitResult>({
    fontSize: minFontSize,
    fittedText: text
  });
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useLayoutEffect(() => {
    if (!canvasRef.current) {
      canvasRef.current = document.createElement('canvas');
    }
    const ctx = canvasRef.current.getContext('2d')!;
    const availW = Math.max(0, width - 2 * padding);
    const availH = Math.max(0, height - 2 * padding);

    // Busca binária do fontSize ideal
    let low = minFontSize;
    let high = maxFontSize;
    let best = minFontSize;
    while (low <= high) {
      const mid = Math.floor((low + high) / 2);
      ctx.font = `${mid}px ${fontFamily}`;
      if (ctx.measureText(text).width <= availW && mid <= availH) {
        best = mid;
        low = mid + 1;
      } else {
        high = mid - 1;
      }
    }

    // Truncamento binário com '…' se precisar
    ctx.font = `${best}px ${fontFamily}`;
    let finalText = text;
    if (ctx.measureText(finalText).width > availW) {
      let lo = 0;
      let hi = text.length;
      while (lo < hi) {
        const mid = Math.ceil((lo + hi) / 2);
        const candidate = text.slice(0, mid) + '…';
        if (ctx.measureText(candidate).width <= availW) {
          lo = mid;
        } else {
          hi = mid - 1;
        }
      }
      finalText = text.slice(0, lo) + '…';
    }

    setResult({ fontSize: best, fittedText: finalText });
  }, [text, width, height, padding, minFontSize, maxFontSize, fontFamily]);

  return result;
}

type SVGRectProps = SVGProps<SVGRectElement> & {
  x: number;
  y: number;
  width: number;
  height: number;
  codigo: string;
  saci?: SaciRoom;
  onClick?: (sala: { x: number; y: number; width: number; height: number; codigo: string; saci?: SaciRoom }) => void;
};

/**
 * Componente Sala:
 * - Desenha um <rect> e um <text> centralizado dentro dele.
 * - Usa useSvgTextFit para garantir que o texto ocupe o máximo de espaço possível.
 */
const Sala: React.FC<SVGRectProps> = ({ x, y, width, height, codigo, saci, onClick, ...rest }) => {
  // Omitir o texto se for "Corredor" ou "Copa"
  const omitText = codigo.trim().toLowerCase() === 'corredor' || codigo.trim().toLowerCase() === 'copa';
  const { fontSize, fittedText } = useSvgTextFit(codigo, width, height, {
    padding: 4,
    maxFontSize: 14,
    minFontSize: 8,
    fontFamily: 'sans-serif'
  });

  const commonRect = {
    x,
    y,
    width,
    height,
    rx: 2,
    stroke: '#d1d5db',
    strokeWidth: 1,
    ...rest
  };
  const fillColor = saci ? '#f3f4f6' : '#ffffff';
  const fillClass = saci
    ? 'transition-colors duration-200 fill-gray-100 hover:fill-gray-200 focus:fill-gray-200 cursor-pointer outline-none'
    : 'fill-white';

  return (
    <g
      role={saci ? 'button' : undefined}
      tabIndex={saci ? 0 : undefined}
      aria-label={saci ? `Detalhes da sala ${codigo}` : undefined}
      onClick={saci ? () => onClick?.({ x, y, width, height, codigo, saci }) : undefined}
      style={saci ? { cursor: 'pointer' } : undefined}>
      <rect {...commonRect} fill={fillColor} className={fillClass} />
      <title>{codigo}</title>
      {!omitText && (
        <text
          x={x + width / 2}
          y={y + height / 2}
          textAnchor='middle'
          dominantBaseline='middle'
          fontSize={fontSize}
          fontFamily='sans-serif'
          fill='#374151'
          className='pointer-events-none font-medium select-none'>
          {fittedText}
        </text>
      )}
    </g>
  );
};

export default Sala;
