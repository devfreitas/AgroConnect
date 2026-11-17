---
target: src/screens/home/HomeScreen.tsx
total_score: 32
max_score: 40
na_heuristics: 
p0_count: 0
p1_count: 1
target_identity: "file:C:\\Users\\freit\\Documents\\All\\Workspace\\AgroConnect\\AgroConnect\\src\\screens\\home\\HomeScreen.tsx"
target_fingerprint: "sha256:59d7ab13f88f1a10739cb12d7c99a7c506b9bd22dd776847dd4b7d29353448a8"
target_path: "C:\\Users\\freit\\Documents\\All\\Workspace\\AgroConnect\\AgroConnect\\src\\screens\\home\\HomeScreen.tsx"
timestamp: 2026-11-15T16-56-00Z
slug: src-screens-home-homescreen-tsx
closed: true
---
# Design Critique: HomeScreen (`src/screens/home/HomeScreen.tsx`)

Method: design review only (detector not applicable, native platform)

### Design Health Score

| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 4 | Real-time cache indicators, pull-to-refresh, explicit offline notices |
| 2 | Match System / Real World | 3 | Uses natural agricultural terminology and units, but lacks agronomic range thresholds |
| 3 | User Control and Freedom | 3 | Easy device switching and refresh, but no quick route from readings to sensor history |
| 4 | Consistency and Standards | 4 | Rigid adherence to AgroConnect theme tokens and Android navigation standards |
| 5 | Error Prevention | 4 | Robust empty states, graceful network error handling with retry actions |
| 6 | Recognition Rather Than Recall | 2 | Farmers must memorize whether values are optimal for their crop; vertical cards impede comparison |
| 7 | Flexibility and Efficiency | 3 | Fast pull-to-refresh, but lacks a multi-device summary or high-density glance mode |
| 8 | Aesthetic and Minimalist Design | 3 | Beautiful warm earth tones and flat tonal layering; repeated timestamps add noise |
| 9 | Error Recovery | 4 | Clear user-facing error notices with one-tap retry mechanism |
| 10 | Help and Documentation | 2 | No inline explanation of sensor metrics or optimal vegetative ranges |
| **Total** | | **32/40** | **Good** |

### Design Specificity Verdict

**LLM assessment**: The home screen strongly embodies AgroConnect's "Field Ledger" design identity. The warm parchment canvas (`#EAD9C1`), off-white cards (`#FFFBF5`), and terracotta accents (`#C46B38`) feel genuinely tailored to rural field operations rather than generic SaaS dashboards. The primary area for growth is domain-specific information architecture: treating readings not as isolated vertical sensor cards, but as an interconnected agro-climatic snapshot of the farmer's parcel.

**Deterministic scan**: not applicable (native platform)

**Visual overlays**: not applicable (native platform)

### Overall Impression
A grounded, resilient, and highly accessible mobile dashboard. Offline caching cues and dual-signal status indicators demonstrate great empathy for rural field conditions. The main UX limitation is that 4 vertical full-width cards force excessive scrolling on mobile, hiding the holistic relationship between soil moisture, heat, and sunlight.

### What's Working
- **Resilient Offline Feedback**: The `DataStatus` banner transparently informs the farmer when telemetry is cached or if the connection dropped, without blocking access to historical readings.
- **Strict Dual-Signal Status Indicators**: Every sensor reading clearly combines semantic color, status icons, and textual validity tags, preventing ambiguity under bright sunlight.
- **Field-Ready Touch Affordances**: Device filter chips and interactive elements maintain generous touch targets (min 44–48 dp) tailored for one-handed operation.

### Priority Issues

- **[P1] Vertical Stack Dilutes At-a-Glance Microclimate Monitoring**
  - **Why it matters**: A farmer needs to evaluate soil moisture in conjunction with ambient temperature and solar radiation. Stacking 4 massive cards vertically requires continuous scrolling on compact Android phones, increasing cognitive load.
  - **Fix**: Reorganize the primary 4 telemetry metrics into a compact 2×2 metric grid or scannable overview matrix above detailed readings.
  - **Suggested command**: `$impeccable layout`

- **[P2] Fragmented Device Selection & Status Display**
  - **Why it matters**: When multiple devices exist, horizontal filter chips sit above a separate card that repeats the selected device's name and status, creating redundant UI layers.
  - **Fix**: Consolidate the device switcher and node status into a single unified header card with an integrated dropdown or segmented selector.
  - **Suggested command**: `$impeccable distill`

- **[P3] Lack of Agronomic Target Context on Sensor Values**
  - **Why it matters**: A reading of "45% Solo" or "31°C" tells the farmer the hardware is working, but doesn't indicate if 45% is hazardous or optimal for their specific crop stage (e.g. vegetative vs maturation).
  - **Fix**: Include an inline target indicator or benchmark bar (e.g. "Faixa ideal: 50%–70%") derived from the field's active planting.
  - **Suggested command**: `$impeccable clarify`

- **[P4] Redundant Per-Card Timestamp Repetition**
  - **Why it matters**: `DataStatus` already states "Atualizado em [data]", yet each of the 4 cards repeats "Atualizado em [data]" at the bottom, adding visual noise.
  - **Fix**: Display the global sync timestamp once at the container level; only show card-specific timestamps when individual sensors report desynchronized timestamps.
  - **Suggested command**: `$impeccable polish`

### Persona Red Flags

- **Alex (Power User / Multi-device Farmer)**: Switching between multiple field devices requires tapping wrapping horizontal chips with no comparative glance across plots. Wants a rapid birds-eye view of all fields.
- **Jordan (First-Time Producer)**: Sees "Válida" next to a reading and wonders if that means the crop is healthy or just that the sensor isn't broken. Needs clearer distinction between sensor health vs crop health.
- **Seu Zé (Elder Family Farmer in Outdoor Sun)**: Excellent text contrast, but excessive vertical scrolling while standing in the field makes it tedious to cross-check temperature and soil humidity simultaneously.

### Minor Observations
- The "Dados simulados" info notice is helpful for academic demonstration, but could be made dismissible once acknowledged to preserve valuable vertical screen space.
- Adding quick navigation from a reading card directly to its historical trend chart in the Analytics tab would speed up troubleshooting.

### Questions to Consider
- What if the top of the home screen displayed an aggregated "Parcel Health Score" that synthesized all 4 sensors into an immediate status summary?
- Could the 4 primary sensor readings fit into a 2×2 glanceable grid above the fold on standard 360dp phone screens?
- How might linking active crop stages directly to the reading cards provide immediate reassurance without requiring agronomist consultation?
