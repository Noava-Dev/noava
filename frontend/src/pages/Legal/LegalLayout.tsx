import { ReactNode } from 'react';
import Header from '../../shared/components/navigation/Header';

type LegalLayoutProps = {
  title: string;
  lastModifiedDate?: string;
  children: ReactNode;
};

function LegalLayout({ title, lastModifiedDate, children }: LegalLayoutProps) {
  return (
    <>
      <Header />
      <div className="w-1/2 min-h-screen mx-auto mt-12">
        <h3 className="mb-2 text-4xl font-medium text-text-title-light dark:text-text-title-dark">
          {title}
        </h3>
        <h4 className="mb-8 text-base font-medium text-text-muted-light dark:text-text-muted-dark">
          Last updated: {lastModifiedDate}
        </h4>
        {children}
      </div>
    </>
  );
}

export default LegalLayout;
