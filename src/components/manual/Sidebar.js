'use client';

import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Sidebar() {
  const menuItems = [
    {
      title: "Installation Instructions Tutorial",
      items: [
        { title: "Vehicle Wiring Instructions", href: "#vehicle-wiring" },
        { title: "Vehicle Definition Diagram", href: "#vehicle-diagram" }
      ]
    },
    {
      title: "Desktop Tutorial",
      items: [
        { title: "Layout Changes", href: "#layout-changes" },
        { title: "Plugin Modifications", href: "#plugin-modifications" },
        { title: "Theme Download", href: "#theme-download" }
      ]
    },
    {
      title: "Description Of System Functions",
      items: [
        { title: "Apple Connected", href: "#apple-connected" },
        { title: "Radio", href: "#radio" },
        { title: "Bluetooth Music", href: "#bluetooth-music" }
      ]
    },
    {
      title: "Others",
      items: [
        { title: "Accessories", href: "#accessories" },
        { title: "Support Information", href: "#support" }
      ]
    }
  ];

  return (
    <div>
      {/* Mobile Menu Button */}
      <div className="lg:hidden">
        <Sheet>
          <SheetTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="fixed left-4 top-4 z-40 lg:hidden"
            >
              <Menu className="h-4 w-4" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[240px] sm:w-[300px] overflow-y-auto custom-scrollbar">
            <h2 className="sr-only">Navigation Menu</h2>
            <nav className="flex flex-col space-y-6 py-6">
              {menuItems.map((section, index) => (
                <div key={index} className="space-y-2">
                  <h4 className="font-medium text-base text-foreground">{section.title}</h4>
                  <div className="flex flex-col space-y-1">
                    {section.items.map((item, itemIndex) => (
                      <a
                        key={itemIndex}
                        href={item.href}
                        className="text-sm text-muted-foreground hover:text-foreground hover:underline"
                      >
                        {item.title}
                      </a>
                    ))}
                  </div>
                </div>
              ))}
            </nav>
          </SheetContent>
        </Sheet>
      </div>

      {/* Desktop Sidebar */}
      <nav className="hidden lg:block">
        <div className="space-y-6">
          {menuItems.map((section, index) => (
            <div key={index} className="space-y-3">
              <h4 className="font-medium text-base text-foreground">{section.title}</h4>
              <div className="flex flex-col space-y-2">
                {section.items.map((item, itemIndex) => (
                  <a
                    key={itemIndex}
                    href={item.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {item.title}
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>
      </nav>
    </div>
  );
}