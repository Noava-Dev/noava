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
    <div className="border-b border-gray-200 bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 dark:border-gray-700">
      <div className="container px-4 py-12 mx-auto sm:px-6 max-w-7xl">
        {children}
      </div>
    </div>
  );
}

export default PageHeader;
