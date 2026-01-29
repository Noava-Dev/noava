import { mainItems, bottomItems } from '../components/SidebarItems';
import { notificationService } from '../../services/NotificationService';
import { useState, useEffect, useRef } from 'react';
import {
  Sidebar,
  SidebarItem,
  SidebarItemGroup,
  SidebarItems,
  SidebarLogo,
} from 'flowbite-react';
import {
  LuChevronsLeft as Left,
  LuChevronsRight as Right,
  LuLogOut as LogOut,
} from 'react-icons/lu';
import { useLocation, useNavigate } from 'react-router-dom';
import type { CustomFlowbiteTheme } from 'flowbite-react/types';
import { useUser, SignOutButton, UserButton } from '@clerk/clerk-react';

const sidebarTheme: CustomFlowbiteTheme['sidebar'] = {
  root: {
    base: 'h-screen border-r transition-all duration-250',
    collapsed: {
      on: 'w-20',
      off: 'w-64',
    },

    inner: 'h-screen flex flex-col bg-background-surface-light rounded-none',
  },
  logo: {
    base: 'py-6 text-xl font-bold',
  },
  item: {
    base: 'flex items-center gap-3 px-3 py-2.5 text-sm font-medium dark:hover:text-white',
    active: 'text-sidebar-active shadow-sm',
    icon: {
      // muted-foreground is a css variable thing. the docs are:
      //https://ui.shadcn.com/docs/theming
      // I have tried at least 20 different combinations of tailwind.config.js colors but nothing has given me the same
      //dynamic color changing as the css variable does. So for now i will leave it as it is because i'm going to lose my mind.
      //also this css variable helps with giving the svg icons the correct color when hovering in light mode.

      base: 'size-5 text-muted-foreground',
      active: 'text-sidebar-active ',
    },
  },
};

export function SidebarNav() {
  const [collapsed, setCollapsed] = useState(false);
  const [notificationCount, setNotificationCount] = useState<number>(0);
  const { getCount } = notificationService();
  const location = useLocation();
  const navigate = useNavigate();
  const sidebarRef = useRef<HTMLDivElement>(null);
  const { user } = useUser();
  // CLERK: when using clerk const isLoaded, isSignedIn should be added on the line above
  // this is because if the clerk isn't loaded yet you can add the following function:
  // if(!isLoaded) return null;

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target as Node)
      ) {
        setCollapsed(true);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    async function fetchNotificationCount() {
      try {
        const data = await getCount();
        if (data && typeof data.count === 'number') {
          setNotificationCount(data.count);
          console.log('Notification count:', data.count);
        } else {
          setNotificationCount(0);
        }
      } catch {
        setNotificationCount(0);
      }
    }
    fetchNotificationCount();
  }, []);

  return (
    <div
      ref={sidebarRef}
      className="fixed top-0 left-0 z-40 h-screen border-r border-border-dark">
      <Sidebar
        theme={sidebarTheme}
        collapsed={collapsed}
        className="rounded-none"
        aria-label="Main sidebar">
        <SidebarLogo
          href="/"
          img="\src\assets\noava-logo-blue-nobg.png"
          className="flex items-center gap-2">
          {!collapsed ? 'Noava' : 'N'}
        </SidebarLogo>

        <SidebarItems className="flex flex-col justify-between flex-1">
          <SidebarItemGroup>
            {mainItems.map((item) => (
              <SidebarItem
                key={item.label}
                href={item.href}
                icon={item.icon}
                active={location.pathname == item.href}>
                {item.label}
              </SidebarItem>
            ))}
          </SidebarItemGroup>

          <div>
            <SidebarItemGroup>
              {bottomItems.map((item) => (
                <SidebarItem
                  key={item.label}
                  icon={item.icon}
                  active={location.pathname == item.href}
                  onClick={() => navigate(item.href)}
                  className="hover:cursor-pointer">
                  {/* TODO: the badge is hardcoded in sidebarItems but should be dynamically fetched */}
                  <span className="flex items-center justify-between w-full">
                    {item.label}
                    {item.label === 'Meldingen' &&
                      notificationCount > 0 &&
                      !collapsed && (
                        <span className="flex items-center justify-center text-xs text-red-800 bg-red-200 rounded-full size-5">
                          {notificationCount}
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
                <div className="flex items-center gap-3 px-3 py-2 rounded-lg">
                  {/* CLERK: should technically work but right now as there is no logged in user
                     i can't test this functionality properly */}
                  <UserButton
                    appearance={{
                      elements: {
                        avatarBox: 'h-9 w-9',
                      },
                    }}
                  />

                  {!collapsed && (
                    <div className="">
                      <p className="text-sm font-medium text-text-body-light dark:text-text-body-dark">
                        {user?.username || 'User'}
                      </p>

                      <p className="text-xs text-text-muted-light dark:text-text-muted-dark">
                        {user?.primaryEmailAddress?.emailAddress ||
                          'user@noava.test'}
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
        className="absolute flex items-center justify-center rounded-full -right-3 top-1/2 size-6 hover:bg-sidebar-accent dark:bg-slate-500 text-text-title-dark bg-primary-400"
        aria-label="Toggle sidebar">
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
