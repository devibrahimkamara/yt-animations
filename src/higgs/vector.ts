// Générateurs de portraits/silhouettes vectoriels en data-URI SVG.
// Le brief supposait une vraie photo pour les Anims 1 et 9 ; on reste 100 %
// vectoriel (même technique que Higgs2Anim08) pour garder la cohérence de
// charte et éviter une dépendance à un asset externe. Les composants exposent
// une prop `portraitSrc` / `faceSrc` : passer une vraie image la remplace sans
// toucher au code.

const svg = (body: string, w: number, h: number) =>
  `data:image/svg+xml;utf8,${encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' width='${w}' height='${h}' viewBox='0 0 ${w} ${h}'>${body}</svg>`,
  )}`;

// Buste stylisé « anonyme » : tête + épaules en aplat, fond sombre.
export const bustSilhouette = ({
  w = 600,
  h = 800,
  tone = "#6b7ea6",
  bg = "transparent",
}: {
  w?: number;
  h?: number;
  tone?: string;
  bg?: string;
} = {}) =>
  svg(
    `${bg === "transparent" ? "" : `<rect width='100%' height='100%' fill='${bg}'/>`}
     <circle cx='${w / 2}' cy='${h * 0.3}' r='${w * 0.22}' fill='${tone}'/>
     <path d='M ${w * 0.1} ${h} C ${w * 0.1} ${h * 0.62}, ${w * 0.32} ${h * 0.52}, ${w / 2} ${h * 0.52} C ${w * 0.68} ${h * 0.52}, ${w * 0.9} ${h * 0.62}, ${w * 0.9} ${h} Z' fill='${tone}'/>`,
    w,
    h,
  );

// Portrait « influenceur IA » : buste + visage stylisé, couleurs chaudes et
// naturelles pour contraster avec le gris/flou du « avant ».
export const aiFacePortrait = ({
  w = 600,
  h = 800,
  skin = "#e8b58c",
  hair = "#3a2a22",
  shirt = "#c9d6e8",
  bg = "transparent",
}: {
  w?: number;
  h?: number;
  skin?: string;
  hair?: string;
  shirt?: string;
  bg?: string;
} = {}) => {
  const cx = w / 2;
  const faceCy = h * 0.34;
  const faceR = w * 0.2;
  return svg(
    `${
      bg === "transparent"
        ? ""
        : `<defs><linearGradient id='bg' x1='0' y1='0' x2='0' y2='1'><stop offset='0' stop-color='${bg}'/><stop offset='1' stop-color='#12151c'/></linearGradient></defs><rect width='100%' height='100%' fill='url(#bg)'/>`
    }
     <path d='M ${w * 0.08} ${h} C ${w * 0.08} ${h * 0.6}, ${w * 0.3} ${h * 0.5}, ${cx} ${h * 0.5} C ${w * 0.7} ${h * 0.5}, ${w * 0.92} ${h * 0.6}, ${w * 0.92} ${h} Z' fill='${shirt}'/>
     <rect x='${cx - w * 0.09}' y='${faceCy + faceR * 0.7}' width='${w * 0.18}' height='${h * 0.12}' rx='${w * 0.06}' fill='${skin}'/>
     <ellipse cx='${cx}' cy='${faceCy}' rx='${faceR}' ry='${faceR * 1.18}' fill='${skin}'/>
     <path d='M ${cx - faceR * 1.05} ${faceCy - faceR * 0.2} C ${cx - faceR} ${faceCy - faceR * 1.5}, ${cx + faceR} ${faceCy - faceR * 1.5}, ${cx + faceR * 1.05} ${faceCy - faceR * 0.2} C ${cx + faceR * 0.6} ${faceCy - faceR * 0.95}, ${cx - faceR * 0.6} ${faceCy - faceR * 0.95}, ${cx - faceR * 1.05} ${faceCy - faceR * 0.2} Z' fill='${hair}'/>
     <circle cx='${cx - faceR * 0.4}' cy='${faceCy - faceR * 0.05}' r='${faceR * 0.09}' fill='#2b2b2b'/>
     <circle cx='${cx + faceR * 0.4}' cy='${faceCy - faceR * 0.05}' r='${faceR * 0.09}' fill='#2b2b2b'/>
     <path d='M ${cx - faceR * 0.28} ${faceCy + faceR * 0.5} Q ${cx} ${faceCy + faceR * 0.72}, ${cx + faceR * 0.28} ${faceCy + faceR * 0.5}' stroke='#a9663f' stroke-width='${w * 0.012}' fill='none' stroke-linecap='round'/>`,
    w,
    h,
  );
};
