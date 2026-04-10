# Slide-Gen Visual Design Spec

All slides are **1280×720px (16:9)**. Five color themes: `green`, `blue`, `pink`, `yellow`, `white`. Three font families: **Saans** (sans), **Saans Mono** (mono), **Serrif VF** (serif).

---

## 1. Cover Slide (`CoverSlide.tsx`)

**Layout:** Full-bleed background image + centered headline stack. Logo bottom-center.

| Element | Style |
|---|---|
| Background image | Opacity 0.35, draggable (mouseX/Y), zoomable (wheel, 1–3×) |
| Eyebrow | Saans Mono, 11px, 500, 0.12em letter-spacing, uppercase, `rgba(255,255,255,0.5)` |
| Eyebrow divider | 1px wide × 80px tall, `rgba(255,255,255,0.15)` |
| Headline | Serrif VF, 64px, 400, −0.02em, lh 1.1, centered, `top: 50% translateY(-50%)` |
| Subheadline | Saans, 14px, `rgba(255,255,255,0.5)`, `bottom: 80px` |
| Logo | `theme.logoOnDark`, 80px wide, opacity 0.5, bottom-center |
| Background color | `theme.darkBg` |

---

## 2. Section Slide (`SectionSlide.tsx`)

**Layout:** Dark bg with top-left number/label, accent bar + headline. Logo bottom-left.

| Element | Style |
|---|---|
| Number label | Saans Mono, 11px, 500, 0.12em letter-spacing, uppercase; 1px vertical divider (12px tall) |
| Headline | Serrif VF, 56px, 400, −0.02em, lh 1.15, max-width 700px |
| Accent bar | 3px wide, `theme.accentMid`, positioned left 48px |
| Background | `theme.darkBg` |
| Text | `theme.textOnDark` |
| Logo | `theme.logoOnDark` |

---

## 3. Diagram Slide (`DiagramSlide.tsx`)

**Layout:** Top headline strip (100px), full-height columns below with alternating backgrounds, 1px separators, 6px bottom accent bar.

| Element | Style |
|---|---|
| Headline | Serrif VF, 44px (scaled), −0.02em, lh 1.1 |
| Step number | Saans Mono, 11px, opacity 0.5 |
| Column header | Serrif VF, 32px (scaled), 600 weight, `accentMid` or white (depending on bg) |
| Column body | Saans, 16px (scaled), `theme.bodyOnLight`, lh 1.65 |
| Column header bg (set 1) | `#F5F5E8` text `#000d05` |
| Column header bg (set 2) | `#E8EEF5` text `#1a2a4d` |
| Column header bg (set 3) | `#F8E8F0` text `#3d0a2a` |
| Tag (optional) | Saans Mono, 10px, 600, 0.12em, uppercase, bordered `accentMid` |
| Column separators | 1px solid `theme.stroke` |
| Column header padding | 32px top, 28px bottom |
| Background | `theme.lightBg` |
| Bottom bar | 6px, `theme.accent` |
| Logo | 80px, `theme.logoOnLight` |

---

## 4. Stats Slide (`StatsSlide.tsx`)

**Layout:** Left column (480px) headline + thesis, vertical separator, right column with 3 metric cards. 6px bottom accent bar.

| Element | Style |
|---|---|
| Headline | Serrif VF, 44px (scaled), −0.02em, lh 1.1 |
| Thesis | Saans, 15px (scaled), lh 1.6; 3px left border `theme.accentMid`, padding-left 20px |
| Metric value | Serrif VF, 56px (scaled) |
| Metric label | Saans, 14px, `theme.mutedOnLight` |
| Metric card bg (green theme) | Olive `#F5F5E8` / teal `#E8EEF5` / magenta `#F8E8F0` |
| Metric card bg (other themes) | White |
| Separator | 1px `theme.stroke` |
| Bottom bar | 6px, `theme.accent` |
| Background | `theme.lightBg` |

---

## 5. Content Slide (`ContentSlide.tsx`)

**Layout:** Headline, 1px divider, N-column layout with accent dots at column tops. 6px bottom accent bar.

