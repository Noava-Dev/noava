import { Button, Navbar, NavbarBrand, NavbarCollapse, NavbarLink, NavbarToggle } from "flowbite-react";
import Logo from '../../../assets/noava-logo-blue-nobg.png';
import { useTranslation } from 'react-i18next';


function Header() {
    const { t } = useTranslation('common');
    return(
        <>
            <Navbar fluid rounded>
                <NavbarBrand href="/" className="mr-8">
                    <img src={Logo} className="mr-3 w-12 h-auto object-cover" alt="Noava Logo" />
                    <span className="self-center whitespace-nowrap text-xl font-semibold dark:text-white">Noava</span>
                </NavbarBrand>
                <div className="flex md:order-2">
                    <Button>{t('actions.getStarted')}</Button>
                    <NavbarToggle />
                </div>
                <NavbarCollapse>
                    <NavbarLink href="#">Docs</NavbarLink>
                    <NavbarLink href="#">Dashboard</NavbarLink>
                    <NavbarLink href="/faq">FAQ</NavbarLink>
                </NavbarCollapse>
            </Navbar>
        </>
    )
}

export default Header;