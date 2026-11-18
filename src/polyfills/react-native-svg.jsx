// Web polyfill for react-native-svg
import React from 'react'

export const Svg = ({ children, width, height, viewBox, style, ...props }) => (
  <svg width={width} height={height} viewBox={viewBox} style={style} {...props}>
    {children}
  </svg>
)

export const Path = ({ d, fill, stroke, strokeWidth, ...props }) => (
  <path d={d} fill={fill} stroke={stroke} strokeWidth={strokeWidth} {...props} />
)

export const Rect = ({ x, y, width, height, fill, rx, ry, ...props }) => (
  <rect x={x} y={y} width={width} height={height} fill={fill} rx={rx} ry={ry} {...props} />
)

export const Circle = ({ cx, cy, r, fill, stroke, ...props }) => (
  <circle cx={cx} cy={cy} r={r} fill={fill} stroke={stroke} {...props} />
)

export const G = ({ children, ...props }) => <g {...props}>{children}</g>

export const Defs = ({ children }) => <defs>{children}</defs>

export const LinearGradient = ({ id, x1, y1, x2, y2, children }) => (
  <linearGradient id={id} x1={x1} y1={y1} x2={x2} y2={y2}>
    {children}
  </linearGradient>
)

export const Stop = ({ offset, stopColor, stopOpacity }) => (
  <stop offset={offset} stopColor={stopColor} stopOpacity={stopOpacity} />
)

export default Svg
