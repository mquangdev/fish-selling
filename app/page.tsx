import AboutSection from "@/components/home/AboutSection";
import FinalCta from "@/components/home/FinalCta";
import FishSection from "@/components/home/FishSection";
import Hero from "@/components/home/Hero";
import HowToOrder from "@/components/home/HowToOrder";
import { DEFAULT_TITLE, buildPageMetadata } from "@/lib/seo";
import { SITE_DESCRIPTION } from "@/lib/site";

export const metadata = buildPageMetadata({
  title: DEFAULT_TITLE,
  description: SITE_DESCRIPTION,
  path: "/",
});

export default function Home() {
  return (
    <>
      <Hero />
      <FishSection />
      <AboutSection />
      <HowToOrder />
      <FinalCta />
    </>
  );
}
