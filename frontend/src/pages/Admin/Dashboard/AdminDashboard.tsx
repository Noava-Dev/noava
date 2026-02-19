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
import UsersTab from "../components/users-tab"

function FaqTab() {
  return (
    <div className="rounded-2xl border bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">FAQ</h3>
          <p className="text-sm text-gray-500">
            Manage frequently asked questions.
          </p>
        </div>

        <Button className="flex items-center gap-2">
          <LuPlus /> Add Question
        </Button>
      </div>

      <div className="mt-6 text-sm text-gray-500">FAQ list will go here.</div>
    </div>
  )
}

function BlogTab() {
  return (
    <div className="rounded-2xl border bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Blog</h3>
          <p className="text-sm text-gray-500">
            Manage blog posts and content.
          </p>
        </div>

        <Button className="flex items-center gap-2">
          <LuPlus /> Add Post
        </Button>
      </div>

      <div className="mt-6 text-sm text-gray-500">Blog CMS will go here.</div>
    </div>
  )
}


/* -------------------------------------------------------------------------- */
/*                              Main Component                                */
/* -------------------------------------------------------------------------- */

function AdminDashboard() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header>
        <PageHeader>
          <div>
            <h1 className="text-2xl font-bold">Admin Dashboard</h1>
            <p className="text-gray-500">
              Manage schools, content, users and other settings.
            </p>
          </div>
        </PageHeader>
      </header>

      {/* Content */}
      <main className="mx-auto max-w-6xl p-6">
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
