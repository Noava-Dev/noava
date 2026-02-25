import { useEffect, useState } from 'react';
import { SchoolCard } from '../../Schools/components/SchoolCard';
import type { SchoolDto } from '../../../models/School';
import { useToast } from '../../../contexts/ToastContext';
import { useSchoolService } from '../../../services/SchoolService';
import { LuPlus, LuSchool, LuSearch, LuPlus as Plus } from 'react-icons/lu';
import CreateSchoolModal from '../../Schools/components/CreateSchoolModal';
import Loading from '../../../shared/components/loading/Loading';
import { useNavigate} from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';
import { useUserRole } from '../../../hooks/useUserRole';
import ConfirmModal from '../../../shared/components/ConfirmModal';
import EmptyState from '../../../shared/components/EmptyState';

export default function SchoolsTab() {
  const navigate = useNavigate();
  const schoolService = useSchoolService();
  const { showError, showSuccess } = useToast();

  const { user } = useUser();
  const { userRole } = useUserRole();

  const [loading, setLoading] = useState(true);
  const [editingSchool, setEditingSchool] = useState<SchoolDto | null>(null);
  const [schools, setSchools] = useState<SchoolDto[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteSchool, setDeleteSchool] = useState<SchoolDto | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchSchools = async () => {
    try {
      setLoading(true);
      const data = await schoolService.getAll();

      if (userRole === 'ADMIN') {
        setSchools(data);
      } else if (user) {
        const filtered = data.filter((school) =>
          school.admins.some((a) => a.clerkId === user.id)
        );
        setSchools(filtered);
      }
    } catch (error) {
      showError('Error loading schools', 'Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userRole) fetchSchools();
  }, [user, userRole]);

  const handleCreateSchool = async (data: {
    name: string;
    adminEmails: string[];
  }) => {
    try {
      if(editingSchool){
        await schoolService.update(editingSchool.id, {
          schoolName: data.name,
          schoolAdminEmails: data.adminEmails
        })

        showSuccess( "School updated", `${data.name} was updated successfully.` );

      }else{
        await schoolService.create({
        schoolName: data.name,
        schoolAdminEmails: data.adminEmails
      });

      showSuccess('School created', `${data.name} was added successfully.`);
    }
      setIsModalOpen(false);
      setEditingSchool(null);
      await fetchSchools();
    } catch (error) {
      showError('Create failed', 'Could not create school.');
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
  if(!school) return;

  setDeleteSchool(school)
}

const confirmDeleteSchool = async () => {
  if (!deleteSchool) return;

  try {
    await schoolService.delete(deleteSchool.id);
    showSuccess(
      "School deleted",
      `${deleteSchool.schoolName} was removed successfully.`
    );
    await fetchSchools();
  } catch {
    showError("Delete failed", "Could not delete school.");
  } finally {
    setDeleteSchool(null);
  }
};

const handleCardClick = (id: number) => {
  navigate(`/schools/${id}/classrooms`);
};
const filteredSchools = schools.filter((school) =>
    school.schoolName.toLowerCase().includes(searchQuery.toLowerCase())
  );

if (loading) {
  return (
    <div className="flex items-center justify-center py-20">
      <Loading/>
    </div>
  );
  }

  return (
    <div className="space-y-6">
      {/* Header row should be replaced with a functioning search bar */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-xl font-semibold text-text-title-light dark:text-text-title-dark">Schools</h2>
          <p className="text-sm text-text-muted-light dark:text-text-muted-dark">
            {userRole === 'ADMIN'
              ? 'Overview of all registered educational institutions.'
              : 'Overview of schools you manage.'}
          </p>
        </div>

        {userRole === 'ADMIN' && (
          <button
            onClick={() => {
              setIsModalOpen(true);
              setEditingSchool(null);
            }}
            className="flex items-center gap-2 rounded-lg bg-primary-500 px-4 py-2 text-sm font-semibold text-white hover:bg-primary-600 shadow"
          >
            <LuPlus className="size-4" /> Add School
          </button>
        )}
      </div>

      <div className="p-4 border shadow-sm border-border dark:border-border-dark bg-background-app-light dark:bg-background-surface-dark rounded-2xl md:p-6">
        <div className="space-y-2">
          <label className="block text-sm font-semibold tracking-wide uppercase text-text-muted-light dark:text-text-muted-dark">
            Search
          </label>

          <div className="relative">
            <LuSearch className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted-light dark:text-text-muted-dark" />
            <input
              type="text"
              placeholder="Search schools by name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-border dark:border-border-dark bg-background-app-light dark:bg-background-app-dark py-2.5 pl-10 pr-4 text-sm text-text-body-light dark:text-text-body-dark focus:ring-2 focus:ring-primary-500 focus:outline-none"
            />
          </div>

          {searchQuery && (
            <p className="flex items-center gap-1 text-xs text-text-body-light dark:text-text-body-dark">
              <span className="inline-block w-2 h-2 rounded-full bg-primary-500"></span>
              {filteredSchools.length} found
            </p>
          )}
        </div>
      </div>

      {/* Schools list */}
      <div className="space-y-4">
        {schools.length === 0 ? (
          <div className="py-12  ">
            <EmptyState
              title="No schools found"
              description={`Add a school to get started.`}
              buttonOnClick={() => setSearchQuery('')} 
              icon={LuSchool}
            />
          </div>
        ) : filteredSchools.length === 0 ? (
          <div className="py-12  ">
            <EmptyState
              title="No schools found"
              description={`We couldn't find any results for "${searchQuery}"`}
              clearButtonText="Clear Search"
              buttonOnClick={() => setSearchQuery('')} 
              icon={LuSchool}
            />
          </div>
        ) : (
          filteredSchools.map((school) => (
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

      {/* Create / Edit */}
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

      {/* Delete confirm */}
      <ConfirmModal
        show={deleteSchool !== null}
        title="Delete School"
        message={`Are you sure you want to delete "${deleteSchool?.schoolName}"?`}
        confirmLabel="Yes, delete"
        cancelLabel="Cancel"
        onConfirm={confirmDeleteSchool}
        onCancel={() => setDeleteSchool(null)}
      />
    </div>
  );
}
