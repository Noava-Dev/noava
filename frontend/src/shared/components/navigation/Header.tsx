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
          <span className="self-center text-xl font-semibold whitespace-nowrap text-text-title-light dark:text-text-title-dark">
            Noava
          </span>
        </NavbarBrand>
        <NavbarCollapse>
          <NavigationLink href="/docs" text="Docs" />
          <NavigationLink href="/dashboard" text="Dashboard" />
          <NavigationLink href="/faq" text="FAQ" />
        </NavbarCollapse>
        <div className="flex items-center gap-2">
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
          <NavbarToggle />
        </div>
      </Navbar>
    </>
  );
}

export default Header;
