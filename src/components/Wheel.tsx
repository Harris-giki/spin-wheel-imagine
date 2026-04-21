"use client";

import { motion, useAnimationControls } from "framer-motion";
import { useEffect, useImperativeHandle, useMemo, forwardRef } from "react";
import { PRIZES } from "@/lib/prizes";

export type WheelHandle = {
  /**
   * Spin the wheel and land on the segment with the given prizeKey.
   * Returns a promise that resolves when the spin animation finishes.
   * If prizeKey is null (consolation), lands on a random segment.
   */
  spinTo: (prizeKey: string | null) => Promise<void>;
};

type Props = {
  size?: number;
  disabled?: boolean;
};

const SEG_COUNT = PRIZES.length;
const SEG_ANGLE = 360 / SEG_COUNT;

function polar(cx: number, cy: number, r: number, deg: number) {
  const rad = ((deg - 90) * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

function describeSegment(cx: number, cy: number, r: number, startDeg: number, endDeg: number) {
  const start = polar(cx, cy, r, endDeg);
  const end = polar(cx, cy, r, startDeg);
  const largeArc = endDeg - startDeg <= 180 ? 0 : 1;
  return [
    `M ${cx} ${cy}`,
    `L ${start.x} ${start.y}`,
    `A ${r} ${r} 0 ${largeArc} 0 ${end.x} ${end.y}`,
    "Z",
  ].join(" ");
}

export const Wheel = forwardRef<WheelHandle, Props>(function Wheel(
  { size = 340, disabled = false },
  ref
) {
  const controls = useAnimationControls();
  const radius = size / 2;
  const cx = radius;
  const cy = radius;
  const outerR = radius - 6;
  // Number badge sits ~75% out from the hub, nicely centered in the segment.
  const numberR = outerR * 0.75;

  const segments = useMemo(
    () =>
      PRIZES.map((p, i) => {
        const startDeg = i * SEG_ANGLE;
        const endDeg = (i + 1) * SEG_ANGLE;
        const midDeg = startDeg + SEG_ANGLE / 2;
        const numberPos = polar(cx, cy, numberR, midDeg);
        return {
          prize: p,
          index: i,
          number: i + 1,
          path: describeSegment(cx, cy, outerR, startDeg, endDeg),
          midDeg,
          numberPos,
        };
      }),
    [cx, cy, outerR, numberR]
  );

  useEffect(() => {
    controls.set({ rotate: 0 });
  }, [controls]);

  useImperativeHandle(ref, () => ({
    async spinTo(prizeKey: string | null) {
      const idx = prizeKey ? PRIZES.findIndex((p) => p.key === prizeKey) : -1;
      const targetIndex = idx >= 0 ? idx : Math.floor(Math.random() * SEG_COUNT);

      // Pointer is at top (0deg). We want the mid of the target segment to align with 0deg
      // after rotation. Segment mid angle (from 0 clockwise) = idx*SEG_ANGLE + SEG_ANGLE/2.
      // A small random jitter within the segment feels more natural.
      const jitter = (Math.random() - 0.5) * (SEG_ANGLE * 0.55);
      const mid = targetIndex * SEG_ANGLE + SEG_ANGLE / 2 + jitter;

      // We rotate the wheel (segments rotate with it). To land the target at 0deg pointer,
      // we need the wheel rotated by (360 - mid). Add 6 full turns for drama.
      const spins = 6;
      const finalRotation = spins * 360 + (360 - mid);

      await controls.start({
        rotate: finalRotation,
        transition: { duration: 5.2, ease: [0.12, 0.7, 0.1, 1] },
      });

      // Normalize rotation so a later spin starts from its modulo rather than an ever-growing number.
      controls.set({ rotate: finalRotation % 360 });
    },
  }));

  return (
    <div className="relative mx-auto select-none" style={{ width: size, height: size }}>
      {/* Outer aura — brand lilac/violet glow */}
      <div
        className="absolute rounded-full"
        style={{
          inset: -28,
          background:
            "conic-gradient(from 0deg, rgba(167,139,250,0.55), rgba(196,181,253,0.45), rgba(124,58,237,0.5), rgba(167,139,250,0.55))",
          filter: "blur(28px)",
          opacity: 0.85,
        }}
      />

      {/* Pointer / pin at top — brand indigo */}
      <div className="absolute left-1/2 -translate-x-1/2 -top-3 z-20">
        <svg width="44" height="52" viewBox="0 0 44 52" fill="none" style={{ filter: "drop-shadow(0 6px 12px rgba(31,14,71,0.45))" }}>
          <defs>
            <linearGradient id="pinGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#a78bfa" />
              <stop offset="100%" stopColor="#1f0e47" />
            </linearGradient>
          </defs>
          <path d="M22 50 L4 14 A20 20 0 0 1 40 14 Z" fill="url(#pinGrad)" stroke="#faf7ff" strokeWidth="2.5" strokeLinejoin="round" />
          <circle cx="22" cy="17" r="5" fill="#faf7ff" />
          <circle cx="22" cy="17" r="2.2" fill="#7c3aed" />
        </svg>
      </div>

      {/* Rotating wheel */}
      <motion.div
        className="absolute inset-0"
        animate={controls}
        initial={{ rotate: 0 }}
        style={{ willChange: "transform" }}
      >
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
          <defs>
            <filter id="segShadow" x="-10%" y="-10%" width="120%" height="120%">
              <feDropShadow dx="0" dy="1" stdDeviation="0.4" floodColor="#1f0e47" floodOpacity="0.35" />
            </filter>
            <radialGradient id="hubGrad" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#c4b5fd" />
              <stop offset="55%" stopColor="#7c3aed" />
              <stop offset="100%" stopColor="#1f0e47" />
            </radialGradient>
            <radialGradient id="rimGrad" cx="50%" cy="50%" r="50%">
              <stop offset="85%" stopColor="#1f0e47" />
              <stop offset="100%" stopColor="#371a7f" />
            </radialGradient>
          </defs>

          {/* Rim (brand indigo) with inset cream */}
          <circle cx={cx} cy={cy} r={outerR + 6} fill="url(#rimGrad)" />
          <circle cx={cx} cy={cy} r={outerR + 3} fill="#faf7ff" />

          {/* Segments */}
          {segments.map(({ prize, path }) => (
            <path
              key={prize.key}
              d={path}
              fill={prize.color}
              stroke="#faf7ff"
              strokeWidth="1.25"
              filter="url(#segShadow)"
            />
          ))}

          {/* Number badges — each segment shows its legend index (1-15) in a
              circular chip. Minimalist and perfectly legible regardless of
              segment width; full prize info lives in the side legend. */}
          {segments.map(({ prize, number, numberPos }) => {
            const badgeR = size < 300 ? 11 : 13;
            // Soft badge — lighter segments get dark-on-light, darker get light-on-dark
            const isDarkSeg = prize.textColor === "#faf7ff";
            const badgeBg = isDarkSeg ? "#faf7ff" : "#1f0e47";
            const badgeFg = isDarkSeg ? "#1f0e47" : "#faf7ff";
            return (
              <g key={`num-${prize.key}`}>
                <circle
                  cx={numberPos.x}
                  cy={numberPos.y}
                  r={badgeR}
                  fill={badgeBg}
                  stroke={badgeFg}
                  strokeWidth={1.5}
                  opacity={0.95}
                />
                <text
                  x={numberPos.x}
                  y={numberPos.y}
                  textAnchor="middle"
                  dominantBaseline="central"
                  fontFamily="Space Grotesk, system-ui, sans-serif"
                  fontWeight={800}
                  fontSize={size < 300 ? 12 : 14}
                  fill={badgeFg}
                >
                  {number}
                </text>
              </g>
            );
          })}

          {/* Tick dots on the rim */}
          {segments.map(({ prize, midDeg }) => {
            const p = polar(cx, cy, outerR + 1.5, midDeg - SEG_ANGLE / 2);
            return (
              <circle
                key={`tick-${prize.key}`}
                cx={p.x}
                cy={p.y}
                r={1.5}
                fill="#1f0e47"
                opacity={0.9}
              />
            );
          })}

          {/* Center hub — brand sparkle */}
          <circle cx={cx} cy={cy} r={outerR * 0.18} fill="#faf7ff" stroke="#1f0e47" strokeWidth="2" />
          <circle cx={cx} cy={cy} r={outerR * 0.13} fill="url(#hubGrad)" />
          {/* 4-point sparkle inside hub */}
          <path
            d={`M ${cx} ${cy - outerR * 0.1}
                L ${cx + outerR * 0.025} ${cy - outerR * 0.025}
                L ${cx + outerR * 0.1} ${cy}
                L ${cx + outerR * 0.025} ${cy + outerR * 0.025}
                L ${cx} ${cy + outerR * 0.1}
                L ${cx - outerR * 0.025} ${cy + outerR * 0.025}
                L ${cx - outerR * 0.1} ${cy}
                L ${cx - outerR * 0.025} ${cy - outerR * 0.025} Z`}
            fill="#faf7ff"
            opacity={0.95}
          />
        </svg>
      </motion.div>

      {disabled && (
        <div className="absolute inset-0 rounded-full bg-ink-900/10 pointer-events-none" />
      )}
    </div>
  );
});
