import { Button, Navbar, NavbarBrand, NavbarCollapse, NavbarToggle } from "flowbite-react";
import { SignInButton, SignUpButton, UserButton, useUser } from "@clerk/clerk-react";
import Logo from '../../../assets/noava-logo-blue-nobg.png';
import { useTranslation } from 'react-i18next';
import { Link } from "react-router-dom";


function Header() {
    const { t } = useTranslation('common');
    const { isSignedIn } = useUser();
    
    return (
        <>
            <Navbar fluid rounded>
                <NavbarBrand href="/" className="mr-8">
                    <img src={Logo} className="mr-3 w-12 h-auto object-cover" alt="Noava Logo" />
                    <span className="self-center whitespace-nowrap text-xl font-semibold dark:text-white">Noava</span>
                </NavbarBrand>
                <div className="flex md:order-2 items-center gap-2">
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
                    <Link to="/docs" className="text-black hover:text-primary-500 dark:text-white dark:hover:text-primary-300">Docs</Link>
                    <Link to="/dashboard" className="text-black hover:text-primary-500 dark:text-white dark:hover:text-primary-300">Dashboard</Link>
                    <Link to="/faq" className="text-black hover:text-primary-500 dark:text-white dark:hover:text-primary-300">FAQ</Link>
                </NavbarCollapse>
            </Navbar>
        </>
    )
}

export default Header;