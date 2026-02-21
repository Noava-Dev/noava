import {
  Button,
  Navbar,
  NavbarBrand,
  NavbarCollapse,
  NavbarToggle,
} from 'flowbite-react';
import {
  SignInButton,
  SignUpButton,
  UserButton,
  useUser,
} from '@clerk/clerk-react';
import Logo from '../../../assets/noava-logo-blue-nobg.png';
import { useTranslation } from 'react-i18next';
import NavigationLink from './NavigationLink';

function Header() {
  const { t } = useTranslation('common');
  const { isSignedIn } = useUser();

  return (
    <>
      <Navbar
        fluid
        className="border-b bg-background-app-light dark:bg-background-surface-dark border-border dark:border-border-dark">
        <NavbarBrand href="/">
          <img
            src={Logo}
            className="object-cover w-12 h-auto mr-3"
            alt="Noava Logo"
          />
          <span className="self-center text-2xl font-semibold sm:text-xl whitespace-nowrap text-text-title-light dark:text-text-title-dark">
            Noava
          </span>
        </NavbarBrand>

        <div className="flex items-center gap-2 sm:hidden">
          {isSignedIn && <UserButton />}
          <NavbarToggle />
        </div>

        <NavbarCollapse>
          <div className="flex flex-col justify-center gap-2 text-lg sm:flex-row sm:text-base sm:gap-4">
            <NavigationLink
              href="http://localhost:3000"
              text="Docs"
              className="py-2 border-b border-border dark:border-border-dark hover:border-primary-500 dark:hover:border-primary-300"
            />
            <NavigationLink
              href="/dashboard"
              text="Dashboard"
              className="py-2 border-b border-border dark:border-border-dark hover:border-primary-500 dark:hover:border-primary-300"
            />
            <NavigationLink
              href="/faq"
              text="FAQ"
              className="py-2 border-b border-border dark:border-border-dark hover:border-primary-500 dark:hover:border-primary-300"
            />
          </div>
          {!isSignedIn && (
            <div className="flex flex-col gap-2 mt-8 sm:hidden">
              <SignUpButton>
                <Button>{t('navigation.register')}</Button>
              </SignUpButton>

              <SignInButton>
                <Button>{t('navigation.login')}</Button>
              </SignInButton>
            </div>
          )}
        </NavbarCollapse>
        <div className="hidden sm:flex sm:items-center sm:gap-2">
          {!isSignedIn ? (
            <>
              <SignUpButton>
                <Button>{t('navigation.register')}</Button>
              </SignUpButton>

              <SignInButton>
                <Button>{t('navigation.login')}</Button>
              </SignInButton>
            </>
          ) : (
            <UserButton />
          )}
        </div>
      </Navbar>
    </>
  );
}

export default Header;
