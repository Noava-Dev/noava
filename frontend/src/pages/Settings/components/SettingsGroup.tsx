import { Tooltip } from "flowbite-react"
import { LuMessageCircleQuestion as Question } from "react-icons/lu";
import { SettingsBtn } from "./SettingsBtn";

type SettingsBtnType = {
    label: string;
    icon?: any;
    active: boolean;
    onClick: () => void;
}

type SettingsGroupType ={
    title: string;
    description: string;
    tooltip: string;
    groupIcon: any;
    options: SettingsBtnType[];
}

export function SettingsGroup({
    title,
    description,
    tooltip,
    groupIcon: GroupIcon,
    options,
}: SettingsGroupType) {
    
    return(
        <div className=" flex flex-col rounded-lg border w-1/2 p-6 m-5 bg-background-surface-light dark:bg-background-surface-dark">
            <div className="flex justify-items-start items-center">
                <div className="flex justify-center items-center rounded-lg bg-primary-100 dark:bg-background-surface-dark border size-10">
                    {GroupIcon && <GroupIcon className="h-6 w-6" stroke='currentColor'/>}
                </div>
                <div className="flex flex-col m-4">
                    <div className="flex gap-3 items-center">
                        <h3>{title}</h3>
                        <Tooltip content={tooltip}>
                            <Question className="size-4"/>
                        </Tooltip>
                    </div>
                    <div>
                        <p className="text-sm text-text-muted-light dark:text-text-muted-dark "> {description} </p>
                    </div>
                </div>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-3">
                {options.map((btn) => (
                <SettingsBtn key={btn.label} {...btn} />
                ))}
            </div>
        </div>
    )
}

// sources:
// https://dev.to/mconner89/passing-props-in-react-using-typescript-20lm
