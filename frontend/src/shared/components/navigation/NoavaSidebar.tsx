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
  LuSchool,
} from 'react-icons/lu';
import { RiShieldUserLine } from 'react-icons/ri';
import { useUserRole } from '../../../hooks/useUserRole';
import { SignOutButton, useClerk, useUser } from '@clerk/clerk-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { notificationService } from '../../../services/NotificationService';
import { useSchoolService } from '../../../services/SchoolService';
import type { SchoolDto } from '../../../models/School';
import { useTranslation } from 'react-i18next';

type NoavaSidebarProps = {
  onNavigate?: () => void;
  className?: string;
};

function NoavaSidebar({ className, onNavigate }: NoavaSidebarProps) {
  const { t } = useTranslation('sidebar');

  const { userRole } = useUserRole();
  const { user } = useUser();
  const { openUserProfile } = useClerk();
  const navigate = useNavigate();
  const location = useLocation();
  const { getCount } = notificationService();
  const [schools, setSchools] = useState<SchoolDto[]>([]);
  const [isSchoolAdmin, setIsSchoolAdmin] = useState(false);
  const schoolService = useSchoolService();

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

  useEffect(() => {
    console.log('userRole:', userRole);
    console.log('user?.id:', user?.id);
    console.log('schools:', schools);
    async function fetchSchools() {
      if (!user) return;
      try {
        const data = await schoolService.getAll();
        setSchools(data);

        if (user && userRole !== 'ADMIN') {
          const adminSchools = data.filter((s) =>
            s.admins?.some((a) => a.clerkId === user.id)
          );
          setIsSchoolAdmin(adminSchools.length > 0);
        }
      } catch (error) {
        console.error('Failed to fetch schools for sidebar', error);
        setIsSchoolAdmin(false);
      }
    }

    fetchSchools();
  }, [user, userRole]);

  return (
    <Sidebar
      aria-label="Noava Sidebar"
      className={`h-full border-r dark:border-border-dark border-border ${className ?? ''}`}>
      {/* Logo */}
      <SidebarItemGroup className="mb-14 w-fit">
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
            onClick={() => {
              navigate('/dashboard');
              onNavigate?.();
            }}
            className="font-semibold cursor-pointer">
            Dashboard
          </SidebarItem>

          <SidebarItem
            icon={LuLayers}
            active={location.pathname === '/decks'}
            onClick={() => {
              navigate('/decks');
              onNavigate?.();
            }}
            className="font-semibold cursor-pointer">
            Decks
          </SidebarItem>

          <SidebarItem
            icon={LuUsers}
            active={location.pathname === '/classrooms'}
            onClick={() => {
              navigate('/classrooms');
              onNavigate?.();
            }}
            className="font-semibold cursor-pointer">
            {t('classrooms')}
          </SidebarItem>

          {(userRole === 'ADMIN' || isSchoolAdmin) && (
            <SidebarItem
              icon={LuSchool}
              active={location.pathname === '/schools'}
              onClick={() => {
                navigate('/schools');
                onNavigate?.();
              }}
              className="font-semibold cursor-pointer">
              {t('schools')}
            </SidebarItem>
          )}

          <SidebarItem
            icon={LuCircleHelp}
            active={location.pathname === '/faq'}
            onClick={() => {
              navigate('/faq');
              onNavigate?.();
            }}
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
            onClick={() => {
              navigate('/notifications');
              onNavigate?.();
            }}
            className="font-semibold cursor-pointer">
            {t('notifications')}
          </SidebarItem>

          <SidebarItem
            icon={LuSettings}
            active={location.pathname === '/settings'}
            onClick={() => {
              navigate('/settings');
              onNavigate?.();
            }}
            className="font-semibold cursor-pointer">
            {t('settings')}
          </SidebarItem>

          {userRole === 'ADMIN' ? (
            <SidebarItem
              icon={RiShieldUserLine}
              active={location.pathname.startsWith('/admin')}
              onClick={() => {
                navigate('/admin/dashboard');
                onNavigate?.();
              }}
              className="font-semibold cursor-pointer">
              Admin
            </SidebarItem>
          ) : null}

          <SignOutButton>
            <SidebarItem
              icon={LuLogOut}
              className="font-semibold cursor-pointer">
              {t('signOut')}
            </SidebarItem>
          </SignOutButton>
        </SidebarItemGroup>

        {/* User Info */}
        <SidebarItemGroup>
          <div className="flex items-center gap-3">
            <button
              onClick={() => openUserProfile()}
              className="flex items-center gap-3 pl-0 text-left bg-transparent border-none active:outline-none">
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
