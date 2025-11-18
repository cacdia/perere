import React, { SVGProps, useLayoutEffect, useRef, useState } from 'react';

import { SaciRoom } from '@/lib/saci/types';

import {
  ArrowUpDown,
  Book,
  BookOpen,
  Briefcase,
  Coffee,
  type LucideProps,
  Monitor,
  Package,
  Search,
  UserRound,
  Users,
  Wrench
} from 'lucide-react';

interface SvgTextFitOptions {
  padding?: number;
  maxFontSize?: number;
  minFontSize?: number;
  fontFamily?: string;
}

interface FitResult {
  fontSize: number;
  fittedText: string;
}

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

type RoomType =
  | 'classroom'
  | 'corridor'
  | 'office'
  | 'facility'
  | 'stairs'
  | 'library'
  | 'administrative'
  | 'social'
  | 'professor'
  | 'lab'
  | 'auditorium'
  | 'storage';

function detectRoomType(codigo: string, hasDocentes?: boolean): RoomType {
  const lower = codigo.trim().toLowerCase();

  if (lower.includes('escada') || lower.includes('eleva')) return 'stairs';
  if (lower.includes('corredor')) return 'corridor';

  if (['banheiro', 'wc', 'copa'].some((term) => lower.includes(term))) return 'facility';
  if (['almoxarifado', 'depósito'].some((term) => lower.includes(term))) return 'storage';

  if (lower.includes('biblioteca')) return 'library';

  if (['diretoria', 'assessoria', 'secretaria'].some((term) => lower.includes(term))) return 'administrative';

  if (lower.includes('auditório')) return 'auditorium';
  if (lower.includes('convivência')) return 'social';

  if (['cacdia', 'cadia', 'cas', 'ca '].some((term) => lower.includes(term)) || lower.startsWith('ca')) return 'office';

  if (
    ['lab', 'lmi', 'lia', 'lamoc', 'lamep', 'laporte', 'lar', 'lumo', 'visio', 'lasid', 'pet'].some((term) =>
      lower.includes(term)
    )
  )
    return 'lab';

  if (/ci\s*3\d{2}/.test(lower)) return 'lab';

  if (/ci\s*(t|sb|1|2)/.test(lower) || /^(t|sb|1|2)\d{2}$/.test(lower) || lower.startsWith('ci ')) {
    return hasDocentes ? 'professor' : 'classroom';
  }

  return 'classroom';
}

