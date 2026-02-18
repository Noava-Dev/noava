import {
  Footer,
  FooterBrand,
  FooterCopyright,
  FooterDivider,
  FooterLinkGroup,
} from 'flowbite-react';
import Logo from '../../../assets/noava-logo-blue-nobg.png';
import ThemeButton from '../ThemeButton';
import NavigationLink from './NavigationLink';

function NoavaFooter() {
  return (
    <Footer
      container
      className="border-t rounded-none bg-background-app-light dark:bg-background-surface-dark border-border dark:border-border-dark">
      <div className="w-full text-center">
        <div className="flex flex-col items-center w-full gap-4 lg:flex-row lg:justify-between lg:items-center">
          <FooterBrand href="/" src={Logo} alt="Noava Logo" name="Noava" className="flex-shrink-0" />
          <FooterLinkGroup className="flex flex-wrap justify-center gap-4 sm:gap-6">
            <NavigationLink href="/about" text="About" />
            <NavigationLink href="/privacy" text="Privacy Policy" />
            <NavigationLink href="/licensing" text="Licensing" />
            <NavigationLink href="/contact" text="Contact" />
          </FooterLinkGroup>
          <div className="flex-shrink-0">
            <ThemeButton />
          </div>
        </div>

        <FooterDivider />
        <FooterCopyright by="Noava" year={2026} />
      </div>
    </Footer>
  );
}

export default NoavaFooter;
