import type { Metadata } from "next";
import { AboutPage } from "@/components/about/about-page";

export const metadata: Metadata = {
  title: "About Roope Aaltonen | ICT Engineering Portfolio",
  description:
    "About Roope Aaltonen, an ICT engineering student focused on practical systems, networks, IoT, testing, cloud technologies and security.",
};

export default function StandaloneAboutPage() {
  return <AboutPage />;
}