| Element | Style |
|---|---|
| Headline | Serrif VF, 44px (scaled), −0.02em, lh 1.1; top 64px, left/right 64px |
| Divider | 1px, `theme.stroke`, top 144px |
| Columns | top 168px, left/right 64px, bottom 96px |
| Column heading | Saans, 18px (scaled), 600 weight, margin-bottom 16px |
| Column body | Saans, 15px (scaled), `theme.bodyOnLight`, lh 1.65 |
| Accent dots | 8×8px, `theme.accentMid`, margin-bottom 16px |
| Column borders | 1px `theme.stroke` between columns |
| Column padding | 48px between columns |
| Bottom bar | 6px, `theme.accent` |
| Background | `theme.lightBg` |

---

## 6. Agenda Slide (`AgendaSlide.tsx`)

**Layout:** Left panel (480px) with dot pattern + logo. Right panel (800px) dark bg with title + numbered list.

| Element | Style |
|---|---|
| Left panel | `theme.agendaLeftBg` with `theme.agendaDotPattern` (radial-gradient, 24px spacing, 16px offset) |
| Right panel | `theme.darkBg` |
| Title | Serrif VF, 56px (scaled), −0.02em |
| Item number | Serrif VF, 18px, 700 weight, `theme.accentMid`, 28px min-width |
| Item text | Saans, 18px (scaled), lh 1.4, `theme.lightBg` color |
| Items top offset | 200px |
| Logo | 80px wide, `theme.logoOnDark` |

---

## 7. Hero Slide (`HeroSlide.tsx`)

**Layout:** Dark bg with dot pattern, large centered headline, top-center logo, customer logos bottom.

| Element | Style |
|---|---|
| Background | `theme.darkBg` with `theme.heroDotPattern` (radial-gradient, 20px spacing) |
| Headline | Serrif VF, 96px, 400, −0.02em, lh 1, centered, `top: 50% translateY(-55%)` |
| Headline color | `theme.accent` |
| Logo | `theme.logoOnDark`, 120px wide, top-center |
| "Trusted by" label | Saans Mono, 10px, uppercase, 0.12em letter-spacing, opacity 0.3, bottom 176px |
| Customer logos | Opacity 0.65, `filter: brightness(0) invert(1)`, flex row, 48px gap, bottom 96px |

---

## 8. Quote Slide (`QuoteSlide.tsx`)

**Layout:** Light bg + optional image (opacity 0.2), giant decorative quote mark, centered quote, attribution.

| Element | Style |
|---|---|
| Background image | Opacity 0.2 overlay |
| Quote mark | Serrif VF, 360px, `theme.accentMid`, opacity 0.08, positioned top −40px left 48px |
| Quote text | Serrif VF, 40px, −0.01em, lh 1.35, centered; `top: 50% translateY(-54%)` |
| Attribution separator | 32px wide × 2px, `theme.accentMid`, margin-bottom 12px |
| Attribution | Saans, 14px, 700 weight, centered |
| Background | `theme.lightBg` |
| Text | `theme.textOnLight` |

---

## 9. Back Cover Slide (`BackCoverSlide.tsx`)

**Layout:** Dark bg, flex center column, logo → CTA text → URL footer. 6px bottom accent bar.

| Element | Style |
|---|---|
| Logo | `theme.logoOnDark`, 220px wide, margin-bottom 32px |
| CTA text | Saans, 18px, 400, `rgba(255,255,255,0.6)`, max-width 640px, lh 1.4, white-space pre-line |
| URL | Saans Mono, 12px, 500, 0.08em letter-spacing, lowercase, `rgba(255,255,255,0.4)`, bottom 48px |
| Background | `theme.darkBg` |
| Bottom bar | 6px, `theme.accent` |

---

## 10. Three Column Slide (`ThreeColSlide.tsx`)

**Layout:** Headline top, horizontal rule at 120px, 3 equal columns with icon + heading + body.

