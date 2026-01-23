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
        <div className="kader flex flex-col">
            <div className="categorieVanSettings flex justify-items-start">
                <div className="et-icoontje">
                    {GroupIcon && <GroupIcon className="h-6 w-6"/>}
                </div>
                <div className="tekst-theme-enzo flex flex-col">
                    <div className="ENKEL-voor-theme-en-tooltip flex">
                        <h3>{title}</h3>
                        <Tooltip content={tooltip}>
                            <button className="text-text-muted-light dark:text-text-muted-dark hover:text-text-title-light dark:hover:text-text-title-dark">
                                <Question className="h-4 w-4"/>
                            </button>
                        </Tooltip>
                    </div>
                    <div className="de-description">
                        <p className="text-sm text-text-muted-light dark:text-text-muted-dark "> {description} </p>
                    </div>
                </div>
            </div>
            <div className="mt-4 flex gap-3 flex-wrap">
                {options.map((btn) => (
                <SettingsBtn key={btn.label} {...btn} />
                ))}
            </div>
        </div>
    )
}

// sources:
// https://dev.to/mconner89/passing-props-in-react-using-typescript-20lm
