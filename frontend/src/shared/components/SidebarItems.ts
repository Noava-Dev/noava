import { 
  LuLayoutDashboard as Dashboard, 
  LuLayers as Layers, 
  LuUsers as Users, 
  LuHistory as History, 
  LuBell as Bell, 
  LuSettings as Settings, 
  LuLogOut as LogOut
} from "react-icons/lu";
// renaming imports for clarity

// top items in the sidebar
export const mainItems = [
  { label: "Dashboard", href: "/", icon: Dashboard, active: true },
  { label: "Decks", href: "/", icon: Layers },
  { label: "Klassen", href: "/", icon: Users },
  { label: "Geschiedenis", href: "/", icon: History },
];

export const bottomItems = [
    // TODO: logic for notifications in badge count
  { label: "Meldingen", href: "/", icon: Bell, badge: "2" },
  { label: "Settings", href: "/", icon: Settings },
  { label: "Logout", href: "/", icon: LogOut },
];