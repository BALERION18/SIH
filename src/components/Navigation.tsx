import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, MapPin, Camera, Archive, Calendar, Headphones } from "lucide-react";
import monasteryLogo from "@/assets/monastery-logo.png";
import { ProfileSection } from "./ProfileSection";

interface NavigationProps {
  activeSection: string;
  setActiveSection: (section: string) => void;
}

export const Navigation = ({ activeSection, setActiveSection }: NavigationProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const navigationItems = [
    { id: "home", label: "Home", icon: null },
    { id: "map", label: "Interactive Map", icon: MapPin },
    { id: "tours", label: "Virtual Tours", icon: Camera },
    { id: "archives", label: "Digital Archives", icon: Archive },
    { id: "calendar", label: "Cultural Calendar", icon: Calendar },
    { id: "audio", label: "Audio Guide", icon: Headphones },
  ];

  const handleNavigation = (sectionId: string) => {
    setActiveSection(sectionId);
    setIsOpen(false);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/5 backdrop-blur-xl border-b border-white/10 shadow-xl min-h-[72px]">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-3 mr-8">
          <img 
            src={monasteryLogo} 
            alt="Monastery360 Logo" 
            loading="eager"
            decoding="async"
            className="w-8 h-8 object-contain"
          />
          <h1 className="text-xl font-bold text-white">Monastery360</h1>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center space-x-6 flex-1 justify-center">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => handleNavigation(item.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 text-sm font-medium ${
                  activeSection === item.id 
                    ? "text-white bg-white/10" 
                    : "text-white/80 hover:text-white hover:bg-white/5"
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

        {/* Mobile Navigation */}
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild className="lg:hidden">
            <button className="p-2 rounded-md text-white/90 hover:text-white hover:bg-white/5 transition-all duration-200">
              <Menu className="w-4 h-4" />
            </button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[350px] bg-gradient-glass backdrop-blur-xl border-white/20">
            <div className="flex flex-col space-y-4 mt-8">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleNavigation(item.id)}
                    className={`flex items-center space-x-2 justify-start w-full px-3 py-2 rounded-md transition-all duration-200 ${
                      activeSection === item.id 
                        ? "text-white font-medium" 
                        : "text-white/90 hover:text-white hover:bg-white/5"
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