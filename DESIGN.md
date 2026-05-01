---
name: GuardMan Chile
colors:
  # Primary — Navy Blue (authoritative, trustworthy)
  primary-50: "#E8ECF1"
  primary-100: "#C5CED9"
  primary-200: "#8FA4BA"
  primary-300: "#5F7A96"
  primary-400: "#3A5572"
  primary-500: "#1A3A5C"
  primary-600: "#1A2744"
  primary-700: "#152038"
  primary-800: "#0F1829"
  primary-900: "#0A1019"
  # Secondary — Steel Gray (neutral ground)
  secondary-50: "#F5F5F5"
  secondary-100: "#ECECEC"
  secondary-200: "#D4D4D4"
  secondary-300: "#A8A8A8"
  secondary-400: "#707070"
  secondary-500: "#4A4A4A"
  secondary-600: "#3A3A3A"
  secondary-700: "#2A2A2A"
  secondary-800: "#1A1A1A"
  secondary-900: "#0A0A0A"
  # Neutral — Cool Grays (text & backgrounds)
  neutral-50: "#F8F9FA"
  neutral-100: "#F1F3F5"
  neutral-200: "#E5E7EB"
  neutral-300: "#CED4DA"
  neutral-400: "#ADB5BD"
  neutral-500: "#6C757D"
  neutral-600: "#495057"
  neutral-700: "#343A40"
  neutral-800: "#212529"
  neutral-900: "#0D0D0D"
  # Functional
  accent: "#3B82F6"
  accent-hover: "#2563EB"
  accent-light: "#EFF6FF"
  success: "#10B981"
  success-light: "#ECFDF5"
  warning: "#F59E0B"
  warning-light: "#FFFBEB"
  error: "#EF4444"
  error-light: "#FEF2F2"
  # Semantic aliases
  surface-light: "#F8F9FA"
  surface-white: "#FFFFFF"
  surface-dark: "#212529"
  on-primary: "#FFFFFF"
  on-surface: "#0D0D0D"
  on-surface-muted: "#6C757D"
  link-hover: "#152038"
typography:
  display:
    fontFamily: Inter
    fontSize: 60px
    fontWeight: "800"
    lineHeight: 72px
    letterSpacing: -0.025em
  h1:
    fontFamily: Inter
    fontSize: 48px
    fontWeight: "700"
    lineHeight: 56px
    letterSpacing: -0.02em
  h1-mobile:
    fontFamily: Inter
    fontSize: 36px
    fontWeight: "700"
    lineHeight: 40px
    letterSpacing: -0.02em
  h2:
    fontFamily: Inter
    fontSize: 36px
    fontWeight: "700"
    lineHeight: 40px
    letterSpacing: -0.01em
  h2-mobile:
    fontFamily: Inter
    fontSize: 30px
    fontWeight: "700"
    lineHeight: 36px
    letterSpacing: -0.01em
  h3:
    fontFamily: Inter
    fontSize: 20px
    fontWeight: "600"
    lineHeight: 28px
  h4:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: "600"
    lineHeight: 24px
  body-lg:
    fontFamily: Inter
    fontSize: 20px
    fontWeight: "400"
    lineHeight: 30px
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: "400"
    lineHeight: 24px
  body-sm:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: "400"
    lineHeight: 20px
  label:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: "500"
    lineHeight: 20px
  label-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: "600"
    lineHeight: 16px
    letterSpacing: 0.05em
rounded:
  sm: 4px
  md: 8px
  lg: 12px
  xl: 16px
  2xl: 24px
  full: 9999px
spacing:
  unit: 4px
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 32px
  2xl: 48px
  3xl: 64px
  section-vertical: 64px
  section-vertical-lg: 96px
  container-px: 16px
  container-max-width: 1280px
  card-padding: 24px
  card-gap: 24px
elevation:
  sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05)
  md: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)
  lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)
  xl: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)
motion:
  duration-fast: 150ms
  duration-normal: 200ms
  duration-slow: 300ms
  easing-default: cubic-bezier(0.4, 0, 0.2, 1)
  card-lift: translateY(-4px)
  image-zoom: scale(1.05)
  chevron-rotate: rotate(180deg)
  fade-in: opacity 0 → 1
