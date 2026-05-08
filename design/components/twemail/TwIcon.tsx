import type { CSSProperties, HTMLAttributes } from 'react';
import type { CanvasSystemIcon } from '@workday/design-assets-types';

export interface TwIconProps extends Omit<HTMLAttributes<HTMLSpanElement>, 'color'> {
  icon: CanvasSystemIcon;
  size?: number;
  /** Stroke/fill via currentColor */
  color?: string;
}

/**
 * Replaces the opening `<svg …>` tag so we control dimensions once (no duplicate attrs).
 * Previously we prefixed `<svg` then stripped `width="24"`/`height="24"`, which removed
 * the injected size when `size === 24` and collapsed icons to empty grey squares.
 */
function normalizeSvgMarkup(iconSvg: string, size: number): string {
  return iconSvg.replace(/^<svg(\s[^>]*)>/, (_full, attrs: string) => {
    const cleaned = attrs
      .replace(/\s+width="[^"]*"/gi, '')
      .replace(/\s+height="[^"]*"/gi, '')
      .replace(/\s+fill="[^"]*"/gi, '');
    return `<svg width="${size}" height="${size}" fill="currentColor" style="display:block;flex-shrink:0"${cleaned}>`;
  });
}

/** Renders Workday system icons without Canvas Kit — SVG sourced from `@workday/canvas-system-icons-web`. */
export function TwIcon({ icon, size = 24, color, style, ...rest }: TwIconProps) {
  const svg = normalizeSvgMarkup(icon.svg, size);
  const wrapperStyle: CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: size,
    height: size,
    color: color ?? 'currentColor',
    lineHeight: 0,
    flexShrink: 0,
    ...style,
  };
  return (
    <span {...rest} style={wrapperStyle} dangerouslySetInnerHTML={{ __html: svg }} />
  );
}
