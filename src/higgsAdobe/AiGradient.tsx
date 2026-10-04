import React from "react";
import { AI_FROM, AI_TO, AI_GRAD_ID } from "./theme";

// <defs> avec le dégradé « IA » (bleu de marque #3060ff → #88aaff), à placer une
// fois par <svg>. Référencer ensuite via fill={`url(#${AI_GRAD_ID})`} ou stroke.
export const AiGradientDefs: React.FC<{ id?: string; vertical?: boolean }> = ({
  id = AI_GRAD_ID,
  vertical = false,
}) => (
  <defs>
    <linearGradient id={id} x1="0" y1="0" x2={vertical ? "0" : "1"} y2={vertical ? "1" : "0"}>
      <stop offset="0%" stopColor={AI_FROM} />
      <stop offset="100%" stopColor={AI_TO} />
    </linearGradient>
  </defs>
);
