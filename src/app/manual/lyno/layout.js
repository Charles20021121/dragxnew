import Sidebar from '@/components/manual/Sidebar';

export default function LynoManualLayout({ children }) {
  return (
    <div className="min-h-screen bg-background">
      {/* Main Content */}
      <div className="container flex-1 items-start md:grid md:grid-cols-[220px_minmax(0,1fr)] md:gap-6 lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-10 px-4">
        <aside className="fixed top-0 z-30 hidden h-screen w-[220px] lg:w-[240px] shrink-0 overflow-y-auto border-r md:sticky md:block custom-scrollbar pl-4">
          <div className="relative py-6 px-4">
            <Sidebar />
          </div>
        </aside>
        <main className="relative py-6 lg:gap-10 lg:py-8 xl:grid">
          <div className="mx-auto w-full min-w-0">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}