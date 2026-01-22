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
import { useUser, SignOutButton, UserButton } from "@clerk/clerk-react";

const sidebarTheme: CustomFlowbiteTheme["sidebar"] = {
  root: {
    base: "h-screen border transition-all duration-250",
    collapsed: {
      on: "w-20",
      off: "w-64",
    },

    inner: "h-screen flex flex-col bg-background-surface-light",
  },
  logo: {
    base: "py-6 text-xl font-bold",
  },
  item: {
    base: "flex items-center gap-3 px-3 py-2.5 text-sm font-medium transition-colors",
    active: "bg-background text-sidebar-active shadow-sm",
    icon: {
      // muted-foreground is a flowbite semantic color that i'm trying to use because it
      // adapts AUTOMATICALLY in dark mode
      base: "size-5 text-text-muted-foreground transition colors",
      active: "text-sidebar-active ",
    },
  },
};

export function SidebarNav() {
  const [collapsed, setCollapsed] = useState(true);
  const location = useLocation();
  const sidebarRef = useRef<HTMLDivElement>(null);
  const { user } = useUser();
  // CLERK: when using clerk const isLoaded, isSignedIn should be added on the line above
  // this is because if the clerk isn't loaded yet you can add the following function:
  // if(!isLoaded) return null;

  useEffect(() => {
    setCollapsed(true);
  }, [location.pathname]);

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
    <div ref={sidebarRef} className="fixed left-0 top-0 z-40 h-screen">
      <Sidebar
        theme={sidebarTheme}
        collapsed={collapsed}
        aria-label="Main sidebar"
      >
        <SidebarLogo
          href="/"
          img="\src\assets\noava-logo-blue-nobg.png"
          className="flex items-center gap-2"
        >
          {!collapsed ? "Noava" : "N"}
        </SidebarLogo>

        <SidebarItems className="flex flex-col flex-1 justify-between">
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
            <SidebarItemGroup>
              {bottomItems.map((item) => (
                <SidebarItem
                  key={item.label}
                  href={item.href}
                  icon={item.icon}
                  active={location.pathname == item.href}
                >
                  {/* TODO: the badge is hardcoded in sidebarItems but should be dynamically fetched */}
                  <span className="flex items-center justify-between w-full">
                    {item.label}
                    {item.badge && !collapsed && (
                      <span className="flex items-center justify-center rounded-full size-5 text-xs text-red-800 bg-red-200">
                        {item.badge}
                      </span>
                    )}
                  </span>
                </SidebarItem>
              ))}

              {/* CLERK: wrapped the logout button in Clerk's SignOutButton component 
              should handle the logic automatically via clerk. The redirectUrl also redirects
               the user to the root after logging out*/}
              <SignOutButton redirectUrl="/">
                <span className="w-full">
                  <SidebarItem icon={LogOut}>Logout</SidebarItem>
                </span>
              </SignOutButton>
            </SidebarItemGroup>
            <SidebarItemGroup>
              <div>
                <div className="flex items-center gap-3 rounded-lg px-3 py-2">
                  {/* CLERK: should technically work but right now as there is no logged user
                     i can't test this functionality properly */}
                  <UserButton
                    appearance={{
                      elements: {
                        avatarBox: "h-9 w-9",
                      },
                    }}
                  />

                  {!collapsed && (
                    <div className="">
                      <p className="text-sm font-medium text-text-body-light">
                        {user?.username || "User"}
                      </p>

                      {/* will have to replace text-text-muted-light with text-text-muted-foreground see line 36-37 */}
                      <p className="text-xs text-text-muted-light">
                        {user?.primaryEmailAddress?.emailAddress ||
                          "user@noava.test"}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </SidebarItemGroup>
          </div>
        </SidebarItems>
      </Sidebar>

      {/* collapse button */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="
        absolute 
        -right-3 top-1/2 
        flex size-6 items-center justify-center
        rounded-full
        hover:bg-sidebar-accent"
        aria-label="Toggle sidebar"
      >
        {collapsed ? (
          <div><Right className="size-4" /></div>
        ) : (
          <div><Left className="size-4" /></div>
        )}
      </button>
    </div>
  );
}
