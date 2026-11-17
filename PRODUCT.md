# Product

<!-- impeccable:product-schema 1 -->

## Platform

android

## Users
- **Primary Users:** Small agricultural producers, family farmers, and smallholding landowners.
- **Situation:** Operating directly on the field or managing daily farm tasks in rural settings with variable network quality.
- **Job to be Done:** Monitor soil and environmental microclimates (soil moisture, air temperature, air humidity, light illuminance) across fields and crops to safeguard plants, avoid resource waste, and make timely crop management decisions.

## Product Purpose
AgroConnect provides small agricultural producers with clear, immediate visibility into their crops' microclimate and soil conditions. It translates IoT sensor telemetry into plain-language insights, severity-based alerts, and AI-generated advisory recommendations. Success means farmers can proactively protect and optimize their crops without needing specialized agronomy degrees or complex industrial monitoring systems.

## Positioning
Unlike enterprise precision-agriculture suites built for large monoculture operations with expensive hardware installations and complex GIS layers, AgroConnect is built specifically around the everyday reality of smallholders: lightweight, accessible, highly readable on mobile, and focused on practical, immediate AI advisory guidance.

## Operating Context
- **Environment:** Outdoor rural plots, greenhouses, and rustic farm environments; frequently viewed on mobile devices under direct sunlight with single-handed operation.
- **Connectivity:** Periodic or intermittent cellular connectivity in rural areas; reliance on cached telemetry and local state resilience.
- **Core Entities & Workflows:**
  - Managing agricultural properties (`Property`) and sub-divided parcels (`Field`).
  - Tracking crop plantings (`Planting`) across biological stages (`SEEDLING`, `VEGETATIVE`, `MATURATION`, `HARVEST`).
  - Monitoring IoT telemetric nodes (`Device`) and environmental sensors (`SOIL_MOISTURE`, `AIR_TEMPERATURE`, `AIR_HUMIDITY`, `LIGHT_ILLUMINANCE`).
  - Reviewing historical trends, threshold alerts (`Alert`), and AI-generated crop recommendations (`Recommendation`).

## Capabilities and Constraints
- **Capabilities:**
  - Real-time and interval-aggregated telemetry tracking (moisture %, temperature °C, humidity %, illuminance lx).
  - Status tracking of IoT nodes (online/offline status, signal RSSI, battery, firmware version).
  - Tiered alert notifications (`INFO`, `WARNING`, `CRITICAL`).
  - AI-assisted advisory recommendations based on crop stage and sensor readings.
  - Property and field configuration.
- **Constraints:**
  - **Advisory Only:** Strictly informative monitoring and advisory recommendations; no direct hardware actuation or automated equipment control (e.g., pumps, valves).
  - **Demonstration / Simulation:** Sensor readings in current stage are simulated/demonstration endpoints for academic showcase (FIAP Global Solution 2026/2).
  - **Mobile Platform:** Native Android-first mobile experience built with Expo and React Native (`@react-navigation` tabs and native stacks).

## Brand Commitments
- **Name:** AgroConnect
- **Voice & Tone:** Practical, grounded, reassuring, and respectful of agrarian experience; avoiding corporate buzzwords and obscure technical jargon.
- **Visual Identity Tokens:**
  - Primary: Terracotta (`#C46B38`) for core accents, badges, and primary interactive elements.
  - Accent / Highlights: Warm sand gold (`#D9B77E`) and taupe (`#A18D72`).
  - Background: Warm parchment beige (`#EAD9C1`).
  - Surfaces: Warm off-white (`#FFFBF5`) for cards and elevated panels.
  - Typography: High-contrast deep coffee (`#382719`) and muted earth brown (`#6B5844`).

## Evidence on Hand
- Complete Expo / React Native codebase in `src/` with structured navigation (`RootNavigator`, `AppNavigator`, `stacks/`), typed domain models (`src/types/domain.ts`), and API services.
- Established token system in `src/theme/` (colors, spacing, typography, navigation theme).
- Academic context: Project developed for FIAP Global Solution 2026/2 (`src/screens/profile/AboutScreen.tsx`).

## Product Principles
1. **Clarity Over Raw Data:** Present environmental telemetry with clear status indicators and plain-language interpretations so critical conditions are understood in seconds.
2. **Actionable Without Disruption:** Deliver prioritized alerts and recommendations that outline *what is happening* and *what action to evaluate*, strictly respecting the advisory boundary.
3. **Field-Ready Mobile Ergonomics:** Prioritize generous touch targets (minimum 48×48 dp), high daylight contrast, and scannable card layouts suitable for one-handed outdoor usage.
4. **Transparent Data Integrity:** Clearly communicate sensor health, connectivity freshness, and simulation status so users always know how current their telemetry is.

## Accessibility & Inclusion
- High visual contrast on text and metrics against warm-tinted backgrounds for outdoor daylight legibility.
- Minimum 48×48 dp touch targets adhering to Android Material specifications.
- Status and severity indicators never rely solely on color; they combine distinct iconography, text labels, and semantic tones.
