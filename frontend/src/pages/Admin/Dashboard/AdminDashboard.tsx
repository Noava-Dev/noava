import { Button } from "flowbite-react";
import { LuPlus } from "react-icons/lu";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  LuBuilding2 as Building2,
  LuCircleHelp as HelpCircle,
  LuUsers as Users,
  LuMail,
} from "react-icons/lu";
import PageHeader from "../../../shared/components/PageHeader";
import { Tabs, TabItem } from "flowbite-react";
import SchoolsTab from "../components/schoolsTab";
import UsersTab from "../components/usersTab";
import ContactMessagesTab from "../components/contactMessagesTab";
import { useState } from "react";

function AdminDashboard() {
  const { t } = useTranslation("adminDashboard");
  const [activeTab, setActiveTab] = useState("schools");

  return (
    <div className="min-h-screen bg-background-app-light dark:bg-background-app-dark">
      <header>
        <PageHeader>
          <div className="pt-4 mb-6 md:mb-8 md:pt-8s">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="space-y-2">
                  <h1 className="text-3xl font-extrabold tracking-tight text-text-title-light md:text-5xl dark:text-text-title-dark">
                    Admin Dashboard
                  </h1>
                  <p className="text-base text-text-body-light md:text-xl dark:text-text-body-dark">
                    Welcome to the Noava Admin Dashboard.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </PageHeader>
      </header>

      {/* Content */}
      <main className="mx-auto max-w-6xl px-6 rounded-2xl shadow-sm mt-7">
        {/* Custom Admin Tabs Navigation */}
        <div className="flex border-b border-border dark:border-border-dark mb-4">
          <button
            type="button"
            className={`inline-flex items-center gap-2 px-6 py-3 font-semibold select-none focus:outline-none focus:ring-0 hover:border-cyan-400 transition-colors bg-transparent ${
              activeTab === "schools"
                ? "text-cyan-400 border-b-2 border-cyan-400"
                : "text-text-muted-light dark:text-text-muted-dark"
            }`}
            onClick={() => setActiveTab("schools")}
          >
            <Building2 className="size-4" />
            Schools
          </button>

          <button
            type="button"
            className={`inline-flex items-center gap-2 px-6 py-3 font-semibold select-none focus:outline-none focus:ring-0 hover:border-cyan-400 transition-colors bg-transparent ${
              activeTab === "users"
                ? "text-cyan-400 border-b-2 border-cyan-400"
                : "text-text-muted-light dark:text-text-muted-dark"
            }`}
            onClick={() => setActiveTab("users")}
          >
            <Users className="size-4" />
            Users
          </button>

          <button
            type="button"
            className={`inline-flex items-center gap-2 px-6 py-3 font-semibold select-none focus:outline-none focus:ring-0 hover:border-cyan-400 transition-colors bg-transparent ${
              activeTab === "contact"
                ? "text-cyan-400 border-b-2 border-cyan-400"
                : "text-text-muted-light dark:text-text-muted-dark"
            }`}
            onClick={() => setActiveTab("contact")}
          >
            <LuMail className="size-4" />
            Contact Messages
          </button>
        </div>

        {/* Tab Content */}
        <div>
          {activeTab === "schools" && <SchoolsTab />}
          {activeTab === "users" && <UsersTab />}
          {activeTab === "contact" && <ContactMessagesTab />}
        </div>
      </main>
    </div>
  );
}

export default AdminDashboard;