components:
  # === NAVIGATION ===
  header-bar:
    backgroundColor: "{colors.surface-white}"
    textColor: "{colors.neutral-700}"
    shadow: "{elevation.sm}"
    height: 64px
    height-lg: 80px
    position: sticky top-0 z-50
  header-logo:
    width: 40px
    height: 40px
    backgroundColor: "{colors.primary-600}"
    rounded: "{rounded.lg}"
    textColor: "{colors.on-primary}"
  nav-link:
    textColor: "{colors.neutral-700}"
    hover-textColor: "{colors.primary-600}"
    fontWeight: "500"
  nav-dropdown:
    backgroundColor: "{colors.surface-white}"
    rounded: "{rounded.lg}"
    shadow: "{elevation.lg}"
    width: 256px
    padding: 8px
    animation: fade-in 200ms
  nav-dropdown-item:
    textColor: "{colors.neutral-700}"
    hover-textColor: "{colors.primary-600}"
    hover-backgroundColor: "{colors.neutral-50}"
    padding: 8px 16px
    rounded: "{rounded.md}"
  header-cta-button:
    backgroundColor: "{colors.primary-600}"
    textColor: "{colors.on-primary}"
    hover-backgroundColor: "{colors.primary-700}"
    padding: 10px 20px
    rounded: "{rounded.lg}"
    fontWeight: "600"
  # === HEROES ===
  hero-primary:
    backgroundColor: "{colors.primary-600}"
    textColor: "{colors.on-primary}"
    padding: 80px 0 desktop / 64px 0 mobile
    has-gradient-overlay: "from-primary-800/95 to-primary-600/70 over background image"
    decorative-blobs:
      - "circle 256px primary-500/20 blur-3xl top-right"
      - "circle 384px white/5 blur-3xl bottom-left"
  hero-compact:
    extends: hero-primary
    padding: 48px 0 desktop / 32px 0 mobile
  hero-badge:
    backgroundColor: "rgba(255,255,255,0.2)"
    textColor: "{colors.on-primary}"
    padding: 8px 16px
    rounded: "{rounded.full}"
    fontSize: 14px
    fontWeight: "500"
  # === CARDS ===
  card-grid:
    backgroundColor: "{colors.neutral-50}"
    rounded: "{rounded.xl}"
    overflow: hidden
    hover-shadow: "{elevation.xl}"
    hover-transform: "translateY(-4px)"
    transition: "all 200ms ease"
  card-grid-image:
    aspectRatio: "16/9"
    backgroundColor: "gradient from primary-100 to primary-200"
    overflow: hidden
  card-grid-image-hover:
    transform: "scale(1.05)"
    transition: "transform 300ms ease"
  card-grid-content:
    padding: "{spacing.card-padding}"
  card-grid-title:
    fontSize: 18px
    fontWeight: "600"
    textColor: "{colors.neutral-900}"
    hover-textColor: "{colors.primary-600}"
    marginBottom: 8px
  card-grid-description:
    fontSize: 14px
    textColor: "{colors.neutral-600}"
    lineClamp: 2
  card-grid-cta:
    fontSize: 14px
    fontWeight: "500"
    textColor: "{colors.primary-600}"
    marginTop: 16px
    has-chevron: true
    chevron-hover-translateX: 4px
  card-list:
    backgroundColor: "{colors.surface-white}"
    border: 1px solid "{colors.neutral-200}"
    rounded: "{rounded.xl}"
    hover-shadow: "{elevation.md}"
  # === FEATURE TILE (dark overlay) ===
  feature-tile:
    backgroundColor: "rgba(255,255,255,0.1)"
    backdropFilter: "blur(8px)"
    border: 1px solid "rgba(255,255,255,0.2)"
    rounded: "{rounded.xl}"
    padding: 16px
    hover-backgroundColor: "rgba(255,255,255,0.2)"
    transition: "background-color 200ms ease"
  feature-tile-icon:
    width: 40px
    height: 40px
    backgroundColor: "rgba(255,255,255,0.2)"
    rounded: "{rounded.lg}"
    textColor: "{colors.on-primary}"
  feature-tile-title:
    fontWeight: "600"
    textColor: "{colors.on-primary}"
  feature-tile-description:
    fontSize: 14px
    textColor: "rgba(255,255,255,0.7)"
  # === BUTTONS ===
  button-primary:
    backgroundColor: "{colors.primary-600}"
    textColor: "{colors.on-primary}"
    hover-backgroundColor: "{colors.primary-700}"
    padding: 16px 32px
    rounded: "{rounded.lg}"
    fontWeight: "600"
    transition: "background-color 200ms ease"
  button-primary-on-dark:
    backgroundColor: "{colors.surface-white}"
    textColor: "{colors.primary-600}"
    hover-backgroundColor: "{colors.neutral-100}"
    padding: 16px 32px
    rounded: "{rounded.lg}"
    fontWeight: "600"
  button-outline:
    border: 2px solid "{colors.primary-600}"
    backgroundColor: transparent
    textColor: "{colors.primary-600}"
    hover-backgroundColor: "{colors.primary-600}"
    hover-textColor: "{colors.on-primary}"
    padding: 16px 32px
    rounded: "{rounded.lg}"
    fontWeight: "600"
    transition: "all 200ms ease"
  button-outline-on-dark:
    border: 2px solid "{colors.on-primary}"
    backgroundColor: transparent
    textColor: "{colors.on-primary}"
    hover-backgroundColor: "rgba(255,255,255,0.1)"
    padding: 16px 32px
    rounded: "{rounded.lg}"
    fontWeight: "600"
  # === SIDEBAR CTA ===
  sidebar-cta:
    backgroundColor: "{colors.neutral-50}"
    rounded: "{rounded.xl}"
    padding: "{spacing.card-padding}"
    position: sticky top-96px
  # === FAQ ACCORDION ===
  faq-item:
    backgroundColor: "{colors.neutral-50}"
    rounded: "{rounded.lg}"
    overflow: hidden
  faq-summary:
    padding: 24px
    fontWeight: "600"
    textColor: "{colors.neutral-900}"
    hover-textColor: "{colors.primary-600}"
    cursor: pointer
  faq-number-badge:
    width: 32px
    height: 32px
    backgroundColor: "{colors.primary-100}"
    rounded: "{rounded.full}"
    textColor: "{colors.primary-600}"
    fontWeight: "700"
    fontSize: 14px
  faq-chevron:
    textColor: "{colors.neutral-400}"
    open-transform: "rotate(180deg)"
    transition: "transform 200ms ease"
  # === FORM INPUTS ===
  input-field:
    backgroundColor: "{colors.surface-white}"
    border: 1px solid "{colors.neutral-300}"
    textColor: "{colors.neutral-900}"
    rounded: "{rounded.lg}"
    padding: 12px 16px
    fontSize: 16px
    focus-ring: 2px solid "{colors.primary-500}"
    focus-borderColor: "{colors.primary-500}"
  input-label:
    fontSize: 14px
    fontWeight: "500"
    textColor: "{colors.neutral-700}"
    marginBottom: 4px
  # === FOOTER ===
  footer:
    backgroundColor: "{colors.neutral-900}"
    textColor: "{colors.on-primary}"
    padding-vertical: 48px desktop / 64px desktop
  footer-section-heading:
    fontSize: 18px
    fontWeight: "600"
    marginBottom: 16px
  footer-link:
    textColor: "{colors.neutral-400}"
    hover-textColor: "{colors.on-primary}"
    fontSize: 14px
  footer-link-cta:
    textColor: "{colors.primary-200}"
    hover-textColor: "{colors.on-primary}"
    fontSize: 14px
    fontWeight: "500"
  footer-social-icon:
    width: 40px
    height: 40px
    backgroundColor: "{colors.neutral-800}"
    hover-backgroundColor: "{colors.primary-600}"
    rounded: "{rounded.lg}"
    transition: "background-color 200ms ease"
  footer-bottom-border:
    borderColor: "{colors.neutral-800}"
    borderWidth: 1px
    paddingTop: 32px
