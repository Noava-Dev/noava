import {
  Avatar,
  Sidebar,
  SidebarItem,
  SidebarItemGroup,
  SidebarItems,
  SidebarLogo,
} from 'flowbite-react';
import {
  LuBell,
  LuCircleHelp,
  LuLayers,
  LuLayoutDashboard,
  LuLogOut,
  LuSettings,
  LuUsers,
} from 'react-icons/lu';
import { RiShieldUserLine } from 'react-icons/ri';
import { useUserRole } from '../../../hooks/useUserRole';
import { SignOutButton, useClerk, useUser } from '@clerk/clerk-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { notificationService } from '../../../services/NotificationService';

function NoavaSidebar() {
  const { userRole } = useUserRole();
  const { user } = useUser();
  const { openUserProfile } = useClerk();
  const navigate = useNavigate();
  const location = useLocation();
  const { getCount } = notificationService();

  const [notificationCount, setNotificationCount] = useState<number>(0);

  useEffect(() => {
    async function fetchNotificationCount() {
      try {
        const data = await getCount();
        if (data && typeof data.count === 'number') {
          setNotificationCount(data.count);
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
    <Sidebar
      aria-label="Noava Sidebar"
      className="h-full border-r dark:border-border-dark border-border">
      {/* Logo */}
      <SidebarItemGroup className="mb-14">
        <SidebarLogo
          href="#"
          img="/src/assets/noava-logo-blue-nobg.png"
          onClick={() => navigate('/')}
          imgAlt="Noava Logo">
          <h3 className="text-2xl">Noava</h3>
        </SidebarLogo>
      </SidebarItemGroup>

      <SidebarItems>
        {/* Main Navigation */}
        <SidebarItemGroup>
          <SidebarItem
            icon={LuLayoutDashboard}
            active={location.pathname === '/dashboard'}
            onClick={() => navigate('/dashboard')}
            className="font-semibold cursor-pointer">
            Dashboard
          </SidebarItem>

          <SidebarItem
            icon={LuLayers}
            active={location.pathname === '/decks'}
            onClick={() => navigate('/decks')}
            className="font-semibold cursor-pointer">
            Decks
          </SidebarItem>

          <SidebarItem
            icon={LuUsers}
            active={location.pathname === '/classrooms'}
            onClick={() => navigate('/classrooms')}
            className="font-semibold cursor-pointer">
            Classrooms
          </SidebarItem>

          <SidebarItem
            icon={LuCircleHelp}
            active={location.pathname === '/faq'}
            onClick={() => navigate('/faq')}
            className="font-semibold cursor-pointer">
            FAQ
          </SidebarItem>
        </SidebarItemGroup>

        {/* Bottom Navigation */}
        <SidebarItemGroup>
          <SidebarItem
            icon={LuBell}
            label={notificationCount.toString()}
            labelColor="blue"
            active={location.pathname === '/notifications'}
            onClick={() => navigate('/notifications')}
            className="font-semibold cursor-pointer">
            Notifications
          </SidebarItem>

          <SidebarItem
            icon={LuSettings}
            active={location.pathname === '/settings'}
            onClick={() => navigate('/settings')}
            className="font-semibold cursor-pointer">
            Settings
          </SidebarItem>

          {userRole === 'ADMIN' ? (
            <SidebarItem
              icon={RiShieldUserLine}
              active={location.pathname.startsWith('/admin')}
              onClick={() => navigate('/admin/dashboard')}
              className="font-semibold cursor-pointer">
              Admin
            </SidebarItem>
          ) : null}

          <SignOutButton>
            <SidebarItem
              icon={LuLogOut}
              className="font-semibold cursor-pointer">
              Sign out
            </SidebarItem>
          </SignOutButton>
        </SidebarItemGroup>

        {/* User Info */}
        <SidebarItemGroup>
          <div className="flex items-center gap-3">
            <button
              onClick={() => openUserProfile()}
              className="flex items-center gap-3 pl-0 text-left border-none active:outline-none">
              <Avatar
                img={user?.imageUrl}
                className="shrink-0"
                size="md"
                rounded>
                <div className="space-y-1 font-medium text-text-body-light dark:text-text-body-dark">
                  <div className="truncate">{user?.username}</div>
                  <div className="max-w-[22ch] text-sm text-gray-500 truncate dark:text-gray-400">
                    {user?.primaryEmailAddress?.emailAddress}
                  </div>
                </div>
              </Avatar>
            </button>
          </div>
        </SidebarItemGroup>
      </SidebarItems>
    </Sidebar>
  );
}

export default NoavaSidebar;
