# 🪟 GlazeFlow: A high-performance, edge-deployed configuration tool for the glazing industry.

## 🚀 The Mission

Manual glazing surveys are prone to costly errors—incorrect thickness selections, missing packing deductions, and invalid glass/spacer combinations. GlazeFlow solves this by moving complex manufacturing logic to the Edge, providing surveyors with instant, non-verbal validation feedback.

## ✨ Key Features

- Intelligent Validation: Uses Zod to enforce industry-specific constraints (e.g., minimum 28mm thickness for triple-glazed units).
- Edge-First Architecture: Deployed on Cloudflare Workers for sub-100ms response times globally.
- Precision UI: Built with Solid.js for fine-grained reactivity, ensuring the UI stays snappy even on low-power mobile devices.
- Smart UX Patterns: \* Native Popover API for contextual "Surveyor Tips" (e.g., the 10mm packing deduction rule).
- Haptic-visual shake animations for instant error recognition.
- Layout-stable smooth transitions for error reporting.

## 🛠️ Technical Stack

| Tech               | Purpose                                                             |
| ------------------ | ------------------------------------------------------------------- |
| SolidStart         | Framework for high-performance server-side rendering and hydration. |
| TypeScript         | End-to-end type safety across the configuration schema.             |
| Zod                | Schema validation and complex business logic enforcement.           |
| Cloudflare Workers | Edge computing platform for zero-latency deployments.               |

## 🛠️ Local Development

1. Clone the repo:

```Bash
git clone https://github.com/Jamie-Andrews1/unit-survey-app
```

2. Install dependencies:

```Bash
pnpm install
```

3. Run development server:

```Bash
pnpm run dev
```

📜 License
Distributed under the MIT License. See LICENSE for more information.
