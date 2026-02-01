import type { ReactNode } from 'react';

/**
 * PageHeader Component
 *
 * Usage:
 * <PageHeader>
 *   <h1>My Title</h1>
 *   <input placeholder="Search..." />
 *   <button>Click me</button>
 * </PageHeader>
 */

interface PageHeaderProps {
  children: ReactNode;
}

function PageHeader({ children }: PageHeaderProps) {
  return (
    <div className="border-b border-border bg-gradient-to-b from-background-app-light to-background-subtle-light dark:from-background-surface-dark dark:to-background-subtle-dark dark:border-border-dark">
      <div className="container px-4 py-12 mx-auto sm:px-6 max-w-7xl">
        {children}
      </div>
    </div>
  );
}

export default PageHeader;
