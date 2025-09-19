import { useState } from "react";
import { Menu, X, Shield, Heart, MessageCircle, BookOpen, Calendar, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { href: "#chat", label: "AI Support", icon: MessageCircle },
    { href: "#screening", label: "Self-Assessment", icon: Heart },
    { href: "#resources", label: "Resources", icon: BookOpen },
    { href: "#booking", label: "Book Session", icon: Calendar },
    { href: "#peer-support", label: "Peer Support", icon: Users },
  ];

  return (
    <nav className="bg-background/95 backdrop-blur-sm border-b border-border sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-hero rounded-lg flex items-center justify-center">
              <Shield className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-foreground">MindBridge</h1>
              <p className="text-xs text-muted-foreground">Student Mental Health Support</p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => {
              const IconComponent = item.icon;
              return (
                <Button
                  key={item.href}
                  variant="ghost"
                  className="text-muted-foreground hover:text-primary hover:bg-primary-soft/20 transition-colors"
                  asChild
                >
                  <a href={item.href} className="flex items-center space-x-2">
                    <IconComponent className="w-4 h-4" />
                    <span>{item.label}</span>
                  </a>
                </Button>
              );
            })}
          </div>

          {/* Privacy Indicator */}
          <div className="hidden md:flex items-center space-x-3">
            <div className="flex items-center space-x-1 text-xs text-safe-foreground bg-safe/30 px-2 py-1 rounded-full">
              <Shield className="w-3 h-3" />
              <span>100% Confidential</span>
            </div>
            <Button variant="outline" size="sm">
              Crisis Help
            </Button>
          </div>

          {/* Mobile menu button */}
          <Button
            variant="ghost"
            size="sm"
            className="md:hidden"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
        </div>

        {/* Mobile Navigation */}
        <div className={cn(
          "md:hidden transition-all duration-300 ease-in-out",
          isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0 overflow-hidden"
        )}>
          <div className="py-4 space-y-2">
            {navItems.map((item) => {
              const IconComponent = item.icon;
              return (
                <a
                  key={item.href}
                  href={item.href}
                  className="flex items-center space-x-3 px-3 py-2 text-muted-foreground hover:text-primary hover:bg-primary-soft/20 rounded-md transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  <IconComponent className="w-4 h-4" />
                  <span>{item.label}</span>
                </a>
              );
            })}
            <div className="pt-3 border-t border-border">
              <div className="flex items-center justify-center space-x-1 text-xs text-safe-foreground bg-safe/30 px-3 py-2 rounded-full mx-3">
                <Shield className="w-3 h-3" />
                <span>All conversations are confidential</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;