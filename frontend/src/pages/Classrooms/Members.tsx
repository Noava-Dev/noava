import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PageHeader from '../../shared/components/PageHeader';
import NoavaFooter from '../../shared/components/navigation/NoavaFooter';
import Loading from '../../shared/components/loading/Loading';
import { HiArrowLeft } from 'react-icons/hi';
import { Button, Tooltip } from 'flowbite-react';
import { useClassroomService } from '../../services/ClassroomService';
import MembersTable from './components/MembersTable';
import EditMemberModal from './components/EditMemberModal';
import ConfirmModal from '../../shared/components/ConfirmModal';
import InviteMemberModal from './components/InviteMemberModal';
import { useToast } from '../../contexts/ToastContext';
import { useTranslation } from 'react-i18next';
import type { ClerkUserResponse } from '../../models/User';
import BackButton from '../../shared/components/navigation/BackButton';

export default function MembersPage() {
  const { classroomId } = useParams();
  const id = Number(classroomId);
  const svc = useClassroomService();
  const { showSuccess, showError } = useToast();
  const { t } = useTranslation('classrooms');
  const navigate = useNavigate();

  const [classroom, setClassroom] = useState<any | null>(null);
  const [loadingClassroom, setLoadingClassroom] = useState(true);

  const [members, setMembers] = useState<ClerkUserResponse[]>([]);
  const [loadingMembers, setLoadingMembers] = useState(true);

  const [editMember, setEditMember] = useState<ClerkUserResponse | null>(null);
  const [showEdit, setShowEdit] = useState(false);
  const [deleteMember, setDeleteMember] = useState<ClerkUserResponse | null>(
    null
  );
  const [showInvite, setShowInvite] = useState(false);

  useEffect(() => {
    if (!id) return;
    fetchClassroom();
    fetchMembers();
  }, [classroomId]);

  const fetchClassroom = async () => {
    try {
      setLoadingClassroom(true);
      const data = await svc.getById(id);
      setClassroom(data);
    } catch (err) {
      showError(t('app.error'), t('toast.loadError'));
    } finally {
      setLoadingClassroom(false);
    }
  };

  const fetchMembers = async (page = 1, pageSize = 50) => {
    try {
      setLoadingMembers(true);
      const data = await svc.getUsersByClassroom(id, page, pageSize);
      setMembers(data);
    } catch (err) {
      showError(t('app.error'), t('toast.loadError'));
    } finally {
      setLoadingMembers(false);
    }
  };

  if (loadingClassroom)
    return (
      <div className="min-h-screen">
        <Loading center />
      </div>
    );

  if (!classroom) return <div className="min-h-screen">{t('notFound')}</div>;

  // Only allow users who have edit permission (teachers) to access this page
  if (!classroom.permissions?.canEdit) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-xl font-semibold">
            {t('members.notAuthorized', 'Not authorized')}
          </h2>
          <p className="text-text-muted-light dark:text-text-muted-dark">
            {t('members.onlyTeachers', 'Only teachers may access this page')}
          </p>
        </div>
      </div>
    );
  }

  const handleEdit = (m: ClerkUserResponse) => {
    setEditMember(m);
    setShowEdit(true);
  };

  const handleSave = async (isTeacher: boolean) => {
    if (!editMember) return;
    try {
      await svc.setUserRole(id, editMember.clerkId, isTeacher);
      showSuccess(
        t('members.updateSuccess', 'Member updated'),
        t('members.updateSuccess', 'Member updated')
      );
      fetchMembers();
    } catch (err) {
      showError(
        t('app.error'),
        t('members.updateError', 'Failed to update member')
      );
    }
  };

  const handleDelete = (m: ClerkUserResponse) => setDeleteMember(m);

  const confirmDelete = async () => {
    if (!deleteMember) return;
    try {
      await svc.removeUser(id, deleteMember.clerkId);
      showSuccess(
        t('members.deleteSuccess', 'Member removed'),
        t('members.deleteSuccess', 'Member removed')
      );
      fetchMembers();
    } catch (err) {
      showError(
        t('app.error'),
        t('members.deleteError', 'Failed to remove member')
      );
    } finally {
      setDeleteMember(null);
    }
  };

  const handleInvite = async (email: string) => {
    try {
      await svc.inviteByEmail(id, email);
      showSuccess(
        t('members.inviteSuccess', 'Invitation sent'),
        t('members.inviteSuccess', 'Invitation sent')
      );
      fetchMembers();
    } catch (err) {
      showError(
        t('app.error'),
        t('members.inviteError', 'Failed to send invitation')
      );
    } finally {
      setShowInvite(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-background-app-light dark:bg-background-app-dark">
      <div className="flex-1 w-full ml-0">
        <PageHeader>
          <div className="pt-4 md:pt-8">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <h1 className="text-3xl font-extrabold tracking-tight text-text-title-light md:text-5xl dark:text-text-title-dark">
                  {classroom.name} - {t('members.title', 'Members')}
                </h1>
                <p className="max-w-3xl mt-2 text-base text-text-muted-light dark:text-text-muted-dark">
                  {t('members.subtitle', 'Manage classroom members')}
                </p>
              </div>

              {classroom?.permissions?.canEdit && (
                <div className="flex-shrink-0">
                  <div className="w-full md:w-fit">
                    <Tooltip content={t('common:tooltips.inviteMember')}>
                      <Button
                        size="sm"
                        onClick={() => setShowInvite(true)}
                        className="inline-flex items-center gap-2">
                        {t('common:actions.invite', 'Invite')}
                      </Button>
                    </Tooltip>
                  </div>
                </div>
              )}
            </div>
          </div>
        </PageHeader>

        <section className="min-h-screen py-8 bg-background-app-light dark:bg-background-app-dark md:py-12">
          <div className="container max-w-5xl px-4 mx-auto">
            <BackButton text="Back to Classroom" href={`/classrooms/${id}`} />

            {loadingMembers ? (
              <div className="py-20">
                <Loading center size="lg" />
              </div>
            ) : (
              <MembersTable
                items={members}
                canEdit={classroom.permissions.canEdit}
                canDelete={classroom.permissions.canDelete}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            )}
          </div>
        </section>

        <EditMemberModal
          show={showEdit}
          member={editMember}
          canEdit={classroom.permissions.canEdit}
          onClose={() => setShowEdit(false)}
          onSave={handleSave}
        />

        <ConfirmModal
          show={deleteMember !== null}
          title={t('members.deleteConfirmTitle', 'Remove member')}
          message={t(
            'members.deleteConfirmMessage',
            'Are you sure you want to remove this member?'
          )}
          onConfirm={confirmDelete}
          onCancel={() => setDeleteMember(null)}
        />

        <InviteMemberModal
          show={showInvite}
          onClose={() => setShowInvite(false)}
          onInvite={handleInvite}
          canInvite={classroom.permissions?.canEdit}
        />

        <NoavaFooter />
      </div>
    </div>
  );
}
