// Atmos22 · Anim 9 — « La barre de chargement bloquée » (150 f @ 30 fps).
// Timeline du brief conservée : entrée des 2 blocs 0–14 (décalage 4 f) · remplissage « Réfléchir »
// 0 → 99 % sur 14–54 (Easing.out(cubic), floor) · blocage 54–100 : spinner, tremblement ±2 px toutes
// les 3 f, 98 % affiché f70–74 · f84 : pilule « BLOQUÉ » (shake ±6 px / 6 f) + pulsation de la bordure
// de la piste 2 (0 → 0.8 → 0.3 / 12 f) · légende « Réfléchir ≠ Agir » 92 (spring 14/110), stable
// 108–138 · sortie 138–150. La barre reste coincée à 99 % de f54 à f138 (2,8 s ≥ 1,5 s).
// Écarts : fond aurora (Stage), pistes glass, remplissage ACCENT (+ glow), BLOQUÉ en ATMOS_ERROR,
// « Agir » de la légende en ACCENT, gris → DIM_TEXT, Plus Jakarta Sans. Tailles mobile : labels et
// pourcentages 44 → 72 px, BLOQUÉ 32 → 44 px, spinner 36 → 52 px, légende 80 → 104 px.
import { AbsoluteFill, Easing, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { z } from "zod";
import { loadFont } from "@remotion/google-fonts/PlusJakartaSans";
import { Stage } from "../atmos22/Stage";
import { ACCENT, ATMOS_ERROR, DIM_TEXT, GLASS_BORDER, GLASS_CARD, INK } from "../atmos22/theme";
import { clamp, dampedShake, exitFx } from "../atmos22/utils";

const { fontFamily } = loadFont("normal", { weights: ["800"], subsets: ["latin"] });

export const atmos22Anim09Schema = z.object({
  thinkLabel: z.string().default("Réfléchir"),
  actLabel: z.string().default("Agir"),
});

const BAR_X = 360;
const BAR_W = 1200;
const BAR_H = 56;
const BAR1_Y = 400; // centre vertical de la piste
const BAR2_Y = 600;
const LABEL_SIZE = 72;
const LABEL_GAP = 22; // entre le bas du label et le haut de la piste

const Spinner: React.FC<{ angle: number; size: number }> = ({ angle, size }) => (
  <svg width={size} height={size} viewBox="0 0 36 36" style={{ transform: `rotate(${angle}deg)` }}>
    <circle cx={18} cy={18} r={14} fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth={4.5} />
    <circle
      cx={18}
      cy={18}
      r={14}
      fill="none"
      stroke={INK}
      strokeWidth={4.5}
      strokeLinecap="round"
      strokeDasharray="34 88"
    />
  </svg>
);

const Warning: React.FC<{ size: number }> = ({ size }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={ATMOS_ERROR} strokeWidth={2.4} strokeLinejoin="round" strokeLinecap="round">
    <path d="M12 3 22 20H2L12 3Z" />
    <path d="M12 10v4.5M12 17.2v.1" />
  </svg>
);

const fmt = (n: number) => `${n} %`;

export const Atmos22Anim09ChargementBloque: React.FC<z.infer<typeof atmos22Anim09Schema>> = ({
  thinkLabel,
  actLabel,
}) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  // Phase 1 : entrée des blocs
  const blockIn = (delay: number) => {
    const t = interpolate(frame, [delay, delay + 10], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
    return { opacity: t, ty: 30 * (1 - t) };
  };
  const b1 = blockIn(0);
  const b2 = blockIn(4);

  // Phase 2 : remplissage
  const fill = interpolate(frame, [14, 54], [0, 99], { ...clamp, easing: Easing.out(Easing.cubic) });
  let shown = Math.floor(fill + 1e-6);
  if (frame >= 70 && frame <= 74) shown = 98;

  // Phase 3 : blocage
  const stuck = frame >= 54;
  const jitter = frame >= 54 && frame < 100 ? (Math.floor((frame - 54) / 3) % 2 === 0 ? 2 : -2) : 0;
  const spinnerIn = interpolate(frame, [54, 60], [0, 1], clamp);
  const spinnerAngle = (frame - 54) * 14;

  const blocked = frame >= 84;
  const blockedIn = spring({ frame: frame - 84, fps, config: { damping: 12, stiffness: 200 } });
  const blockedShake = dampedShake(frame, 84, 6, 6);
  const pulse = frame >= 84 ? interpolate(frame, [84, 90, 96], [0, 0.8, 0.3], clamp) : 0;

  // Phase 4 : légende
  const cap = spring({ frame: frame - 92, fps, config: { damping: 14, stiffness: 110 }, durationInFrames: 14 });
  const capOpacity = frame >= 92 ? interpolate(cap, [0, 1], [0, 1], clamp) : 0;
  const capTy = 30 * (1 - cap);

  const exit = exitFx(frame, durationInFrames, 12);

  const labelRow = (barY: number): React.CSSProperties => ({
    position: "absolute",
    left: BAR_X,
    width: BAR_W,
    top: barY - BAR_H / 2 - LABEL_GAP - LABEL_SIZE * 1.1,
    height: LABEL_SIZE * 1.1,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    fontSize: LABEL_SIZE,
    fontWeight: 800,
    lineHeight: 1.1,
  });

  const track = (barY: number): React.CSSProperties => ({
    position: "absolute",
    left: BAR_X,
    top: barY - BAR_H / 2,
    width: BAR_W,
    height: BAR_H,
    borderRadius: BAR_H / 2,
    background: GLASS_CARD,
    border: `2px solid ${GLASS_BORDER}`,
    boxSizing: "border-box",
    overflow: "hidden",
  });

  return (
    <Stage outFrames={0}>
      <AbsoluteFill
        style={{
          fontFamily,
          color: INK,
          opacity: exit.opacity,
          transform: `scale(${exit.scale})`,
        }}
      >
        {/* ── Bloc 1 : Réfléchir ── */}
        <AbsoluteFill style={{ opacity: b1.opacity, transform: `translateY(${b1.ty}px)` }}>
          <div style={labelRow(BAR1_Y)}>
            <span>{thinkLabel}</span>
            <span style={{ display: "flex", alignItems: "center", gap: 20, fontVariantNumeric: "tabular-nums" }}>
              {stuck && (
                <span style={{ opacity: spinnerIn, display: "flex" }}>
                  <Spinner angle={spinnerAngle} size={52} />
                </span>
              )}
              {fmt(shown)}
            </span>
          </div>
          <div style={track(BAR1_Y)}>
            <div
              style={{
                position: "absolute",
                left: 0,
                top: 0,
                bottom: 0,
                width: `${fill}%`,
                borderRadius: BAR_H / 2,
                background: `linear-gradient(90deg, ${ACCENT}, #5a82ff)`,
                boxShadow: "0 0 28px rgba(48,96,255,0.6)",
                transform: `translateX(${jitter}px)`,
              }}
            />
          </div>
        </AbsoluteFill>

        {/* ── Bloc 2 : Agir ── */}
        <AbsoluteFill style={{ opacity: b2.opacity, transform: `translateY(${b2.ty}px)` }}>
          <div style={labelRow(BAR2_Y)}>
            <span style={{ display: "flex", alignItems: "center", gap: 28 }}>
              {actLabel}
              {blocked && (
                <span
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    padding: "8px 24px",
                    borderRadius: 999,
                    border: `3px solid ${ATMOS_ERROR}`,
                    background: "rgba(239,68,68,0.12)",
                    color: ATMOS_ERROR,
                    fontSize: 44,
                    lineHeight: 1,
                    opacity: interpolate(blockedIn, [0, 1], [0, 1], clamp),
                    transform: `translateX(${blockedShake}px) scale(${interpolate(blockedIn, [0, 1], [0.8, 1])})`,
                  }}
                >
                  <Warning size={44} />
                  BLOQUÉ
                </span>
              )}
            </span>
            <span style={{ color: DIM_TEXT, fontVariantNumeric: "tabular-nums" }}>{fmt(0)}</span>
          </div>
          <div style={track(BAR2_Y)} />
          {pulse > 0 && (
            <div
              style={{
                position: "absolute",
                left: BAR_X - 3,
                top: BAR2_Y - BAR_H / 2 - 3,
                width: BAR_W + 6,
                height: BAR_H + 6,
                borderRadius: BAR_H / 2 + 3,
                border: `4px solid ${ATMOS_ERROR}`,
                boxShadow: "0 0 24px rgba(239,68,68,0.6)",
                opacity: pulse,
              }}
            />
          )}
        </AbsoluteFill>

        {/* ── Légende ── */}
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: 860 - 104 * 0.6,
            textAlign: "center",
            fontSize: 104,
            fontWeight: 800,
            lineHeight: 1.2,
            opacity: capOpacity,
            transform: `translateY(${capTy}px)`,
          }}
        >
          {thinkLabel} ≠{" "}
          <span style={{ color: ACCENT, textShadow: "0 0 40px rgba(136,170,255,0.6)" }}>{actLabel}</span>
        </div>
      </AbsoluteFill>
    </Stage>
  );
};
