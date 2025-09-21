import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";

export const metadata = {
  title: 'Lyno Android Player User Manual',
  description: 'Complete user manual for Lyno Android Player, including installation instructions, desktop tutorials, system functions, and more.',
};

// 手册数据 - Part 1: Desktop Tutorial (完整第1章)
const manualData = [
  {
    id: "installation",
    title: "Installation Instruction Tutorial",
    sections: [
      {
        id: "layout-changes",
        title: "1.1 Layout Changes",
        steps: [
          {
            id: "1.1.1",
            text: "1.1.1 Click on the car settings desktop homepage layout settings to switch layouts",
            image: "/manual/lyno/1. Desktop Tutorial/1.1 Layout Changes/1.1.1.png",
            alt: "Layout Changes Step 1"
          },
          {
            id: "1.1.2",
            text: "1.1.2 Two layout options available, top and bottom layout/left and right layout",
            image: "/manual/lyno/1. Desktop Tutorial/1.1 Layout Changes/1.1.2.png",
            alt: "Layout Changes Step 2"
          },
          {
            id: "1.1.3",
            text: "1.1.3 Layout 1 (left and right layout) Size plug-in can switch positions",
            image: "/manual/lyno/1. Desktop Tutorial/1.1 Layout Changes/1.1.3.png",
            alt: "Layout Changes Step 3"
          },
          {
            id: "1.1.4",
            text: "1.1.4 Left side effect",
            image: "/manual/lyno/1. Desktop Tutorial/1.1 Layout Changes/1.1.4.png",
            alt: "Layout Changes Step 4"
          },
          {
            id: "1.1.5",
            text: "1.1.5 Right side effect",
            image: "/manual/lyno/1. Desktop Tutorial/1.1 Layout Changes/1.1.5.png",
            alt: "Layout Changes Step 5"
          },
          {
            id: "1.1.6",
            text: "1.1.6 Layout 2 (Top and Bottom Layout) Layout pendants can be switched",
            image: "/manual/lyno/1. Desktop Tutorial/1.1 Layout Changes/1.1.6.png",
            alt: "Layout Changes Step 6"
          },
          {
            id: "1.1.7",
            text: "1.1.7 Style 1 (without pendant)",
            image: "/manual/lyno/1. Desktop Tutorial/1.1 Layout Changes/1.1.7.png",
            alt: "Layout Changes Step 7"
          },
          {
            id: "1.1.8",
            text: "1.1.8 Style 2 pendant on the left side",
            image: "/manual/lyno/1. Desktop Tutorial/1.1 Layout Changes/1.1.8.png",
            alt: "Layout Changes Step 8"
          },
          {
            id: "1.1.9",
            text: "1.1.9 Style 3 pendant on the right side",
            image: "/manual/lyno/1. Desktop Tutorial/1.1 Layout Changes/1.1.9.png",
            alt: "Layout Changes Step 9"
          },
          {
            id: "1.1.10",
            text: "1.1.10 And the plugin size can be set to mini in the settings",
            image: "/manual/lyno/1. Desktop Tutorial/1.1 Layout Changes/1.1.10.png",
            alt: "Layout Changes Step 10"
          },
          {
            id: "1.1.11",
            text: "1.1.11 Pendant long press can be edited and adjusted",
            image: "/manual/lyno/1. Desktop Tutorial/1.1 Layout Changes/1.1.11.png",
            alt: "Layout Changes Step 11"
          },
          {
            id: "1.1.12",
            text: "1.1.12 Modifying pendant can be checked or adjusted in position",
            image: "/manual/lyno/1. Desktop Tutorial/1.1 Layout Changes/1.1.12.png",
            alt: "Layout Changes Step 12"
          },
          {
            id: "1.1.13",
            text: "1.1.13 Music pendant settings multiple layouts",
            image: "/manual/lyno/1. Desktop Tutorial/1.1 Layout Changes/1.1.13.png",
            alt: "Layout Changes Step 13"
          },
          {
            id: "1.1.14",
            text: "1.1.14 Complete",
            image: "/manual/lyno/1. Desktop Tutorial/1.1 Layout Changes/1.1.14.png",
            alt: "Layout Changes Step 14"
          }
        ]
      },
      {
        id: "plugin-modifications",
        title: "1.2 Plug-in Modifications",
        steps: [
          {
            id: "1.2.1",
            text: "1.2.1 Plug-in Modifications",
            image: "/manual/lyno/1. Desktop Tutorial/1.2 Plug-in Modifications/1.2.1.png",
            alt: "Plug-in Modifications Step 1"
          },
          {
            id: "1.2.2",
            text: "1.2.2 Long press on any plug-in (select modify home plug-in)",
            image: "/manual/lyno/1. Desktop Tutorial/1.2 Plug-in Modifications/1.2.2.png",
            alt: "Plug-in Modifications Step 2"
          },
          {
            id: "1.2.3",
            text: "1.2.3 Tick to show or hide, or long-press to adjust plug-in position",
            image: "/manual/lyno/1. Desktop Tutorial/1.2 Plug-in Modifications/1.2.3.png",
            alt: "Plug-in Modifications Step 3"
          },
          {
            id: "1.2.4",
            text: "1.2.4 Click Save-Confirm after making adjustments.",
            image: "/manual/lyno/1. Desktop Tutorial/1.2 Plug-in Modifications/1.2.4.png",
            alt: "Plug-in Modifications Step 4"
          }
        ],
        afterText: ""
      },
      {
        id: "theme-download",
        title: "1.3 Theme Download",
        steps: [
          {
            id: "1.3.1",
            text: "1.3.1 Go to Theme Center",
            image: "/manual/lyno/1. Desktop Tutorial/1.3 Theme Download/1.3.1.png",
            alt: "Theme Download Step 1"
          },
          {
            id: "1.3.2a",
            text: "1.3.2 Dozens of themes Free downloads (requires internet access to log in to your account)",
            image: "/manual/lyno/1. Desktop Tutorial/1.3 Theme Download/1.3.2a.png",
            alt: "Theme Download Step 2a"
          },
          {
            id: "1.3.2b",
            text: "",
            image: "/manual/lyno/1. Desktop Tutorial/1.3 Theme Download/1.3.2b.png",
            alt: "Theme Download Step 2b"
          },
          {
            id: "1.3.3",
            text: "1.3.3 Choose your favorite theme and click install",
            image: "/manual/lyno/1. Desktop Tutorial/1.3 Theme Download/1.3.3.png",
            alt: "Theme Download Step 3"
          },
          {
            id: "1.3.4",
            text: "1.3.4 After successful installation, check in \"My Themes\".",
            image: "/manual/lyno/1. Desktop Tutorial/1.3 Theme Download/1.3.4.png",
            alt: "Theme Download Step 4"
          },
          {
            id: "1.3.5a",
            text: "1.3.5 Set favorite theme as default/night theme (can be both)",
            image: "/manual/lyno/1. Desktop Tutorial/1.3 Theme Download/1.3.5a.png",
            alt: "Theme Download Step 5a"
          },
          {
            id: "1.3.5b",
            text: "",
            image: "/manual/lyno/1. Desktop Tutorial/1.3 Theme Download/1.3.5b.png",
            alt: "Theme Download Step 5b"
          }
        ],
        afterText: ""
      },
      {
        id: "digital-meter-download",
        title: "1.4 Digital Meter Download",
        steps: [
          {
            id: "1.4.1",
            text: "1.4.1 Go to Theme center",
            image: "/manual/lyno/1. Desktop Tutorial/1.4 Digital Meter Download/1.4.1.png",
            alt: "Digital Meter Download Step 1"
          },
          {
            id: "1.4.2",
            text: "1.4.2 Wide range of Digital Meter types to choose",
            image: "/manual/lyno/1. Desktop Tutorial/1.4 Digital Meter Download/1.4.2.png",
            alt: "Digital Meter Download Step 2"
          },
          {
            id: "1.4.3",
            text: "1.4.3 Select the Digital Meter to be switched, and click on Installation.",
            image: "/manual/lyno/1. Desktop Tutorial/1.4 Digital Meter Download/1.4.3.png",
            alt: "Digital Meter Download Step 3"
          },
          {
            id: "1.4.4",
            text: "1.4.4 After successful installation, check in OSD.",
            image: "/manual/lyno/1. Desktop Tutorial/1.4 Digital Meter Download/1.4.4.png",
            alt: "Digital Meter Download Step 4"
          },
          {
            id: "1.4.5",
            text: "1.4.5 Click the favorite Digital Meter to use",
            image: "/manual/lyno/1. Desktop Tutorial/1.4 Digital Meter Download/1.4.5.png",
            alt: "Digital Meter Download Step 5"
          },
          {
            id: "1.4.6a",
            text: "1.4.6 Open OSD APP",
            image: "/manual/lyno/1. Desktop Tutorial/1.4 Digital Meter Download/1.4.6a.png",
            alt: "Digital Meter Download Step 6a"
          },
          {
            id: "1.4.6b",
            text: "",
            image: "/manual/lyno/1. Desktop Tutorial/1.4 Digital Meter Download/1.4.6b.png",
            alt: "Digital Meter Download Step 6b"
          }
        ],
        afterText: ""
      },
      {
        id: "wallpaper-mode-tutorial",
        title: "1.5 Wallpaper Mode Tutorial",
        steps: [
          {
            id: "1.5.1a",
            text: "1.5.1 Click the + sign in the lower right corner to import wallpapers",
            image: "/manual/lyno/1. Desktop Tutorial/1.5 Wallpaper Mode Tutorial/1.5.1a.png",
            alt: "Wallpaper Mode Tutorial Step 1a"
          },
          {
            id: "1.5.1b",
            text: "",
            image: "/manual/lyno/1. Desktop Tutorial/1.5 Wallpaper Mode Tutorial/1.5.1b.png",
            alt: "Wallpaper Mode Tutorial Step 1b"
          },
          {
            id: "1.5.1c",
            text: "",
            image: "/manual/lyno/1. Desktop Tutorial/1.5 Wallpaper Mode Tutorial/1.5.1c.png",
            alt: "Wallpaper Mode Tutorial Step 1c"
          },
          {
            id: "1.5.2a",
            text: "1.5.2 You can also download wallpapers from the Theme Center and set the wallpapers to be available at day/night.",
            image: "/manual/lyno/1. Desktop Tutorial/1.5 Wallpaper Mode Tutorial/1.5.2a.png",
            alt: "Wallpaper Mode Tutorial Step 2a"
          },
          {
            id: "1.5.2b",
            text: "",
            image: "/manual/lyno/1. Desktop Tutorial/1.5 Wallpaper Mode Tutorial/1.5.2b.png",
            alt: "Wallpaper Mode Tutorial Step 2b"
          },
          {
            id: "1.5.3",
            text: "1.5.3 Home plug-in can switch to wallpaper mode",
            image: "/manual/lyno/1. Desktop Tutorial/1.5 Wallpaper Mode Tutorial/1.5.3.png",
            alt: "Wallpaper Mode Tutorial Step 3"
          },
          {
            id: "1.5.4a",
            text: "1.5.4 Long press wallpaper plug-ins can be adjusted / can also be adjusted in the settings - desktop - wallpaper mode - plug-in settings",
            image: "/manual/lyno/1. Desktop Tutorial/1.5 Wallpaper Mode Tutorial/1.5.4a.png",
            alt: "Wallpaper Mode Tutorial Step 4a"
          },
          {
            id: "1.5.4b",
            text: "",
            image: "/manual/lyno/1. Desktop Tutorial/1.5 Wallpaper Mode Tutorial/1.5.4b.png",
            alt: "Wallpaper Mode Tutorial Step 4b"
          },
          {
            id: "1.5.4c",
            text: "",
            image: "/manual/lyno/1. Desktop Tutorial/1.5 Wallpaper Mode Tutorial/1.5.4c.png",
            alt: "Wallpaper Mode Tutorial Step 4c"
          },
          {
            id: "1.5.5a",
            text: "1.5.5 Basic Settings. You can adjust the transparency of widgets and plug-ins, as well as the automatic switching of wallpapers.",
            image: "/manual/lyno/1. Desktop Tutorial/1.5 Wallpaper Mode Tutorial/1.5.5a.png",
            alt: "Wallpaper Mode Tutorial Step 5a"
          },
          {
            id: "1.5.5b",
            text: "",
            image: "/manual/lyno/1. Desktop Tutorial/1.5 Wallpaper Mode Tutorial/1.5.5b.png",
            alt: "Wallpaper Mode Tutorial Step 5b"
          }
        ],
        afterText: ""
      },
      {
        id: "circadian-mode-settings",
        title: "1.6 Circadian Mode Settings",
        steps: [
          {
            id: "1.6.1",
            text: "1.6.1 Multiple switching modes to meet various needs",
            image: "/manual/lyno/1. Desktop Tutorial/1.6 Circadian Mode Settings/1.6.1.png",
            alt: "Circadian Mode Settings Step 1"
          },
          {
            id: "1.6.2",
            text: "1.6.2 Theme Centre. Setting the default (daytime) and nighttime themes",
            image: "/manual/lyno/1. Desktop Tutorial/1.6 Circadian Mode Settings/1.6.2.png",
            alt: "Circadian Mode Settings Step 2"
          },
          {
            id: "1.6.3",
            text: "1.6.3 Extreme Dark Mode: When turned on, the screen is less bright at night.",
            image: "/manual/lyno/1. Desktop Tutorial/1.6 Circadian Mode Settings/1.6.3.png",
            alt: "Circadian Mode Settings Step 3"
          }
        ],
        afterText: "System Brightness Settings. Adjust the screen brightness parameters and the backlight control method. Finish"
      },
      {
        id: "enhanced-navigation-bar",
        title: "1.7 Enhanced Navigation Bar",
        steps: [
          {
            id: "1.7.1a",
            text: "1.7.1 Navigation bar and status bar mode settings (top status bar, bottom navigation bar, both)",
            image: "/manual/lyno/1. Desktop Tutorial/1.7 Enhanced Navigation Bar/1.7.1a.png",
            alt: "Enhanced Navigation Bar Step 1a"
          },
          {
            id: "1.7.1b",
            text: "",
            image: "/manual/lyno/1. Desktop Tutorial/1.7 Enhanced Navigation Bar/1.7.1b.png",
            alt: "Enhanced Navigation Bar Step 1b"
          },
          {
            id: "1.7.2a",
            text: "1.7.2 Bottom navigation bar supports 4 styles",
            image: "/manual/lyno/1. Desktop Tutorial/1.7 Enhanced Navigation Bar/1.7.2a.png",
            alt: "Enhanced Navigation Bar Step 2a"
          },
          {
            id: "1.7.2b",
            text: "",
            image: "/manual/lyno/1. Desktop Tutorial/1.7 Enhanced Navigation Bar/1.7.2b.png",
            alt: "Enhanced Navigation Bar Step 2b"
          },
          {
            id: "1.7.3a",
            text: "1.7.3 Custom styles (adjustable to add configuration plugins as well as plugin customisation)",
            image: "/manual/lyno/1. Desktop Tutorial/1.7 Enhanced Navigation Bar/1.7.3a.png",
            alt: "Enhanced Navigation Bar Step 3a"
          },
          {
            id: "1.7.3b",
            text: "",
            image: "/manual/lyno/1. Desktop Tutorial/1.7 Enhanced Navigation Bar/1.7.3b.png",
            alt: "Enhanced Navigation Bar Step 3b"
          },
          {
            id: "1.7.3c",
            text: "",
            image: "/manual/lyno/1. Desktop Tutorial/1.7 Enhanced Navigation Bar/1.7.3c.png",
            alt: "Enhanced Navigation Bar Step 3c"
          },
          {
            id: "1.7.4",
            text: "1.7.4 Navigation bar style 1 (does not support plugin customization)",
            image: "/manual/lyno/1. Desktop Tutorial/1.7 Enhanced Navigation Bar/1.7.4.png",
            alt: "Enhanced Navigation Bar Step 4"
          },
          {
            id: "1.7.5a",
            text: "1.7.5 Navigation bar style 2 (only supports adjustment of air-conditioning plug-ins)",
            image: "/manual/lyno/1. Desktop Tutorial/1.7 Enhanced Navigation Bar/1.7.5a.png",
            alt: "Enhanced Navigation Bar Step 5a"
          },
          {
            id: "1.7.5b",
            text: "",
            image: "/manual/lyno/1. Desktop Tutorial/1.7 Enhanced Navigation Bar/1.7.5b.png",
            alt: "Enhanced Navigation Bar Step 5b"
          },
          {
            id: "1.7.6a",
            text: "1.7.6 Navigation bar style 3 (only supports adjustment of air-conditioning plug-ins)",
            image: "/manual/lyno/1. Desktop Tutorial/1.7 Enhanced Navigation Bar/1.7.6a.png",
            alt: "Enhanced Navigation Bar Step 6a"
          },
          {
            id: "1.7.6b",
            text: "",
            image: "/manual/lyno/1. Desktop Tutorial/1.7 Enhanced Navigation Bar/1.7.6b.png",
            alt: "Enhanced Navigation Bar Step 6b"
          },
          {
            id: "1.7.7",
            text: "1.7.7 Navigation bar display position switches to the left",
            image: "/manual/lyno/1. Desktop Tutorial/1.7 Enhanced Navigation Bar/1.7.7.png",
            alt: "Enhanced Navigation Bar Step 7"
          },
          {
            id: "1.7.8",
            text: "1.7.8 Left navigation bar supports 2 styles",
            image: "/manual/lyno/1. Desktop Tutorial/1.7 Enhanced Navigation Bar/1.7.8.png",
            alt: "Enhanced Navigation Bar Step 8"
          },
          {
            id: "1.7.9",
            text: "1.7.9 Customized style (adjustable DOCK bar)",
            image: "/manual/lyno/1. Desktop Tutorial/1.7 Enhanced Navigation Bar/1.7.9.png",
            alt: "Enhanced Navigation Bar Step 9"
          },
          {
            id: "1.7.10",
            text: "1.7.10 Layout 1 (non-adjustable, fixed number of dock columns)",
            image: "/manual/lyno/1. Desktop Tutorial/1.7 Enhanced Navigation Bar/1.7.10.png",
            alt: "Enhanced Navigation Bar Step 10"
          }
        ],
        afterText: ""
      },
      {
        id: "picture-in-picture",
        title: "1.8 Picture In Picture",
        steps: [
          {
            id: "1.8.1",
            text: "1.8.1 Setting up the Picture-in-Picture App",
            image: "/manual/lyno/1. Desktop Tutorial/1.8 Picture In Picture/1.8.1.png",
            alt: "Picture In Picture Step 1"
          },
          {
            id: "1.8.2",
            text: "1.8.2 Modify homepage plug-in, add APP panel",
            image: "/manual/lyno/1. Desktop Tutorial/1.8 Picture In Picture/1.8.2.png",
            alt: "Picture In Picture Step 2"
          },
          {
            id: "1.8.3a",
            text: "1.8.3 APP panel to add picture-in-picture 1/2/3 or other apps",
            image: "/manual/lyno/1. Desktop Tutorial/1.8 Picture In Picture/1.8.3a.png",
            alt: "Picture In Picture Step 3a"
          },
          {
            id: "1.8.3b",
            text: "",
            image: "/manual/lyno/1. Desktop Tutorial/1.8 Picture In Picture/1.8.3b.png",
            alt: "Picture In Picture Step 3b"
          },
          {
            id: "1.8.4a",
            text: "1.8.4 Partial application picture-in-picture demo",
            image: "/manual/lyno/1. Desktop Tutorial/1.8 Picture In Picture/1.8.4a.png",
            alt: "Picture In Picture Step 4a"
          },
          {
            id: "1.8.4b",
            text: "",
            image: "/manual/lyno/1. Desktop Tutorial/1.8 Picture In Picture/1.8.4b.png",
            alt: "Picture In Picture Step 4b"
          }
        ],
        afterText: ""
      },
      {
        id: "music-plugins",
        title: "1.9 Music Plugins",
        steps: [
          {
            id: "1.9.1",
            text: "1.9.1 Settings-Home-Widget-Music-Select APP CANBUS, support multiple music apps.",
            image: "/manual/lyno/1. Desktop Tutorial/1.9 Music Plug-ins/1.9.1.png",
            alt: "Music Plugins Step 1"
          },
          {
            id: "1.9.2",
            text: "1.9.2 For example, the plugin click action is set to switch the main plugin.",
            image: "/manual/lyno/1. Desktop Tutorial/1.9 Music Plug-ins/1.9.2.png",
            alt: "Music Plugins Step 2"
          },
          {
            id: "1.9.3",
            text: "1.9.3 Click Home Plugin",
            image: "/manual/lyno/1. Desktop Tutorial/1.9 Music Plug-ins/1.9.3.png",
            alt: "Music Plugins Step 3"
          },
          {
            id: "1.9.4a",
            text: "1.9.4 On the left side, you can quickly switch between local music, radio, Bluetooth music, and QQ music bound to the plug-in.",
            image: "/manual/lyno/1. Desktop Tutorial/1.9 Music Plug-ins/1.9.4a.png",
            alt: "Music Plugins Step 4a"
          },
          {
            id: "1.9.4b",
            text: "",
            image: "/manual/lyno/1. Desktop Tutorial/1.9 Music Plug-ins/1.9.4b.png",
            alt: "Music Plugins Step 4b"
          },
          {
            id: "1.9.4c",
            text: "",
            image: "/manual/lyno/1. Desktop Tutorial/1.9 Music Plug-ins/1.9.4c.png",
            alt: "Music Plugins Step 4c"
          }
        ]
      },
      {
        id: "fullscreen-gestures",
        title: "1.10 Full-screen Gestures",
        steps: [
          {
            id: "1.10.1",
            text: "1.10.1 Enabling Gesture Functions",
            image: "/manual/lyno/1. Desktop Tutorial/1.10 Full-screen Gestures/1.10.1.png",
            alt: "Full-screen Gestures Step 1"
          },
          {
            id: "1.10.2",
            text: "1.10.2 Operate as on the right side (release immediately after sliding)",
            image: "/manual/lyno/1. Desktop Tutorial/1.10 Full-screen Gestures/1.10.2.png",
            alt: "Full-screen Gestures Step 2"
          },
          {
            id: "1.10.3",
            text: "1.10.3 As in the right hover operation (swipe and hold for 1-2 seconds and then release)",
            image: "/manual/lyno/1. Desktop Tutorial/1.10 Full-screen Gestures/1.10.3.png",
            alt: "Full-screen Gestures Step 3"
          },
          {
            id: "1.10.4a",
            text: "1.10.4 Like the left-hand side, set it as an app shortcut hover window.",
            image: "/manual/lyno/1. Desktop Tutorial/1.10 Full-screen Gestures/1.10.4a.png",
            alt: "Full-screen Gestures Step 4a"
          },
          {
            id: "1.10.4b",
            text: "",
            image: "/manual/lyno/1. Desktop Tutorial/1.10 Full-screen Gestures/1.10.4b.png",
            alt: "Full-screen Gestures Step 4b"
          },
          {
            id: "1.10.5a",
            text: "1.10.5 When you set the APP shortcut hover window or open the APP application, you can adjust the association or modify the application within the shortcut menu.",
            image: "/manual/lyno/1. Desktop Tutorial/1.10 Full-screen Gestures/1.10.5a.png",
            alt: "Full-screen Gestures Step 5a"
          },
          {
            id: "1.10.5b",
            text: "",
            image: "/manual/lyno/1. Desktop Tutorial/1.10 Full-screen Gestures/1.10.5b.png",
            alt: "Full-screen Gestures Step 5b"
          },
          {
            id: "1.10.6",
            text: "1.10.6 Can adjust the gesture hot zone height and width",
            image: "/manual/lyno/1. Desktop Tutorial/1.10 Full-screen Gestures/1.10.6.png",
            alt: "Full-screen Gestures Step 6"
          }
        ]
      },
      {
        id: "app-management",
        title: "1.11 APP Management",
        steps: [
          {
            id: "1.11.1",
            text: "1.11.1 Long press on any application in the list to select sorting and display management",
            image: "/manual/lyno/1. Desktop Tutorial/1.11 APP Management/1.11.1.png",
            alt: "APP Management Step 1"
          },
          {
            id: "1.11.2",
            text: "1.11.2 In Settings, choose APP Management",
            image: "/manual/lyno/1. Desktop Tutorial/1.11 APP Management/1.11.2.png",
            alt: "APP Management Step 2"
          },
          {
            id: "1.11.3",
            text: "1.11.3 Drag the APP to adjust the sorting, tick to show the app in the list/uncheck to hide it",
            image: "/manual/lyno/1. Desktop Tutorial/1.11 APP Management/1.11.3.png",
            alt: "APP Management Step 3"
          },
          {
            id: "1.11.4",
            text: "1.11.4 Click save and Confirm after adjusting",
            image: "/manual/lyno/1. Desktop Tutorial/1.11 APP Management/1.11.4.png",
            alt: "APP Management Step 4"
          }
        ],
        afterText: ""
      },
      {
        id: "planned-tasks",
        title: "1.12 Planned Tasks",
        steps: [
          {
            id: "1.12.1a",
            text: "1.12.1 Add a task (it is recommended that multiple tasks be executed 2 seconds apart, otherwise they will not take effect)",
            image: "/manual/lyno/1. Desktop Tutorial/1.12 Planned Tasks/1.12.1a.png",
            alt: "Planned Tasks Step 1a"
          },
          {
            id: "1.12.1b",
            text: "",
            image: "/manual/lyno/1. Desktop Tutorial/1.12 Planned Tasks/1.12.1b.png",
            alt: "Planned Tasks Step 1b"
          },
          {
            id: "1.12.2",
            text: "1.12.2 Setting the trigger conditions and executing actions",
            image: "/manual/lyno/1. Desktop Tutorial/1.12 Planned Tasks/1.12.2.png",
            alt: "Planned Tasks Step 2"
          },
          {
            id: "1.12.3",
            text: "1.12.3 If the system starts - after 2 seconds - play music",
            image: "/manual/lyno/1. Desktop Tutorial/1.12 Planned Tasks/1.12.3.png",
            alt: "Planned Tasks Step 3"
          }
        ],
        afterText: "For reference only, if it can work or not, please check the description of trigger condition and action in detail"
      }
    ]
  },
  {
    id: "system-function",
    title: "Description of System Function",
    sections: [
      {
        id: "apple-connected",
        title: "2.1 Apple Connected",
        steps: [
          {
            id: "2.1.1a",
            text: "2.1.1 Connect your mobile phone to your car's Bluetooth and click on pairing.",
            image: "/manual/lyno/2. Description of System Function/2.1 Apple Connected/2.1.1a.png",
            alt: "Apple Connected Step 1a"
          },
          {
            id: "2.1.1b",
            text: "",
            image: "/manual/lyno/2. Description of System Function/2.1 Apple Connected/2.1.1b.png",
            alt: "Apple Connected Step 1b"
          },
          {
            id: "2.1.2a",
            text: "2.1.2 Open the car cartlink2.0, mobile phone click to confirm the use of carplay in-car",
            image: "/manual/lyno/2. Description of System Function/2.1 Apple Connected/2.1.2a.png",
            alt: "Apple Connected Step 2a"
          },
          {
            id: "2.1.2b",
            text: "",
            image: "/manual/lyno/2. Description of System Function/2.1 Apple Connected/2.1.2b.png",
            alt: "Apple Connected Step 2b"
          },
          {
            id: "2.1.3",
            text: "2.1.3 Connect successfully, enter carplay",
            image: "/manual/lyno/2. Description of System Function/2.1 Apple Connected/2.1.3.png",
            alt: "Apple Connected Step 3"
          },
          {
            id: "2.1.4",
            text: "2.1.4 If you can't connect, you can change the wifi system, if the carplay screen is not smooth, change the frame rate.",
            image: "/manual/lyno/2. Description of System Function/2.1 Apple Connected/2.1.4.png",
            alt: "Apple Connected Step 4"
          }
        ]
      },
      {
        id: "huawei-internet",
        title: "2.2 Huawei Internet",
        steps: [
          {
            id: "2.2.1a",
            text: "2.2.1 Connect the car to your mobile phone's Bluetooth and click on pairing",
            image: "/manual/lyno/2. Description of System Function/2.2 Huawei Internet/2.2.1a.png",
            alt: "Huawei Internet Step 1a"
          },
          {
            id: "2.2.1b",
            text: "",
            image: "/manual/lyno/2. Description of System Function/2.2 Huawei Internet/2.2.1b.png",
            alt: "Huawei Internet Step 1b"
          },
          {
            id: "2.2.2a",
            text: "2.2.2 Open HUAWEI HiCar, tap Connect on your phone and enter the connection code",
            image: "/manual/lyno/2. Description of System Function/2.2 Huawei Internet/2.2.2a.png",
            alt: "Huawei Internet Step 2a"
          },
          {
            id: "2.2.2b",
            text: "",
            image: "/manual/lyno/2. Description of System Function/2.2 Huawei Internet/2.2.2b.png",
            alt: "Huawei Internet Step 2b"
          },
          {
            id: "2.2.3",
            text: "2.2.3 Successful connection, enter Huawei hicar",
            image: "/manual/lyno/2. Description of System Function/2.2 Huawei Internet/2.2.3.png",
            alt: "Huawei Internet Step 3"
          }
        ]
      },
      {
        id: "local-music",
        title: "2.3 Local Music",
        steps: [
          {
            id: "2.3.1",
            text: "2.3.1 Accessing a USB stick or deleting and adding music requires a rescan.",
            image: "/manual/lyno/2. Description of System Function/2.3 Local Music/2.3.1.png",
            alt: "Local Music Step 1"
          },
          {
            id: "2.3.2",
            text: "2.3.2 Too many lyrics Support search to find",
            image: "/manual/lyno/2. Description of System Function/2.3 Local Music/2.3.2.png",
            alt: "Local Music Step 2"
          },
          {
            id: "2.3.3",
            text: "2.3.3 Album catalogue is automatically generated based on folders",
            image: "/manual/lyno/2. Description of System Function/2.3 Local Music/2.3.3.png",
            alt: "Local Music Step 3"
          },
          {
            id: "2.3.4",
            text: "2.3.4 Favourite songs Play in favourites list",
            image: "/manual/lyno/2. Description of System Function/2.3 Local Music/2.3.4.png",
            alt: "Local Music Step 4"
          },
          {
            id: "2.3.5",
            text: "2.3.5 Full screen display of songs",
            image: "/manual/lyno/2. Description of System Function/2.3 Local Music/2.3.5.png",
            alt: "Local Music Step 5"
          }
        ]
      },
      {
        id: "radio",
        title: "2.4 Radio",
        steps: [
          {
            id: "2.4.1",
            text: "2.4.1 In the Multimedia application, switch to the local radio",
            image: "/manual/lyno/2. Description of System Function/2.4 Radio/2.4.1.png",
            alt: "Radio Step 1"
          },
          {
            id: "2.4.2a",
            text: "2.4.2 Search for radio stations",
            image: "/manual/lyno/2. Description of System Function/2.4 Radio/2.4.2a.png",
            alt: "Radio Step 2a"
          },
          {
            id: "2.4.2b",
            text: "",
            image: "/manual/lyno/2. Description of System Function/2.4 Radio/2.4.2b.png",
            alt: "Radio Step 2b"
          },
          {
            id: "2.4.3",
            text: "2.4.3 Collection Radio",
            image: "/manual/lyno/2. Description of System Function/2.4 Radio/2.4.3.png",
            alt: "Radio Step 3"
          },
          {
            id: "2.4.4",
            text: "2.4.4 Change of radio station name",
            image: "/manual/lyno/2. Description of System Function/2.4 Radio/2.4.4.png",
            alt: "Radio Step 4"
          },
          {
            id: "2.4.5",
            text: "2.4.5 Switching on RDS wireless radio and setting up radio zones",
            image: "/manual/lyno/2. Description of System Function/2.4 Radio/2.4.5.png",
            alt: "Radio Step 5"
          },
          {
            id: "2.4.6",
            text: "2.4.6 Switch favourites list",
            image: "/manual/lyno/2. Description of System Function/2.4 Radio/2.4.6.png",
            alt: "Radio Step 6"
          },
          {
            id: "2.4.7",
            text: "2.4.7 Interface style switching",
            image: "/manual/lyno/2. Description of System Function/2.4 Radio/2.4.7.png",
            alt: "Radio Step 7"
          }
        ]
      },
      {
        id: "bluetooth-music",
        title: "2.5 Bluetooth Music",
        steps: [
          {
            id: "2.5.1",
            text: "2.5.1 Connecting your mobile phone's Bluetooth",
            image: "/manual/lyno/2. Description of System Function/2.5 Bluetooth Music/2.5.1.png",
            alt: "Bluetooth Music Step 1"
          },
          {
            id: "2.5.2",
            text: "2.5.2 Switch to Bluetooth music in the Multimedia application",
            image: "/manual/lyno/2. Description of System Function/2.5 Bluetooth Music/2.5.2.png",
            alt: "Bluetooth Music Step 2"
          },
          {
            id: "2.5.3",
            text: "2.5.3 Bluetooth music interface click to play (if there is no sound, the mobile phone to open the music player)",
            image: "/manual/lyno/2. Description of System Function/2.5 Bluetooth Music/2.5.3.png",
            alt: "Bluetooth Music Step 3"
          }
        ],
        afterText: ""
      },
      {
        id: "document-management",
        title: "2.6 Document Management",
        steps: [
          {
            id: "2.6.1",
            text: "2.6.1 U disk drive letter can be selected on the left side, you can quickly search for different types of files",
            image: "/manual/lyno/2. Description of System Function/2.6 Document Management/2.6.1.png",
            alt: "Document Management Step 1"
          },
          {
            id: "2.6.2",
            text: "2.6.2 Accurately locate files on disk",
            image: "/manual/lyno/2. Description of System Function/2.6 Document Management/2.6.2.png",
            alt: "Document Management Step 2"
          },
          {
            id: "2.6.3",
            text: "2.6.3 Long press on a file to edit it",
            image: "/manual/lyno/2. Description of System Function/2.6 Document Management/2.6.3.png",
            alt: "Document Management Step 3"
          },
          {
            id: "2.6.4",
            text: "2.6.4 File Sorting and Display Mode Settings",
            image: "/manual/lyno/2. Description of System Function/2.6 Document Management/2.6.4.png",
            alt: "Document Management Step 4"
          },
          {
            id: "2.6.5",
            text: "2.6.5 Switching display mode (full or half screen)",
            image: "/manual/lyno/2. Description of System Function/2.6 Document Management/2.6.5.png",
            alt: "Document Management Step 5"
          }
        ],
        afterText: ""
      },
      {
        id: "bluetooth-phone",
        title: "2.7 Bluetooth Phone",
        steps: [
          {
            id: "2.7.1",
            text: "2.7.1 Connecting cell phone Bluetooth",
            image: "/manual/lyno/2. Description of System Function/2.7 Bluetooth Phone/2.7.1.png",
            alt: "Bluetooth Phone Step 1"
          },
          {
            id: "2.7.2a",
            text: "2.7.2 Synchronization of cell phone contacts (Bluetooth setting of cell phone, synchronization of contacts needs to be turned on)",
            image: "/manual/lyno/2. Description of System Function/2.7 Bluetooth Phone/2.7.2a.png",
            alt: "Bluetooth Phone Step 2a"
          },
          {
            id: "2.7.2b",
            text: "",
            image: "/manual/lyno/2. Description of System Function/2.7 Bluetooth Phone/2.7.2b.png",
            alt: "Bluetooth Phone Step 2b"
          },
          {
            id: "2.7.3",
            text: "2.7.3 Keyboard left/right alignment",
            image: "/manual/lyno/2. Description of System Function/2.7 Bluetooth Phone/2.7.3.png",
            alt: "Bluetooth Phone Step 3"
          },
          {
            id: "2.7.4",
            text: "2.7.4 Personal Favorites, Contacts, Recent Contacts",
            image: "/manual/lyno/2. Description of System Function/2.7 Bluetooth Phone/2.7.4.png",
            alt: "Bluetooth Phone Step 4"
          },
          {
            id: "2.7.5a",
            text: "2.7.5 Dialing interface Full-screen, top bar, or hover icon display options",
            image: "/manual/lyno/2. Description of System Function/2.7 Bluetooth Phone/2.7.5a.png",
            alt: "Bluetooth Phone Step 5a"
          },
          {
            id: "2.7.5b",
            text: "",
            image: "/manual/lyno/2. Description of System Function/2.7 Bluetooth Phone/2.7.5b.png",
            alt: "Bluetooth Phone Step 5b"
          },
          {
            id: "2.7.5c",
            text: "",
            image: "/manual/lyno/2. Description of System Function/2.7 Bluetooth Phone/2.7.5c.png",
            alt: "Bluetooth Phone Step 5c"
          }
        ],
        afterText: ""
      },
      {
        id: "equalizer",
        title: "2.8 Equalizer",
        steps: [
          {
            id: "2.8.1",
            text: "2.8.1 Sound Adjustment",
            image: "/manual/lyno/2. Description of System Function/2.8 Equalizer/2.8.1.png",
            alt: "Equalizer Step 1"
          },
          {
            id: "2.8.2",
            text: "2.8.2 9 Styles",
            image: "/manual/lyno/2. Description of System Function/2.8 Equalizer/2.8.2.png",
            alt: "Equalizer Step 2"
          },
          {
            id: "2.8.3a",
            text: "2.8.3 36-band EQ adjustment",
            image: "/manual/lyno/2. Description of System Function/2.8 Equalizer/2.8.3a.png",
            alt: "Equalizer Step 3a"
          },
          {
            id: "2.8.3b",
            text: "",
            image: "/manual/lyno/2. Description of System Function/2.8 Equalizer/2.8.3b.png",
            alt: "Equalizer Step 3b"
          },
          {
            id: "2.8.4",
            text: "2.8.4 DTS4.1/5.1",
            image: "/manual/lyno/2. Description of System Function/2.8 Equalizer/2.8.4.png",
            alt: "Equalizer Step 4"
          },
          {
            id: "2.8.5",
            text: "2.8.5 Sound Field Adjustment",
            image: "/manual/lyno/2. Description of System Function/2.8 Equalizer/2.8.5.png",
            alt: "Equalizer Step 5"
          },
          {
            id: "2.8.6",
            text: "2.8.6 Bass High/Low filter Gain Reverb Adjustment",
            image: "/manual/lyno/2. Description of System Function/2.8 Equalizer/2.8.6.png",
            alt: "Equalizer Step 6"
          },
          {
            id: "2.8.7",
            text: "2.8.7 Amplifier Switch Power Adjustment",
            image: "/manual/lyno/2. Description of System Function/2.8 Equalizer/2.8.7.png",
            alt: "Equalizer Step 7"
          }
        ],
        afterText: ""
      },
      {
        id: "sound-master",
        title: "2.9 Sound Master",
        steps: [
          {
            id: "2.9.1",
            text: "2.9.1 Access to Sound Master (Need to connect the internet and login the account)",
            image: "/manual/lyno/2. Description of System Function/2.9 Sound Master/2.9.1.png",
            alt: "Sound Master Step 1"
          },
          {
            id: "2.9.2",
            text: "2.9.2 You can select the sound effects according to your own preferences to match your musical style.",
            image: "/manual/lyno/2. Description of System Function/2.9 Sound Master/2.9.2.png",
            alt: "Sound Master Step 2"
          },
          {
            id: "2.9.3",
            text: "2.9.3 If you like a sound you can use it or bookmark it to your list.",
            image: "/manual/lyno/2. Description of System Function/2.9 Sound Master/2.9.3.png",
            alt: "Sound Master Step 3"
          },
          {
            id: "2.9.4",
            text: "2.9.4 Favourites List",
            image: "/manual/lyno/2. Description of System Function/2.9 Sound Master/2.9.4.png",
            alt: "Sound Master Step 4"
          },
          {
            id: "2.9.5a",
            text: "2.9.5 You can save multiple EQ programmes of your own setting.",
            image: "/manual/lyno/2. Description of System Function/2.9 Sound Master/2.9.5a.png",
            alt: "Sound Master Step 5a"
          },
          {
            id: "2.9.5b",
            text: "",
            image: "/manual/lyno/2. Description of System Function/2.9 Sound Master/2.9.5b.png",
            alt: "Sound Master Step 5b"
          },
          {
            id: "2.9.6",
            text: "2.9.6 Sharing EQ programme",
            image: "/manual/lyno/2. Description of System Function/2.9 Sound Master/2.9.6.png",
            alt: "Sound Master Step 6"
          },
          {
            id: "2.9.7",
            text: "2.9.7 Equaliser",
            image: "/manual/lyno/2. Description of System Function/2.9 Sound Master/2.9.7.png",
            alt: "Sound Master Step 7"
          }
        ]
      }
    ]
  },
  {
    id: "others",
    title: "Others",
    sections: [
      {
        id: "accessories",
        title: "3.1 Accessories",
        isAccessories: true,
        accessories: [
          {
            id: "sony-camera",
            name: "SONY 307 camera",
            image: "/manual/lyno/3. Others/3.1 Accessories/3.1.1 SONY 307 camera.png"
          },
          {
            id: "adas-dvr",
            name: "ADAS DVR",
            image: "/manual/lyno/3. Others/3.1 Accessories/3.1.2 ADAS DVR.png"
          },
          {
            id: "usb-tpms",
            name: "USB TPMS",
            image: "/manual/lyno/3. Others/3.1 Accessories/3.1.3 USB TPMS.png"
          }
        ]
      }
    ]
  }
];

