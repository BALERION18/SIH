import { useState } from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, MapPin, Camera, Archive, Calendar, Headphones } from "lucide-react";
import monasteryLogo from "@/assets/monastery-logo.png";
import { ProfileSection } from "./ProfileSection";

export const Navigation = ({ activeSection, setActiveSection }) => {
  const [isOpen, setIsOpen] = useState(false);

  const navigationItems = [
    { id: "home", label: "Home", icon: null },
    { id: "map", label: "Interactive Map", icon: MapPin },
    { id: "tours", label: "Virtual Tours", icon: Camera },
    { id: "archives", label: "Digital Archives", icon: Archive },
    { id: "calendar", label: "Cultural Calendar", icon: Calendar },
    { id: "audio", label: "Audio Guide", icon: Headphones },
  ];

  const handleNavigation = (sectionId) => {
    setActiveSection(sectionId);
    setIsOpen(false);
  };

  // 🔥 Always black text + subtle glow
  const textStyle = "text-black drop-shadow-[0_0_6px_rgba(255,255,255,0.6)]";

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-white/20 backdrop-blur-xl border-b border-white/30 shadow-lg">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo + Title */}
        <div className="flex items-center space-x-3 mr-8">
          <img
            src={monasteryLogo}
            alt="Monastery360 Logo"
            className="w-8 h-8 object-contain"
          />
          <h1 className={`text-xl font-bold transition-colors ${textStyle}`}>
            Monastery
            <span className="text-primary drop-shadow-[0_0_6px_rgba(59,130,246,0.7)]">
              360
            </span>
          </h1>
        </div>

        {/* Desktop Nav */}
        <div className="hidden lg:flex items-center space-x-6 flex-1 justify-center">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => handleNavigation(item.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 text-sm font-medium ${
                  activeSection === item.id
                    ? `${textStyle} bg-white/30`
                    : `${textStyle} opacity-80 hover:opacity-100 hover:bg-white/20`
                }`}
              >
                {Icon && <Icon className="w-4 h-4" />}
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>

        {/* Profile Section - Desktop */}
        <div className="hidden lg:block">
          <ProfileSection />
        </div>

        {/* Mobile Nav */}
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild className="lg:hidden">
            <button className={`p-2 rounded-md transition-all duration-200 ${textStyle}`}>
              <Menu className="w-4 h-4" />
            </button>
          </SheetTrigger>
          <SheetContent
            side="right"
            className="w-[350px] bg-white/20 backdrop-blur-2xl border-white/30"
          >
            <div className="flex flex-col space-y-4 mt-8">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleNavigation(item.id)}
                    className={`flex items-center space-x-2 justify-start w-full px-3 py-2 rounded-md transition-all duration-200 ${
                      activeSection === item.id
                        ? `${textStyle} font-medium`
                        : `${textStyle} opacity-80 hover:opacity-100`
                    }`}
                  >
                    {Icon && <Icon className="w-4 h-4" />}
                    <span>{item.label}</span>
                  </button>
                );
              })}

              {/* Mobile Profile Section */}
              <div className="mt-8 pt-8 border-t border-white/20">
                <ProfileSection />
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </nav>
  );
};
