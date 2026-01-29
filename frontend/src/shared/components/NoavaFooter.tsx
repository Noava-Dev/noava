import { Footer, FooterBrand, FooterCopyright, FooterDivider, FooterLinkGroup } from "flowbite-react";
import Logo from "../../assets/noava-logo-blue-nobg.png";
import ThemeButton from "./ThemeButton";
import { Link } from "react-router-dom";


function NoavaFooter() {
  return (
    <Footer container className="dark:bg-gray-900 rounded-none">
      <div className="w-full text-center">
        <div className="w-full flex flex-col items-center gap-4 sm:flex-row sm:justify-between sm:items-center">
          <FooterBrand
            href="/"
            src={Logo}
            alt="Noava Logo"
            name="Noava"
          />
          <FooterLinkGroup className="flex flex-wrap justify-center gap-4 sm:gap-6">
            <Link to="#" className="text-black hover:text-primary-500 dark:text-white dark:hover:text-primary-300">About</Link>
            <Link to="#" className="text-black hover:text-primary-500 dark:text-white dark:hover:text-primary-300">Privacy Policy</Link>
            <Link to="#" className="text-black hover:text-primary-500 dark:text-white dark:hover:text-primary-300">Licensing</Link>
            <Link to="#" className="text-black hover:text-primary-500 dark:text-white dark:hover:text-primary-300">Contact</Link>
          </FooterLinkGroup>
          <ThemeButton />
        </div>
        
        <FooterDivider />
        <FooterCopyright by="Noava" year={2026} />
      </div>
    </Footer>
  );
}

export default NoavaFooter;