import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useToast } from '../../contexts/ToastContext';
import { useSchoolService } from '../../services/SchoolService';
import { SchoolClassroomDto, SchoolDto } from '../../models/School';
import PageHeader from '../../shared/components/PageHeader';
import ClassroomCard from './components/ClassroomCard';
import ClassroomModal
 from '../../shared/components/ClassroomModal';
import { 
    LuGraduationCap as Cap,
    LuPlus as Plus
 } from "react-icons/lu";
import Loading from '../../shared/components/loading/Loading';
import { useClassroomService } from '../../services/ClassroomService';

export default function SchoolsPage() {
    const { id } = useParams<{ id: string}>();
    const schoolId = Number(id);

    const schoolService = useSchoolService();
    const classroomService = useClassroomService();
    const { showError, showSuccess } = useToast();

    const [loading, setLoading] = useState(true);
    const [ school, setSchool] = useState<SchoolDto | null>(null);
    const [classrooms, setClassrooms] = useState<SchoolClassroomDto[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const fetchClassrooms = async () => {
        if(!schoolId) return;

        setLoading(true);
        
        try {
            const schoolData = await schoolService.getById(schoolId);
            setSchool(schoolData);
        } catch (error) {
            showError('Error loading school details', 'Could not fetch school info.');
        }

        try {
            const classroomData = await schoolService.getAllClassrooms(schoolId);
            setClassrooms(classroomData);
        } catch (error) {
            console.warn("Could not load classrooms (might be empty)", error);
            setClassrooms([]);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateClassroom = async (data: {
        name: string;
        description: string;
    }) => {
        try{
            await schoolService.createClassroom(
                schoolId,
                {
                    name: data.name,
                    description: data.description
                }
            )

            showSuccess('Classroom created', `${data.name} was added successfully.`);
            setIsModalOpen(false);
            await fetchClassrooms();
        } catch(error) {
            setIsModalOpen(false);
            showError('Create failed', 'Could not create classroom.');
        }
        
    }

    useEffect(() => {
        fetchClassrooms();
    }, [schoolId])

if (loading) { 
  return ( 
  <div className="flex items-center justify-center min-h-screen bg-background-app-light dark:bg-background-app-dark">
    <Loading size="lg" center text="Loading schools..." /> 
  </div> 
  ); 
}
  return (
    <div>
        <PageHeader>
            <div className='flex items-center gap-7'>
                <div className="bg-primary-400 size-12 rounded-xl flex justify-center items-center">
                    <Cap className="size-9"></Cap>
                </div>
                <div className="School+Rest">
                    <h1><b>{school?.schoolName}</b></h1>
                    <p>x classrooms • x decks • x students</p>
                </div>
                <div className="button"></div>
                <button 
                    onClick={() => {
                        setIsModalOpen(true);
                    }}
                    className="flex items-center gap-2 bg-teal-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-teal-700">
                        <Plus /> New Classroom
                </button>
            </div>
        </PageHeader>

        <div className='ml-6'>
            <h2><b>Classrooms</b></h2>
            <p>Select a classroom to view and manage its decks</p>
        </div>
        <main className="px-4 py-12 mx-auto max-w-7xl sm:px-6">
                <div className="max-w-4xl mx-auto space-y-4">
                  {classrooms.length === 0 ? (
                    <div className="py-12 text-center md:py-20">
                      <p className="mb-6 text-xl text-text-body-light dark:text-text-muted-dark md:text-2xl">
                        No classrooms found. Start by adding a new classroom.
                      </p>
                    </div>
                  ) : (
                    classrooms.map((classroom) => (
                      <ClassroomCard
                      key={classroom.id}
                      id= {classroom.id}
                      name={classroom.name}
                      description={classroom.description ?? ""}
                      deckCount= {0}
                      studentCount= {0}
                      />
                    ))
                  )}
                </div>
        </main>
        <ClassroomModal
            isOpen={isModalOpen}
            onClose={() => {
                setIsModalOpen(false);
            }}
            onSubmit={handleCreateClassroom}

        />
    </div>
  )
}