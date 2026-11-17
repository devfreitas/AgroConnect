---
name: AgroConnect
description: Grounded, agrarian mobile design system built for smallholder field clarity
colors:
  primary: "#C46B38"
  accent: "#D9B77E"
  secondary: "#A18D72"
  background: "#EAD9C1"
  surface: "#FFFBF5"
  text: "#382719"
  text-muted: "#6B5844"
  border: "#D6C3A5"
  primary-contrast: "#FFFFFF"
  success: "#4F7A3A"
  warning: "#B7791F"
  error: "#B3261E"
  info: "#3E6A8A"
typography:
  display:
    fontSize: "34px"
    fontWeight: "700"
    lineHeight: "40px"
  title:
    fontSize: "28px"
    fontWeight: "700"
    lineHeight: "34px"
  headline:
    fontSize: "22px"
    fontWeight: "600"
    lineHeight: "28px"
  body:
    fontSize: "16px"
    fontWeight: "400"
    lineHeight: "24px"
  label:
    fontSize: "14px"
    fontWeight: "500"
    lineHeight: "20px"
rounded:
  sm: "8px"
  md: "12px"
  lg: "20px"
  full: "999px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "16px"
  lg: "24px"
  xl: "32px"
  xxl: "48px"
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.primary-contrast}"
    rounded: "{rounded.md}"
    padding: "8px 24px"
    height: "48px"
  button-secondary:
    backgroundColor: "{colors.accent}"
    textColor: "{colors.text}"
    rounded: "{rounded.md}"
    padding: "8px 24px"
    height: "48px"
  button-outline:
    backgroundColor: "transparent"
    textColor: "{colors.primary}"
    rounded: "{rounded.md}"
    padding: "8px 24px"
    height: "48px"
  button-danger:
    backgroundColor: "{colors.error}"
    textColor: "{colors.primary-contrast}"
    rounded: "{rounded.md}"
    padding: "8px 24px"
    height: "48px"
  card:
    backgroundColor: "{colors.surface}"
    rounded: "{rounded.lg}"
    padding: "16px"
  input:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.text}"
    rounded: "{rounded.md}"
    padding: "8px 16px"
    height: "48px"
  chip:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.text}"
    rounded: "{rounded.full}"
    padding: "0px 16px"
    height: "44px"
  chip-active:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.primary-contrast}"
    rounded: "{rounded.full}"
    padding: "0px 16px"
    height: "44px"
---

# Design System: AgroConnect

## Overview

**Creative North Star: "The Field Ledger"**

AgroConnect's visual identity draws inspiration from a sturdy, well-used agricultural field notebook. Built primarily for small agricultural producers operating outdoors under direct sunlight and variable weather, the interface eschews cold neon palettes, artificial gradients, and fragile micro-interactions. In their place, it presents a grounded, tactile atmosphere defined by warm earth tones, generous spacing, and deep-contrast typographic clarity.

The visual system treats every screen as a purposeful recording surface. Information density is carefully calibrated: telemetry metrics (soil moisture, temperature, air humidity, illuminance) are presented with immediate physical legibility rather than decorative charts. Complex agronomic data translates into clear, reassuring status states that respect the farmer's time and practical wisdom.

**Key Characteristics:**
- **Warm Agrarian Palette:** Earthy terracotta, warm sand gold, and toasted taupe resting on a calm parchment background.
- **Tonal Layering with Crisp Borders:** Flat-by-default surfaces where depth is established through subtle background shifts and crisp outlines, never muddy drop shadows.
- **Field-Ready Ergonomics:** Minimum 48×48 dp touch targets designed for comfortable one-handed thumb interaction outdoors.
- **Dual-Signal Communication:** Every status, alert, and diagnostic indicator pairs semantic color with an unambiguous icon and explicit textual label.

## Colors

The palette balances warm organic earth tones with high-contrast functional status hues, evoking cultivated soil, dry sand, and healthy crops.

### Primary
- **Terracotta** (`#C46B38`): The signature brand voice. Used for primary buttons, active navigation indicators, key metrics, and selected filter chips. Represents clay soil and human craft.

### Secondary
- **Sand Gold** (`#D9B77E`): Secondary action color, warm accents, and informational callout highlights. Represents sunlight and ripening harvest.
- **Taupe** (`#A18D72`): Secondary structural elements, muted icons, and supportive dividers.

