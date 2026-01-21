import { mainItems, bottomItems } from "../components/SidebarItems";
import { useState, useEffect, useRef } from "react";
import {
  Sidebar,
  SidebarItem,
  SidebarItemGroup,
  SidebarItems,
  SidebarLogo,
} from "flowbite-react";
import {
  LuChevronsLeft as Left,
  LuChevronsRight as Right,
  LuLogOut as LogOut,
} from "react-icons/lu";
import { useLocation } from "react-router-dom";
import type { CustomFlowbiteTheme } from "flowbite-react/types";
import { useUser, SignOutButton } from "@clerk/clerk-react";

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
    base: "py-6 text-xl font-bold text-sidebar-foreground",
  },
  item: {
    base: "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
    active: "bg-background text-sidebar-active shadow-sm",
    icon: {
      base: "size-5 text-muted-foreground",
      active: "text-sidebar-active",
    },
  },
};

export function SidebarNav() {
  const [collapsed, setCollapsed] = useState(true);
  const location = useLocation();
  const sidebarRef = useRef<HTMLDivElement>(null);
  const { user, isLoaded } = useUser();
  const initials =
    isLoaded && user?.firstName && user?.lastName
      ? `${user.firstName[0]}${
          user.lastName ? user.lastName[0] : ""
        }`.toUpperCase()
      : "N";

  useEffect(() => {
    setCollapsed(true);
  }, [location.pathname]);

  // logic to collapse sidebar when clicking outside of it.
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target as Node)
      ) {
        setCollapsed(true);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div
      ref={sidebarRef}
      className="relative h-screen flex-none sticky top-0 z-40"
    >
      <Sidebar
        theme={sidebarTheme}
        collapsed={collapsed}
        aria-label="Main sidebar"
        className="sticky top-0 h-screen flex-none"
      >
        <SidebarLogo
          href="/"
          img="\src\assets\noava-logo-blue-nobg.png"
          className="flex items-center gap-2"
        >
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

          <div>
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

              {/* wrapped the logout button in Clerk's SignOutButton component 
              should handle the logic automatically via clerk. The redirectUrl also redirects
               the user to the root after logging out*/}
              <SignOutButton redirectUrl="">
                <span className= "w-full">
                  <SidebarItem icon={LogOut}>Logout</SidebarItem>
                </span>
              </SignOutButton>

            </SidebarItemGroup>
              <SidebarItemGroup>
                <div>
                  <div
                    className={`flex items-center gap-3 rounded-lg px-3 py-2 ${
                      collapsed ? "justify-center" : ""
                    } hover:bg-sidebar-accent transition-colors`}
                  >
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-sidebar-active text-sm font-semibold text-background">
                      {initials}
                    </div>
                    {!collapsed && (
                      <div className="">
                        <p className="truncate text-sm font-medium text-sidebar-foreground">
                          {user?.fullName || "User"}
                        </p>
                        <p className="truncate text-xs text-muted-foreground">
                          {user?.primaryEmailAddress?.emailAddress || ""}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </SidebarItemGroup>
          </div>
        </SidebarItems>
      </Sidebar>

      {/* Collapse button  */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-1/2 flex size-6 -translate-y-1/2 items-center justify-center rounded-full border border-sidebar-border bg-background text-muted-foreground shadow-sm hover:bg-sidebar-accent z-50"
        aria-label="Toggle sidebar"
      >
        {collapsed ? (
          <div>
            <Right className="size-4" />
          </div>
        ) : (
          <div>
            <Left className="size-4" />
          </div>
        )}
      </button>
    </div>
  );
}
