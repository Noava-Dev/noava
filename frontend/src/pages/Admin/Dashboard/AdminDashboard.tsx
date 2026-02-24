import { LuBuilding2 as Building2,
        LuCircleHelp as HelpCircle,
        LuUsers as Users
 } from "react-icons/lu"
import PageHeader from "../../../shared/components/PageHeader"
import { Tabs, TabItem } from "flowbite-react"
import SchoolsTab from "../components/schoolsTab"
import UsersTab from "../components/usersTab"
import { useTranslation } from 'react-i18next';


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
              <div className="flex items-center gap-2">
                <Building2 className="size-4" /> Schools
              </div>
            }
          >
            <SchoolsTab />
          </TabItem>
          <TabItem
            title={
              <div className="flex items-center gap-2">
                <Users className="size-4" /> Users
              </div>
            }
          >
            <UsersTab />
          </TabItem>
        </Tabs>
      </main>
    </div>
  )
}

export default AdminDashboard
