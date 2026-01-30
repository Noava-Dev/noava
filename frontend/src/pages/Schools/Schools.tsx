import { useEffect, useState } from "react";
import { SchoolCard } from "./components/SchoolCard";
import PageHeader from "../../shared/components/PageHeader";
import type { SchoolDto } from "../../models/School";
import { useToast } from "../../contexts/ToastContext";
import { useSchoolService } from "../../services/SchoolService";
import { LuPlus as Plus} from "react-icons/lu";

export default function SchoolsPage() {
  const schoolService = useSchoolService();
  const { showError } = useToast();
  
  const [schools, setSchools] = useState<SchoolDto[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchSchools = async () => {
    try {
      setLoading(true);
      const data = await schoolService.getAll();
      setSchools(data);
    } catch (error) {
      showError("Error loading schools", "Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSchools();
  }, []);
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background-app-light dark:bg-background-app-dark">
        <div className="size-10 animate-spin rounded-full border-4 border-primary-100 border-t-primary-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background-app-light dark:bg-background-app-dark">
      <PageHeader>
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-text-title-light dark:text-text-title-dark">
              Schools
            </h1>
            <p className="text-text-muted-light dark:text-text-muted-dark">
              Overview of all registered educational institutions.
            </p>
          </div>
          <button 
            className="flex items-center justify-center gap-2 rounded-lg bg-primary-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-primary-600 transition-colors shadow-md"
          >
            <Plus className="size-5" />
            Add School
          </button>
        </div>
      </PageHeader>

      <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <div className="mx-auto max-w-4xl space-y-4">
          {schools.length === 0 ? (
            <div className="rounded-xl border border-border bg-background-surface-light dark:bg-background-surface-dark p-12 text-center">
              <p className="text-text-body-light dark:text-text-body-dark text-lg font-medium">
                No schools found.
              </p>
              <p className="text-text-muted-light dark:text-text-muted-dark mt-1">
                Start by adding a new school to the platform.
              </p>
            </div>
          ) : (
            schools.map((school) => (
              <SchoolCard
                key={school.schoolId}
                name={school.schoolName}
                createdAt={new Date(school.createdAt)}
                admins={school.admins.map(a => ({
                  id: a.clerkId,
                  name: a.username,
                  email: a.email,
                }))}
              />
            ))
          )}
        </div>
      </main>
    </div>
  );
}