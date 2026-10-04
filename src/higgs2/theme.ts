// Identité visuelle partagée — vidéo « chaîne YouTube 100 % IA » (higgs2).
// Reprend la charte réelle du projet : Plus Jakarta Sans, bleu #3060ff,
// aurora background, glassmorphism. Ne PAS utiliser les placeholders du brief
// (#FF3B30, « ta couleur de marque », etc.).

import { Easing } from "remotion";

export {
  ATMOS_BLUE,
  ATMOS_BLUE_LIGHT,
  ATMOS_GOLD,
  ATMOS_ERROR,
  ATMOS_SUCCESS,
  ATMOS_PANEL_BG,
  atmosPanelBorder,
  atmosGlow,
  ATMOS_SPRING_POP,
  ATMOS_SPRING_BOUNCY,
  strokeDashDraw,
} from "../AtmosOverlay/theme";

// Alias sémantiques pour ce set d'animations
export const ACCENT = "#3060ff";
export const ACCENT_LIGHT = "#88aaff";
export const NEUTRAL_LINE = "#3A3A3C";
export const NEUTRAL_PANEL = "#2C2C2E";
export const NEUTRAL_BORDER = "#48484A";
export const INK = "#FFFFFF";
export const MONEY_GREEN = "#22c55e";
export const AD_YELLOW = "#FFD60A";
export const COIN_GOLD = "#FFD700";

// Couleurs de marques (usages spécifiques, volontairement hors charte)
export const YT_RED = "#FF0000";
export const FB_BLUE = "#1877F2";
export const IG_PINK = "#E1306C";
export const TIKTOK_BLACK = "#000000";
export const TIKTOK_CYAN = "#25F4EE";
export const TIKTOK_MAGENTA = "#FE2C55";
export const CLAUDE_TERRACOTTA = "#D97757";
export const CHATGPT_TEAL = "#10A37F";
export const DESATURATED = "#48484A";

// Easing signature du projet (cf. GlassCard, templates Verdant)
export const EASE = Easing.bezier(0.16, 1, 0.3, 1);

// Tailles de police — vidéo regardée majoritairement sur téléphone :
// tout doit être GRAND et lisible d'un coup d'œil sur un écran de 6 pouces
// (cf. mémoire feedback-mobile-sizing, renforcé par le retour d'Ibrahim).
export const FONT = {
  micro: 44, // textes secondaires / unités
  label: 66, // labels, titres de cartes
  value: 96, // sous-valeurs
  counter: 180, // gros compteurs
  hero: 250, // chiffre héros
} as const;

// Tailles d'emoji/icônes — minimum ~72px, 96-120px pour les éléments principaux
export const ICON = {
  sm: 72,
  md: 100,
  lg: 140,
} as const;

export const FONT_FAMILY_FALLBACK = "Plus Jakarta Sans, sans-serif";

// Pile d'emoji couleur, pour un rendu de glyphe stable et bien cadré
export const EMOJI_FONT =
  '"Apple Color Emoji", "Segoe UI Emoji", "Noto Color Emoji", sans-serif';
