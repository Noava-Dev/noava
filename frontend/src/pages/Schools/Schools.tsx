import { useEffect, useState } from 'react';
import { SchoolCard } from './components/SchoolCard';
import PageHeader from '../../shared/components/PageHeader';
import type { SchoolDto } from '../../models/School';
import { useToast } from '../../contexts/ToastContext';
import { useSchoolService } from '../../services/SchoolService';
import { LuPlus as Plus } from 'react-icons/lu';
import CreateSchoolModal from './components/CreateSchoolModal';
import Loading from '../../shared/components/loading/Loading';
import { useNavigate} from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';
import { useUserRole } from '../../hooks/useUserRole';
import ConfirmModal from '../../shared/components/ConfirmModal';
import { Tooltip } from 'flowbite-react';

export default function SchoolsPage() {
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

  const fetchSchools = async () => {
    try {
      setLoading(true);
      const data = await schoolService.getAll();

      if(userRole == 'ADMIN'){
        setSchools(data);
      } else if (user) {
        const filteredSchools = data.filter(school => school.admins.some(a => a.clerkId === user.id))
        setSchools(filteredSchools)
      }
    } catch (error) {
      showError('Error', 'Failed to load schools. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if(userRole) {
    fetchSchools();
    }
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

        showSuccess('Success', `${data.name} was updated successfully.`);

      }else{
        await schoolService.create({
        schoolName: data.name,
        schoolAdminEmails: data.adminEmails
      });

      showSuccess('Success', `${data.name} was added successfully.`);
    }
      setIsModalOpen(false);
      setEditingSchool(null);
      await fetchSchools();
    } catch (error) {
      showError('Error', 'Failed to create school.');
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
      'Success',
      `${deleteSchool.schoolName} was deleted successfully.`
    );
    await fetchSchools();
  } catch {
    showError('Error', 'Failed to delete school.');
  } finally {
    setDeleteSchool(null);
  }
};


const handleCardClick = (id: number) => {
    navigate(`/schools/${id}/classrooms`)
}

if (loading) { 
  return ( 
  <div className="flex items-center justify-center min-h-screen bg-background-app-light dark:bg-background-app-dark">
    <Loading size="lg" center text="Loading schools..." /> 
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
              {userRole === 'ADMIN' 
              ? 'Overview of all registered educational institutions.' 
              : 'Overview of schools you manage.'}
            </p>
          </div>

          {userRole === 'ADMIN' && (
            <div className="w-full md:w-fit">
              <Tooltip content="Create a new school for your institution">
                <button
                  onClick={() => {
                    setIsModalOpen(true);
                    setEditingSchool(null);
                  }}
                  className="flex items-center justify-center gap-2 rounded-lg bg-primary-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-primary-600 shadow-md"
                >
                  <Plus className="size-5" />
                  Add School
                </button>
              </Tooltip>
            </div>
          )}

        </div>
      </PageHeader>

      <main className="px-4 py-12 mx-auto max-w-7xl sm:px-6">
        <div className="max-w-4xl mx-auto space-y-4">
          {schools.length === 0 ? (
            <div className="py-12 text-center md:py-20">
              <p className="mb-6 text-xl text-text-body-light dark:text-text-muted-dark md:text-2xl">
                {userRole === 'ADMIN' 
                ? 'No schools found. Start by adding a new school.' 
                : 'You are not currently assigned to any schools.'}
              </p>
            </div>
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
          }
        }
        onCreate={handleCreateSchool}
        initialData={
          editingSchool
          ? {
            name: editingSchool.schoolName,
            adminEmails: editingSchool.admins.map(a => a.email),
          }
          : undefined
        }
      />

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