### Neutral
- **Background Parchment** (`#EAD9C1`): The global canvas color. Provides a warm, low-glare foundation that reduces outdoor eye fatigue compared to stark white.
- **Surface Off-White** (`#FFFBF5`): Applied to cards, elevated sheets, input fields, and bottom navigation. Contrasts gently with the parchment background.
- **Coffee Brown** (`#382719`): Primary text color for titles, body copy, and data values. Ensures crisp daylight readability.
- **Muted Earth** (`#6B5844`): Secondary text for labels, captions, metadata, and inactive states.
- **Border Sand** (`#D6C3A5`): Structural 1px outlines for cards, text fields, and dividers.
- **Contrast White** (`#FFFFFF`): Text and icons sitting atop primary terracotta or danger surfaces.

### Semantic / Status
- **Leaf Green** (`#4F7A3A`): Online telemetry status, normal sensor ranges, and healthy readings.
- **Harvest Amber** (`#B7791F`): Warning states, sensor calibration delays, and intermediate thresholds.
- **Alert Brick** (`#B3261E`): Critical telemetry alerts, hardware offline states, and destructive actions.
- **Dew Blue** (`#3E6A8A`): Informational notices and AI advisory recommendations.

### Named Rules
**The Daylight Contrast Rule.** Primary numbers, headlines, and critical telemetry values must always use Coffee Brown (`#382719`) or Contrast White (`#FFFFFF`). Low-contrast grays or faded pastels are forbidden for primary metrics to ensure legibility under midday sunlight.

**The Dual-Signal Rule.** Status indicators and alerts must never rely on color alone. Every warning, error, or online state must pair its semantic color with a dedicated icon and explicit text label.

## Typography

**Display Font:** System Sans-Serif / Roboto (Android Native)  
**Body Font:** System Sans-Serif / Roboto (Android Native)  
**Label/Mono Font:** monospace (used exclusively for sensor hardware IDs, commit hashes, and firmware versions)

**Character:** Clean, sturdy, and unpretentious sans-serif letterforms tuned for rapid glancing. Generous line heights ensure continuous readability without cramped lines.

### Hierarchy
- **Display** (Bold 700, 34px, line-height 40px): High-impact focal figures and prominent dashboard statistics.
- **Title** (Bold 700, 28px, line-height 34px): Primary screen headers and modal dialog titles.
- **Headline** (Semibold 600, 22px, line-height 28px): Section titles, property names, and card group headings.
- **Subheading** (Semibold 600, 18px, line-height 24px): Card titles, modal subtitles, and secondary section headers.
- **Body** (Regular 400, 16px, line-height 24px): General explanatory text, AI recommendations, and form inputs.
- **BodyStrong** (Semibold 600, 16px, line-height 24px): Emphasized body text, table row leaders, and button text.
- **Caption** (Regular 400, 14px, line-height 20px): Helper text, timestamps, sensor units, and footnotes.
- **Label** (Medium 500, 14px, line-height 20px): Form input labels, chip text, and table header tags.

### Named Rules
**The Fixed Ratio Rule.** Font sizes and line heights are strictly mapped to predefined scale tokens. Arbitrary `fontSize` numbers must not be declared in individual component styles.

## Layout

AgroConnect follows Android edge-to-edge conventions with dedicated safe area handling:

- **Horizontal Gutters:** Screens maintain a standard `16px` (`spacing.md`) horizontal padding across all mobile device widths.
- **Vertical Spacing Rhythm:** Component blocks are spaced using an 8-point grid rhythm: `8px` (`spacing.sm`) for tightly coupled items (label to field), `16px` (`spacing.md`) between cards and sections, and `24px` (`spacing.lg`) for major screen transitions.
- **Thumb Reach & Bottom Navigation:** Primary workflows live within the bottom tab bar (5 tabs: Início, Plantação, Sensores, Análises, Perfil). Primary action buttons span full width (`fullWidth = true`) within thumb reach.
- **Scroll Resilience:** All content screens implement `Screen` with `keyboardShouldPersistTaps="handled"` and native `RefreshControl` pull-to-refresh.

## Elevation & Depth

**The Flat-by-Default Rule.** Surfaces are flat at rest. Depth is established purely through tonal layering and crisp 1px borders (`#D6C3A5`), never heavy or fuzzy drop shadows. Surface cards (`#FFFBF5`) rest cleanly on the parchment background (`#EAD9C1`), maintaining a natural, paper-and-binder aesthetic.

State transitions rely on immediate physical opacity shifts (e.g., `opacity: 0.85` on press) rather than lifting or floating animations.

## Shapes

