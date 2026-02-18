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
        <div className="flex flex-col items-center w-full gap-4 sm:flex-row sm:justify-between sm:items-center">
          <FooterBrand href="/" src={Logo} alt="Noava Logo" name="Noava" />
          <FooterLinkGroup className="flex flex-wrap justify-center gap-4 sm:gap-6">
            <NavigationLink href="/guidelines" text="Guidelines" />
            <NavigationLink href="/privacy" text="Privacy Policy" />
            <NavigationLink href="/terms-of-service" text="Terms of Service" />
            <NavigationLink href="/copyright" text="Copyright" />
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
