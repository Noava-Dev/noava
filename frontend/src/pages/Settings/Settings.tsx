import { 
    LuSun as sun,
    LuMoon as moon,
    LuGlobe as globe,} 
from "react-icons/lu";
import { useState, useEffect } from "react";
import PageHeader from "../../shared/components/PageHeader";
import { SettingsGroup } from "./components/SettingsGroup";

function SettingsPage() {
    const [theme, setTheme] = useState<"light" | "dark">(() => {
        return (localStorage.getItem("theme") as "light" | "dark" ) || "light";
    });
    const [language, setLanguage] = useState("en");

    // TODO: add logic for changing the theme of the app when setTheme is called

    useEffect(() => {
        const root = document.documentElement;

        if (theme === "dark"){
            root.classList.add("dark")
        }else{
            root.classList.remove("dark")
        }

        localStorage.setItem("theme", theme)

    }, [theme]);

    // TODO: add logic for changing the language of the app when setLanguage is called
    // TODO: add logic to store settings in the db

    return(
        <div className="flex flex-col bg-background-app-light dark:bg-background-app-dark h-screen">
            <header>
                <PageHeader>
                    <div className="flex flex-col text-center p-3 gap-2">
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
                <div className="flex flex-col items-center">
                   <SettingsGroup
                        title="Theme"
                        description="Select your preferred color scheme"
                        tooltip = "Choose between light and dark mode to customize the appearance of the application based on your preference or environment."
                        groupIcon={theme === "dark" ? moon : sun}
                        options={[
                            {label: "Light", icon: sun, active: theme === "light", onClick: () => setTheme("light")},
                            {label: "dark", icon: moon, active: theme === "dark", onClick: () => setTheme("dark") }
                        ]}
                   />
                   <SettingsGroup
                        title="Language"
                        description= "Choose your preferred language"
                        tooltip = "Select your preferred language for the application interface. This will change all text and labels throughout the app."
                        groupIcon={globe}
                        options={[
                            {label: "English",active: language === "en", onClick: () => setLanguage("en")},
                            {label: "Nederlands",active: language === "nl", onClick: () => setLanguage("nl")},
                            {label: "Français",active: language === "fr", onClick: () => setLanguage("fr")},
                            {label: "Deutsch",active: language === "de", onClick: () => setLanguage("de")},

                        ]}
                   />
                </div>
            </div>
            
        </div>
    )

}
export default SettingsPage;