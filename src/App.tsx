import { useTranslation } from "react-i18next";
import { Nav } from "./components/Nav";
import { Hero } from "./components/Hero";
import { Marquee } from "./components/Marquee";
import { Products } from "./components/Products";
import { Corrugated } from "./components/Corrugated";
import { WhyUs } from "./components/WhyUs";
import { OurClients } from "./components/OurClients";
import { Distribution } from "./components/Distribution";
import { Contact } from "./components/Contact";
import { Footer } from "./components/Footer";
import { ChatWidget } from "./components/chat/ChatWidget";
import { StructuredData } from "./components/StructuredData";

/**
 * "Our Clients" is built and ready but hidden at the client's request until he
 * supplies the client names and logo files.
 * To switch it back on: set this to true (the section renders between "Why
 * Kakatiya" and "Distribution"). Content lives in src/components/OurClients.tsx.
 */
const SHOW_OUR_CLIENTS = false;

export default function App() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-background text-foreground">
      <StructuredData />
      {/* Skip link for keyboard users */}
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-lg focus:bg-foreground focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-background"
      >
        {t("nav.skip")}
      </a>

      <Nav />
      <main id="main">
        <Hero />
        <Marquee />
        <Products />
        <Corrugated />
        <WhyUs />
        {SHOW_OUR_CLIENTS && <OurClients />}
        <Distribution />
        <Contact />
      </main>
      <Footer />
      <ChatWidget />
    </div>
  );
}