// 渲染单个步骤的组件
const StepItem = ({ step }) => {
  // 处理单图片步骤
  if (step.image) {
    return (
      <div className="flex flex-col items-start space-y-3">
        <p className="text-sm font-semibold text-gray-800 dark:text-gray-200 leading-relaxed text-start max-w-4xl">
          {step.text}
        </p>
              <div className="relative w-full max-w-4xl aspect-[4/3] rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow">
                <Image
            src={step.image}
            alt={step.alt}
                  fill
                  className="object-contain"
                  sizes="(max-width: 768px) 95vw, 896px"
                />
              </div>
            </div>
    );
  }
  
  // 处理多图片步骤（临时兼容，应该转换为单图片）
  if (step.images && step.images.length > 0) {
    return (
      <div className="space-y-2">
        <p className="text-sm font-semibold text-gray-800 dark:text-gray-200 leading-relaxed mb-1">
          {step.text}
        </p>
        {step.images.map((image, index) => (
          <div key={index} className="space-y-1">
              <div className="relative aspect-[4/3] rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow">
                <Image
                src={image}
                alt={step.alts ? step.alts[index] : `${step.alt || 'Image'} ${index + 1}`}
                  fill
                  className="object-contain"
                  sizes="100vw"
                />
              </div>
            </div>
        ))}
              </div>
    );
  }
  
  // 如果没有图片，返回null
  return null;
};

