import { Footer, FooterBrand, FooterCopyright, FooterDivider, FooterLink, FooterLinkGroup } from "flowbite-react";
import Logo from "../../assets/noava-logo-blue-nobg.png";
import ThemeButton from "./ThemeButton";


function NoavaFooter() {
  return (
    <Footer container className="dark:bg-gray-900 rounded-none">
      <div className="w-full text-center">
        <div className="w-full flex flex-col items-center gap-4 sm:flex-row sm:justify-between sm:items-center">
          <FooterBrand
            href="#"
            src={Logo}
            alt="Noava Logo"
            name="Noava"
          />
          <FooterLinkGroup className="flex flex-wrap justify-center gap-4 sm:gap-6">
            <FooterLink href="#">About</FooterLink>
            <FooterLink href="#">Privacy Policy</FooterLink>
            <FooterLink href="#">Licensing</FooterLink>
            <FooterLink href="#">Contact</FooterLink>
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