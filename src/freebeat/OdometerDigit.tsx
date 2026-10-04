// Colonne de chiffres façon rouleau mécanique (Anim 2, borne d'essence).
// `offset` est exprimé en "nombre de chiffres défilés" (float) : le parent
// calcule l'easing (Easing.out(Easing.cubic)) et passe la valeur courante,
// exactement comme l'odomètre de Higgs2Anim04CTAAbonnementCompteur.

const STRIP = Array.from({ length: 60 }, (_, i) => i % 10);

export const OdometerDigit: React.FC<{
  offset: number;
  height: number;
  width: number;
  fontSize: number;
  fontFamily: string;
  color: string;
  /** overlay de couleur (flash « clac » / pic) — opacité 0 → 1 */
  flash?: number;
  flashColor?: string;
}> = ({ offset, height, width, fontSize, fontFamily, color, flash = 0, flashColor = "#fff" }) => (
  <div
    style={{
      position: "relative",
      width,
      height,
      overflow: "hidden",
      fontVariantNumeric: "tabular-nums",
    }}
  >
    <div style={{ transform: `translateY(${-offset * height}px)` }}>
      {STRIP.map((d, k) => (
        <div
          key={k}
          style={{
            height,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily,
            fontWeight: 800,
            fontSize,
            color,
          }}
        >
          {d}
        </div>
      ))}
    </div>
    {flash > 0 && (
      <div style={{ position: "absolute", inset: 0, background: flashColor, opacity: flash }} />
    )}
  </div>
);
