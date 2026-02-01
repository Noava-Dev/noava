type SettingsBtnType = {
  label: string;
  icon?: any;
  active?: boolean;
  onClick: () => void;
};

export function SettingsBtn({
  label,
  icon: Icon,
  active = false,
  onClick,
}: SettingsBtnType) {
  return (
    <button
      onClick={onClick}
      className={`
        flex flex-1 items-center justify-center gap-2
        rounded-lg border px-4 py-3 text-sm font-medium transition-colors focus:ring-0 focus:outline-none
        ${
          active
            ? 'border-primary-500 dark:border-primary-400 bg-background-app-light text-primary-700 dark:bg-background-surface-dark dark:text-primary-400 hover:border-primary-500'
            : 'border-border dark:border-border-dark bg-background-app-light dark:bg-background-surface-dark text-text-body-light dark:text-text-body-dark hover:border-primary-500 hover:dark:border-primary-400 hover:text-text-title-light dark:hover:text-primary-400'
        }
      `}>
      {Icon && <Icon className="w-4 h-4" />}
      {label}
    </button>
  );
}
