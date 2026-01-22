import { 
    LuSun as sun,
    LuMoon as moon,
    LuGlobe as globe,
    LuMessageCircleQuestion as CircleQuestion } 
from "react-icons/lu";
import { useState, useEffect } from "react";
import PageHeader from "../../shared/components/PageHeader";
import { Tooltip } from "flowbite-react";
import { SettingsButton } from "./components/SettingsButton";

const themeOptions = [
  { id: "light", label: "Light", icon: sun },
  { id: "dark", label: "Dark", icon: moon },
//   { id: "system", label: "System", icon: a computer or smth }
]
const languageOptions = [
  { id: "en", label: "English" },
  { id: "nl", label: "Nederlands" },
  { id: "de", label: "Deutsch" },
  { id: "fr", label: "Français" },
]
function SettingsPage() {
    const [theme, setTheme] = useState<"light" | "dark">("light");
    const [language, setLanguage] = useState("en");

    const handleThemeChange = (selected: "light" | "dark") => setTheme(selected)
    const handleLanguageChange = (selected: string) => setLanguage(selected)

    return(
        <div className="flex flex-col bg-background-app-light dark:bg-background-app-dark">
            <header>
                <PageHeader>
                    <div className="text-center">
                        <h1 className="text-4xl font-bold text-text-title-light dark:text-text-title-dark">
                            Settings
                        </h1>
                        <p className="text-text-body-light dark:text-text-body-dark">
                            Personalize your application experience.
                        </p>
                    </div>
                </PageHeader>
            </header>
            <div>
                <div>
                    <SettingsButton 
                        label="light"
                        icon={sun}
                        active={theme === "light"}
                        onClick= {() => setTheme("light")}
                    />
                    <SettingsButton 
                        label="dark"
                        icon={moon}
                        active={theme === "dark"}
                        onClick= {() => setTheme("dark")}
                    />
                </div>
            </div>
            
        </div>
    )

}
export default SettingsPage;