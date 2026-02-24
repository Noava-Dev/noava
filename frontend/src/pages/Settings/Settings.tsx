import {
  LuSun as sun,
  LuMoon as moon,
  LuGlobe as Globe,
  LuMessageCircleQuestion as Question,
  LuChevronDown as ChevronDown,
  LuMailCheck as MailCheck,
  LuMailX as MailX,
} from "react-icons/lu";
import { useState, useEffect } from "react";
import PageHeader from "../../shared/components/PageHeader";
import { SettingsGroup } from "./components/SettingsGroup";
import { useTranslation } from "react-i18next";
import { Tooltip, Dropdown, DropdownItem } from "flowbite-react";
import { useTheme } from "../../contexts/ThemeContext";
import { useUserService } from "../../services/UserService";
import { useToast } from "../../contexts/ToastContext";
import Loading from "../../shared/components/loading/Loading";

function SettingsPage() {
  //-------------------change theme------------------------------
  const { theme, toggleTheme } = useTheme();

  //--------------------change language-----------------------------
  const { t, i18n } = useTranslation("settings");
  const { showSuccess, showError } = useToast();
  const userService = useUserService();

  const languageLabels: Record<string, string> = {
    en: "English",
    nl: "Nederlands",
    fr: "Français",
  };

  const [language, setLanguage] = useState(
    localStorage.getItem("preferredLanguage") ?? i18n.language
  );

  //--------------------email preferences-----------------------------
  const [emailPreferences, setEmailPreferences] = useState<boolean>(false);
  const [loadingPreferences, setLoadingPreferences] = useState(true);
  const [updatingPreferences, setUpdatingPreferences] = useState(false);

  useEffect(() => {
    fetchEmailPreferences();
  }, []);

  const fetchEmailPreferences = async () => {
    try {
      setLoadingPreferences(true);
      const preferences = await userService.getEmailPreferences();
      console.log("Fetched email preferences:", preferences);
      setEmailPreferences(preferences);
    } catch (error) {
      console.error("Failed to fetch email preferences:", error);
      showError("Failed to load email preferences", t("common:app.error"));
      setEmailPreferences(false);
    } finally {
      setLoadingPreferences(false);
    }
  };

  const handleEmailPreferenceChange = async () => {
    try {
      setUpdatingPreferences(true);
      const newValue = !emailPreferences;
      await userService.updateEmailPreferences(newValue);
      setEmailPreferences(newValue);
      showSuccess(t("common:toast.settingsUpdated"), t("common:toast.success"));
    } catch (error) {
      console.error("Failed to update email preferences:", error);
      showError("Failed to update email preferences", t("common:app.error"));
    } finally {
      setUpdatingPreferences(false);
    }
  };

  const changeLanguage = (lang: string) => {
    i18n.changeLanguage(lang);
    localStorage.setItem("preferredLanguage", lang);
    setLanguage(lang);
  };

  return (
    <>
      <div className="flex flex-col h-screen bg-background-app-light dark:bg-background-app-dark">
        <header>
          <PageHeader>
            <div className="pt-4 mb-6 md:mb-8 md:pt-8">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="space-y-2">
                    <h1 className="text-3xl font-extrabold tracking-tight text-text-title-light md:text-5xl dark:text-text-title-dark">
                      {t("common:navigation.settings")}
                    </h1>
                    <p className="text-base text-text-body-light md:text-xl dark:text-text-body-dark">
                      {t("header.subtitle")}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </PageHeader>
        </header>

        {loadingPreferences ? (
          <div className="flex items-center justify-center flex-1">
            <Loading />
          </div>
        ) : (
          <div className="flex flex-col items-center mt-4">
            {/* Theme */}
            <SettingsGroup
              title={t("theme.title")}
              description={t("theme.description")}
              tooltip={t("theme.tooltip")}
              groupIcon={theme === "dark" ? moon : sun}
              options={[
                {
                  label: t("theme.light"),
                  icon: sun,
                  active: theme === "light",
                  onClick: () => theme === "dark" && toggleTheme(),
                },
                {
                  label: t("theme.dark"),
                  icon: moon,
                  active: theme === "dark",
                  onClick: () => theme === "light" && toggleTheme(),
                },
              ]}
            />

            {/* Language */}
            <div className="flex flex-col justify-between w-5/6 p-6 m-5 border rounded-lg sm:flex-row sm:w-1/2 border-border-strong dark:border-border-dark text-text-title-light bg-background-surface-light dark:bg-background-surface-dark dark:text-text-title-dark">
              <div className="flex items-center justify-items-start">
                <div className="flex items-center justify-center text-white border rounded-lg size-10 bg-primary-700 dark:bg-primary-600 border-primary-500">
                  <Globe className="size-6" />
                </div>
                {/* <div className="flex items-center justify-center text-white border rounded-lg size-10 bg-primary-700 dark:bg-primary-600 border-primary-500">
                  <Globe className="w-6 h-6" />
                </div> */}
                <div className="flex flex-col m-4">
                  <div className="flex items-center gap-3">
                    <h3>{t("language.title")}</h3>
                    <Tooltip content={t("language.tooltip")}>
                      <Question className="size-4" />
                    </Tooltip>
                  </div>
                  <div>
                    <p className="text-sm text-text-muted-light dark:text-text-muted-dark ">
                      {t("language.description")}
                    </p>
                  </div>
                </div>
              </div>
              <Dropdown
                inline
                renderTrigger={() => (
                  <button className="flex items-center gap-1 px-4 py-2 my-auto text-sm font-medium border rounded-lg h-fit bg-background-app-light dark:bg-background-surface-dark text-text-body-light dark:text-text-body-dark focus:ring-0 focus:outline-none focus:border-border hover:border-border-strong border-border hover:dark:border-border-strong dark:border-border-dark">
                    {languageLabels[language]}
                    <ChevronDown className="w-5 h-5 ml-auto opacity-70" />
                  </button>
                )}
              >
                <DropdownItem
                  className="bg-transparent"
                  onClick={() => changeLanguage("en")}
                >
                  English
                </DropdownItem>
                <DropdownItem
                  className="bg-transparent"
                  onClick={() => changeLanguage("nl")}
                >
                  Nederlands
                </DropdownItem>
                <DropdownItem
                  className="bg-transparent"
                  onClick={() => changeLanguage("fr")}
                >
                  Français
                </DropdownItem>
              </Dropdown>
            </div>

            {/* Email Preferences */}
            <SettingsGroup
              title={t("emailPreferences.title")}
              description={t("emailPreferences.description")}
              tooltip={t("emailPreferences.tooltip")}
              groupIcon={emailPreferences ? MailCheck : MailX}
              options={[
                {
                  label: t("emailPreferences.emailAndApp"),
                  icon: MailCheck,
                  active: emailPreferences,
                  onClick: () =>
                    !emailPreferences &&
                    !updatingPreferences &&
                    handleEmailPreferenceChange(),
                },
                {
                  label: t("emailPreferences.appOnly"),
                  icon: MailX,
                  active: !emailPreferences,
                  onClick: () =>
                    emailPreferences &&
                    !updatingPreferences &&
                    handleEmailPreferenceChange(),
                },
              ]}
            />
          </div>
        )}
      </div>
    </>
  );
}
export default SettingsPage;