import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, Easing, spring } from "remotion";
import { z } from "zod";

export const teemDrop11Schema = z.object({});

const USER_MESSAGE = "Donne-moi des idées de niches pour des T-shirts à vendre autour de la Fête des Pères";

const AI_IDEAS = [
  { title: "Papa Bricoleur", subtitle: 'Outils · Réparations · "Mon papa répare tout"' },
  { title: "Papa Cuisinier", subtitle: 'Recettes · Barbecue · "Chef de famille"' },
  { title: "Papa Football", subtitle: "Équipe favorite · Couleurs du club" },
  { title: "Papa Humour", subtitle: "Citations drôles · Blagues de papa" },
  { title: "Papa au Travail", subtitle: 'Métier + fierté : "Papa Pompier", "Papa Médecin"' },
  { title: "Papa Gamer", subtitle: 'Manettes · Niveaux · "Meilleur joueur de la famille"' },
];

const HISTORY_ITEMS = [
  "T-shirts Halloween 2026",
  "Niches Fête des Mères",
  "Designs beach été",
  "Citations motivantes",
];

export const TeemDrop11: React.FC<z.infer<typeof teemDrop11Schema>> = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const clamp = { extrapolateLeft: "clamp" as const, extrapolateRight: "clamp" as const };

  // Phase 0: window entry
  const winEntry = spring({ frame, fps, config: { damping: 18, stiffness: 100, mass: 1.3 } });
  const sweepX = interpolate(frame, [10, 28], [-120, 1400], { easing: Easing.bezier(0.4, 0, 0.2, 1), ...clamp });
  const sidebarEl = spring({ frame: Math.max(0, frame - 15), fps, config: { damping: 16, stiffness: 120 } });

  // Phase 1: typing
  const charsShown = Math.floor(interpolate(
    frame,
    [30, 38, 42, 55, 59, 68, 72, 80],
    [0, 8, 8, 35, 35, 58, 58, USER_MESSAGE.length],
    clamp
  ));
  const typedText = USER_MESSAGE.substring(0, charsShown);
  const sendBtnActive = frame >= 78;
  const userBubbleEntry = spring({ frame: Math.max(0, frame - 82), fps, config: { damping: 16, stiffness: 140 } });
  const showUserBubble = frame >= 82;

  // Phase 2: AI typing indicator
  const showTyping = frame >= 90 && frame < 118;

  // Phase 3: AI response
  const introChars = Math.floor(interpolate(frame, [118, 138], [0, 74], clamp));
  const introText = "Voici 6 idées de niches pour des T-shirts autour de la Fête des Pères 🎁".substring(0, introChars);

  const ideaFrames = [145, 157, 169, 181, 193, 205];
  const ideaEntries = ideaFrames.map(f => spring({ frame: Math.max(0, frame - f), fps, config: { damping: 18, stiffness: 120 } }));

  // Scroll: content moves up as ideas appear
  const ideasVisible = ideaFrames.filter(f => frame >= f).length;
  const contentScrollTarget = -Math.max(0, ideasVisible - 2) * 58;
  const contentScroll = spring({ frame: Math.max(0, frame - (ideaFrames[2] ?? 0)), fps, config: { damping: 18, stiffness: 120 } });
  const contentTranslateY = contentScrollTarget * Math.min(1, contentScroll);

  // Conseil
  const conseilEntry = spring({ frame: Math.max(0, frame - 228), fps, config: { damping: 18, stiffness: 120 } });
  const showConseil = frame >= 228;

  // Phase 4: cursor
  const cursorVisible = frame >= 215;
  const cursorX = interpolate(frame, [215, 240, 248], [300, 900, 900], { easing: Easing.bezier(0.4, 0, 0.2, 1), ...clamp });
  const cursorY = interpolate(frame, [215, 240], [500, 320 + contentTranslateY], { easing: Easing.bezier(0.4, 0, 0.2, 1), ...clamp });
  const hover1 = frame >= 240 && frame < 260;
  const clicked = frame >= 248 && frame < 255;
  const badgeEntry = spring({ frame: Math.max(0, frame - 248), fps, config: { damping: 16, stiffness: 160 } });
  const showBadge = frame >= 248;

  const WIN_X = 260;
  const WIN_Y = 130;
  const WIN_W = 1400;
  const WIN_H = 820;
  const SIDEBAR_W = 240;

  return (
    <AbsoluteFill style={{ background: "linear-gradient(160deg, #0F172A 0%, #020617 100%)", fontFamily: "'Plus Jakarta Sans', sans-serif", overflow: "hidden" }}>
      {/* Aurora */}
      <div style={{ position: "absolute", top: -200, left: 400, width: 600, height: 400, borderRadius: "50%", background: "radial-gradient(circle, rgba(249,115,22,0.04) 0%, transparent 70%)" }} />

      {/* Chat window */}
      <div style={{
        position: "absolute",
        left: WIN_X,
        top: WIN_Y,
        width: WIN_W,
        height: WIN_H,
        borderRadius: 16,
        background: "#0D1117",
        border: "1px solid rgba(255,255,255,0.08)",
        boxShadow: "0 32px 100px rgba(0,0,0,0.8)",
        overflow: "hidden",
        opacity: winEntry,
        transform: `translateY(${(1 - winEntry) * 60}px) scale(${0.96 + 0.04 * winEntry})`,
        display: "flex",
        flexDirection: "column",
      }}>

        {/* Sweep */}
        {frame < 30 && (
          <div style={{
            position: "absolute",
            left: sweepX - 60,
            top: 0, bottom: 0,
            width: 60,
            background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.05), transparent)",
            zIndex: 100,
            pointerEvents: "none",
          }} />
        )}

        {/* Top bar */}
        <div style={{ height: 48, background: "#0D1117", borderBottom: "1px solid rgba(255,255,255,0.06)", display: "flex", alignItems: "center", padding: "0 18px", flexShrink: 0 }}>
          <div style={{ display: "flex", gap: 7 }}>
            <div style={{ width: 13, height: 13, borderRadius: "50%", background: "#EF4444" }} />
            <div style={{ width: 13, height: 13, borderRadius: "50%", background: "#F59E0B" }} />
            <div style={{ width: 13, height: 13, borderRadius: "50%", background: "#10B981" }} />
          </div>
          <div style={{ flex: 1, textAlign: "center", fontSize: 15, fontWeight: 600, color: "#E2E8F0" }}>Claude — Nouvelle conversation</div>
          {/* More icon */}
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <circle cx="4" cy="10" r="1.5" fill="#64748B" />
            <circle cx="10" cy="10" r="1.5" fill="#64748B" />
            <circle cx="16" cy="10" r="1.5" fill="#64748B" />
          </svg>
        </div>

        {/* Body */}
        <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>
          {/* Sidebar */}
          <div style={{ width: SIDEBAR_W, background: "#090D12", borderRight: "1px solid rgba(255,255,255,0.05)", display: "flex", flexDirection: "column", padding: "16px 12px", gap: 8, flexShrink: 0, opacity: sidebarEl, transform: `translateX(${(1 - sidebarEl) * -8}px)` }}>
            {/* New conv button */}
            <div style={{ background: "rgba(249,115,22,0.15)", border: "1px solid rgba(249,115,22,0.3)", borderRadius: 8, padding: "9px 12px", fontSize: 14, fontWeight: 600, color: "#F97316", display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><line x1="8" y1="2" x2="8" y2="14" stroke="#F97316" strokeWidth="2" strokeLinecap="round" /><line x1="2" y1="8" x2="14" y2="8" stroke="#F97316" strokeWidth="2" strokeLinecap="round" /></svg>
              Nouvelle conv.
            </div>

            {/* Recent label */}
            <div style={{ fontSize: 11, fontWeight: 600, color: "#475569", letterSpacing: "0.1em", padding: "4px 4px", marginBottom: 4 }}>RÉCENT</div>

            {/* History items */}
            {HISTORY_ITEMS.map((item, i) => (
              <div key={i} style={{ padding: "8px 10px", borderRadius: 7, fontSize: 13, color: "#94A3B8", overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis", cursor: "pointer" }}>
                {item}
              </div>
            ))}

            {/* Profile */}
            <div style={{ marginTop: "auto", display: "flex", alignItems: "center", gap: 8, padding: "10px 4px", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
              <div style={{ width: 32, height: 32, borderRadius: "50%", background: "linear-gradient(135deg, #3B82F6, #8B5CF6)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700, color: "white" }}>IK</div>
              <span style={{ fontSize: 13, color: "#94A3B8", fontWeight: 500 }}>Ibrahim K.</span>
            </div>
          </div>

          {/* Chat area */}
          <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
            {/* Messages */}
            <div style={{ flex: 1, overflowY: "hidden", padding: "24px 32px", display: "flex", flexDirection: "column", gap: 18 }}>
              <div style={{ transform: `translateY(${contentTranslateY}px)`, display: "flex", flexDirection: "column", gap: 18 }}>

                {/* User message bubble */}
                {showUserBubble && (
                  <div style={{ display: "flex", justifyContent: "flex-end", gap: 12, alignItems: "flex-end", opacity: userBubbleEntry, transform: `translateY(${(1 - userBubbleEntry) * 14}px)` }}>
                    <div style={{ maxWidth: 680, background: "#1E3A5F", borderRadius: "18px 18px 4px 18px", padding: "14px 18px", fontSize: 15, color: "#E2E8F0", lineHeight: 1.6 }}>
                      {USER_MESSAGE}
                    </div>
                    <div style={{ width: 36, height: 36, borderRadius: "50%", background: "linear-gradient(135deg, #3B82F6, #8B5CF6)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700, color: "white", flexShrink: 0 }}>IK</div>
                  </div>
                )}

                {/* AI typing indicator */}
                {showTyping && (
                  <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                    <div style={{ width: 32, height: 32, borderRadius: 8, background: "rgba(249,115,22,0.15)", border: "1px solid rgba(249,115,22,0.3)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <span style={{ fontSize: 14, color: "#F97316", fontWeight: 800 }}>◆</span>
                    </div>
                    <div style={{ background: "rgba(255,255,255,0.04)", borderRadius: "18px 18px 18px 4px", padding: "14px 18px", display: "flex", flexDirection: "column", gap: 6 }}>
                      <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                        {[0, 1, 2].map(i => (
                          <div key={i} style={{ width: 8, height: 8, borderRadius: "50%", background: "#F97316", opacity: 0.3 + 0.7 * (Math.sin(frame / 8 + i * 0.8) * 0.5 + 0.5) }} />
                        ))}
                      </div>
                      <span style={{ fontSize: 13, color: "#64748B" }}>Claude réfléchit...</span>
                    </div>
                  </div>
                )}

                {/* AI response */}
                {frame >= 118 && (
                  <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                    <div style={{ width: 32, height: 32, borderRadius: 8, background: "rgba(249,115,22,0.15)", border: "1px solid rgba(249,115,22,0.3)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 2 }}>
                      <span style={{ fontSize: 14, color: "#F97316", fontWeight: 800 }}>◆</span>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 12, flex: 1 }}>
                      {/* Intro */}
                      {introText && (
                        <div style={{ fontSize: 15, color: "#E2E8F0", lineHeight: 1.6 }}>{introText}</div>
                      )}

                      {/* Ideas */}
                      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                        {AI_IDEAS.map((idea, i) => {
                          if (frame < ideaFrames[i]) return null;
                          const entry = ideaEntries[i];
                          const isHover1 = hover1 && i === 0;
                          const isClicked = clicked && i === 0;
                          return (
                            <div key={i} style={{
                              background: isHover1 ? "rgba(59,130,246,0.1)" : "rgba(255,255,255,0.03)",
                              border: isHover1 ? "1px solid rgba(59,130,246,0.3)" : "1px solid rgba(255,255,255,0.06)",
                              borderRadius: 10,
                              padding: "10px 14px",
                              opacity: entry,
                              transform: `translateY(${(1 - entry) * 10}px) scale(${isClicked ? 0.97 : 1})`,
                              position: "relative",
                            }}>
                              <div style={{ fontSize: 14, fontWeight: 600, color: "#FFFFFF" }}>{idea.title}</div>
                              <div style={{ fontSize: 13, color: "#64748B", marginTop: 2 }}>{idea.subtitle}</div>

                              {/* Badge "Sélectionnée" */}
                              {showBadge && i === 0 && (
                                <div style={{
                                  position: "absolute",
                                  right: 12,
                                  top: "50%",
                                  transform: `translateY(-50%) scale(${badgeEntry})`,
                                  background: "rgba(59,130,246,0.2)",
                                  border: "1px solid rgba(59,130,246,0.5)",
                                  borderRadius: 6,
                                  padding: "3px 8px",
                                  fontSize: 12,
                                  fontWeight: 600,
                                  color: "#93C5FD",
                                }}>
                                  ✓ Sélectionnée
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>

                      {/* Conseil */}
                      {showConseil && (
                        <div style={{ display: "flex", gap: 8, opacity: conseilEntry, transform: `translateY(${(1 - conseilEntry) * 8}px)` }}>
                          <span style={{ fontSize: 14, color: "#F97316", fontWeight: 700 }}>💡 Conseil :</span>
                          <span style={{ fontSize: 14, color: "#94A3B8", lineHeight: 1.5 }}>les niches humour et métier se vendent le mieux en juin.</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Input bar */}
            <div style={{ height: 64, borderTop: "1px solid rgba(255,255,255,0.06)", display: "flex", alignItems: "center", padding: "0 24px", gap: 14, flexShrink: 0 }}>
              <div style={{ flex: 1, background: "rgba(255,255,255,0.04)", borderRadius: 10, border: "1px solid rgba(255,255,255,0.08)", padding: "10px 16px", fontSize: 15, color: frame >= 82 ? "#475569" : "#E2E8F0", minHeight: 40, display: "flex", alignItems: "center" }}>
                {frame < 82 ? (
                  <span>
                    {typedText}
                    {frame >= 30 && frame < 82 && <span style={{ opacity: Math.floor(frame / 15) % 2 === 0 ? 1 : 0, color: "#94A3B8" }}>|</span>}
                  </span>
                ) : (
                  <span style={{ color: "#475569" }}>Envoyer un message à Claude...</span>
                )}
              </div>
              {/* Send button */}
              <div style={{
                width: 40,
                height: 40,
                borderRadius: 8,
                background: sendBtnActive ? "#F97316" : "rgba(255,255,255,0.06)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
                transition: "background 0.2s",
              }}>
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                  <path d="M16 9L2 2L6 9L2 16L16 9Z" fill={sendBtnActive ? "white" : "#475569"} />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mouse cursor */}
      {cursorVisible && (
        <svg style={{ position: "absolute", left: WIN_X + cursorX - 8, top: WIN_Y + cursorY - 4, pointerEvents: "none", zIndex: 20, transform: `scale(${clicked ? 0.9 : 1})` }} width="24" height="32" viewBox="0 0 24 32" fill="none">
          <path d="M2 2 L2 22 L7 17 L11 27 L14 26 L10 16 L18 16Z" fill="white" stroke="#0F172A" strokeWidth="1.5" strokeLinejoin="round" />
        </svg>
      )}
    </AbsoluteFill>
  );
};
