# EduBridge Learning Design Guidelines

## Absolute Rules (NO EXCEPTIONS)

1. **No Additional Text**: Do NOT add any new visible text (no placeholders, labels, extra headings, cookie banner, tooltips, helper copy)
2. **Exact Copy Only**: Use Approved Copy exactly as provided, character-for-character
3. **Fixed Color Palette**: Only use exact color variables + white + ultra-light neutral borders
4. **Preserve Structure**: Layout can be refined but section order and meaning must match
5. **Complete Implementation**: Fully working project with no TODOs or missing files

## Brand Color Tokens (CSS Variables)

- `--blue: #2F6BFF`
- `--mint: #34D399`
- `--yellow: #FFC83D`
- `--pink: #FF4D6D`
- `--navy: #0B1630`
- `--ink: #0F172A`
- `--muted: #64748B`
- `--card: #F8FAFF`
- `--bg: #FFFFFF`

**Allowed Neutrals**: white, borders like rgba(15,23,42,0.06), shadows with low opacity

## Typography (Premium)

- **Font**: Inter
- **Headings**: 800–900 weight, tight line height, slightly negative tracking
- **Kicker**: uppercase + wide letter spacing (0.2em), small size
- **Body**: 15–16px mobile, 16–18px desktop, line-height ~1.6

## Global UI Style

- **Layout**: Mobile-first, centered content column
- **Radii**: Extra round (cards 28–36px, buttons pill 9999px)
- **Cards**: 1px soft border + subtle shadow
- **Icon Chips**: Rounded-square with tinted background using brand colors at low opacity
- **Background**: Subtle radial/blur blobs (blue/mint) at extremely low opacity

## Motion & Scroll Ambience

- Smooth scrolling
- Reveal on scroll for sections/cards (fade + slight up + blur resolve)
- Tiny parallax background blobs on scroll
- Button micro-interactions (hover/press)
- Drawer: slide-in + backdrop blur fade
- **Respect prefers-reduced-motion**

## Component Structure & Visual Specs

**Navbar**
- Left: Blue rounded square with hamburger + "EduBridge" / "LEARNING" text stack
- Right: Pill button "GET STARTED" in blue with soft shadow

**Drawer**
- Full-height panel, navy background
- Top: rounded blue square with "E" + "EDUBRIDGE" text
- Exact menu sections from approved copy

**Hero**
- Emphasis: "BUILDING FUTURES" in blue, rest in ink
- Large pill CTA button

**Feature Cards (Why Choose)**
- Large, airy, soft border
- Icon chip near top-left
- 6 cards total

**Curriculum Options**
- Big rounded pills with small blue dot on left
- 3 options

**Step Bars (How It Works)**
- Big colored rounded bars: 01 blue, 02 mint, 03 yellow, 04 pink
- Step number + title inside
- Bullet points under first 3 steps only

**Promise Cards**
- Icon chip with soft tint (mint/blue/pink style)
- 3 cards

**Final CTA**
- Huge pill button matching hero style

**Footer**
- Dark navy background matching specifications

## Page Order (Must Match)

1. Navbar
2. Hero
3. Why Choose EduBridge Learning (6 cards)
4. Curriculum (3 options)
5. Subjects (4 items)
6. How EduBridge Learning Works (4 steps)
7. Who EduBridge Learning is Perfect For (5 checklist items)
8. Our Promise (3 cards)
9. Ready to Get Started (CTA)
10. Drawer + dark navy footer area

## Images

No hero image specified. Focus on typography, color, and component design with ambient background elements only.