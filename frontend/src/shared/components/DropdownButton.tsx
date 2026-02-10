import { Button, Dropdown } from "flowbite-react";
import { ComponentType, ReactNode } from "react";
import { HiChevronDown } from "react-icons/hi";

type DropdownButtonProps = {
    size?: "xs" | "sm" | "md" | "lg" | "xl";
    onClickMain: () => void;
    icon: ComponentType<{className?: string}>;
    text: string;
    className?: string;
    color?:string;
    children: ReactNode;
}

function DropdownButton({size, onClickMain, icon: Icon, text, className, color, children}: DropdownButtonProps) {
    return(
        <>
            <div className="flex">
                <Button
                    size={size}
                    onClick={onClickMain}
                    className={`rounded-r-none pr-2 ${className ?? ''}`}>
                        <Icon className="mr-2 size-5" />
                        {text}
                </Button>
                <Dropdown size={size} renderTrigger={() => <div className={`hover:cursor-pointer flex items-center px-2 rounded-r-lg border border-transparent border-l-border-strong hover:bg-primary-800 hover:dark:bg-primary-700 ${color ?? 'dark:bg-primary-600 bg-primary-700'}`}><HiChevronDown className="size-5" /> </div>}>
                    {/* Flowbite <DropdownItem>'s as children */}
                    {children}
                </Dropdown>
            </div>
        </>
    )
}

export default DropdownButton;