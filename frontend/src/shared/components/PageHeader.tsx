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
    <div className="bg-background-surface-light dark:bg-background-surface-dark border-b border-border dark:border-border-dark">
      
        {children}
      
    </div>
  );
}

export default PageHeader;