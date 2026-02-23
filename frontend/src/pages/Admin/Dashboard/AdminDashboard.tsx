import { Button } from "flowbite-react"
import { LuPlus,
        LuBuilding2 as Building2,
        LuCircleHelp as HelpCircle,
        LuFileText as FileText,
        LuUsers as Users
 } from "react-icons/lu"
import PageHeader from "../../../shared/components/PageHeader"
import { Tabs, TabItem } from "flowbite-react"
import SchoolsTab from "../components/schoolsTab"
import UsersTab from "../components/UsersTab"

function FaqTab() {
  return (
    <div className="rounded-2xl border bg-background-app-light dark:bg-background-app-dark p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">FAQ</h3>
          <p className="text-sm text-text-muted-light dark:text-text-muted-dark">
            Manage frequently asked questions.
          </p>
        </div>

        <Button className="flex items-center gap-2">
          <LuPlus /> Add Question
        </Button>
      </div>

      <div className="mt-6 text-sm text-text-muted-light dark:text-text-muted-dark">FAQ list will go here.</div>
    </div>
  )
}

function BlogTab() {
  return (
    <div className="rounded-2xl border bg-background-app-light dark:bg-background-app-dark p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Blog</h3>
          <p className="text-sm text-text-muted-light dark:text-text-muted-dark">
            Manage blog posts and content.
          </p>
        </div>

        <Button className="flex items-center gap-2">
          <LuPlus /> Add Post
        </Button>
      </div>

      <div className="mt-6 text-sm text-text-muted-light dark:text-text-muted-dark">Blog CMS will go here.</div>
    </div>
  )
}
import { useTranslation } from 'react-i18next';

function AdminDashboard() {
  const { t } = useTranslation('adminDashboard');

  return (
    <div className="min-h-screen bg-background-app-light dark:bg-background-app-dark">
      {/* Header */}
      <header className="pt-4 mb-6 md:mb-8">
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
                <HelpCircle className="size-4" /> FAQ
              </div>
            }
          >
            <FaqTab />
          </TabItem>

          <TabItem
            title={
              <div className="flex items-center gap-2">
                <FileText className="size-4" /> Blog
              </div>
            }
          >
            <BlogTab />
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
