import { mainItems, bottomItems} from "../components/SidebarItems";
import { useState } from "react";
import {
  Sidebar,
  SidebarItem,
  SidebarItemGroup,
  SidebarItems,
  SidebarLogo,
} from "flowbite-react";
import { LuChevronsLeft, LuChevronsRight } from "react-icons/lu";
import { useLocation } from "react-router-dom";


// styling but this should be moved to a central file later on
import type { CustomFlowbiteTheme } from "flowbite-react/types";

// TODO: add the correct colors to match the rest of the project
// current custom theme but can be expanded later or moved to a central file
const sidebarTheme: CustomFlowbiteTheme["sidebar"] = {
  root: {
    base: "h-screen border-r border-sidebar-border bg-sidebar-bg transition-all duration-300",
    collapsed: {
      on: "w-20",
      off: "w-64",
    },
    inner: "h-full flex flex-col bg-sidebar-bg overflow-hidden",
  },
  logo: {
    base: "px-5 py-6 text-xl font-bold text-sidebar-foreground",
  },
  item: {
    base:
      "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
    active:
      "bg-background text-sidebar-active shadow-sm",
    icon: {
      base: "size-5 text-muted-foreground",
      active: "text-sidebar-active",
    },
  },
};


export function SidebarNav() {
  const [collapsed, setCollapsed] = useState(false);


  return (
    <Sidebar
      theme={sidebarTheme}
      collapsed={collapsed}
      aria-label="Main sidebar"
      className = "sticky top-0 h-screen flex-none"
    >
      <SidebarLogo href="/" img="/icon.svg">
        {!collapsed ? "Noava" : "N"}
      </SidebarLogo>

      <SidebarItems className="flex flex-col flex-1 justify-between">
        {/* Main navigation */}
        <SidebarItemGroup>
          {mainItems.map((item) => (
            <SidebarItem
              key={item.label}
              href={item.href}
              icon={item.icon}
              active={location.pathname == item.href}
            >
              {item.label}
            </SidebarItem>
          ))}
        </SidebarItemGroup>

        {/* Navigation on the bottom of the bar */}
        <SidebarItemGroup>
          {bottomItems.map((item) => (
            <SidebarItem
              key={item.label}
              href={item.href}
              icon={item.icon}
              active={location.pathname == item.href}
            >
              <span className="flex items-center justify-between w-full">
                {item.label}
                {item.badge && !collapsed && (
                  <span className="ml-2 rounded-full bg-destructive px-2 text-xs text-background">
                    {item.badge}
                  </span>
                )}
              </span>
            </SidebarItem>
          ))}
        </SidebarItemGroup>
      </SidebarItems>

      {/* Collapse button */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-1/2 flex size-6 -translate-y-1/2 items-center justify-center rounded-full border border-sidebar-border bg-background text-muted-foreground shadow-sm hover:bg-sidebar-accent"
        aria-label="Toggle sidebar"
      >
        {collapsed ? (
          <LuChevronsRight className="text-lg" />
        ) : (
          <LuChevronsLeft className="text-lg" />
        )}
      </button>

      {/* TODO: add logic so that the sidebar collapses when moving to a different page*/}
      {/* TODO: add logic so that the sidebar collapses when clicking outside the sidebar*/}
    </Sidebar>
  );
}
