import React from 'react';
import type { CSSProperties } from 'react';
import { SPACE, resolveSpacing, type SpaceToken } from './palette';

export { resolveSpacing };

export interface TwBoxProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'width' | 'height'> {
  flex?: number | string;
  height?: number | string;
  width?: number | string;
  /** Maps to `backgroundColor` */
  background?: string;
  flexShrink?: number;
  flexGrow?: number;
  position?: CSSProperties['position'];
  maxWidth?: CSSProperties['maxWidth'];
  minHeight?: CSSProperties['minHeight'];
  alignSelf?: CSSProperties['alignSelf'];
  margin?: SpaceToken | number;
  marginTop?: SpaceToken | number | string;
  marginBottom?: SpaceToken | number | string;
  marginLeft?: SpaceToken | number | string;
  marginRight?: SpaceToken | number | string;
  marginY?: SpaceToken | number;
  marginX?: SpaceToken | number;
  padding?: SpaceToken | number | string;
  paddingTop?: SpaceToken | number | string;
  paddingBottom?: SpaceToken | number | string;
  paddingLeft?: SpaceToken | number | string;
  paddingRight?: SpaceToken | number | string;
  paddingX?: SpaceToken | number | string;
  paddingY?: SpaceToken | number | string;
}

function mpStyle(props: Pick<
  TwBoxProps,
  | 'margin'
  | 'marginTop'
  | 'marginBottom'
  | 'marginLeft'
  | 'marginRight'
  | 'marginY'
  | 'marginX'
  | 'padding'
  | 'paddingTop'
  | 'paddingBottom'
  | 'paddingLeft'
  | 'paddingRight'
  | 'paddingX'
  | 'paddingY'
>): CSSProperties {
  const o: CSSProperties = {};
  const m = resolveSpacing(props.margin);
  if (m !== undefined) o.margin = m;
  const mt = resolveSpacing(props.marginTop);
  if (mt !== undefined) o.marginTop = mt;
  const mb = resolveSpacing(props.marginBottom);
  if (mb !== undefined) o.marginBottom = mb;
  const ml = resolveSpacing(props.marginLeft);
  if (ml !== undefined) o.marginLeft = ml;
  const mr = resolveSpacing(props.marginRight);
  if (mr !== undefined) o.marginRight = mr;
  const my = resolveSpacing(props.marginY);
  if (my !== undefined) {
    o.marginTop = my;
    o.marginBottom = my;
  }
  const mx = resolveSpacing(props.marginX);
  if (mx !== undefined) {
    o.marginLeft = mx;
    o.marginRight = mx;
  }
  const p = resolveSpacing(props.padding);
  if (p !== undefined) o.padding = p;
  const pt = resolveSpacing(props.paddingTop);
  if (pt !== undefined) o.paddingTop = pt;
  const pb = resolveSpacing(props.paddingBottom);
  if (pb !== undefined) o.paddingBottom = pb;
  const pl = resolveSpacing(props.paddingLeft);
  if (pl !== undefined) o.paddingLeft = pl;
  const pr = resolveSpacing(props.paddingRight);
  if (pr !== undefined) o.paddingRight = pr;
  const px = resolveSpacing(props.paddingX);
  if (px !== undefined) {
    o.paddingLeft = px;
    o.paddingRight = px;
  }
  const py = resolveSpacing(props.paddingY);
  if (py !== undefined) {
    o.paddingTop = py;
    o.paddingBottom = py;
  }
  return o;
}

export const Box = React.forwardRef<HTMLDivElement, TwBoxProps>(function TwBox(props, ref) {
  const {
    flex,
    height,
    width,
    background,
    flexShrink,
    flexGrow,
    position,
    maxWidth,
    minHeight,
    alignSelf,
    style,
    children,
    margin,
    marginTop,
    marginBottom,
    marginLeft,
    marginRight,
    marginY,
    marginX,
    padding,
    paddingTop,
    paddingBottom,
    paddingLeft,
    paddingRight,
    paddingX,
    paddingY,
    ...domRest
  } = props;
  const mp = mpStyle({
    margin,
    marginTop,
    marginBottom,
    marginLeft,
    marginRight,
    marginY,
    marginX,
    padding,
    paddingTop,
    paddingBottom,
    paddingLeft,
    paddingRight,
    paddingX,
    paddingY,
  });
  const merged: CSSProperties = {
    height,
    width,
    flexShrink,
    flexGrow,
    position,
    maxWidth,
    minHeight,
    alignSelf,
    backgroundColor: background,
    ...mp,
    ...style,
  };
  /** Apply flex shorthand last so `style={{ display:'flex', flexDirection:'column', ... }}` cannot strip grow/shrink from `flex={1}` */
  if (flex !== undefined && flex !== null) {
    merged.flex = flex;
  }
  return (
    <div ref={ref} style={merged} {...domRest}>
      {children}
    </div>
  );
});

export type { SpaceToken } from './palette';

export interface TwFlexProps extends TwBoxProps {
  flexDirection?: CSSProperties['flexDirection'];
  alignItems?: CSSProperties['alignItems'];
  justifyContent?: CSSProperties['justifyContent'];
  flexWrap?: CSSProperties['flexWrap'];
  gap?: SpaceToken | number | string;
}

export const Flex = React.forwardRef<HTMLDivElement, TwFlexProps>(function TwFlex(
  {
    flexDirection = 'row',
    alignItems,
    justifyContent,
    flexWrap,
    gap,
    style,
    children,
    ...rest
  },
  ref,
) {
  const gapVal =
    gap === undefined
      ? undefined
      : typeof gap === 'number'
        ? gap
        : typeof gap === 'string' && gap in SPACE
          ? SPACE[gap as SpaceToken]
          : gap;
  return (
    <Box
      ref={ref}
      {...rest}
      style={{
        display: 'flex',
        flexDirection,
        alignItems,
        justifyContent,
        flexWrap,
        gap: gapVal as CSSProperties['gap'],
        ...style,
      }}
    >
      {children}
    </Box>
  );
});
