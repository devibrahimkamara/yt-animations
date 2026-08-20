# Design System — Atmos Animations (Ibrahim Kamara / YouTube SaaS)

## Brand

A premium, high-tech visual identity for a French-speaking YouTube creator teaching SaaS app development with AI. The aesthetic is cinematic dark-tech — Aurora-lit glassmorphism with bold typographic statements.

## Colors

| Role              | Value                          | Notes                                  |
| ----------------- | ------------------------------ | -------------------------------------- |
| Background        | `#030818`                      | Deep navy-black, not pure black        |
| Surface / Card    | `rgba(20, 40, 120, 0.55)`      | Blue-tinted glass with transparency    |
| Surface border    | `rgba(80, 130, 255, 0.22)`     | Semi-transparent blue glow border      |
| Foreground        | `#ffffff`                      | Primary text                           |
| Muted text        | `rgba(136, 170, 255, 0.85)`    | Secondary text, labels                 |
| Dimmed text       | `rgba(136, 170, 255, 0.50)`    | Tertiary, metadata                     |
| Accent blue       | `#3060ff`                      | Primary accent                         |
| Accent gold       | `#ffd700`                      | Revenue, success, highlights           |
| Accent green      | `#22c55e`                      | Positive states, validation            |
| Accent red        | `#ef4444`                      | Negative, jealousy, warnings           |
| Aurora blob 1     | `rgba(20, 60, 220, 0.75)`      | Background animated blob               |
| Aurora blob 2     | `rgba(40, 90, 255, 0.60)`      | Background animated blob               |
| Aurora blob 3     | `rgba(10, 30, 160, 0.70)`      | Background animated blob               |

## Typography

- **Display / Hero**: Plus Jakarta Sans, weight 800, tracking -0.02em
- **Heading**: Plus Jakarta Sans, weight 700, tracking -0.01em
- **Body / Label**: Plus Jakarta Sans, weight 600, tracking 0.01em
- **Monospace / Data**: Plus Jakarta Sans, weight 400, `font-variant-numeric: tabular-nums`

Minimum sizes for video:
- Hero titles: 80–160px
- Section labels: 48–64px
- Body text: 28–40px
- Data labels: 22–32px

## Corners & Depth

- Cards: `border-radius: 28–36px`
- Chips / badges: `border-radius: 50px`
- Glow: `box-shadow: 0 0 60px <accent>30, 0 0 120px <accent>15`
- Glass inset: `inset 0 1px 0 rgba(255,255,255,0.08)`
- Depth: layered glow — atmospheric + focal

## Aurora Background

Every animation uses a persistent animated background:
- 3–5 large blurred radial blobs (400–800px, `filter: blur(120–160px)`)
- Each blob slowly oscillates position using GSAP sine-wave motion
- Attached to the main timeline with calculated repeat counts (never `repeat: -1`)
- Colors: blues and indigos from the palette

## Motion Signature

- **Easing signature**: `cubic-bezier(0.16, 1, 0.3, 1)` → GSAP equivalent: `"expo.out"`
- Entry eases: `expo.out`, `power3.out`, `back.out(1.4)` (vary across elements)
- Exit eases: `power3.in`, `expo.in`
- Spring feel: `elastic.out(0.8, 0.4)` for pops and reveals
- Timing: 0.4–0.7s for content, 0.2–0.4s for accents, 1.0–2.0s for atmosphere

## Do's

- Aurora blobs in the background always moving
- Glassmorphism cards with subtle borders and glow
- Large, bold French text with dramatic reveals
- Mix of gold/blue/white for contrast and emphasis
- Euro signs (€) styled prominently

## Don'ts

- No pure black `#000` backgrounds — always use `#030818` or tinted dark
- No white backgrounds
- No thin fonts (< weight 600 for display)
- No static backgrounds — all decoratives must animate
- No more than one animation using the same structural concept
