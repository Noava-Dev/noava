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
import { Link } from 'react-router-dom';

function Header() {
  const { t } = useTranslation('common');
  const { isSignedIn } = useUser();

  return (
    <>
      <Navbar fluid rounded>
        <NavbarBrand href="/" className="mr-8">
          <img
            src={Logo}
            className="object-cover w-12 h-auto mr-3"
            alt="Noava Logo"
          />
          <span className="self-center text-xl font-semibold whitespace-nowrap dark:text-white">
            Noava
          </span>
        </NavbarBrand>
        <div className="flex items-center gap-2 md:order-2">
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
        <NavbarCollapse>
          <Link
            to="/docs"
            className="text-black hover:text-primary-500 dark:text-white dark:hover:text-primary-300">
            Docs
          </Link>
          <Link
            to="/dashboard"
            className="text-black hover:text-primary-500 dark:text-white dark:hover:text-primary-300">
            Dashboard
          </Link>
          <Link
            to="/faq"
            className="text-black hover:text-primary-500 dark:text-white dark:hover:text-primary-300">
            FAQ
          </Link>
        </NavbarCollapse>
      </Navbar>
    </>
  );
}

export default Header;
