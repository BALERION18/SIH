import { useState } from "react";
import { Navigation } from "@/components/Navigation";
import { Homepage } from "@/components/Homepage";
import { InteractiveMap } from "@/components/InteractiveMap";
import { VirtualTours } from "@/components/VirtualTours";
import { Blogs } from "@/components/Blogs";
import { CulturalCalendar } from "@/components/CulturalCalendar";
import { AudioGuide } from "@/components/AudioGuide";
import { PWAInstallPrompt } from "@/components/PWAInstallPrompt";

const Index = () => {
  const [activeSection, setActiveSection] = useState("home");

  const renderActiveSection = () => {
    switch (activeSection) {
      case "home":
        return <Homepage setActiveSection={setActiveSection} />;
      case "map":
        return <InteractiveMap />;
      case "tours":
        return <VirtualTours />;
      case "archives":
        return <Blogs />;
      case "calendar":
        return <CulturalCalendar />;
      case "audio":
        return <AudioGuide />;
      default:
        return <Homepage setActiveSection={setActiveSection} />;
    }
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <Navigation activeSection={activeSection} setActiveSection={setActiveSection} />
      <main className={activeSection === "home" ? "" : "pt-[72px]"}>
        {renderActiveSection()}
      </main>
      <PWAInstallPrompt />
    </div>
  );
};

export default Index;