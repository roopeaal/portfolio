import { Suspense } from "react";
import { TopologyHero } from "@/components/topology-hero";

export default function HomePage() {
  return (
    <main>
      <Suspense fallback={<div className="min-h-screen bg-[#fbfbfb]" />}>
        <TopologyHero />
      </Suspense>
    </main>
  );
}
