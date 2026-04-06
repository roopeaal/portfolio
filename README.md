# Roope Aaltonen – interactive network-topology inspired portfolio homepage

This is a Next.js portfolio built around a Packet Tracer / network-topology inspired homepage.
The homepage is the real application surface and the popup windows are the source of truth for all meaningful content.

## Stack

- Next.js 16 App Router
- React 19
- TypeScript
- Tailwind CSS v4
- Framer Motion

## Core product behavior

- Homepage remains the primary interactive experience
- Popup state is synced to the URL
- Deep links work, for example:
  - `/?panel=about`
  - `/?panel=projects`
  - `/?panel=projects&project=multi-platform-iot-security-lab`
  - `/?panel=contact`
- `/about`, `/projects` and `/contact` redirect to the matching homepage popup state
- Projects are browsed inside the same popup window instead of separate duplicate pages

## Main content files

- `components/topology-hero.tsx` — homepage topology, node interaction and animation logic
- `components/packet-window.tsx` — Packet Tracer style window shell with focus handling and keyboard support
- `components/portfolio-panel-content.tsx` — real popup content for Home, About, Projects and Contact
- `hooks/use-portfolio-panel-state.ts` — URL-synced popup state
- `content/profile.ts` — profile and contact content source
- `content/projects.ts` — project case study content source

## Commands

```bash
npm install
npm run lint
npm run typecheck
npm run build
```
