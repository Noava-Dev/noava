import type { ComponentType } from "react";

type SettingsType = {
    label: string;
    icon: ComponentType<any>;
    active: boolean;
    onClick: () => void;
}

export function SettingsButton({
    label,
    active = false,
    icon: Icon,
    onClick,
}: SettingsType) {
    
    return(
        <button
            onClick = {onClick}
            className = {
                `flex flex-1 items-center justify-center
                gap-2 rounded-lg border px-4 py-3
                text-sm font-medium
                ${active
                    ?"border-primary-500 bg-primary-100 text-primary-700 dark:bg-primary-500 dark:text-primary-500"
                    : "border-border bg-background-surface-light dark:bg-background-surface-dark text-text-body-light dark:text-text-body-dark hover:border-primary-300 hover:text-text-title-light dark:hover:text-text-title-dark"
                }`
            }
        >
            {Icon && <Icon className="h-4 w-4" />}
            {label}
        </button>
    )
}

// sources:
// https://dev.to/mconner89/passing-props-in-react-using-typescript-20lm
