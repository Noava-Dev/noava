import { Button } from 'flowbite-react';
import { ComponentType, ReactNode } from 'react';
import { LuFrown } from 'react-icons/lu';

type EmptyStateProps = {
  title: string;
  description: string;
  icon?: ComponentType<{ className?: string }>;
  buttonOnClick?: () => void;
  clearButtonText?: ReactNode;
};

function EmptyState({
  title,
  description,
  icon: Icon,
  clearButtonText,
  buttonOnClick,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center">
      <div className="mb-6">
        {Icon ? (
          <Icon className="w-16 h-16 mx-auto opacity-50 text-text-muted-light md:w-24 md:h-24 dark:text-text-muted-dark" />
        ) : (
          <LuFrown className="w-16 h-16 mx-auto opacity-50 text-text-muted-light md:w-24 md:h-24 dark:text-text-muted-dark" />
        )}
      </div>
      <p className="mb-3 text-xl font-semibold text-text-body-light dark:text-text-title-dark md:text-2xl">
        {title}
      </p>
      <p className="mb-6 text-center text-text-body-light dark:text-text-muted-dark max-w-prose">
        {description}
      </p>
      {buttonOnClick && clearButtonText && (
        <Button onClick={buttonOnClick}>{clearButtonText}</Button>
      )}
    </div>
  );
}

export default EmptyState;