- **Small Radius (`8px` / `radius.sm`):** Inner badges, status pills, and compact interactive tags.
- **Medium Radius (`12px` / `radius.md`):** Buttons and form input containers.
- **Large Radius (`20px` / `radius.lg`):** Cards, modal sheets, and primary content containers.
- **Full Radius (`999px` / `radius.full`):** Filter chips and circular status icon containers.
- **Borders:** Consistent `1px` to `1.5px` border widths create crisp, defined shapes without visual heaviness.

## Components

### Buttons
- **Shape:** Rounded corners (`12px` / `radius.md`) with a `1.5px` border.
- **Height:** Minimum `48px` to guarantee Android touch target compliance.
- **Primary:** Terracotta background (`#C46B38`), border `#C46B38`, Contrast White text (`#FFFFFF`), `padding: 8px 24px`.
- **Secondary:** Sand Gold background (`#D9B77E`), border `#D9B77E`, Coffee Brown text (`#382719`).
- **Outline:** Transparent background, Terracotta border (`#C46B38`), Terracotta text (`#C46B38`).
- **Danger:** Alert Brick background (`#B3261E`), border `#B3261E`, Contrast White text (`#FFFFFF`).
- **Feedback:** Pressing triggers immediate `opacity: 0.85`. Disabled buttons render at `opacity: 0.5`.

### Cards
- **Shape:** Softly curved corners (`20px` / `radius.lg`).
- **Background:** Surface Off-White (`#FFFBF5`).
- **Border:** `1px` solid Border Sand (`#D6C3A5`).
- **Padding:** `16px` (`spacing.md`) internal padding.
- **Elevation:** Flat tonal contrast against parchment canvas; zero drop shadow.

### Inputs / Text Fields
- **Shape:** Rounded corners (`12px` / `radius.md`).
- **Height:** Minimum `48px` single-line (`96px` multiline).
- **Background:** Surface Off-White (`#FFFBF5`).
- **Border:** `1.5px` solid Border Sand (`#D6C3A5`) at rest; transitions to Terracotta (`#C46B38`) on focus, or Alert Brick (`#B3261E`) on validation error.
- **Labels:** Displayed cleanly above the input field in Coffee Brown (`#382719`).
- **Helper / Error:** Displayed directly beneath the container in caption typography.

### Chips / Filter Groups
- **Shape:** Pill silhouette (`999px` / `radius.full`).
- **Height:** `44px` minimum touch target.
- **Unselected:** Surface Off-White (`#FFFBF5`), `1.5px` Border Sand (`#D6C3A5`), Coffee Brown text.
- **Selected:** Terracotta background (`#C46B38`), border `#C46B38`, Contrast White text (`#FFFFFF`).

### Status Badges
- **Structure:** Horizontal row pairing an Ionicons symbol (`16px`) with a semibold caption label.
- **Semantics:** Online (Green `checkmark-circle`), Unstable (Amber `warning`), Offline (Brick `close-circle`), Unknown (Muted `help-circle`).
- **Rule:** Never render a standalone colored dot without an adjacent textual status.

### Navigation (Bottom Bar)
- **Background:** Surface Off-White (`#FFFBF5`) with a `1px` top border (`#D6C3A5`).
- **Active State:** Terracotta icon and label (`#C46B38`).
- **Inactive State:** Muted Earth icon and label (`#6B5844`).

## Do's and Don'ts

### Do:
- **Do** maintain a minimum `48×48 dp` touch target for all interactive elements and buttons.
- **Do** use the parchment background (`#EAD9C1`) for screens and off-white (`#FFFBF5`) for cards and inputs.
- **Do** accompany every status color with a descriptive icon and plain-language text label.
- **Do** test text readability in outdoor sunlight by verifying high contrast against Coffee Brown (`#382719`).
- **Do** use `RefreshControl` with Terracotta tint (`#C46B38`) for pull-to-refresh interactions.

### Don't:
- **Don't** add artificial drop shadows, blurred glows, or skeuomorphic bevels to cards.
- **Don't** use pure black (`#000000`) or cold slate grays for text; use Coffee Brown (`#382719`) and Muted Earth (`#6B5844`).
- **Don't** rely on color alone to communicate sensor health, connection dropouts, or critical alerts.
- **Don't** stack Floating Action Buttons or create complex nested swipe gestures that conflict with Android system Back.
- **Don't** hardcode raw font sizes or colors in component styles; always reference `colors`, `spacing`, and `typography` tokens.
