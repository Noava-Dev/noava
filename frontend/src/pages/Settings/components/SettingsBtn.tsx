type SettingsBtnType = {
  label: string
  icon?: any
  active?: boolean
  onClick: () => void
}

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
        rounded-lg border px-4 py-3 text-sm font-medium transition-colors
        ${
          active
            ? "border-primary-500 bg-primary-100 text-primary-700 dark:bg-primary-500/10 dark:text-primary-500"
            : "border-border bg-background-surface-light dark:bg-background-surface-dark text-text-body-light dark:text-text-body-dark hover:border-primary-300 hover:text-text-title-light dark:hover:border-primary-600 dark:hover:text-text-title-dark"
        }
      `}
    >
      {Icon && <Icon className="h-4 w-4" />}
      {label}
    </button>
  )
}
