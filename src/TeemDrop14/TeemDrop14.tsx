import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, Easing, spring } from "remotion";
import { z } from "zod";

export const teemDrop14Schema = z.object({});

const PRODUCTS = [
  { title: "Papa Bricoleur", color: "#6B7280", bg: "#F3F4F6", price: "22,90€", stars: 4.9, reviews: 412, seller: "PapaShop", badge: "BEST-SELLER" },
  { title: "Super Papa Édition Limitée", color: "#1A1A1A", bg: "#FFF7ED", price: "22,40€", oldPrice: "28€", stars: 4.7, reviews: 189, seller: "CreativeTees", badge: "-20%" },
  { title: "Mon Papa Mon Héros", color: "#1E3A5F", bg: "#EFF6FF", price: "26,99€", stars: 5.0, reviews: 67, seller: "HeroTees", badge: "BEST-SELLER" },
  { title: "Papa Cuisinier Grillmaster", color: "#1A1A1A", bg: "#F9FAFB", price: "29,99€", stars: 4.8, reviews: 156, seller: "CustomKing", badge: "PERSO" },
  { title: "Bonne Fête Papa Typo Vintage", color: "#5C3D11", bg: "#FEFCE8", price: "19,90€", stars: 4.6, reviews: 298, seller: "VintagePrint", badge: "BEST-SELLER" },
  { title: "Papa Football Fan", color: "#064E3B", bg: "#ECFDF5", price: "24,50€", stars: 4.5, reviews: 87, seller: "FanTees", badge: "PERSO" },
  { title: "Le Boss de la Maison", color: "#1D4ED8", bg: "#EFF6FF", price: "25,60€", oldPrice: "32€", stars: 4.8, reviews: 203, seller: "BossTees", badge: "-20%" },
  { title: "Papa Gamer Niveau Max", color: "#1A1A1A", bg: "#F9FAFB", price: "21,99€", stars: 4.9, reviews: 334, seller: "GameTees", badge: "BEST-SELLER" },
  { title: "Papa Chef Étoilé", color: "#1A1A1A", bg: "#F9FAFB", price: "23,50€", stars: 4.7, reviews: 145, seller: "ChefTees", badge: "PERSO" },
  { title: "Super Héros de la Maison", color: "#1E3A5F", bg: "#EFF6FF", price: "27,90€", stars: 4.8, reviews: 201, seller: "HeroShop", badge: "BEST-SELLER" },
  { title: "Papa Vintage 70s", color: "#5C3D11", bg: "#FEFCE8", price: "20,99€", stars: 4.6, reviews: 178, seller: "RetroTees", badge: null },
  { title: "Papa Mon Ami Éternel", color: "#1A1A1A", bg: "#FFF7ED", price: "25,00€", stars: 4.9, reviews: 89, seller: "FamilyTees", badge: null },
];

const CARD_W = 340;
const CARD_H = 340;
const GAP = 20;
const COLS = 4;

function TShirtSVG({ color }: { color: string }) {
  return (
    <svg width="120" height="145" viewBox="0 0 120 145" fill="none">
      <path d="M 30,18 C 30,18 39,15 48,14.4 C 48,14.4 51,24 60,25.5 C 69,24 72,14.4 72,14.4 C 81,15 90,18 90,18 L 111,36 L 96,48 L 93,39 L 93,126 L 27,126 L 27,39 L 24,48 L 9,36 Z"
        fill={color} opacity="0.9"
      />
      <path d="M 30,18 C 30,18 39,15 48,14.4 C 48,14.4 51,24 60,25.5 C 69,24 72,14.4 72,14.4 C 81,15 90,18 90,18 L 111,36 L 96,48 L 93,39 L 93,126 L 27,126 L 27,39 L 24,48 L 9,36 Z"
        fill="none" stroke="rgba(0,0,0,0.08)" strokeWidth="1" strokeDasharray="2 3"
      />
      <ellipse cx="45" cy="60" rx="24" ry="12" fill="rgba(255,255,255,0.06)" />
    </svg>
  );
}

function StarRating({ stars }: { stars: number }) {
  return (
    <div style={{ display: "flex", gap: 2 }}>
      {[1, 2, 3, 4, 5].map(i => (
        <svg key={i} width="12" height="12" viewBox="0 0 12 12" fill={i <= Math.round(stars) ? "#F59E0B" : "#D1D5DB"}>
          <path d="M6 1L7.5 4.3H11L8.3 6.5L9.5 10L6 7.9L2.5 10L3.7 6.5L1 4.3H4.5Z" />
        </svg>
      ))}
    </div>
  );
}

