import { LuBuilding2 as Building2,
        LuCircleHelp as HelpCircle,
        LuUsers as Users,
        LuMail
 } from "react-icons/lu"
import PageHeader from "../../../shared/components/PageHeader"
import { Tabs, TabItem } from "flowbite-react"
import SchoolsTab from "../components/schoolsTab"
import UsersTab from "../components/usersTab"
import ContactMessagesTab from "../components/contactMessagesTab"
import { useTranslation } from 'react-i18next';


function AdminDashboard() {
  const { t } = useTranslation("adminDashboard");

  return (
    <div className="min-h-screen bg-background-app-light dark:bg-background-app-dark">
      {/* Header */}
      <header>
        <PageHeader>
          <div className="pt-4 mb-6 md:mb-8 md:pt-8">
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
      <main className="mx-auto max-w-6xl px-6 rounded-2xl shadow-sm">
        <Tabs>
          <TabItem
            active
            title={
              <div className="flex items-center gap-2 text-text-body-light dark:text-text-body-dark">
                <Building2 className="size-4" /> Schools
              </div>
            }
          >
            <SchoolsTab />
          </TabItem>
          <TabItem
            title={
              <div className="flex items-center gap-2 text-text-body-light dark:text-text-body-dark">
                <Users className="size-4" /> Users
              </div>
            }
          >
            <UsersTab />
          </TabItem>
          <TabItem
            title={
              <div className="flex items-center gap-2 text-text-body-light dark:text-text-body-dark">
                <LuMail className="size-4" /> Contact Messages
              </div>
            }
          >
            <ContactMessagesTab />
          </TabItem>
        </Tabs>
      </main>
    </div>
  );
}

export default AdminDashboard;
