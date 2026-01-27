import { 
  LuLayoutDashboard as Dashboard, 
  LuLayers as Layers, 
  LuUsers as Users, 
  LuBell as Bell, 
  LuSettings as Settings,
  LuCircleHelp as FAQ 
} from "react-icons/lu";
// renaming imports for clarity

// top items in the sidebar
// TODO: make sure labels can be translated
export const mainItems = [
  { label: "Dashboard", href: "/home", icon: Dashboard },
  { label: "Decks", href: "/decks", icon: Layers },
  { label: "Klassen", href: "/classrooms", icon: Users },
  { label: "FAQ", href: "/faq", icon: FAQ },
];

export const bottomItems = [
  { label: "Meldingen", href: "/notifications", icon: Bell },
  { label: "Settings", href: "/settings", icon: Settings },
];