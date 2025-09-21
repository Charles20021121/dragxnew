import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import LynoSidebar from '@/components/manual/Sidebar';

export default function LynoManualLayout({ children }) {
  return (
    <div className="min-h-screen bg-background">
      <SidebarProvider>
        <div className="flex w-full" style={{ minHeight: 'calc(100vh - 80px - 200px)' }}>
          <LynoSidebar />
          <SidebarInset className="flex-1">
            <header className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-2 border-b bg-background/95 backdrop-blur px-4">
              <SidebarTrigger className="lg:hidden -ml-1" />
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-semibold">Lyno Android Player Manual</h1>
              </div>
            </header>
            <main className="flex-1 p-6">
              {children}
            </main>
          </SidebarInset>
        </div>
      </SidebarProvider>
    </div>
  );
}