import { Button } from 'flowbite-react';
import { LuFrown } from 'react-icons/lu';

type EmptyStateProps = {
  title: string;
  description: string;
  buttonOnClick: () => void;
  clearButtonText: string;
};

function EmptyState({
  title,
  description,
  clearButtonText,
  buttonOnClick,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center">
      <div className="mb-6">
        <LuFrown className="w-16 h-16 mx-auto opacity-50 text-text-muted-light md:w-24 md:h-24 dark:text-text-body-light" />
      </div>
      <p className="mb-3 text-xl font-semibold text-text-body-light dark:text-text-title-dark md:text-2xl">
        {title}
      </p>
      <p className="mb-6 text-text-body-light dark:text-text-muted-dark">
        {description}
      </p>
      <Button onClick={buttonOnClick}>{clearButtonText}</Button>
    </div>
  );
}

export default EmptyState;
