import { Spinner } from 'flowbite-react';
import { useTranslation } from 'react-i18next';

interface LoadingProps {
  text?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  color?:
    | 'info'
    | 'gray'
    | 'failure'
    | 'warning'
    | 'success'
    | 'pink'
    | 'purple';
  className?: string;
  center?: boolean;
}

function Loading({
  text,
  size = 'md',
  color = 'info',
  className = '',
  center = false,
}: LoadingProps) {
  const { t } = useTranslation('common');
  const displayText = text ?? t('app.loading');

  return (
    <div
      className={`flex items-center gap-3 ${center ? 'justify-center' : ''} ${className}`}>
      <Spinner size={size} color={color} />
      <span className="text-text-body-light dark:text-text-body-dark">
        {displayText}
      </span>
    </div>
  );
}

export default Loading;
