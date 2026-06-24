# Roope Aaltonen – interactive network-topology inspired portfolio homepage

This is a Next.js portfolio built around a Packet Tracer / network-topology inspired homepage.
The homepage is the real application surface and the popup windows are the source of truth for all meaningful content.

## Stack

- Next.js 16 App Router
- React 19
- TypeScript
- Tailwind CSS v4
- Framer Motion
- React Three Fiber, Three.js and Rapier physics

## Core product behavior

- Homepage remains the primary interactive experience
- `/about` provides a standalone employer-focused profile and interactive 3D tech stack
- Popup state is synced to the URL
- Deep links work, for example:
  - `/?panel=about`
  - `/?panel=projects`
  - `/?panel=projects&project=multi-platform-iot-security-lab`
  - `/?panel=contact`
- `/projects` and `/contact` redirect to the matching homepage popup state
- The About popup links to the complete standalone About page
- Projects are browsed inside the same popup window instead of separate duplicate pages

## Main content files

- `components/topology-hero.tsx` — homepage topology, node interaction and animation logic
- `components/packet-window.tsx` — Packet Tracer style window shell with focus handling and keyboard support
- `components/portfolio-panel-content.tsx` — real popup content for Home, About, Projects and Contact
- `components/about/` — standalone About page sections and isolated 3D physics field
- `hooks/use-portfolio-panel-state.ts` — URL-synced popup state
- `content/profile.ts` — profile and contact content source
- `content/projects.ts` — project case study content source

## Documentation

- [Academic implementation report](docs/portfolio-academic-report.md)

## Commands

```bash
npm install
npm run lint
npm run typecheck
npm run build
```
