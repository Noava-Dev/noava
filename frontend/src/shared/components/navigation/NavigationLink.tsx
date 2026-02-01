import { Link } from 'react-router-dom';

type NavigationLinkProps = {
  href: string;
  text: string;
};

function NavigationLink({ href, text }: NavigationLinkProps) {
  return (
    <Link
      to={href}
      className="text-text-body-light hover:text-primary-500 dark:text-text-body-dark dark:hover:text-primary-300">
      {text}
    </Link>
  );
}

export default NavigationLink;
