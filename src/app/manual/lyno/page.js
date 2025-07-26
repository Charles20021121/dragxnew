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
          <div className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Welcome to the comprehensive user manual for Lyno Android Player. This guide will help you understand and make the most of your device.
          </div>
        </section>

        {/* Installation Instructions */}
        <section>
          <div className="flex items-center gap-4 mb-8">
            <h2 className="text-3xl font-semibold tracking-tight">1. Installation Instructions Tutorial</h2>
            <Badge variant="outline" className="h-6">Essential</Badge>
          </div>
          
          <div className="grid gap-8">
            <Card id="vehicle-wiring" className="scroll-m-20 overflow-hidden border-l-4 border-l-green-500">
              <CardContent className="p-6">
                <h3 className="text-2xl font-medium mb-4 flex items-center gap-2">
                  1.1 Vehicle Wiring Instructions
                  <Badge variant="secondary" className="text-xs">Safety Critical</Badge>
                </h3>
                <div className="space-y-4">
                  <p className="text-muted-foreground">Before installing your Lyno Android Player, please ensure you have all the necessary wiring components and follow these steps carefully:</p>
                  <ol className="list-decimal list-inside space-y-3 ml-4">
                    <li className="text-foreground/90 hover:text-foreground transition-colors">Locate your vehicle's wiring harness</li>
                    <li className="text-foreground/90 hover:text-foreground transition-colors">Identify the power, ground, and accessory wires</li>
                    <li className="text-foreground/90 hover:text-foreground transition-colors">Connect the corresponding wires from the Lyno unit</li>
                    <li className="text-foreground/90 hover:text-foreground transition-colors">Secure all connections with appropriate insulation</li>
                  </ol>
                </div>
              </CardContent>
            </Card>

            <Card id="vehicle-diagram" className="scroll-m-20 overflow-hidden border-l-4 border-l-blue-500">
              <CardContent className="p-6">
                <h3 className="text-2xl font-medium mb-4 flex items-center gap-2">
                  1.2 Vehicle Definition Diagram
                  <Badge variant="secondary" className="text-xs">Reference</Badge>
                </h3>
                <div className="space-y-4">
                  <p className="text-muted-foreground">Reference the diagram below for standard connection points:</p>
                  <div className="bg-muted/50 p-6 rounded-lg border border-dashed flex items-center justify-center min-h-[200px]">
                    [Diagram placeholder - will be replaced with actual wiring diagram]
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Desktop Tutorial */}
        <section>
          <div className="flex items-center gap-4 mb-8">
            <h2 className="text-3xl font-semibold tracking-tight">2. Desktop Tutorial</h2>
            <Badge variant="outline" className="h-6">Customization</Badge>
          </div>
          
          <div className="grid gap-8">
            <Card id="layout-changes" className="scroll-m-20 overflow-hidden border-l-4 border-l-purple-500">
              <CardContent className="p-6">
                <h3 className="text-2xl font-medium mb-4 flex items-center gap-2">
                  2.1 Layout Changes
                  <Badge variant="secondary" className="text-xs">UI/UX</Badge>
                </h3>
                <div className="space-y-4">
                  <p className="text-muted-foreground">Customize your desktop layout:</p>
                  <ul className="grid gap-3 ml-4">
                    <li className="flex items-center gap-2 text-foreground/90 hover:text-foreground transition-colors">
                      <span className="w-2 h-2 rounded-full bg-purple-500"></span>
                      Long press any empty area to enter edit mode
                    </li>
                    <li className="flex items-center gap-2 text-foreground/90 hover:text-foreground transition-colors">
                      <span className="w-2 h-2 rounded-full bg-purple-500"></span>
                      Drag and drop widgets to rearrange
                    </li>
                    <li className="flex items-center gap-2 text-foreground/90 hover:text-foreground transition-colors">
                      <span className="w-2 h-2 rounded-full bg-purple-500"></span>
                      Pinch to zoom for widget size adjustment
                    </li>
                    <li className="flex items-center gap-2 text-foreground/90 hover:text-foreground transition-colors">
                      <span className="w-2 h-2 rounded-full bg-purple-500"></span>
                      Tap and hold icons to create folders
                    </li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            <Card id="plugin-modifications" className="scroll-m-20 overflow-hidden border-l-4 border-l-orange-500">
              <CardContent className="p-6">
                <h3 className="text-2xl font-medium mb-4 flex items-center gap-2">
                  2.2 Plugin Modifications
                  <Badge variant="secondary" className="text-xs">Extensions</Badge>
                </h3>
                <div className="space-y-4">
                  <p className="text-muted-foreground">Enhance your experience with plugins:</p>
                  <ul className="grid gap-3 ml-4">
                    <li className="flex items-center gap-2 text-foreground/90 hover:text-foreground transition-colors">
                      <span className="w-2 h-2 rounded-full bg-orange-500"></span>
                      Access the plugin store from settings
                    </li>
                    <li className="flex items-center gap-2 text-foreground/90 hover:text-foreground transition-colors">
                      <span className="w-2 h-2 rounded-full bg-orange-500"></span>
                      Browse categories for desired functionality
                    </li>
                    <li className="flex items-center gap-2 text-foreground/90 hover:text-foreground transition-colors">
                      <span className="w-2 h-2 rounded-full bg-orange-500"></span>
                      Install and configure plugins
                    </li>
                    <li className="flex items-center gap-2 text-foreground/90 hover:text-foreground transition-colors">
                      <span className="w-2 h-2 rounded-full bg-orange-500"></span>
                      Manage plugin permissions
                    </li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            <Card id="theme-download" className="scroll-m-20 overflow-hidden border-l-4 border-l-pink-500">
              <CardContent className="p-6">
                <h3 className="text-2xl font-medium mb-4 flex items-center gap-2">
                  2.3 Theme Download
                  <Badge variant="secondary" className="text-xs">Appearance</Badge>
                </h3>
                <div className="space-y-4">
                  <p className="text-muted-foreground">Personalize your interface:</p>
                  <ul className="grid gap-3 ml-4">
                    <li className="flex items-center gap-2 text-foreground/90 hover:text-foreground transition-colors">
                      <span className="w-2 h-2 rounded-full bg-pink-500"></span>
                      Visit the theme store
                    </li>
                    <li className="flex items-center gap-2 text-foreground/90 hover:text-foreground transition-colors">
                      <span className="w-2 h-2 rounded-full bg-pink-500"></span>
                      Preview available themes
                    </li>
                    <li className="flex items-center gap-2 text-foreground/90 hover:text-foreground transition-colors">
                      <span className="w-2 h-2 rounded-full bg-pink-500"></span>
                      Download and apply your chosen theme
                    </li>
                    <li className="flex items-center gap-2 text-foreground/90 hover:text-foreground transition-colors">
                      <span className="w-2 h-2 rounded-full bg-pink-500"></span>
                      Customize theme elements
                    </li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* System Functions */}
        <section>
          <div className="flex items-center gap-4 mb-8">
            <h2 className="text-3xl font-semibold tracking-tight">3. Description Of System Functions</h2>
            <Badge variant="outline" className="h-6">Features</Badge>
          </div>
          
          <div className="grid gap-8">
            <Card id="apple-connected" className="scroll-m-20 overflow-hidden border-l-4 border-l-gray-500">
              <CardContent className="p-6">
                <h3 className="text-2xl font-medium mb-4 flex items-center gap-2">
                  3.1 Apple Connected
                  <Badge variant="secondary" className="text-xs">Integration</Badge>
                </h3>
                <div className="space-y-4">
                  <p className="text-muted-foreground">Connect your iPhone seamlessly:</p>
                  <ul className="grid gap-3 ml-4">
                    <li className="flex items-center gap-2 text-foreground/90 hover:text-foreground transition-colors">
                      <span className="w-2 h-2 rounded-full bg-gray-500"></span>
                      Enable CarPlay in iPhone settings
                    </li>
                    <li className="flex items-center gap-2 text-foreground/90 hover:text-foreground transition-colors">
                      <span className="w-2 h-2 rounded-full bg-gray-500"></span>
                      Connect via USB or wireless connection
                    </li>
                    <li className="flex items-center gap-2 text-foreground/90 hover:text-foreground transition-colors">
                      <span className="w-2 h-2 rounded-full bg-gray-500"></span>
                      Use Siri for voice commands
                    </li>
                    <li className="flex items-center gap-2 text-foreground/90 hover:text-foreground transition-colors">
                      <span className="w-2 h-2 rounded-full bg-gray-500"></span>
                      Access compatible apps
                    </li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            <Card id="radio" className="scroll-m-20 overflow-hidden border-l-4 border-l-cyan-500">
              <CardContent className="p-6">
                <h3 className="text-2xl font-medium mb-4 flex items-center gap-2">
                  3.2 Radio
                  <Badge variant="secondary" className="text-xs">Entertainment</Badge>
                </h3>
                <div className="space-y-4">
                  <p className="text-muted-foreground">Optimize your radio experience:</p>
                  <ul className="grid gap-3 ml-4">
                    <li className="flex items-center gap-2 text-foreground/90 hover:text-foreground transition-colors">
                      <span className="w-2 h-2 rounded-full bg-cyan-500"></span>
                      Auto-scan for available stations
                    </li>
                    <li className="flex items-center gap-2 text-foreground/90 hover:text-foreground transition-colors">
                      <span className="w-2 h-2 rounded-full bg-cyan-500"></span>
                      Save favorite channels
                    </li>
                    <li className="flex items-center gap-2 text-foreground/90 hover:text-foreground transition-colors">
                      <span className="w-2 h-2 rounded-full bg-cyan-500"></span>
                      Adjust audio settings
                    </li>
                    <li className="flex items-center gap-2 text-foreground/90 hover:text-foreground transition-colors">
                      <span className="w-2 h-2 rounded-full bg-cyan-500"></span>
                      Use RDS features
                    </li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            <Card id="bluetooth-music" className="scroll-m-20 overflow-hidden border-l-4 border-l-indigo-500">
              <CardContent className="p-6">
                <h3 className="text-2xl font-medium mb-4 flex items-center gap-2">
                  3.3 Bluetooth Music
                  <Badge variant="secondary" className="text-xs">Wireless</Badge>
                </h3>
                <div className="space-y-4">
                  <p className="text-muted-foreground">Stream your favorite music:</p>
                  <ul className="grid gap-3 ml-4">
                    <li className="flex items-center gap-2 text-foreground/90 hover:text-foreground transition-colors">
                      <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
                      Pair your device
                    </li>
                    <li className="flex items-center gap-2 text-foreground/90 hover:text-foreground transition-colors">
                      <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
                      Manage connected devices
                    </li>
                    <li className="flex items-center gap-2 text-foreground/90 hover:text-foreground transition-colors">
                      <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
                      Control playback
                    </li>
                    <li className="flex items-center gap-2 text-foreground/90 hover:text-foreground transition-colors">
                      <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
                      View song information
                    </li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Others */}
        <section className="pb-16">
          <div className="flex items-center gap-4 mb-8">
            <h2 className="text-3xl font-semibold tracking-tight">4. Others</h2>
            <Badge variant="outline" className="h-6">Additional</Badge>
          </div>
          
          <div className="grid gap-8">
            <Card id="accessories" className="scroll-m-20 overflow-hidden border-l-4 border-l-yellow-500">
              <CardContent className="p-6">
                <h3 className="text-2xl font-medium mb-4 flex items-center gap-2">
                  4.1 Accessories
                  <Badge variant="secondary" className="text-xs">Hardware</Badge>
                </h3>
                <div className="space-y-4">
                  <p className="text-muted-foreground">Standard package includes:</p>
                  <ul className="grid gap-3 ml-4">
                    <li className="flex items-center gap-2 text-foreground/90 hover:text-foreground transition-colors">
                      <span className="w-2 h-2 rounded-full bg-yellow-500"></span>
                      Main unit
                    </li>
                    <li className="flex items-center gap-2 text-foreground/90 hover:text-foreground transition-colors">
                      <span className="w-2 h-2 rounded-full bg-yellow-500"></span>
                      Power cable
                    </li>
                    <li className="flex items-center gap-2 text-foreground/90 hover:text-foreground transition-colors">
                      <span className="w-2 h-2 rounded-full bg-yellow-500"></span>
                      GPS antenna
                    </li>
                    <li className="flex items-center gap-2 text-foreground/90 hover:text-foreground transition-colors">
                      <span className="w-2 h-2 rounded-full bg-yellow-500"></span>
                      User manual
                    </li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            <Card id="support" className="scroll-m-20 overflow-hidden border-l-4 border-l-red-500">
              <CardContent className="p-6">
                <h3 className="text-2xl font-medium mb-4 flex items-center gap-2">
                  Support Information
                  <Badge variant="secondary" className="text-xs">Help</Badge>
                </h3>
                <div className="space-y-4">
                  <p className="text-muted-foreground">Get help when you need it:</p>
                  <ul className="grid gap-3 ml-4">
                    <li className="flex items-center gap-2 text-foreground/90 hover:text-foreground transition-colors">
                      <span className="w-2 h-2 rounded-full bg-red-500"></span>
                      Visit our support center
                    </li>
                    <li className="flex items-center gap-2 text-foreground/90 hover:text-foreground transition-colors">
                      <span className="w-2 h-2 rounded-full bg-red-500"></span>
                      Contact technical support
                    </li>
                    <li className="flex items-center gap-2 text-foreground/90 hover:text-foreground transition-colors">
                      <span className="w-2 h-2 rounded-full bg-red-500"></span>
                      Check FAQ section
                    </li>
                    <li className="flex items-center gap-2 text-foreground/90 hover:text-foreground transition-colors">
                      <span className="w-2 h-2 rounded-full bg-red-500"></span>
                      Access firmware updates
                    </li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      </div>
    </div>
  );
}