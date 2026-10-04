import { interpolate, useCurrentFrame } from "remotion";

// Frappe caractère par caractère + curseur clignotant (Anim 3).
// Tout est posé dans une même ligne flex à alignement vertical centré pour
// éviter les décalages de baseline entre le texte, le curseur et les icônes
// voisines. Le parent gère l'affichage/masquage du curseur (spinner).
export const TypeOnText: React.FC<{
  text: string;
  startFrame: number;
  endFrame: number;
  fontFamily: string;
  fontSize: number;
  color: string;
  showCursor?: boolean;
  cursorColor?: string;
}> = ({ text, startFrame, endFrame, fontFamily, fontSize, color, showCursor = true, cursorColor }) => {
  const frame = useCurrentFrame();

  const n = Math.floor(
    interpolate(frame, [startFrame, endFrame], [0, text.length], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }),
  );
  const shown = text.slice(0, n);
  const blinkOn = Math.floor(frame / 8) % 2 === 0;

  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        fontFamily,
        fontSize,
        fontWeight: 700,
        lineHeight: 1,
        color,
        whiteSpace: "pre",
      }}
    >
      {shown}
      {showCursor && (
        <span
          style={{
            display: "inline-block",
            width: Math.max(4, Math.round(fontSize * 0.07)),
            height: Math.round(fontSize * 0.92),
            marginLeft: Math.round(fontSize * 0.1),
            background: cursorColor ?? color,
            opacity: blinkOn ? 1 : 0,
          }}
        />
      )}
    </span>
  );
};
