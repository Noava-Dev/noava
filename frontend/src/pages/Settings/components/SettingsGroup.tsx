import { Tooltip } from 'flowbite-react';
import { LuMessageCircleQuestion as Question } from 'react-icons/lu';
import { SettingsBtn } from './SettingsBtn';

type SettingsBtnType = {
  label: string;
  icon?: any;
  active: boolean;
  onClick: () => void;
};

type SettingsGroupType = {
  title: string;
  description: string;
  tooltip: string;
  groupIcon: any;
  options: SettingsBtnType[];
};

export function SettingsGroup({
  title,
  description,
  tooltip,
  groupIcon: GroupIcon,
  options,
}: SettingsGroupType) {
  return (
    <div className="flex flex-col w-1/2 p-6 m-5 border rounded-lg border-border-strong dark:border-border-dark text-text-title-light bg-background-surface-light dark:bg-background-surface-dark dark:text-text-title-dark">
      <div className="flex items-center justify-items-start">
        <div className="flex items-center justify-center text-white border rounded-lg size-10 bg-primary-700 dark:bg-primary-600 border-primary-500">
          {GroupIcon && <GroupIcon className="w-6 h-6" stroke="currentColor" />}
        </div>
        <div className="flex flex-col m-4">
          <div className="flex items-center gap-3">
            <h3>{title}</h3>
            <Tooltip content={tooltip}>
              <Question className="size-4" />
            </Tooltip>
          </div>
          <div>
            <p className="text-sm text-text-muted-light dark:text-text-muted-dark ">
              {description}
            </p>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3 mt-4">
        {options.map((btn) => (
          <SettingsBtn key={btn.label} {...btn} />
        ))}
      </div>
    </div>
  );
}

// sources:
// https://dev.to/mconner89/passing-props-in-react-using-typescript-20lm
