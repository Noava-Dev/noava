import { useEffect, useState } from "react";
import { SchoolCard } from "./components/SchoolCard";
import PageHeader from "../../shared/components/PageHeader";
import type { SchoolDto } from "../../models/School";
import { useToast } from "../../contexts/ToastContext";
import { useSchoolService } from "../../services/SchoolService";
import { LuSchool, LuPlus as Plus } from "react-icons/lu";
import CreateSchoolModal from "./components/CreateSchoolModal";
import Loading from "../../shared/components/loading/Loading";
import { useNavigate } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";
import { useUserRole } from "../../hooks/useUserRole";
import ConfirmModal from "../../shared/components/ConfirmModal";
import { Button, Select, Tooltip } from "flowbite-react";
import EmptyState from "../../shared/components/EmptyState";
import Searchbar from "../../shared/components/Searchbar";

export default function SchoolsPage() {
  const navigate = useNavigate();
  const { t } = useTranslation('schools');
  const schoolService = useSchoolService();
  const { showError, showSuccess } = useToast();

  const { user } = useUser();
  const { userRole } = useUserRole();

  const [loading, setLoading] = useState(true);

  const [editingSchool, setEditingSchool] = useState<SchoolDto | null>(null);
  const [schools, setSchools] = useState<SchoolDto[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteSchool, setDeleteSchool] = useState<SchoolDto | null>(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest" | "az" | "za">(
    "newest"
  );

  const fetchSchools = async () => {
    try {
      setLoading(true);
      const data = await schoolService.getAll();

      if (userRole == "ADMIN") {
        setSchools(data);
      } else if (user) {
        const filteredSchools = data.filter((school) =>
          school.admins.some((a) => a.clerkId === user.id)
        );
        setSchools(filteredSchools);
      }
    } catch (error) {
      showError(t('toast.loadErrorTitle'), t('toast.loadErrorDescription'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userRole) {
      fetchSchools();
    }
  }, [user, userRole]);

  const handleCreateSchool = async (data: {
    name: string;
    adminEmails: string[];
  }) => {
    try {
      if (editingSchool) {
        await schoolService.update(editingSchool.id, {
          schoolName: data.name,
          schoolAdminEmails: data.adminEmails,
        });

        showSuccess(
          t('toast.successTitle'),
          t('toast.updateSuccess', { name: data.name })
        );
      } else {
        await schoolService.create({
          schoolName: data.name,
          schoolAdminEmails: data.adminEmails,
        });

        showSuccess(
          t('toast.successTitle'),
          t('toast.createSuccess', { name: data.name })
        );
      }
      setIsModalOpen(false);
      setEditingSchool(null);
      await fetchSchools();
    } catch (error) {
      showError(t('toast.loadErrorTitle'), t('toast.saveError'));
    }
  };

  const handleEditSchool = (id: number) => {
    const school = schools.find((s) => s.id === id);
    if (!school) return;

    setEditingSchool(school);
    setIsModalOpen(true);
  };

  const handleDeleteSchool = async (id: number) => {
    const school = schools.find((s) => s.id === id);
    if (!school) return;

    setDeleteSchool(school);
  };

  const confirmDeleteSchool = async () => {
    if (!deleteSchool) return;

    try {
      await schoolService.delete(deleteSchool.id);
      showSuccess(t('toast.successTitle'), t('toast.deleteSuccess', { name: deleteSchool.schoolName }));
      await fetchSchools();
    } catch {
      showError(t('toast.loadErrorTitle'), t('toast.deleteError'));
    } finally {
      setDeleteSchool(null);
    }
  };

  const handleCardClick = (id: number) => {
    navigate(`/schools/${id}/classrooms`);
  };

  const filteredSchools = schools.filter((s) =>
    s.schoolName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedSchools = [...filteredSchools].sort((a, b) => {
    switch (sortOrder) {
      case "az":
        return a.schoolName.localeCompare(b.schoolName, undefined, {
          sensitivity: "base",
        });
      case "za":
        return b.schoolName.localeCompare(a.schoolName, undefined, {
          sensitivity: "base",
        });
      case "newest":
        return (
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      case "oldest":
        return (
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );
      default:
        return 0;
    }
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background-app-light dark:bg-background-app-dark">
        <Loading size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background-app-light dark:bg-background-app-dark">
      <PageHeader>

             <div className="pt-4 mb-6 md:mb-8 md:pt-8">
          <div className="flex items-start justify-between gap-4">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-text-title-light dark:text-text-title-dark">
              {t('title')}
            </h1>
            <p className="text-text-muted-light dark:text-text-muted-dark">
              {userRole === 'ADMIN'
                ? t('subtitleAdmin')
                : t('subtitleManager')}
            </p>
   
          
                {schools.length > 0 && !searchTerm && (
                  <p className="text-sm text-text-muted-light dark:text-text-muted-dark">
                    {schools.length}{" "}
                    {schools.length === 1 ? "school" : "schools"}
                  </p>
                )}
              </div>

              {/* Action Buttons */}
              {userRole === "ADMIN" && (
                <div className="flex flex-col gap-3 mt-4 mb-8 md:flex-row md:justify-between md:items-start md:mt-6">
                  <div className="w-full md:w-fit">
                    <Tooltip content="Create a new school for your institution">
                      <Button
                        onClick={() => {
                          setIsModalOpen(true);
                          setEditingSchool(null);
                        }}
                        size="lg"
                        className="w-full md:w-fit bg-gradient-to-r from-primary-600 to-primary-700"
                      >
                        <Plus className="mr-2 size-5" />
                        Add School
                      </Button>
                    </Tooltip>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Search and Sort Box */}
        <div className="p-4 border shadow-sm border-border bg-background-app-light dark:bg-background-surface-dark rounded-2xl md:p-6 dark:border-border-dark">
          <div className="grid grid-cols-1 md:grid-cols-[1fr_280px] gap-4">
            <div className="space-y-2">
              <label className="block text-sm font-semibold tracking-wide uppercase text-text-muted-light dark:text-text-muted-dark">
                Search
              </label>
              <Searchbar
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
              />
              {searchTerm && (
                <p className="flex items-center gap-1 text-xs text-text-body-light dark:text-text-body-dark">
                  <span className="inline-block w-2 h-2 rounded-full bg-primary-500"></span>
                  {sortedSchools.length} found
                </p>
              )}
            </div>

          {userRole === 'ADMIN' && (
            <div className="w-full md:w-fit">
              <Tooltip content={t('createTooltip')}>
                <button
                  onClick={() => {
                    setIsModalOpen(true);
                    setEditingSchool(null);
                  }}
                  className="flex items-center justify-center gap-2 rounded-lg bg-primary-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-primary-600 shadow-md">
                  <Plus className="size-5" />
                  {t('addButton')}
                </button>
              </Tooltip>
            <div className="space-y-2">
              <label className="block text-sm font-semibold tracking-wide text-gray-700 uppercase dark:text-gray-300">
                Sort By
              </label>
              <Select
                value={sortOrder}
                onChange={(e) =>
                  setSortOrder(
                    e.target.value as "newest" | "oldest" | "az" | "za"
                  )
                }
                className="cursor-pointer"
              >
                <option value="newest">Newest first</option>
                <option value="oldest">Oldest first</option>
                <option value="az">A-Z</option>
                <option value="za">Z-A</option>
              </Select>
            </div>
          </div>
        </div>
      </PageHeader>

      <main className="px-4 py-12 mx-auto max-w-7xl sm:px-6">
        <div className="max-w-4xl mx-auto space-y-4">
          {schools.length === 0 ? (
            <>
              {userRole === "ADMIN" ? (
                <EmptyState
                  title={t('empty.title')}
                  description={t('empty.messageAdmin')}
                  icon={LuSchool}
                />
              ) : (
                <EmptyState
                  title={t('empty.title')}
                  description={t('empty.messageManager')}
                  icon={LuSchool}
                />
              )}
            </>
          ) : (
            schools.map((school) => (
              <SchoolCard
                key={school.id}
                id={school.id}
                name={school.schoolName}
                createdAt={new Date(school.createdAt)}
                admins={school.admins.map((a) => ({
                  id: a.clerkId,
                  name: a.username,
                  email: a.email,
                }))}
                onEdit={handleEditSchool}
                onDelete={handleDeleteSchool}
                onClick={handleCardClick}
              />
            ))
          )}
        </div>
      </main>

      <CreateSchoolModal
        open={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingSchool(null);
        }}
        onCreate={handleCreateSchool}
        initialData={
          editingSchool
            ? {
                name: editingSchool.schoolName,
                adminEmails: editingSchool.admins.map((a) => a.email),
              }
            : undefined
        }
      />

      <ConfirmModal
        show={deleteSchool !== null}
        title={t('deleteModal.title')}
        message={t('deleteModal.message', { name: deleteSchool?.schoolName ?? '' })}
        confirmLabel={t('deleteModal.confirm')}
        cancelLabel={t('modal.cancelButton')}
        onConfirm={confirmDeleteSchool}
        onCancel={() => setDeleteSchool(null)}
      />
    </div>
  );
}