// Desaturated, sober, and clearly distinct palette for each room type.
// The goal is to provide high contrast and avoid similar hues between different room types.
// Corridor and stairs intentionally keep their original palette to obey the user's requirement.
const ROOM_PALETTE = {
  classroom: {
    light: { fill: 'fill-blue-100', stroke: 'stroke-blue-700', text: 'fill-blue-900' },
    dark: { fill: 'dark:fill-blue-900', stroke: 'dark:stroke-blue-400', text: 'dark:fill-blue-100' },
    hover: { fill: 'hover:fill-blue-200', darkFill: 'dark:hover:fill-blue-800' },
    focus: { fill: 'focus:fill-blue-300', darkFill: 'dark:focus:fill-blue-700' },
    icon: '',
    iconCircle: 'fill-blue-100',
    iconStroke: 'stroke-blue-700'
  },
  lab: {
    light: { fill: 'fill-indigo-100', stroke: 'stroke-indigo-700', text: 'fill-indigo-900' },
    dark: { fill: 'dark:fill-indigo-900', stroke: 'dark:stroke-indigo-400', text: 'dark:fill-indigo-100' },
    hover: { fill: 'hover:fill-indigo-200', darkFill: 'dark:hover:fill-indigo-800' },
    focus: { fill: 'focus:fill-indigo-300', darkFill: 'dark:focus:fill-indigo-700' },
    icon: '',
    iconCircle: 'fill-indigo-100',
    iconStroke: 'stroke-indigo-700'
  },
  professor: {
    light: { fill: 'fill-emerald-100', stroke: 'stroke-emerald-700', text: 'fill-emerald-900' },
    dark: { fill: 'dark:fill-emerald-900', stroke: 'dark:stroke-emerald-400', text: 'dark:fill-emerald-100' },
    hover: { fill: 'hover:fill-emerald-200', darkFill: 'dark:hover:fill-emerald-800' },
    focus: { fill: 'focus:fill-emerald-300', darkFill: 'dark:focus:fill-emerald-700' },
    icon: '',
    iconCircle: 'fill-emerald-100',
    iconStroke: 'stroke-emerald-700'
  },
  administrative: {
    light: { fill: 'fill-slate-200', stroke: 'stroke-slate-700', text: 'fill-slate-900' },
    dark: { fill: 'dark:fill-slate-800', stroke: 'dark:stroke-slate-400', text: 'dark:fill-slate-100' },
    hover: { fill: 'hover:fill-slate-300', darkFill: 'dark:hover:fill-slate-700' },
    focus: { fill: 'focus:fill-slate-400', darkFill: 'dark:focus:fill-slate-600' },
    icon: '',
    iconCircle: 'fill-slate-200',
    iconStroke: 'stroke-slate-700'
  },
  office: {
    light: { fill: 'fill-amber-100', stroke: 'stroke-amber-700', text: 'fill-amber-900' },
    dark: { fill: 'dark:fill-amber-900', stroke: 'dark:stroke-amber-400', text: 'dark:fill-amber-100' },
    hover: { fill: 'hover:fill-amber-200', darkFill: 'dark:hover:fill-amber-800' },
    focus: { fill: 'focus:fill-amber-300', darkFill: 'dark:focus:fill-amber-700' },
    icon: '',
    iconCircle: 'fill-amber-100',
    iconStroke: 'stroke-amber-700'
  },
  library: {
    light: { fill: 'fill-lime-100', stroke: 'stroke-lime-700', text: 'fill-lime-900' },
    dark: { fill: 'dark:fill-lime-800', stroke: 'dark:stroke-lime-400', text: 'dark:fill-lime-100' },
    hover: { fill: 'hover:fill-lime-200', darkFill: 'dark:hover:fill-lime-700' },
    focus: { fill: 'focus:fill-lime-300', darkFill: 'dark:focus:fill-lime-600' },
    icon: '',
    iconCircle: 'fill-lime-100',
    iconStroke: 'stroke-lime-700'
  },
  auditorium: {
    light: { fill: 'fill-rose-100', stroke: 'stroke-rose-700', text: 'fill-rose-900' },
    dark: { fill: 'dark:fill-rose-900', stroke: 'dark:stroke-rose-400', text: 'dark:fill-rose-100' },
    hover: { fill: 'hover:fill-rose-200', darkFill: 'dark:hover:fill-rose-800' },
    focus: { fill: 'focus:fill-rose-300', darkFill: 'dark:focus:fill-rose-700' },
    icon: '',
    iconCircle: 'fill-rose-100',
    iconStroke: 'stroke-rose-700'
  },
  social: {
    light: { fill: 'fill-fuchsia-100', stroke: 'stroke-fuchsia-700', text: 'fill-fuchsia-900' },
    dark: { fill: 'dark:fill-fuchsia-900', stroke: 'dark:stroke-fuchsia-400', text: 'dark:fill-fuchsia-100' },
    hover: { fill: 'hover:fill-fuchsia-200', darkFill: 'dark:hover:fill-fuchsia-800' },
    focus: { fill: 'focus:fill-fuchsia-300', darkFill: 'dark:focus:fill-fuchsia-700' },
    icon: '',
    iconCircle: 'fill-fuchsia-100',
    iconStroke: 'stroke-fuchsia-700'
  },
  facility: {
    light: { fill: 'fill-cyan-100', stroke: 'stroke-cyan-700', text: 'fill-cyan-900' },
    dark: { fill: 'dark:fill-cyan-900', stroke: 'dark:stroke-cyan-400', text: 'dark:fill-cyan-100' },
    hover: { fill: 'hover:fill-cyan-200', darkFill: 'dark:hover:fill-cyan-800' },
    focus: { fill: 'focus:fill-cyan-300', darkFill: 'dark:focus:fill-cyan-700' },
    icon: '',
    iconCircle: 'fill-cyan-100',
    iconStroke: 'stroke-cyan-700'
  },
  storage: {
    light: { fill: 'fill-stone-200', stroke: 'stroke-stone-700', text: 'fill-stone-900' },
    dark: { fill: 'dark:fill-stone-800', stroke: 'dark:stroke-stone-400', text: 'dark:fill-stone-100' },
    hover: { fill: 'hover:fill-stone-300', darkFill: 'dark:hover:fill-stone-700' },
    focus: { fill: 'focus:fill-stone-400', darkFill: 'dark:focus:fill-stone-600' },
    icon: '',
    iconCircle: 'fill-stone-200',
    iconStroke: 'stroke-stone-700'
  },
  corridor: {
    light: { fill: 'fill-[#E0E0E0]', stroke: 'stroke-[#999999]', text: 'fill-[#666666]' },
    dark: { fill: 'dark:fill-[#2A2A2A]', stroke: 'dark:stroke-[#666666]', text: 'dark:fill-[#AAAAAA]' },
    hover: { fill: 'hover:fill-[#D5D5D5]', darkFill: 'dark:hover:fill-[#333333]' },
    focus: { fill: 'focus:fill-[#CACACA]', darkFill: 'dark:focus:fill-[#3D3D3D]' },
    icon: '',
    iconCircle: ''
  },
  stairs: {
    light: { fill: 'fill-[#D5D5D5]', stroke: 'stroke-[#999999]', text: 'fill-[#666666]' },
    dark: { fill: 'dark:fill-[#3E2723]', stroke: 'dark:stroke-[#A1887F]', text: 'dark:fill-[#D7CCC8]' },
    hover: { fill: 'hover:fill-[#C8C8C8]', darkFill: 'dark:hover:fill-[#4E342E]' },
    focus: { fill: 'focus:fill-[#BBBBBB]', darkFill: 'dark:focus:fill-[#5D4037]' },
    icon: '',
    iconCircle: ''
  }
} as const;

