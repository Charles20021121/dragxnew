'use client';

import { useState, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  useSidebar,
} from "@/components/ui/sidebar";
import * as Collapsible from "@radix-ui/react-collapsible";

export default function LynoSidebar() {
  const [activeSection, setActiveSection] = useState('');
  const { setOpenMobile } = useSidebar();

  const handleLinkClick = (href, e) => {
    e.preventDefault();
    const targetId = href.replace('#', '');
    const element = document.getElementById(targetId);
    if (element) {
      // 获取元素位置
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - 100; // 向上偏移100px
      
      // 平滑滚动到指定位置
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
      
      setActiveSection(href);
      
      // 在手机版本自动关闭 sidebar
      if (window.innerWidth < 1024) { // lg breakpoint
        setOpenMobile(false);
      }
    }
  };

  // 监听滚动事件来更新活动状态
  useEffect(() => {
    const handleScroll = () => {
      const sections = document.querySelectorAll('[id]');
      let currentSection = '';
      
      sections.forEach((section) => {
        const rect = section.getBoundingClientRect();
        // 使用相同的偏移量来判断活动状态
        if (rect.top <= 120 && rect.bottom >= 120) {
          currentSection = `#${section.id}`;
        }
      });
      
      if (currentSection !== activeSection) {
        setActiveSection(currentSection);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [activeSection]);

  const menuItems = [
    {
      id: "desktop",
      title: "1. Desktop Tutorial",
      page: 3,
      items: [
        { title: "1.1 Layout Changes", href: "#layout-changes", page: 4 },
        { title: "1.2 Plug-in Modifications", href: "#plugin-modifications", page: 12 },
        { title: "1.3 Theme Download", href: "#theme-download", page: 16 },
        { title: "1.4 Digital Meter Download", href: "#digital-meter-download", page: 23 },
        { title: "1.5 Wallpaper Mode Tutorial", href: "#wallpaper-mode-tutorial", page: 30 },
        { title: "1.6 Circadian Mode Settings", href: "#circadian-mode-settings", page: 41 },
        { title: "1.7 Enhanced Navigation Bar", href: "#enhanced-navigation-bar", page: 44 },
        { title: "1.8 Picture In Picture", href: "#picture-in-picture", page: 60 },
        { title: "1.9 Music Plugins", href: "#music-plugins", page: 66 },
        { title: "1.10 Full-screen Gestures", href: "#fullscreen-gestures", page: 72 },
        { title: "1.11 APP Management", href: "#app-management", page: 78 },
        { title: "1.12 Planned Tasks", href: "#planned-tasks", page: 82 }
      ]
    },
    {
      id: "functions",
      title: "2. Description of System Function",
      page: 86,
      items: [
        { title: "2.1 Apple Connected", href: "#apple-connected", page: 87 },
        { title: "2.2 Huawei Internet", href: "#huawei-internet", page: 93 },
        { title: "2.3 Local Music", href: "#local-music", page: 98 },
        { title: "2.4 Radio", href: "#radio", page: 102 },
        { title: "2.5 Bluetooth Music", href: "#bluetooth-music", page: 106 },
        { title: "2.6 Document Management", href: "#document-management", page: 109 },
        { title: "2.7 Bluetooth Phone", href: "#bluetooth-phone", page: 114 },
        { title: "2.8 Equalizer", href: "#equalizer", page: 122 },
        { title: "2.9 Sound Master", href: "#sound-master", page: 130 }
      ]
    },
    {
      id: "others",
      title: "3. Others",
      page: 138,
      items: [
        { title: "3.1 Accessories", href: "#accessories", page: 139 }
      ]
    }
  ];



  return (
    <Sidebar className="border-r bg-background w-80 lg:block sticky top-0" style={{height: 'calc(100vh)'}}>
      <SidebarContent className="px-4 py-4 overflow-y-auto h-full">
        {/* 导航菜单 */}
        <div className="space-y-4">
          {menuItems.map((section) => (
            <div key={section.id} className="space-y-2">
              <Collapsible.Root defaultOpen>
                <Collapsible.Trigger asChild>
                                      <button className="group/label w-full flex items-center justify-between px-3 py-2.5 text-left hover:bg-muted/50 rounded-lg transition-colors">
                      <span className="font-semibold text-sm text-foreground">{section.title}</span>
                      <ChevronDown className="h-4 w-4 text-muted-foreground transition-transform group-data-[state=closed]/label:-rotate-90" />
                    </button>
                </Collapsible.Trigger>
                <Collapsible.Content>
                  <div className="mt-2 ml-2 space-y-1 border-l-2 border-muted pl-4">
                    {section.items.map((item, itemIndex) => {
                      const isActive = activeSection === item.href;
                      return (
                                                  <a
                            key={itemIndex}
                            href={item.href}
                            onClick={(e) => handleLinkClick(item.href, e)}
                            className={`group flex items-center py-2 px-3 rounded-md transition-colors ${
                              isActive 
                                ? 'bg-blue-50 border-l-2 border-blue-500 text-blue-700 -ml-6 pl-5' 
                                : 'hover:bg-muted/30 text-muted-foreground hover:text-foreground'
                            }`}
                          >
                            <span className="text-sm leading-tight">{item.title}</span>
                          </a>
                      );
                    })}
                  </div>
                </Collapsible.Content>
              </Collapsible.Root>
            </div>
          ))}
        </div>
      </SidebarContent>
    </Sidebar>
  );
}