---

## Brand & Style

GuardMan Chile is a private security company serving Santiago's Metropolitan Region. The visual identity communicates **institutional trust, professional authority, and operational reliability** — values critical for a security brand operating in Chile's regulated OS-10 certification environment.

The aesthetic is **Corporate Authority**: clean, structured, and decisive. Every design choice reinforces the message that GuardMan is a serious, certified operation — not a startup, not a gadget company, but a professional security force with 500+ guards and 200+ enterprise clients.

## Colors

The palette is built around a deep **Navy Blue** primary that conveys authority and trust — the two most critical emotions for a security company. This is not a playful blue; it carries the weight of a police or military palette adapted for corporate Chile.

- **Primary (Navy):** Used as the dominant brand color on heroes, CTAs, and the logo mark. It creates a strong "official" impression that aligns with OS-10 and Carabineros certification context. The gradient `from-primary-800/95 to-primary-600/70` overlays background images to maintain readability while adding depth.
- **Neutrals:** A cool-gray scale provides the structural backbone. `neutral-50` (#F8F9FA) is the default page background; `neutral-900` (#0D0D0D) is the primary text color. The cool undertone keeps the palette professional rather than warm.
- **Functional Colors:** Green for success/check states, amber for warning callouts, and red for errors. These are used sparingly — a green checkmark on feature lists, amber backgrounds on "problems we solve" sections.

**Dark overlay sections** alternate with white sections to create visual rhythm. When the primary navy is used as a section background, decorative blur circles (`primary-500/20` and `white/5`) add atmospheric depth without competing with content.

## Typography

**Inter** is the sole typeface, loaded from Google Fonts in weights 400 (Regular), 500 (Medium), 600 (SemiBold), 700 (Bold), and 800 (ExtraBold). This single-family approach keeps the design unified and performant.

- **Hero headlines** use 48–60px Bold/ExtraBold with tight letter-spacing (-0.02 to -0.025em), creating a commanding first impression on landing pages and service detail pages.
- **Section headings** at 36px Bold provide clear content hierarchy on white backgrounds.
- **Body text** at 16–20px Regular with generous line-height (1.5×) maintains readability in Spanish-language paragraphs.
- **Small labels** at 12–14px SemiBold with wider letter-spacing (0.05em) are used for badges, nav items, and metadata.
- **Font weight escalation:** On dark/primary backgrounds, text weight naturally reads heavier. The design compensates by using `text-white/90` for subtitles and `text-white/70` for descriptions, maintaining clear hierarchy through opacity rather than color.

## Layout & Spacing

The layout follows a **centered container** model with a max width of 1280px and 16px horizontal padding. Content is organized into full-width horizontal bands that alternate background colors.

**Section rhythm** is the most important spacing pattern:
- Each major content section uses `py-16 lg:py-24` (64px mobile / 96px desktop vertical padding), creating generous breathing room.
- Sections alternate between four background treatments: white, neutral-50 (light gray), primary-600/700 (navy), and neutral-900 (dark).
- This alternation creates a clear visual separation without needing borders or dividers.

**Card grids** follow a responsive pattern: 1 column on mobile → 2 on tablet → 3–4 on desktop, with 24px gaps. Each card uses `rounded-xl` (16px corners) and lifts 4px on hover with an accompanying shadow elevation.

**Two-column layouts** (text + image, text + sidebar) use `grid lg:grid-cols-2 gap-12` for the primary content split. On service detail pages, the sidebar CTA is sticky (`top-24`) to remain accessible while scrolling.

## Elevation & Depth

Elevation is subtle and functional. The site does not use dramatic shadows or floating effects. Instead:

- **Header** uses the lightest shadow (`shadow-sm`) for a clean sticky bar.
- **Cards** rest on `neutral-50` backgrounds and elevate to `shadow-xl` on hover, creating a "pick up" effect.
- **Dark overlay sections** use decorative blurred circles positioned at the edges (translated outside the section bounds) to create atmospheric depth. These are always `aria-hidden="true"` and serve purely aesthetic purposes.
- **Feature tiles on dark backgrounds** use `backdrop-blur` with semi-transparent borders (`border-white/20`) to create a frosted glass effect that feels modern without being trendy.

## Shapes

The shape language is **Rounded Corporate**: soft enough to feel approachable, structured enough to feel professional.

- **Cards and containers** use `rounded-xl` (16px) — the system's workhorse radius.
- **Buttons and inputs** use `rounded-lg` (12px).
- **Badges and pills** use `rounded-full` (9999px) for inline labels and certifications.
- **Logo mark** uses `rounded-lg` (12px) — a rounded square containing a shield-check icon.
- **Process step circles** are fully round (48px circles) with the primary-600 background and bold white numbers.
- **FAQ number badges** are 32px circles with `primary-100` background.

## Components

### Header & Navigation
The header is a white sticky bar with the GuardMan shield logo, text-based dropdown navigation (Servicios, Ubicaciones, Sectores), a phone number link, and a solid navy "Cotizar" CTA button. Dropdowns appear on hover with a fade transition and contain navigation links to CMS-driven pages. On mobile, a hamburger button toggles a simple vertical menu.

### Hero Sections
Hero sections use the primary-600 background with an optional background image under a gradient overlay. A decorative blur circle sits at the top-right corner. Content includes a badge pill, an H1 title, a subtitle at reduced opacity, and a CTA button. The OS-10 certification shield image appears alongside the main CTA on the homepage hero.

### Service & Sector Cards
Cards follow two variants: **Grid** (for browsing pages) and **List** (for inline links). Grid cards have a 16:9 image area with a hover zoom effect, a padded content section below, and an optional "Ver detalles →" link with a chevron that translates right on hover. The image area falls back to a gradient background when no image is available.

### Feature Tiles (Dark Sections)
Used on navy/dark backgrounds for product highlights (Guard Pod, Ajax Systems). Each tile is a frosted glass card with a small icon container, a bold title, and a muted description. The tile uses `backdrop-blur`, a translucent white background, and a translucent white border.

### Page CTA Section
A full-width call-to-action band in one of three variants: `primary` (navy background), `light` (neutral-50), or `dark` (neutral-900). Contains a centered heading, description, a solid CTA button, an outline secondary button, and an optional phone number. The primary variant includes a certification badge pill.

### FAQ Accordion
Each item is a `<details>` element with a numbered circle badge, the question as a semi-bold summary, and the answer in the disclosure panel. A chevron icon rotates 180° when expanded. Items use `neutral-50` backgrounds with `rounded-lg` corners.

### Contact & Quote Forms
Forms use a card-based layout with `neutral-50` grouped sections (`rounded-2xl`). Inputs have clean borders that highlight with a primary-500 ring on focus. Labels are 14px Medium weight. The submit button is a full-width primary CTA. Trust indicators (shield icons with short text) appear below the form.

### Footer
A dark (`neutral-900`) four-column grid with the brand logo and description, service links, location links, and contact information. Social media icons are rounded squares (`neutral-800` → `primary-600` on hover). The bottom bar has a thin `neutral-800` border with legal links and copyright text.

## Iconography

All icons are inline SVGs using the **Heroicons outline** style (24×24 viewBox, 2px stroke, rounded caps). The shield-check icon is the brand's signature mark, used in the logo, trust badges, and certification indicators. Other frequently used icons include map-pin (locations), building (sectors), telephone (contact), and chevron-right (CTA arrows).

Icons on primary-colored backgrounds are always white. Icons on light backgrounds use `primary-600`. Icon containers are 40×40 rounded squares or 48×48 circles depending on context.

## Image Treatment

- **Aspect ratio:** All card images use 16:9 aspect ratio (`aspect-video`).
- **Hero backgrounds:** Full-bleed with `object-cover` and a directional gradient overlay.
- **Hover effect:** Images scale to 105% on card hover with a 300ms ease transition.
- **Fallback:** When no image is available, a gradient from `primary-100` to `primary-200` (or `primary-600` to `primary-700` on dark contexts) fills the space, often with a centered icon.
- **Loading strategy:** Hero images use `loading="eager"` with `fetchpriority="high"`. All other images use `loading="lazy"` with `decoding="async"`.
- **Badge overlays:** Small certification or promotional badges appear as `white/90` pills with `primary-700` text, positioned at the top-left of card images.
- **Corner badges:** Some images have a small `primary-600` badge anchored to the bottom-right, offset by -16px, with a shadow.

## Motion & Interaction

Motion is restrained and purposeful — appropriate for a professional security brand.

- **Card hover:** Cards translate up 4px (`hover:-translate-y-1`) and shadow deepens from none/md to xl. Duration: 200ms default easing.
- **Image hover:** Card images scale to 105% over 300ms ease, creating a subtle zoom.
- **Chevron arrows:** CTA chevrons translate right 4px on hover (`group-hover:translate-x-1`), suggesting forward motion.
- **FAQ accordion:** The expand/collapse chevron rotates 180° on open, using the `<details>` native disclosure pattern.
- **Navigation dropdowns:** Fade in from `opacity-0 invisible` to `opacity-100 visible` over 200ms on hover.
- **Button states:** Background color transitions over 200ms. Outline buttons fill with primary color and text becomes white on hover.
- **All transitions** use the default Tailwind easing (`cubic-bezier(0.4, 0, 0.2, 1)`) for a natural, non-bouncy feel.

## Page Structure Pattern

Every page follows a consistent vertical rhythm:

1. **Hero band** (navy, with gradient overlay)
2. **Content sections** alternating white / light-gray / navy / dark
3. **Optional sidebar** on detail pages (sticky CTA panel)
4. **FAQ section** (white background)
5. **Final CTA band** (navy or light)
6. **Footer** (dark)

This creates a visual cadence that guides the user from awareness → information → conversion, with each background shift signaling a new content theme. The navy hero establishes authority; the white content areas deliver information; the dark CTA sections create urgency; and the footer provides navigation closure.