| Element | Style |
|---|---|
| Headline | Serrif VF, 44px (scaled), −0.02em, lh 1.1 |
| Icon | 32px, `theme.accentMid` |
| Column header | Saans, 18px (scaled), 500 weight |
| Rule under header | 1px solid `theme.stroke`, margin-bottom 16px |
| Body | Saans, 14px (scaled), `theme.mutedOnLight`, lh 1.6 |
| Column separators | border-left 1px `theme.stroke` |
| Column padding | 32px between columns |
| Background | `theme.lightBg` |
| Text | `theme.textOnLight` / `theme.mutedOnLight` |

---

## 11. Feature List Slide (`FeatureListSlide.tsx`)

**Layout:** Headline, up to 5 feature rows (icon + title + body). 1px bottom borders between items.

| Element | Style |
|---|---|
| Headline | Serrif VF, 44px (scaled), −0.02em, lh 1.1 |
| Icon | 28px, `theme.accentMid`, width 40px, flex-shrink 0 |
| Title | Saans, 16px (scaled), 600 weight, width 220px (scaled), flex-shrink 0, margin-left 16px |
| Body | Saans, 14px (scaled), `theme.mutedOnLight`, lh 1.5, flex 1, margin-left 24px |
| Row height | 96px (scaled) |
| Row border | 1px bottom `theme.stroke` |
| Background | `theme.lightBg` |

---

## 12. Big Quote Slide (`BigQuoteSlide.tsx`)

**Layout:** Dark bg. Left content (680px or full width if no image), optional right image with gradient overlay.

| Element | Style |
|---|---|
| Left padding | 80px all sides |
| Quote mark | Serrif VF, 200px, `theme.accent`, opacity 0.3, lh 0.7, margin-bottom 16px |
| Quote text | Serrif VF, 36px (no image) or 48px (with image), −0.01em, lh 1.3, margin-bottom 40px |
| Accent rule | 40px wide × 2px, `theme.accent`, margin-bottom 20px |
| Attribution | Saans, 15px, 700 weight, margin-bottom 6px |
| Role | Saans, 13px, `rgba(255,255,255,0.45)` |
| Background | `theme.darkBg` |
| Right image overlay | `linear-gradient(to right, theme.darkBg 0%, transparent 30%)`, grayscale(20%) |
| Logo | `theme.logoOnDark`, 80px wide |
| Bottom bar | 6px, `theme.accent` |

---

## 13. Two Column Media Slide (`TwoColMediaSlide.tsx`)

**Layout:** Left text area (560px), right area image or decorative dot grid. Edge gradient blending.

| Element | Style |
|---|---|
| Left padding | 80px 72px |
| Background | `theme.lightBg` (left), `theme.darkBg` (right if no image) |
| Eyebrow | Saans Mono, 11px, 500, 0.12em, uppercase, `theme.accentMid`, margin-bottom 20px |
| Headline | Serrif VF, 48px (scaled), −0.02em, lh 1.15, margin-bottom 28px |
| Accent rule | 40px wide × 2px, `theme.accent`, margin-bottom 24px |
| Body | Saans, 17px (scaled), `theme.bodyOnLight`, lh 1.7 |
| Edge gradient | `linear-gradient(to right)` from bg color 0% → transparent 8% |
| No-image placeholder | Dot grid (32px spacing), center `✦` at 180px, opacity 0.15 |

---

## 14. Checklist Slide (`ChecklistSlide.tsx`)

**Layout:** Headline, checklist rows with interactive checkboxes. 1px bottom borders between items.

| Element | Style |
|---|---|
| Headline | Serrif VF, 44px (scaled), −0.02em, lh 1.1 |
| Checkbox | 24×24px, 2px solid `theme.accentMid`; filled + white checkmark when checked |
| Title | Saans, 16px (scaled), 600 weight, width 240px (scaled), margin-left 16px |
| Body | Saans, 14px (scaled), `theme.mutedOnLight`, lh 1.5, flex 1, margin-left 24px |
| Row height | 88px (scaled) |
| Row border | 1px bottom `theme.stroke` |
| Background | `theme.lightBg` |
| Interactive | Toggle checkbox on click |

---

## 15. Customer Story Slide (`CustomerStorySlide.tsx`)

