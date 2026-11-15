import AboutSection from "@/components/home/AboutSection";
import FinalCta from "@/components/home/FinalCta";
import FishSection from "@/components/home/FishSection";
import Hero from "@/components/home/Hero";
import HowToOrder from "@/components/home/HowToOrder";

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
