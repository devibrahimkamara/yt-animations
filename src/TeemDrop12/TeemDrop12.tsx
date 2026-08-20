import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, Easing, spring } from "remotion";
import { z } from "zod";

export const teemDrop12Schema = z.object({});

const DAYS = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];
const CELL_W = 140;
const CELL_H = 88;
const CAL_X = 470;
const CAL_Y = 190;
const CAL_W = 980;
const CAL_H = 640;

interface CalendarMonthProps {
  month: string;
  year: number;
  startCol: number; // 0-based weekday of 1st
  days: number;
  highlightDay?: number;
  highlightColor?: string;
  highlightLabel?: string;
  ghostDots?: number[]; // days with ghost dots
  dotColor?: string;
  opacity?: number;
  translateX?: number;
}

function CalendarMonth({ month, year, startCol, days, highlightDay, highlightColor = "#3B82F6", highlightLabel, ghostDots = [], dotColor = "#64748B", opacity = 1, translateX = 0 }: CalendarMonthProps) {
  const cells: { day: number; col: number; row: number }[] = [];
  for (let d = 1; d <= days; d++) {
    const idx = d - 1 + startCol;
    cells.push({ day: d, col: idx % 7, row: Math.floor(idx / 7) });
  }

  return (
    <div style={{ position: "absolute", inset: 0, opacity, transform: `translateX(${translateX}px)` }}>
      {/* Month header */}
      <div style={{ padding: "20px 24px 12px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ fontSize: 22, fontWeight: 700, color: "#FFFFFF" }}>{month} {year}</div>
        <div style={{ display: "flex", gap: 8 }}>
          {/* Chevron left/right */}
          <div style={{ color: "#475569", fontSize: 18 }}>‹</div>
          <div style={{ color: "#475569", fontSize: 18 }}>›</div>
        </div>
      </div>

      {/* Day headers */}
      <div style={{ display: "grid", gridTemplateColumns: `repeat(7, ${CELL_W}px)`, padding: "0 24px", marginBottom: 4 }}>
        {DAYS.map(d => (
          <div key={d} style={{ textAlign: "center", fontSize: 13, fontWeight: 600, color: "#475569", padding: "4px 0" }}>{d}</div>
        ))}
      </div>

      {/* Grid */}
      <div style={{ position: "relative", padding: "0 24px" }}>
        {cells.map(({ day, col, row }) => {
          const isHighlight = day === highlightDay;
          const hasDot = ghostDots.includes(day);
          return (
            <div key={day} style={{
              position: "absolute",
              left: col * CELL_W,
              top: row * CELL_H,
              width: CELL_W,
              height: CELL_H,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: 8,
              background: isHighlight ? `rgba(${highlightColor === "#F97316" ? "249,115,22" : "59,130,246"},0.12)` : "transparent",
            }}>
              <div style={{
                fontSize: isHighlight ? 22 : 18,
                fontWeight: isHighlight ? 700 : 400,
                color: isHighlight ? highlightColor : "#94A3B8",
              }}>{day}</div>
              {hasDot && <div style={{ width: 6, height: 6, borderRadius: "50%", background: dotColor, marginTop: 3 }} />}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export const TeemDrop12: React.FC<z.infer<typeof teemDrop12Schema>> = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const clamp = { extrapolateLeft: "clamp" as const, extrapolateRight: "clamp" as const };

  // Phase 0: header elements
  const h1 = spring({ frame: Math.max(0, frame - 0), fps, config: { damping: 16, stiffness: 100, mass: 1.2 } });
  const h2 = spring({ frame: Math.max(0, frame - 5), fps, config: { damping: 16, stiffness: 100, mass: 1.2 } });
  const h3 = spring({ frame: Math.max(0, frame - 10), fps, config: { damping: 16, stiffness: 100, mass: 1.2 } });
  const h4 = spring({ frame: Math.max(0, frame - 15), fps, config: { damping: 16, stiffness: 100, mass: 1.2 } });
  const calEntry = spring({ frame: Math.max(0, frame - 8), fps, config: { damping: 16, stiffness: 100, mass: 1.2 } });

  // Phase 1: Month transitions
  const JAN_START = 22;
  const T1_START = 34;
  const T1_END = 46;
  const T2_START = 58;
  const T2_END = 70;

  // Janvier opacity/translateX
  const janOpacity = interpolate(frame, [JAN_START, T1_START, T1_END], [1, 1, 0], clamp);
  const janTX = interpolate(frame, [T1_START, T1_END], [0, -980], { easing: Easing.bezier(0.4, 0, 0.2, 1), ...clamp });

  // Mars opacity/translateX
  const marOpacity = interpolate(frame, [T1_START, T1_END, T2_START, T2_END], [0, 1, 1, 0], clamp);
  const marTX = interpolate(frame, [T1_START, T1_END], [980, 0], { easing: Easing.bezier(0.4, 0, 0.2, 1), ...clamp });
  const marTX2 = interpolate(frame, [T2_START, T2_END], [0, -980], { easing: Easing.bezier(0.5, 0, 0.2, 1), ...clamp });

  // Juin opacity/scale
  const junOpacity = interpolate(frame, [T2_START, T2_END], [0, 1], clamp);
  const junScale = spring({ frame: Math.max(0, frame - T2_END), fps, config: { damping: 18, stiffness: 120 } });
  const junScaleVal = interpolate(junScale, [0, 1], [1.05, 1]);

  // Progress bar indicator Y
  const progressY = interpolate(frame, [JAN_START, T1_END, T2_END], [0, 100, 300], clamp);

  // Phase 2: Cursor → June 5
  const cur1Progress = interpolate(frame, [88, 125], [0, 1], { easing: Easing.bezier(0.4, 0, 0.2, 1), ...clamp });
  const cursor1X = interpolate(frame, [88, 125], [400, CAL_X + 4 * CELL_W + 24 + CELL_W / 2], { easing: Easing.bezier(0.4, 0, 0.2, 1), ...clamp });
  const cursor1Y = interpolate(frame, [88, 125], [700, CAL_Y + 140 + 0 * CELL_H + CELL_H / 2]) + Math.sin(cur1Progress * Math.PI) * 30;
  const hover1 = spring({ frame: Math.max(0, frame - 125), fps, config: { damping: 18, stiffness: 200 } });
  const todayLabel = interpolate(frame, [128, 135], [0, 1], clamp);

  // Phase 3: Parabolic jump to June 15
  const t = interpolate(frame, [130, 152], [0, 1], { easing: Easing.bezier(0.4, 0, 0.2, 1), ...clamp });
  const cursor2X = interpolate(t, [0, 1], [CAL_X + 4 * CELL_W + 24 + CELL_W / 2, CAL_X + 6 * CELL_W + 24 + CELL_W / 2]);
  const cursor2Y = interpolate(t, [0, 1], [CAL_Y + 140 + CELL_H / 2, CAL_Y + 140 + CELL_H + CELL_H / 2]) + (-120) * Math.sin(t * Math.PI);
  const useJumpCursor = frame >= 130;
  const cursorX = useJumpCursor ? cursor2X : cursor1X;
  const cursorY = useJumpCursor ? cursor2Y : cursor1Y;
  const showCursor = frame >= 88;

  // Phase 4: Circle around June 15
  const circleProgress = interpolate(frame, [152, 178], [0, 188], { easing: Easing.bezier(0.4, 0, 0.2, 1), ...clamp });
  const strokeDashoffset = 188 - circleProgress;
  const circleRot = frame * 2;
  const date15Scale = interpolate(frame, [152, 162, 170], [1, 1.35, 1.2], clamp);
  const date15Color = frame >= 152 ? "#F97316" : "#94A3B8";
  const cardEntry15 = spring({ frame: Math.max(0, frame - 165), fps, config: { damping: 16, stiffness: 120 } });

  // June 5 position (col 4, row 0, 0-indexed): Juin 2026 starts Monday → June 1 = col 0
  return (
    <AbsoluteFill style={{ background: "linear-gradient(160deg, #0F172A 0%, #020617 100%)", fontFamily: "'Plus Jakarta Sans', sans-serif", overflow: "hidden" }}>
      {/* Aurora */}
      <div style={{ position: "absolute", top: -200, left: -100, width: 500, height: 500, borderRadius: "50%", background: "radial-gradient(circle, rgba(48,96,255,0.06) 0%, transparent 70%)" }} />
      <div style={{ position: "absolute", bottom: -100, right: 200, width: 400, height: 400, borderRadius: "50%", background: "radial-gradient(circle, rgba(249,115,22,0.05) 0%, transparent 70%)" }} />

      {/* Header (left side) */}
      <div style={{ position: "absolute", left: 80, top: 200 }}>
        <div style={{ opacity: h1, transform: `translateY(${(1 - h1) * 12}px)`, fontSize: 22, color: "#64748B", fontWeight: 400, marginBottom: 6 }}>On est le</div>
        <div style={{ opacity: h2, transform: `translateY(${(1 - h2) * 12}px)`, fontSize: 64, fontWeight: 800, color: "#FFFFFF", lineHeight: 1, marginBottom: 8 }}>5 juin 2026</div>
        <div style={{ opacity: h3, transform: `translateY(${(1 - h3) * 12}px)`, fontSize: 20, color: "#64748B", fontWeight: 400, marginBottom: 6 }}>La Fête des Pères arrive dans</div>
        <div style={{ opacity: h4, transform: `translateY(${(1 - h4) * 12}px)`, fontSize: 64, fontWeight: 800, color: "#F97316", lineHeight: 1 }}>10 jours</div>
      </div>

      {/* Progress bar (left of calendar) */}
      <div style={{ position: "absolute", left: CAL_X - 30, top: CAL_Y + 140, width: 4, height: 400, background: "#1E293B", borderRadius: 2 }}>
        {/* Segment labels */}
        {["Jan", "Mar", "Juin"].map((m, i) => (
          <div key={m} style={{ position: "absolute", left: -32, top: i * 133 + 8, fontSize: 11, color: "#475569", fontWeight: 600 }}>{m}</div>
        ))}
        {/* Indicator dot */}
        <div style={{
          position: "absolute",
          top: progressY - 4,
          left: -4,
          width: 12,
          height: 12,
          borderRadius: "50%",
          background: "#F97316",
          boxShadow: "0 0 8px rgba(249,115,22,0.5)",
          transition: "top 0.3s",
        }} />
        {/* Fill */}
        <div style={{ position: "absolute", top: 0, width: 4, height: progressY, background: "#F97316", borderRadius: 2, opacity: 0.5 }} />
      </div>

      {/* Calendar */}
      <div style={{
        position: "absolute",
        left: CAL_X,
        top: CAL_Y,
        width: CAL_W,
        height: CAL_H,
        background: "rgba(13,27,42,0.85)",
        borderRadius: 20,
        border: "1px solid rgba(255,255,255,0.06)",
        backdropFilter: "blur(12px)",
        overflow: "hidden",
        opacity: calEntry,
        transform: `translateY(${(1 - calEntry) * 50}px) scale(${0.95 + 0.05 * calEntry})`,
      }}>
        {/* Janvier */}
        {frame < T1_END && (
          <div style={{ position: "absolute", inset: 0, opacity: janOpacity, transform: `translateX(${janTX}px)` }}>
            <CalendarMonth month="Janvier" year={2026} startCol={3} days={31} ghostDots={[1, 15, 20, 28]} />
          </div>
        )}

        {/* Mars */}
        {frame >= T1_START && frame < T2_END && (
          <div style={{ position: "absolute", inset: 0, opacity: marOpacity, transform: `translateX(${marTX + marTX2}px)` }}>
            <CalendarMonth month="Mars" year={2026} startCol={6} days={31} highlightDay={8} highlightColor="#EC4899" dotColor="#EC4899" ghostDots={[8]} />
          </div>
        )}

        {/* Juin */}
        {frame >= T2_START && (
          <div style={{ position: "absolute", inset: 0, opacity: junOpacity, transform: `scale(${junScaleVal})`, transformOrigin: "center" }}>
            <div style={{ padding: "20px 24px 12px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div style={{ fontSize: 22, fontWeight: 700, color: "#FFFFFF" }}>Juin 2026</div>
              <div style={{ display: "flex", gap: 8 }}>
                <div style={{ color: "#475569", fontSize: 18 }}>‹</div>
                <div style={{ color: "#475569", fontSize: 18 }}>›</div>
              </div>
            </div>
            {/* Day headers */}
            <div style={{ display: "grid", gridTemplateColumns: `repeat(7, ${CELL_W}px)`, padding: "0 24px", marginBottom: 4 }}>
              {DAYS.map(d => (
                <div key={d} style={{ textAlign: "center", fontSize: 13, fontWeight: 600, color: "#475569", padding: "4px 0" }}>{d}</div>
              ))}
            </div>
            {/* Days */}
            <div style={{ position: "relative", padding: "0 24px" }}>
              {Array.from({ length: 30 }, (_, i) => i + 1).map(day => {
                const idx = day - 1; // June 2026: June 1 = Monday = col 0
                const col = idx % 7;
                const row = Math.floor(idx / 7);
                const is5 = day === 5;
                const is15 = day === 15;
                const bg5 = is5 && frame >= 125 ? "rgba(59,130,246,0.12)" : "transparent";
                const bg15 = is15 && frame >= 152 ? "rgba(249,115,22,0.12)" : "transparent";
                return (
                  <div key={day} style={{
                    position: "absolute",
                    left: col * CELL_W,
                    top: row * CELL_H,
                    width: CELL_W,
                    height: CELL_H,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: 8,
                    background: bg5 || bg15,
                  }}>
                    <div style={{
                      fontSize: is15 ? 22 * date15Scale : is5 ? 22 : 18,
                      fontWeight: is5 || is15 ? 700 : 400,
                      color: is15 ? date15Color : is5 ? "#FFFFFF" : "#94A3B8",
                      transition: "color 0.3s",
                    }}>{day}</div>
                    {/* SVG circle around 15 */}
                    {is15 && frame >= 152 && (
                      <svg style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", overflow: "visible" }} width="60" height="60" viewBox="0 0 60 60">
                        <circle cx="30" cy="30" r="30" fill="none" stroke="#F97316" strokeWidth="2.5"
                          strokeDasharray="188"
                          strokeDashoffset={strokeDashoffset}
                          strokeLinecap="round"
                          transform="rotate(-90, 30, 30)"
                        />
                        <circle cx="30" cy="30" r="30" fill="none" stroke="#F97316" strokeWidth="1.5" opacity="0.3"
                          strokeDasharray="6 4"
                          transform={`rotate(${circleRot}, 30, 30)`}
                        />
                      </svg>
                    )}
                  </div>
                );
              })}
            </div>

            {/* "Fête des Pères" floating card */}
            {frame >= 165 && (
              <div style={{
                position: "absolute",
                left: 24 + 6 * CELL_W + CELL_W / 2 - 110,
                top: 140 + CELL_H + CELL_H + 10,
                width: 220,
                background: "rgba(249,115,22,0.12)",
                border: "1px solid rgba(249,115,22,0.4)",
                borderRadius: 10,
                padding: "8px 14px",
                opacity: cardEntry15,
                transform: `translateY(${(1 - cardEntry15) * 10}px)`,
              }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: "#F97316" }}>Fête des Pères</div>
                <div style={{ fontSize: 11, color: "#94A3B8", marginTop: 2 }}>Dimanche 15 juin 2026</div>
                {/* Connector line */}
                <div style={{ position: "absolute", top: -20, left: "50%", width: 2, height: 20, background: "rgba(249,115,22,0.4)", transform: "translateX(-50%)" }} />
              </div>
            )}
          </div>
        )}

        {/* June 5 highlight ring */}
        {frame >= 125 && frame < 130 && (
          <svg style={{ position: "absolute", left: 24 + 4 * CELL_W, top: 140, width: CELL_W, height: CELL_H, overflow: "visible", pointerEvents: "none" }}>
            <circle cx={CELL_W / 2} cy={CELL_H / 2} r={hover1 * 22} fill="none" stroke="rgba(59,130,246,0.5)" strokeWidth="2" />
          </svg>
        )}

        {/* "Aujourd'hui" label */}
        {frame >= 128 && frame < 135 && (
          <div style={{
            position: "absolute",
            left: 24 + 4 * CELL_W + CELL_W / 2 - 40,
            top: 140 - 30,
            background: "rgba(59,130,246,0.15)",
            border: "1px solid rgba(59,130,246,0.4)",
            borderRadius: 6,
            padding: "3px 8px",
            fontSize: 12,
            color: "#93C5FD",
            fontWeight: 600,
            opacity: todayLabel,
          }}>
            Aujourd'hui
          </div>
        )}
      </div>

      {/* Mouse cursor SVG */}
      {showCursor && (
        <svg style={{ position: "absolute", left: cursorX - 8, top: cursorY - 4, pointerEvents: "none", zIndex: 10 }} width="24" height="32" viewBox="0 0 24 32" fill="none">
          <path d="M2 2 L2 22 L7 17 L11 27 L14 26 L10 16 L18 16Z" fill="white" stroke="#0F172A" strokeWidth="1.5" strokeLinejoin="round" />
        </svg>
      )}

      {/* Trail cursors (parabolic jump) */}
      {frame >= 130 && frame < 152 && [0.06, 0.12, 0.18, 0.24].map((delay, i) => {
        const trailT = Math.max(0, t - delay);
        const tx = interpolate(trailT, [0, 1], [CAL_X + 4 * CELL_W + 24 + CELL_W / 2, CAL_X + 6 * CELL_W + 24 + CELL_W / 2]);
        const ty = interpolate(trailT, [0, 1], [CAL_Y + 140 + CELL_H / 2, CAL_Y + 140 + CELL_H + CELL_H / 2]) + (-120) * Math.sin(trailT * Math.PI);
        const opacity = [0.5, 0.3, 0.15, 0.06][i];
        return (
          <svg key={i} style={{ position: "absolute", left: tx - 8, top: ty - 4, pointerEvents: "none", opacity, zIndex: 9 }} width="24" height="32" viewBox="0 0 24 32" fill="none">
            <path d="M2 2 L2 22 L7 17 L11 27 L14 26 L10 16 L18 16Z" fill="white" stroke="#0F172A" strokeWidth="1.5" strokeLinejoin="round" />
          </svg>
        );
      })}
    </AbsoluteFill>
  );
};