**Layout:** Left column (528px) with quote + attribution, vertical separator at left 640px, right column with metric cards. 6px bottom accent bar.

| Element | Style |
|---|---|
| Customer label | Saans Mono, 11px, 500, 0.12em, uppercase, `theme.accentMid`, top 48px |
| Headline | Serrif VF, 36px, −0.01em, lh 1.25, margin-bottom 24px |
| Body | Saans, 14px, `theme.bodyOnLight`, lh 1.65, margin-bottom 32px |
| Attribution name | Saans, 13px, 600 weight |
| Avatar | 36px circular with initials |
| Vertical separator | 1px `theme.stroke`, left 640px |
| Metric value | Serrif VF, 48px, −0.02em, lh 1 |
| Metric label | Saans, 13px, `theme.mutedOnLight`, lh 1.4 |
| Metric left border | 3px solid `theme.accentMid` |
| Background | `theme.lightBg` |
| Bottom bar | 6px, `theme.accent` |

---

## 16. Full Image Slide (`FullImageSlide.tsx`)

**Layout:** Full-bleed image (draggable/zoomable), optional caption overlay at bottom.

| Element | Style |
|---|---|
| Image | Full bleed, imageX/imageY (0–100%) positioning, zoom 1–3× |
| Caption bg | `linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 100%)` |
| Caption text | Saans, 14px, `rgba(255,255,255,0.8)`, lh 1.5 |
| Caption padding | 32px 48px |
| No-image placeholder | Dot grid, 🖼 emoji (48px, opacity 0.2), 13px instruction text `rgba(255,255,255,0.3)` |
| Background | `theme.darkBg` |

---

## 17. Contact Slide (`ContactSlide.tsx`)

**Layout:** Dark bg, flex center column, headline, contact cards row (min-width 340px each).

| Element | Style |
|---|---|
| Headline | Serrif VF, 52px, −0.02em, lh 1.1, margin-bottom 56px |
| Card background | `rgba(255,255,255,0.06)` |
| Card border | 1px `theme.stroke` |
| Card padding | 40px 48px |
| Name | Serrif VF, 28px, −0.01em, margin-bottom 6px |
| Role | Saans, 13px, `rgba(255,255,255,0.45)`, margin-bottom 28px |
| Divider | 1px `theme.stroke`, 100% wide; margin 28px top / 24px bottom |
| Contact icon bg | `theme.accent` |
| Contact icon | Saans Mono, 10px, 700; color `theme.darkBg` |
| Contact value | Saans, 14px, `rgba(255,255,255,0.65)` |
| Contact row gap | 14px |
| Background | `theme.darkBg` |

---

## 18. Team Slide (`TeamSlide.tsx`)

**Layout:** Light bg, flex center column, headline, avatar grid (max-width 1100px).

| Element | Style |
|---|---|
| Headline | Serrif VF, 40px, −0.02em, lh 1.1, margin-bottom 56px |
| Avatar size | 140px (≤4 members) or 110px (>4 members) |
| Avatar border | 2px `theme.stroke` |
| Avatar bg | `theme.stroke` (no image) |
| Avatar initial | Serrif VF, avatarSize × 0.38, `theme.accent` |
| Grid gap | 48px (≤4 members) or 32px (>4 members) |
| Member name | Saans, 16px, 700 weight, centered, `theme.textOnLight` |
| Member role | Saans Mono, 10px, 500, 0.08em, uppercase, `theme.mutedOnLight` |
| Upload overlay | `rgba(0,0,0,0.55)`, opacity 0.25 → 1 on hover |
| Background | `theme.lightBg` |

---

## 19. Case Study Slide (`CaseStudySlide.tsx`)

**Layout:** Customer logo top-left, category label top-right, vertical divider at left 592px, left column (504px) with headline + stats, right column with image + optional quote.

