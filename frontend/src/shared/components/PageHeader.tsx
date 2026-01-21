import type { ReactNode } from 'react';
import { Button, TextInput } from 'flowbite-react';
import { HiSearch } from 'react-icons/hi';

/* Usage examples (also look at the FAQPage):
 Simple (title only)
 <PageHeader title="About" subtitle="Learn more" />
 
 With search
 <PageHeader
   title="FAQs"
   subtitle="Find answers"
   showSearch
  searchValue={search}
   onSearchChange={setSearch}
   /> */

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  showSearch?: boolean;
  searchPlaceholder?: string;
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  primaryButton?: {
    label: string;
    onClick: () => void;
    icon?: ReactNode;
  };
  secondaryButton?: {
    label: string;
    onClick: () => void;
    icon?: ReactNode;
  };
  filters?: ReactNode;
  children?: ReactNode;
}

function PageHeader({
  title,
  subtitle,
  showSearch = false,
  searchPlaceholder = "Search...",
  searchValue,
  onSearchChange,
  primaryButton,
  secondaryButton,
  filters,
  children
}: PageHeaderProps) {
  return (
    <div className="bg-background-surface-light dark:bg-background-surface-dark border-b border-border dark:border-border-dark">
      <div className="container mx-auto px-4 py-8 max-w-7xl">

        {/* Title Section */}
        <div className="mb-6" text-center>
          <h1 className="text-3xl md:text-4xl font-bold text-text-title-light dark:text-text-title-dark mb-2">
            {title}
          </h1>
          {subtitle && (
            <p className="text-lg text-text-body-light dark:text-text-body-dark">
              {subtitle}
            </p>
          )}
        </div>

        {/* Actions Bar */}
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">

          {/* Search */}
          {showSearch && (
            <div className="flex-1 max-w-md w-full">
              <TextInput
                icon={HiSearch}
                placeholder={searchPlaceholder}
                value={searchValue}
                onChange={(e) => onSearchChange?.(e.target.value)}
                sizing="md"
              />
            </div>
          )}


          {/* Buttons */}
          <div className="flex gap-3 items-center">
            {secondaryButton && (
              <Button
                color="light"
                onClick={secondaryButton.onClick}
              >
                {secondaryButton.icon}
                {secondaryButton.label}
              </Button>
            )}
            {primaryButton && (
              <Button
                onClick={primaryButton.onClick}
              >
                {primaryButton.icon}
                {primaryButton.label}
              </Button>
            )}
          </div>
        </div>

        {/* Filters */}
        {filters && (
          <div className="mt-6">
            {filters}
          </div>
        )}

        {/* Custom children */}
        {children && (
          <div className="mt-6">
            {children}
          </div>
        )}
      </div>
    </div>
  );
}

export default PageHeader;