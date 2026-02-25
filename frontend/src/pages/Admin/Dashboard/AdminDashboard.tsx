import { Button } from 'flowbite-react';
import { LuPlus } from 'react-icons/lu';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
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


function AdminDashboard() {
  const { t } = useTranslation('adminDashboard');

  return (
    <div className="min-h-screen bg-background-app-light dark:bg-background-app-dark">
      {/* Header */}
      <header className="mb-6 md:mb-8">
        <PageHeader>
          <div className="flex flex-col gap-2 p-3 text-center">
            <h1 className="text-4xl font-bold text-text-title-light dark:text-text-title-dark">
              Admin Dashboard
            </h1>
            <p className="text-text-body-light dark:text-text-body-dark">
              Welcome to the Noava Admin Dashboard.
            </p>
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
  )
}

export default AdminDashboard
