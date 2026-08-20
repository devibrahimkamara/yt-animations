import { loadFont } from "@remotion/google-fonts/PlusJakartaSans";
import { Easing, interpolate, useCurrentFrame } from "remotion";

const { fontFamily } = loadFont("normal", { weights: ["600"], subsets: ["latin"] });
const EASING = Easing.bezier(0.16, 1, 0.3, 1);
const START_FRAME = 18;
const STAGGER = 5;
const DURATION = 20;

export const GridItems: React.FC<{
  items: { label: string; active?: boolean }[];
}> = ({ items }) => {
  const frame = useCurrentFrame();

  return (
    <div style={{ display: "flex", gap: 16, flexWrap: "wrap", marginTop: 8 }}>
      {items.map((item, i) => {
        const start = START_FRAME + i * STAGGER;
        const opacity = interpolate(frame - start, [0, DURATION], [0, 1], {
          extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASING,
        });
        const scale = interpolate(frame - start, [0, DURATION], [0.88, 1], {
          extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASING,
        });

        return (
          <div
            key={i}
            style={{
              opacity,
              transform: `scale(${scale})`,
              width: 130,
              height: 130,
              borderRadius: 18,
              background: item.active
                ? "rgba(15, 25, 80, 0.75)"
                : "linear-gradient(145deg, rgba(100,140,255,0.25) 0%, rgba(60,100,220,0.15) 100%)",
              border: item.active
                ? "1px solid rgba(80,130,255,0.15)"
                : "1px solid rgba(140,180,255,0.3)",
              display: "flex",
              alignItems: "flex-end",
              justifyContent: "center",
              paddingBottom: 14,
            }}
          >
            <span style={{
              fontFamily,
              fontWeight: 600,
              fontSize: 20,
              color: item.active ? "rgba(255,255,255,0.45)" : "rgba(255,255,255,0.88)",
            }}>
              {item.label}
            </span>
          </div>
        );
      })}
    </div>
  );
};
