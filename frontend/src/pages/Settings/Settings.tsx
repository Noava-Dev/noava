import { LuSun as sun, LuMoon as moon, LuGlobe as globe } from "react-icons/lu";
import { useState, useEffect } from "react";
import PageHeader from "../../shared/components/PageHeader";
import { SettingsGroup } from "./components/SettingsGroup";
import { useTranslation } from 'react-i18next';

function SettingsPage() {

    //-------------------change theme------------------------------
  const [theme, setTheme] = useState<"light" | "dark">(() => {
    return (localStorage.getItem("theme") as "light" | "dark") || "light";
  });

  useEffect(() => {
    const root = document.documentElement;

    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }

    localStorage.setItem("theme", theme);
  }, [theme]);


  //--------------------change language-----------------------------
const { t, i18n } = useTranslation("settings");

const setLanguage = (lang: string) => {
  i18n.changeLanguage(lang);
  localStorage.setItem("preferredLanguage", lang);
};


  return (
    <div className="flex flex-col bg-background-app-light dark:bg-background-app-dark h-screen">
      <header>
        <PageHeader>
          <div className="flex flex-col text-center p-3 gap-2">
            <h1 className="text-4xl font-bold text-text-title-light dark:text-text-title-dark">
              {t('header.title')}
            </h1>
            <p className="text-text-body-light dark:text-text-body-dark">
              {t('header.subtitle')}
            </p>
          </div>
        </PageHeader>
      </header>
      <div>
        <div className="flex flex-col items-center">
          <SettingsGroup
            title={t('theme.title')}
            description={t("theme.description")}
            tooltip={t("theme.tooltip")}
            groupIcon={theme === "dark" ? moon : sun}
            options={[
              {
                label: t("theme.light"),
                icon: sun,
                active: theme === "light",
                onClick: () => setTheme("light"),
              },
              {
                label: t("theme.dark"),
                icon: moon,
                active: theme === "dark",
                onClick: () => setTheme("dark"),
              },
            ]}
          />
          <SettingsGroup
            title={t("language.title")}
            description={t("language.description")}
            tooltip={t("language.tooltip")}
            groupIcon={globe}
            // labels are kept in their native languages so users can easily switch back
            // if they change the language by accident and can’t understand the UI.
            options={[
              {
                label: "English",
                active: i18n.language === "en",
                onClick: () => setLanguage("en"),
              },
              {
                label: "Nederlands",
                active:  i18n.language === "nl",
                onClick: () => setLanguage("nl"),
              },
              {
                label: "Français",
                active:  i18n.language === "fr",
                onClick: () => setLanguage("fr"),
              },
            ]}
          />
        </div>
      </div>
    </div>
  );
}
export default SettingsPage;
