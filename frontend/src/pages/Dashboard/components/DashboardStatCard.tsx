import { Card, Tooltip } from 'flowbite-react';
import type { ComponentType } from 'react';
import { LuMessageCircleQuestion } from 'react-icons/lu';

type DashboardStatCardProps = {
  title: string;
  value: string | number;
  tooltip?: string;
  icon: ComponentType<{ className?: string }>;
};

function DashboardStatCard({
  title,
  value,
  tooltip,
  icon: Icon,
}: DashboardStatCardProps) {
  return (
    <>
      <Card className="rounded-xl">
        <div className="flex justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-sm text-text-muted-light dark:text-text-muted-dark">
              <p>{title}</p>
              <Tooltip content={tooltip}>
                <LuMessageCircleQuestion className="size-4" />
              </Tooltip>
            </div>

            <h3 className="text-xl font-semibold text-text-title-light dark:text-text-title-dark">
              {value}
            </h3>
          </div>

          <div className="p-2 rounded-lg bg-background-subtle-light dark:bg-background-subtle-dark h-fit w-fit">
            <Icon className="text-primary-500 dark:text-primary-300 size-5" />
          </div>
        </div>
      </Card>
    </>
  );
}

export default DashboardStatCard;