| Element | Style |
|---|---|
| Logo | Top 40px left 64px, height 60px |
| Category | Saans Mono, 11px, uppercase, 0.12em, `theme.mutedOnLight`, top 52px right 64px |
| Vertical divider | 1px `theme.stroke`, top 32px → bottom 72px, left 592px |
| Headline | Serrif VF, 36px (scaled), −0.02em, lh 1.2 |
| Stat value | Serrif VF, 54px (scaled), −0.03em |
| Stat description | Saans, 14px (scaled), lh 1.45, `theme.bodyOnLight` |
| Stat row border | 1px top `theme.stroke` |
| Stat value width | 120px, flex-shrink 0 |
| Quote | Serrif VF, 15px (scaled), padding-top 18px |
| Quote attribution | Saans, 12px (scaled), 600 weight, `theme.mutedOnLight` |
| Image | object-fit cover, object-position 50% 20%, 1px `theme.stroke` border |
| Background | `theme.lightBg` |

---

## 20. Speaker Slide (`SpeakerSlide.tsx`)

**Layout:** Left column (548px) with name, role badge, quote. Vertical separator. Right column with headshot + company logo strip.

| Element | Style |
|---|---|
| Left padding | 56px 56px 80px 64px |
| Name | Serrif VF, 80px (scaled), −0.03em, lh 0.95, margin-bottom 20px |
| Role badge | Saans Mono, 13px (scaled), 500, 0.06em; padding 4px 10px; bg `${theme.accentMid}18`; color `theme.accentMid` |
| Accent rule | 32px wide × 3px, `theme.accentMid`, margin-bottom 20px |
| Quote | Serrif VF, 28px (scaled), −0.01em, lh 1.35 |
| Divider | 1px `theme.stroke`, margin 32px 0 72px |
| Headshot | object-fit cover, headshotX/Y positioning, headshotZoom 1–3×; 1px `theme.stroke` border |
| No-headshot placeholder | 👤 40px emoji + "Upload a headshot" text |
| Company logo strip | height 96px, max-height 48px for logo, max-width 220px; 1px `theme.stroke` top border |
| No-logo placeholder | 140×36px, "COMPANY LOGO" text |
| Background | `theme.lightBg` |

---

## 21. Chart Slide (`ChartSlide.tsx`)

**Layout:** 88px header strip (chart type label + "Edit in Chartwiz" link), SVG canvas below with title, subtitle, and chart. Optional painting bg overlay. AirOps logo bottom-right (optional). 4px `#00ff64` bottom bar.

### Chart Types

**Bar Chart** — vertical bars with gridlines (5 divisions)
- Bar width: `max(80, (canvasW / n) × 0.6)`
- Value labels: Saans 11px 600 weight, above bars
- Category labels: Saans 11px, below bars
- Axis line: 1.5px `theme.axisTick`
- Highlight bar: `barAccent` fill with `#8a9600` stroke

**Ranked Bar** — horizontal bars, left-aligned labels
- Bar height: `max(32, (canvasH / n) × 0.6)`
- Label width: `max(200, W × 0.28)`
- Value labels right of bar

**Line Chart** — polyline with rounded joins
- Circle points: r=4
- Grid lines: 5 divisions
- Point labels below x-axis

**Pie Chart** — SVG path slices
- Labels: shown when slice > 4%
- Legend: colored squares with labels
- Fill colors cycle: `barFill → lineStroke → barAccent → barStroke → axisTick`

**Stat Display** — large centered value
- Value: 96px, `barAccent` color
- Label: 20px
- Sub-label: 14px (optional)

**Table**
- Header row: dark bg, white text, Saans Mono 12px 600 uppercase
- Data rows: alternating white and bg color
- Cell padding: 12–16px vertical (scales by row count), 20px horizontal
- Header borders: `rgba(255,255,255,0.1)`; data borders: `theme.stroke`

### Chart Color Modes

| Mode | bg | title | barFill | barStroke | barAccent | lineStroke |
|---|---|---|---|---|---|---|
| Light | `#F8FFFB` | `#000d05` | `#CCFFE0` | `#002910` | `#EEFF8C` | `#008c44` |
| Dark | `#002910` | `#ffffff` | `#005c2e` | `#008c44` | `#EEFF8C` | `#00e676` |
| Lime | `#EEFF8C` | `#000d05` | `#CCFFE0` | `#002910` | `#002910` | `#008c44` |
| Midnight | `#000d05` | `#ffffff` | `#002910` | `#005c2e` | `#EEFF8C` | `#00ff64` |
| Painting | transparent | `#ffffff` | `rgba(255,255,255,0.85)` | `rgba(0,0,0,0.6)` | `#EEFF8C` | `#00ff64` |

