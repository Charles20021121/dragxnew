import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const metadata = {
  title: 'Lyno Android Player User Manual',
  description: 'Complete user manual for Lyno Android Player, including installation instructions, desktop tutorials, system functions, and more.',
};

export default function LynoManual() {
  return (
    <div className="max-w-4xl mx-auto px-4">
      <div className="space-y-16">
        {/* Introduction */}
        <section className="text-center py-12">
          <h1 className="scroll-m-20 text-4xl font-bold tracking-tight mb-6 bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">
            Lyno Android Player User Manual
          </h1>
        </section>
      </div>
    </div>
  );
}