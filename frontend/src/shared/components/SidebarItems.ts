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
  { label: "Dashboard", href: "/", icon: Dashboard },
  { label: "Decks", href: "/decks", icon: Layers },
  { label: "Klassen", href: "/klassen", icon: Users },
  { label: "Geschiedenis", href: "/geschiedenis", icon: History },
];

export const bottomItems = [
    // TODO: logic for notifications in badge count
  { label: "Meldingen", href: "/meldingen", icon: Bell, badge: "2" },
  { label: "Settings", href: "/settings", icon: Settings },
  { label: "Logout", href: "/logout", icon: LogOut },
];