function getRoomColors(
  type: RoomType,
  isClickable: boolean
): {
  fill: string;
  fillHover: string;
  fillFocus: string;
  stroke: string;
  text: string;
  iconFill: string;
  iconCircleFill: string;
  iconStroke?: string;
} {
  const p = ROOM_PALETTE[type];
  return {
    fill: `${p.light.fill} ${p.dark.fill}`,
    fillHover: isClickable ? `${p.hover.fill} ${p.hover.darkFill}` : '',
    fillFocus: isClickable ? `${p.focus.fill} ${p.focus.darkFill}` : '',
    stroke: `${p.light.stroke} ${p.dark.stroke}`,
    text: `${p.light.text} ${p.dark.text}`,
    iconFill: '',
    iconCircleFill: p.iconCircle,
    iconStroke: 'iconStroke' in p && typeof p.iconStroke === 'string' ? p.iconStroke : ''
  };
}

function getRoomIcon(type: RoomType): React.ComponentType<LucideProps> | null {
  const iconMap: Record<RoomType, React.ComponentType<LucideProps> | null> = {
    classroom: BookOpen,
    corridor: null,
    office: Monitor,
    facility: Wrench,
    storage: Package,
    stairs: ArrowUpDown,
    library: Book,
    administrative: Briefcase,
    social: Coffee,
    auditorium: Users,
    professor: UserRound,
    lab: Search
  };

  return iconMap[type] || null;
}

type SVGRectProps = SVGProps<SVGRectElement> & {
  x: number;
  y: number;
  width: number;
  height: number;
  codigo: string;
  saci?: SaciRoom;
  onClick?: (sala: { x: number; y: number; width: number; height: number; codigo: string; saci?: SaciRoom }) => void;
  isAdjacent?: boolean;
  hasDocentes?: boolean;
};

