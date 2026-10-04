import { EMOJI_FONT } from "./theme";

// Emoji rendu dans une boîte carrée centrée : évite les décalages verticaux
// (baseline) qui donnent l'impression d'icônes « pas en phase » avec le texte.
export const Emoji: React.FC<{
  size: number;
  children: string;
  style?: React.CSSProperties;
}> = ({ size, children, style }) => (
  <span
    style={{
      width: size,
      height: size,
      fontSize: size * 0.9,
      lineHeight: 1,
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: EMOJI_FONT,
      flexShrink: 0,
      ...style,
    }}
  >
    {children}
  </span>
);
