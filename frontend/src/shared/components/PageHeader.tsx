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
    <div className="bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 border-b border-gray-200 dark:border-gray-700">
      <div className="container mx-auto px-4 sm:px-6 py-12 max-w-7xl">
        {children}
      </div>
    </div>
  );
}

export default PageHeader;