### Chart Typography

| Element | Style |
|---|---|
| Header label | Saans Mono, 10px, 600, 0.12em, uppercase |
| Title | Serrif VF / Georgia, 44px (scaled), 400, −0.02em |
| Subtitle | Saans, 16px (scaled) |
| Subcopy callout | Saans, 13px (scaled) |
| Source line | Saans Mono, 10px, 500, 0.06em |

---

## 22. Table Slide (`TableSlide.tsx`)

**Layout:** 96px headline header, table below. First column accented. Alternating row bgs. 6px bottom accent bar.

| Element | Style |
|---|---|
| Headline | Serrif VF, 40px (scaled), 400, −0.02em, lh 1.1; padding left/right 64px |
| Header row bg | `theme.darkBg` |
| Header text | Saans Mono, dynamic (min 13px, scales down by col count), 600, 0.08em, uppercase, `theme.accent` |
| Data cell | Saans, dynamic (min 14px, scales down by col count) |
| First column | fontWeight 500, `theme.textOnLight`, 3px left border `theme.accentMid` |
| Other columns | `theme.bodyOnLight` |
| Row bgs | Alternating `theme.lightBg` / `#ffffff` |
| Cell borders | 1px `theme.stroke` |
| Header borders | `rgba(255,255,255,0.1)` |
| Row padding | 14px vertical (10px if >6 rows), 20px horizontal |
| Header padding | 16px vertical (12px if >6 rows), 20px horizontal |
| Table margins | top 96px, left/right 64px, bottom 72px |
| Bottom bar | 6px, `theme.accent` |

---

## Theme Reference

All slides draw from a `SlideTheme` object. The five built-in themes set these variables:

| Token | Role |
|---|---|
| `theme.darkBg` | Dark background |
| `theme.lightBg` | Light background |
| `theme.accent` | Primary accent (used for bars, bottom strips, headline color on hero) |
| `theme.accentMid` | Mid-tone accent (borders, icons, labels) |
| `theme.textOnLight` | Primary text on light bg |
| `theme.textOnDark` | Primary text on dark bg |
| `theme.bodyOnLight` | Body/secondary text on light bg |
| `theme.mutedOnLight` | Muted/tertiary text on light bg |
| `theme.stroke` | Borders, dividers, separators |
| `theme.logoOnDark` | Logo variant for dark backgrounds |
| `theme.logoOnLight` | Logo variant for light backgrounds |
| `theme.agendaLeftBg` | Left panel bg for agenda slide |
| `theme.agendaDotPattern` | CSS radial-gradient for agenda dot pattern (24px spacing, 16px offset) |
| `theme.heroDotPattern` | CSS radial-gradient for hero dot pattern (20px spacing) |

---

## Global Typography Scale

| Use | Family | Size | Weight | Letter-spacing | Line-height |
|---|---|---|---|---|---|
| Large headline | Serrif VF | 64–96px | 400 | −0.02em | 1–1.1 |
| Section headline | Serrif VF | 52–56px | 400 | −0.02em | 1.1–1.15 |
| Slide headline | Serrif VF | 36–48px (scaled) | 400 | −0.02em | 1.1–1.2 |
| Quote body | Serrif VF | 28–40px (scaled) | 400 | −0.01em | 1.3–1.35 |
| Stat value | Serrif VF | 48–56px (scaled) | 400 | −0.02em | 1 |
| Column heading | Saans | 18px (scaled) | 500–600 | — | — |
| Body copy | Saans | 14–17px (scaled) | 400 | — | 1.5–1.7 |
| Attribution / name | Saans | 13–15px | 600–700 | — | — |
| Eyebrow / label | Saans Mono | 10–13px | 500 | 0.06–0.12em | — |

**`textScale`** — all font sizes are multiplied by this prop (default 1) for responsive scaling across export sizes.