export const TeemDrop14: React.FC<z.infer<typeof teemDrop14Schema>> = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const clamp = { extrapolateLeft: "clamp" as const, extrapolateRight: "clamp" as const };

  // Phase 0: window entry
  const winEntry = spring({ frame, fps, config: { damping: 20, stiffness: 110 } });
  const sweepX = interpolate(frame, [5, 22], [-120, 1580], { easing: Easing.bezier(0.4, 0, 0.2, 1), ...clamp });

  // Phase 2: grid scroll
  const scrollOffset = interpolate(frame, [85, 145], [0, -220], { easing: Easing.bezier(0.4, 0, 0.2, 1), ...clamp });

  // Phase 3: cursor hover over best-sellers (cards 0, 2, 4)
  const cursorVisible = frame >= 105;

  // Cursor path: card 0 → card 2 → card 4
  const target0X = 80 + 0 * (CARD_W + GAP) + CARD_W / 2;
  const target0Y = 64 + 48 + 48 + 0 * (CARD_H + GAP) + CARD_H / 2;
  const target2X = 80 + 2 * (CARD_W + GAP) + CARD_W / 2;
  const target4X = 80 + 0 * (CARD_W + GAP) + CARD_W / 2;
  const target4Y = 64 + 48 + 48 + 1 * (CARD_H + GAP) + CARD_H / 2;

  const cursorX = interpolate(
    frame,
    [105, 125, 140, 158],
    [200, target0X, target2X, target4X],
    { easing: Easing.bezier(0.4, 0, 0.2, 1), ...clamp }
  );
  const cursorY = interpolate(
    frame,
    [105, 125, 140, 158],
    [300, target0Y + scrollOffset, target0Y + scrollOffset, target4Y + scrollOffset],
    { easing: Easing.bezier(0.4, 0, 0.2, 1), ...clamp }
  );

  // Hover highlight by card
  function isHovered(idx: number) {
    if (!cursorVisible) return false;
    if (idx === 0 && frame >= 125 && frame < 140) return true;
    if (idx === 2 && frame >= 140 && frame < 158) return true;
    if (idx === 4 && frame >= 158 && frame < 173) return true;
    return false;
  }

  // Best-seller border dash animation
  const bsDash = interpolate(frame, [125, 145], [200, 0], clamp);

  // Phase 4: insight panel
  const panelEntry = spring({ frame: Math.max(0, frame - 155), fps, config: { damping: 18, stiffness: 120 } });
  const b1Entry = spring({ frame: Math.max(0, frame - 165), fps, config: { damping: 18, stiffness: 120 } });
  const b2Entry = spring({ frame: Math.max(0, frame - 171), fps, config: { damping: 18, stiffness: 120 } });
  const b3Entry = spring({ frame: Math.max(0, frame - 177), fps, config: { damping: 18, stiffness: 120 } });
  const ctaEntry = spring({ frame: Math.max(0, frame - 178), fps, config: { damping: 18, stiffness: 120 } });

  const showPanel = frame >= 155;

  const WIN_X = 170;
  const WIN_Y = 80;
  const WIN_W = 1580;
  const WIN_H = 920;

  return (
    <AbsoluteFill style={{ background: "#1A1A2E", fontFamily: "'Plus Jakarta Sans', sans-serif", overflow: "hidden" }}>
      {/* Outer bg dark */}
      <div style={{
        position: "absolute",
        left: WIN_X,
        top: WIN_Y,
        width: WIN_W,
        height: WIN_H,
        borderRadius: 12,
        background: "#FAFAF8",
        boxShadow: "0 0 0 1px rgba(0,0,0,0.08), 0 32px 100px rgba(0,0,0,0.7)",
        overflow: "hidden",
        opacity: winEntry,
        transform: `translateY(${(1 - winEntry) * 40}px) scale(${0.97 + 0.03 * winEntry})`,
      }}>

        {/* Sweep */}
        {frame < 25 && (
          <div style={{
            position: "absolute",
            left: sweepX - 60,
            top: 0,
            bottom: 0,
            width: 60,
            background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.6), transparent)",
            zIndex: 100,
            pointerEvents: "none",
          }} />
        )}

        {/* Top bar */}
        <div style={{ height: 44, background: "#F5F5F3", display: "flex", alignItems: "center", padding: "0 16px", gap: 8, borderBottom: "1px solid #E5E7EB" }}>
          <div style={{ display: "flex", gap: 6 }}>
            <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#EF4444" }} />
            <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#F59E0B" }} />
            <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#10B981" }} />
          </div>
          <div style={{ flex: 1, display: "flex", justifyContent: "center" }}>
            <div style={{ background: "#EBEBEB", borderRadius: 6, padding: "4px 16px", fontSize: 12, color: "#6B7280", fontWeight: 400 }}>
              etsy.com/search?q=t-shirt+fête+des+pères
            </div>
          </div>
        </div>

        {/* Marketplace header */}
        <div style={{ height: 64, background: "#FFFFFF", display: "flex", alignItems: "center", padding: "0 24px", gap: 20, borderBottom: "1px solid #E5E7EB" }}>
          <div style={{ fontSize: 22, fontWeight: 800, fontStyle: "italic", color: "#F97316", marginRight: 16 }}>Artisly</div>
          <div style={{ flex: 1, maxWidth: 560, position: "relative" }}>
            <div style={{ border: "2px solid #F97316", borderRadius: 8, padding: "8px 16px", fontSize: 14, color: "#374151", background: "#FAFAFA" }}>
              t-shirt fête des pères
            </div>
          </div>
          <div style={{ marginLeft: "auto", display: "flex", gap: 14 }}>
            {/* Heart icon */}
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#6B7280" strokeWidth="2">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
            {/* Cart icon */}
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#6B7280" strokeWidth="2">
              <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" fill="none" strokeLinejoin="round" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <path d="M16 10a4 4 0 01-8 0" fill="none" />
            </svg>
          </div>
        </div>

        {/* Filter bar */}
        <div style={{ height: 48, background: "#F9F9F7", display: "flex", alignItems: "center", padding: "0 80px", gap: 16, borderBottom: "1px solid #E5E7EB" }}>
          <span style={{ fontSize: 14, color: "#374151", fontWeight: 500, marginRight: 8 }}>2 847 résultats</span>
          {["Livraison rapide", "Prix : 15-40€", "Personnalisable"].map(chip => (
            <div key={chip} style={{ background: "#FFF7ED", border: "1px solid #FED7AA", borderRadius: 20, padding: "4px 12px", fontSize: 13, color: "#EA580C", fontWeight: 500 }}>
              {chip}
            </div>
          ))}
          <div style={{ marginLeft: "auto", fontSize: 13, color: "#6B7280" }}>Trier : Pertinence</div>
        </div>

        {/* Product grid */}
        <div style={{ padding: "24px 80px", overflow: "hidden", height: WIN_H - 44 - 64 - 48 - 24 }}>
          <div style={{ transform: `translateY(${scrollOffset}px)`, display: "grid", gridTemplateColumns: `repeat(${COLS}, ${CARD_W}px)`, gap: GAP }}>
            {PRODUCTS.map((product, idx) => {
              const row = Math.floor(idx / COLS);
              const col = idx % COLS;
              const delay = row * 8 + col * 3;
              const cardEntry = spring({ frame: Math.max(0, frame - 25 - delay), fps, config: { damping: 16, stiffness: 120 } });
              const hovered = isHovered(idx);
              const isBestSeller = product.badge === "BEST-SELLER";

              return (
                <div key={idx} style={{
                  width: CARD_W,
                  height: CARD_H,
                  background: "#FFFFFF",
                  borderRadius: 12,
                  border: hovered ? "2px solid #EF4444" : "1px solid #E5E7EB",
                  overflow: "hidden",
                  position: "relative",
                  opacity: cardEntry,
                  transform: `translateY(${(1 - cardEntry) * 20}px) scale(${0.95 + 0.05 * cardEntry})`,
                  boxShadow: hovered ? "0 4px 20px rgba(239,68,68,0.15)" : "0 2px 8px rgba(0,0,0,0.06)",
                  transition: "box-shadow 0.2s",
                }}>
                  {/* Hover border svg for best-sellers */}
                  {hovered && isBestSeller && (
                    <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", zIndex: 5, pointerEvents: "none" }}>
                      <rect x="1" y="1" width={CARD_W - 2} height={CARD_H - 2} rx="11" fill="none"
                        stroke="#EF4444" strokeWidth="2"
                        strokeDasharray="200"
                        strokeDashoffset={bsDash}
                      />
                    </svg>
                  )}

                  {/* Badges */}
                  {product.badge === "BEST-SELLER" && (
                    <div style={{ position: "absolute", top: 10, left: 10, background: "#EF4444", borderRadius: 4, padding: "3px 7px", fontSize: 10, fontWeight: 700, color: "white", zIndex: 2 }}>
                      BEST-SELLER
                    </div>
                  )}
                  {product.badge === "-20%" && (
                    <div style={{ position: "absolute", top: 10, right: 10, background: "#10B981", borderRadius: 4, padding: "3px 7px", fontSize: 10, fontWeight: 700, color: "white", zIndex: 2 }}>
                      -20%
                    </div>
                  )}
                  {product.badge === "PERSO" && (
                    <div style={{ position: "absolute", bottom: 130, left: 10, background: "#F97316", borderRadius: 4, padding: "3px 7px", fontSize: 10, fontWeight: 700, color: "white", zIndex: 2 }}>
                      PERSO
                    </div>
                  )}

                  {/* Image zone */}
                  <div style={{ height: 220, background: product.bg, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <TShirtSVG color={product.color} />
                  </div>

                  {/* Text zone */}
                  <div style={{ padding: "12px 14px", height: 120 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: "#111827", lineHeight: 1.3, marginBottom: 5, overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" }}>
                      {product.title}
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 5 }}>
                      <StarRating stars={product.stars} />
                      <span style={{ fontSize: 11, color: "#9CA3AF" }}>({product.reviews})</span>
                    </div>
                    <div style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
                      <span style={{ fontSize: 17, fontWeight: 700, color: "#111827" }}>{product.price}</span>
                      {product.oldPrice && <span style={{ fontSize: 13, color: "#9CA3AF", textDecoration: "line-through" }}>{product.oldPrice}</span>}
                    </div>
                    <div style={{ fontSize: 11, color: "#6B7280", marginTop: 3 }}>{product.seller}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Cursor */}
      {cursorVisible && (
        <svg style={{ position: "absolute", left: WIN_X + cursorX - 8, top: WIN_Y + 44 + 64 + 48 + 24 + cursorY - 4, pointerEvents: "none", zIndex: 20 }} width="24" height="32" viewBox="0 0 24 32" fill="none">
          <path d="M2 2 L2 22 L7 17 L11 27 L14 26 L10 16 L18 16Z" fill="white" stroke="#1A1A2E" strokeWidth="1.5" strokeLinejoin="round" />
        </svg>
      )}

      {/* Insight panel */}
      {showPanel && (
        <div style={{
          position: "absolute",
          left: 960 - 300,
          top: 540 - 140,
          width: 600,
          background: "rgba(15,23,42,0.97)",
          borderRadius: 16,
          padding: "28px 32px",
          border: "1px solid rgba(255,255,255,0.1)",
          boxShadow: "0 24px 80px rgba(0,0,0,0.8)",
          opacity: panelEntry,
          transform: `scale(${0.85 + 0.15 * panelEntry})`,
          zIndex: 30,
        }}>
          <div style={{ fontSize: 20, fontWeight: 700, color: "#FFFFFF", marginBottom: 20 }}>
            📊 Ce que les données montrent
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {[
              { text: "Niche humour & métier : meilleures ventes en juin", spring: b1Entry },
              { text: "Prix moyen gagnant : 20–26€", spring: b2Entry },
              { text: 'Mots-clés : "papa", "fête", "personnalisable"', spring: b3Entry },
            ].map(({ text, spring: s }, i) => (
              <div key={i} style={{ display: "flex", gap: 12, alignItems: "flex-start", opacity: s, transform: `translateX(${(1 - s) * -10}px)` }}>
                <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#F97316", marginTop: 7, flexShrink: 0 }} />
                <span style={{ fontSize: 16, color: "#E2E8F0", lineHeight: 1.5 }}>{text}</span>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div style={{
            marginTop: 24,
            display: "flex",
            justifyContent: "center",
            opacity: ctaEntry,
            transform: `translateY(${(1 - ctaEntry) * 8}px)`,
          }}>
            <div style={{
              background: "#F97316",
              borderRadius: 10,
              padding: "12px 28px",
              fontSize: 17,
              fontWeight: 700,
              color: "white",
              cursor: "pointer",
            }}>
              Créer mon design →
            </div>
          </div>
        </div>
      )}
    </AbsoluteFill>
  );
};