// 渲染章节的组件
const SectionComponent = ({ section }) => {
  if (section.isAccessories) {
    // 配件章节特殊处理
    return (
      <section id={section.id} className="space-y-8">
        <div className="my-12">
          <h2 className="text-3xl font-bold">{section.title}</h2>
              </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-12">
          {section.accessories.map((accessory) => (
            <div key={accessory.id} className="flex flex-col items-center space-y-3">
              <div className="relative w-full aspect-[4/3] rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow">
                <Image
                  src={accessory.image}
                  alt={accessory.name}
                  fill
                  className="object-contain"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed text-center">
                {accessory.name}
              </p>
            </div>
          ))}
          </div>
        </section>
    );
  }

  // 普通章节
  return (
    <section id={section.id} className="space-y-8">
      <div className="my-12">
        <h2 className="text-3xl font-bold">{section.title}</h2>
          </div>
          
          <div className="max-w-4xl mx-auto space-y-8 md:space-y-16">
        {section.steps && section.steps.map((step, index) => (
          <div key={step.id}>
            <StepItem step={step} />
            {/* 如果这是最后一个步骤且有afterText，显示在这个步骤下面 */}
            {index === section.steps.length - 1 && section.afterText && (
              <div className="mt-4 text-center">
                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed font-medium">
                  {section.afterText}
                </p>
              </div>
            )}
            </div>
        ))}
          </div>
        </section>
  );
};

export default function LynoManual() {
  return (
    <div className="w-full">
      <div className="space-y-16">
        {manualData.map((chapter) => (
          <div key={chapter.id}>
            {/* 章节标题 */}
        <section className="space-y-8">
              <div className="text-center py-16 my-16 border-t border-b border-border">
                <h1 className="text-4xl font-bold text-foreground">{chapter.title}</h1>
          </div>
        </section>

            {/* 章节内容 */}
            {chapter.sections.map((section) => (
              <SectionComponent key={section.id} section={section} />
            ))}
          </div>
        ))}

        {/* Manual Complete */}
        <section className="space-y-8">
          <div className="text-center py-12 border-t border-border">
            <h2 className="text-2xl font-bold text-foreground mb-4">Manual Complete</h2>
            <p className="text-lg text-muted-foreground mb-6">
              Thank you for using the Lyno Android Player User Manual!
            </p>
            <div className="max-w-4xl mx-auto text-sm text-muted-foreground space-y-2">
              <p>This comprehensive guide covers all features and functions of your Lyno Android Player.</p>
              <p>For additional support, please contact our customer service team.</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}