const Sala: React.FC<SVGRectProps> = ({
  x,
  y,
  width,
  height,
  codigo,
  saci,
  onClick,
  isAdjacent,
  hasDocentes,
  ...rest
}) => {
  const roomType = detectRoomType(codigo, hasDocentes);
  const isClickable = Boolean(saci);
  const lower = codigo.trim().toLowerCase();
  const omitText = lower === 'copa' || lower === 'corredor' || lower.includes('corredor');

  const { fontSize, fittedText } = useSvgTextFit(codigo, width, height, {
    padding: 6,
    maxFontSize: 14,
    minFontSize: 8,
    fontFamily: 'sans-serif'
  });

  const colors = getRoomColors(roomType, isClickable);
  const Icon = getRoomIcon(roomType);

  const shouldMerge = (roomType === 'corridor' || roomType === 'stairs') && isAdjacent;
  const baseStrokeWidth = shouldMerge || roomType === 'corridor' ? 0 : 2;

  const commonRect = {
    x,
    y,
    width,
    height,
    strokeWidth: baseStrokeWidth,
    ...rest
  };

  const fillClass = `${colors.fill} ${colors.fillHover} ${colors.fillFocus} transition-colors duration-200`;
  const strokeClass = colors.stroke;
  const textClass = `pointer-events-none font-bold select-none ${colors.text}`;

  // Standardized icon size for all rooms (fixed pixel size)
  const STANDARD_ICON_SIZE = 20; // px — size of the icon itself
  const ICON_WRAPPER_PADDING = 6; // px — padding around the icon inside the circle/container
  const ICON_WRAPPER_SIZE = STANDARD_ICON_SIZE + ICON_WRAPPER_PADDING * 2; // total container size
  const circleRadius = ICON_WRAPPER_SIZE / 2;
  const iconInnerSize = STANDARD_ICON_SIZE;
  // Only show icons for rooms large enough to fit the wrapper.
  const showIcon =
    Icon &&
    width >= ICON_WRAPPER_SIZE &&
    height >= ICON_WRAPPER_SIZE &&
    roomType !== 'corridor' &&
    roomType !== 'stairs' &&
    lower !== 'copa' &&
    lower !== 'elevador';
  const textYOffset = showIcon ? height * 0.15 : 0;

  return (
    <g
      role={isClickable ? 'button' : undefined}
      tabIndex={isClickable ? 0 : undefined}
      aria-label={isClickable ? `Detalhes da sala ${codigo}` : undefined}
      onClick={isClickable ? () => onClick?.({ x, y, width, height, codigo, saci }) : undefined}
      onKeyDown={
        isClickable
          ? (e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onClick?.({ x, y, width, height, codigo, saci });
              }
            }
          : undefined
      }
      style={isClickable ? { cursor: 'pointer' } : undefined}
      className={
        isClickable
          ? 'focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-50 dark:focus-visible:ring-indigo-400 dark:focus-visible:ring-offset-gray-900'
          : undefined
      }>
      <rect {...commonRect} className={`${fillClass} ${strokeClass}`} />
      <title>{codigo}</title>
      {showIcon && (
        <g transform={`translate(${x + width / 2}, ${y + height / 2 - textYOffset})`}>
          <circle
            cx={0}
            cy={0}
            r={circleRadius}
            className={`transition-opacity duration-200 ${colors.iconCircleFill}`}
          />
          <foreignObject x={-iconInnerSize / 2} y={-iconInnerSize / 2} width={iconInnerSize} height={iconInnerSize}>
            <div
              style={{ width: `${iconInnerSize}px`, height: `${iconInnerSize}px` }}
              className='flex items-center justify-center'>
              <Icon
                size={Math.floor(iconInnerSize)}
                className={`fill-none ${colors.iconStroke || ''} pointer-events-none`}
                strokeWidth={2.5}
                strokeLinecap='round'
                strokeLinejoin='round'
                aria-hidden
                focusable={false}
              />
            </div>
          </foreignObject>
        </g>
      )}
      {!omitText && (
        <text
          x={x + width / 2}
          y={y + height / 2 + (showIcon ? textYOffset : 0)}
          textAnchor='middle'
          dominantBaseline='middle'
          fontSize={fontSize}
          fontFamily='sans-serif'
          className={textClass}>
          {fittedText}
        </text>
      )}
    </g>
  );
};

export default Sala;
