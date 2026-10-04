import React from "react";
import { OBSTACLE, INK, RAIL } from "./theme";

// Silhouette de bouteille de complément — forme finale statique (l'animation est
// faite par l'appelant via des transforms sur le wrapper). Construite en détail
// dans l'Anim 6 ; réutilisée telle quelle dans les Anims 10, 14, 15.
//
// viewBox interne 120 × 300 (ratio bouteille). `size` = hauteur rendue en px.

export const Bottle: React.FC<{
  size?: number;
  bodyColor?: string;
  capColor?: string;
  /** bande d'étiquette blanche autour du corps */
  label?: boolean;
  labelText?: string;
  /** couleur d'accent d'un logo simple sur l'étiquette */
  logoColor?: string;
  style?: React.CSSProperties;
}> = ({
  size = 300,
  bodyColor = OBSTACLE,
  capColor = "#5A5A5C",
  label = false,
  labelText,
  logoColor,
  style,
}) => {
  const w = (size / 300) * 120;
  return (
    <svg
      width={w}
      height={size}
      viewBox="0 0 120 300"
      style={{ overflow: "visible", ...style }}
    >
      {/* bouchon */}
      <rect x={38} y={4} width={44} height={30} rx={8} fill={capColor} />
      {/* col */}
      <rect x={46} y={30} width={28} height={20} fill={bodyColor} opacity={0.85} />
      {/* corps : épaules arrondies + base arrondie */}
      <path
        d="M30 70 Q30 50 46 48 L74 48 Q90 50 90 70 L90 268 Q90 288 70 288 L50 288 Q30 288 30 268 Z"
        fill={bodyColor}
        stroke={RAIL}
        strokeWidth={2}
      />
      {label && (
        <>
          <rect x={26} y={120} width={68} height={104} rx={4} fill={INK} />
          {/* ombres latérales : illusion de courbure cylindrique */}
          <rect x={26} y={120} width={14} height={104} fill="rgba(0,0,0,0.16)" />
          <rect x={80} y={120} width={14} height={104} fill="rgba(0,0,0,0.16)" />
          {logoColor && (
            <circle cx={60} cy={150} r={12} fill={logoColor} />
          )}
          {labelText && (
            <text
              x={60}
              y={190}
              textAnchor="middle"
              style={{
                fontFamily: "Plus Jakarta Sans, sans-serif",
                fontWeight: 800,
                fontSize: 13,
                fill: "#1A1F28",
                letterSpacing: "0.5px",
              }}
            >
              {labelText}
            </text>
          )}
        </>
      )}
    </svg>
  );
};
