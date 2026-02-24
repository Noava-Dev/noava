import { useEffect, useState } from 'react';
import { useContactMessageService } from '../../../services/ContactMessageService';
import type { ContactMessage, ContactMessageStatus, ContactSubject } from '../../../models/ContactMessage';
import { useToast } from '../../../contexts/ToastContext';
import { LuSearch, LuTrash, LuEye } from 'react-icons/lu';
import Loading from '../../../shared/components/loading/Loading';
import EmptyState from '../../../shared/components/EmptyState';
import ConfirmModal from '../../../shared/components/ConfirmModal';
import { useTranslation } from 'react-i18next';
import { Modal, ModalHeader, ModalBody } from 'flowbite-react';

export default function ContactMessagesTab() {
  const { t } = useTranslation(['contact', 'common']);
  const contactMessageService = useContactMessageService();
  const { showError, showSuccess } = useToast();

  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [subjectFilter, setSubjectFilter] = useState<ContactSubject | 'all'>('all');
  const [statusFilter, setStatusFilter] = useState<ContactMessageStatus | 'all'>('all');
  const [messageToDelete, setMessageToDelete] = useState<ContactMessage | null>(null);
  const [viewingMessage, setViewingMessage] = useState<ContactMessage | null>(null);

  useEffect(() => {
    fetchMessages();
  }, [subjectFilter, statusFilter]);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const filter: any = {};
      if (subjectFilter !== 'all') filter.subject = subjectFilter;
      if (statusFilter !== 'all') filter.status = statusFilter;
      
      const data = await contactMessageService.getAll(filter);
      setMessages(data);
    } catch (error) {
      showError('Error', 'Failed to load contact messages.');
      console.error('Failed to load messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id: number, newStatus: ContactMessageStatus) => {
    try {
      await contactMessageService.updateStatus(id, newStatus);
      setMessages((prev) =>
        prev.map((msg) => (msg.id === id ? { ...msg, status: newStatus } : msg))
      );
      showSuccess('Status Updated', 'Message status has been updated successfully.');
    } catch (error) {
      showError('Error', 'Failed to update status.');
      console.error('Failed to update status:', error);
    }
  };

  const handleDelete = async () => {
    if (!messageToDelete) return;

    try {
      await contactMessageService.delete(messageToDelete.id);
      setMessages((prev) => prev.filter((msg) => msg.id !== messageToDelete.id));
      showSuccess('Message Deleted', 'Contact message was deleted successfully.');
    } catch (error) {
      showError('Error', 'Failed to delete message.');
      console.error('Failed to delete message:', error);
    } finally {
      setMessageToDelete(null);
    }
  };

  const filtered = messages.filter((msg) => {
    const matchesSearch =
      msg.senderEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
      msg.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  const statusColors: Record<ContactMessageStatus, string> = {
    Pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
    InProgress: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
    Answered: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
    Closed: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300',
    Rejected: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-text-title-light dark:text-text-title-dark">
            Contact Messages
          </h3>
          <p className="text-sm text-text-muted-light dark:text-text-muted-dark">
            Manage and respond to user inquiries.
          </p>
        </div>
      </div>

      <div className="space-y-5">
        {/* Search and Filters */}
        <div className="p-4 border shadow-sm border-border dark:border-border-dark bg-background-app-light dark:bg-background-surface-dark rounded-2xl md:p-6">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {/* Search */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold tracking-wide uppercase text-text-muted-light dark:text-text-muted-dark">
                Search
              </label>

              <div className="relative">
                <LuSearch className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted-light dark:text-text-muted-dark" />
                <input
                  type="text"
                  placeholder="Search by email or message..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-xl border border-border dark:border-border-dark bg-background-app-light dark:bg-background-app-dark py-2.5 pl-10 pr-4 text-sm text-text-body-light dark:text-text-body-dark focus:ring-2 focus:ring-primary-500 focus:outline-none"
                />
              </div>

              {searchQuery && (
                <p className="flex items-center gap-1 text-xs text-text-body-light dark:text-text-body-dark">
                  <span className="inline-block w-2 h-2 rounded-full bg-primary-500"></span>
                  {filtered.length} found
                </p>
              )}
            </div>

            {/* Subject Filter */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold tracking-wide uppercase text-text-muted-light dark:text-text-muted-dark">
                Filter by Subject
              </label>

              <select
                value={subjectFilter}
                onChange={(e) => setSubjectFilter(e.target.value as ContactSubject | 'all')}
                className="rounded-xl border border-border dark:border-border-dark bg-background-app-light dark:bg-background-app-dark py-2.5 px-4 text-sm text-text-body-light dark:text-text-body-dark focus:ring-2 focus:ring-primary-500 focus:outline-none w-full"
              >
                <option value="all">All Subjects</option>
                <option value="GeneralInquiry">{t('contact:subjects.GeneralInquiry')}</option>
                <option value="Support">{t('contact:subjects.Support')}</option>
                <option value="BugReport">{t('contact:subjects.BugReport')}</option>
                <option value="Feedback">{t('contact:subjects.Feedback')}</option>
                <option value="Complaint">{t('contact:subjects.Complaint')}</option>
                <option value="Other">{t('contact:subjects.Other')}</option>
              </select>
            </div>

            {/* Status Filter */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold tracking-wide uppercase text-text-muted-light dark:text-text-muted-dark">
                Filter by Status
              </label>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as ContactMessageStatus | 'all')}
                className="rounded-xl border border-border dark:border-border-dark bg-background-app-light dark:bg-background-app-dark py-2.5 px-4 text-sm text-text-body-light dark:text-text-body-dark focus:ring-2 focus:ring-primary-500 focus:outline-none w-full"
              >
                <option value="all">All Statuses</option>
                <option value="Pending">Pending</option>
                <option value="InProgress">In Progress</option>
                <option value="Answered">Answered</option>
                <option value="Closed">Closed</option>
                <option value="Rejected">Rejected</option>
              </select>
            </div>
          </div>
        </div>

        {/* Messages Table */}
        {loading ? (
          <Loading />
        ) : filtered.length === 0 ? (
          <div className="py-20">
            <EmptyState
              title="No messages found"
              description={
                searchQuery || subjectFilter !== 'all' || statusFilter !== 'all'
                  ? 'No messages match your current filters.'
                  : 'No contact messages have been received yet.'
              }
              clearButtonText="Clear Filters"
              buttonOnClick={() => {
                setSearchQuery('');
                setSubjectFilter('all');
                setStatusFilter('all');
              }}
            />
          </div>
        ) : (
          <div className="overflow-x-auto rounded-2xl border border-border dark:border-border-dark bg-background-app-light dark:bg-background-surface-dark shadow-sm">
            <table className="w-full text-left text-sm text-text-body-light dark:text-text-body-dark">
              <thead className="bg-background-surface-light dark:bg-background-app-dark text-xs uppercase text-text-muted-light dark:text-text-muted-dark">
                <tr>
                  <th className="px-6 py-3 font-bold text-text-title-light dark:text-text-title-dark">
                    Sender
                  </th>
                  <th className="px-6 py-3 font-bold text-text-title-light dark:text-text-title-dark">
                    Subject
                  </th>
                  <th className="px-6 py-3 font-bold text-text-title-light dark:text-text-title-dark">
                    Status
                  </th>
                  <th className="px-6 py-3 font-bold text-text-title-light dark:text-text-title-dark">
                    Date
                  </th>
                  <th className="px-6 py-3 text-right font-bold text-text-title-light dark:text-text-title-dark">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border dark:divide-border-dark">
                {filtered.map((message) => (
                  <tr
                    key={message.id}
                    className="hover:bg-background-surface-light dark:hover:bg-background-app-dark transition-colors"
                  >
                    {/* Sender */}
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="font-medium text-text-title-light dark:text-text-title-dark">
                          {message.senderEmail}
                        </span>
                        <span className="text-xs text-text-muted-light dark:text-text-muted-dark">
                          {t(`contact:titles.${message.title}`)}
                        </span>
                      </div>
                    </td>

                    {/* Subject */}
                    <td className="px-6 py-4">
                      <span className="text-text-body-light dark:text-text-body-dark">
                        {t(`contact:subjects.${message.subject}`)}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="px-6 py-4">
                      <div className="relative inline-block">
                        <select
                          value={message.status}
                          onChange={(e) =>
                            handleStatusChange(message.id, e.target.value as ContactMessageStatus)
                          }
                          className={`appearance-none inline-flex items-center rounded-full pl-3 pr-8 py-1 text-xs capitalize border-none focus:ring-2 focus:ring-primary-500 cursor-pointer ${
                            statusColors[message.status]
                          }`}
                        >
                          <option value="Pending">Pending</option>
                          <option value="InProgress">In Progress</option>
                          <option value="Answered">Answered</option>
                          <option value="Closed">Closed</option>
                          <option value="Rejected">Rejected</option>
                        </select>
                        <div className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2">
                          <svg
                            className="h-4 w-4"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                      </div>
                    </td>

                    {/* Date */}
                    <td className="px-6 py-4">
                      <span className="text-text-body-light dark:text-text-body-dark">
                        {new Date(message.createdAt).toLocaleDateString()}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => setViewingMessage(message)}
                          className="rounded-lg p-2 text-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-900/20"
                          title="View details"
                        >
                          <LuEye className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => setMessageToDelete(message)}
                          className="rounded-lg p-2 text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20"
                          title="Delete message"
                        >
                          <LuTrash className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* View Message Modal */}
      <Modal
        show={viewingMessage !== null}
        onClose={() => setViewingMessage(null)}
        size="lg"
        dismissible
      >
        <ModalHeader>Message Details</ModalHeader>
        <ModalBody>
          {viewingMessage && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-text-muted-light dark:text-text-muted-dark mb-1">
                  From
                </label>
                <p className="text-text-title-light dark:text-text-title-dark">
                  {t(`contact:titles.${viewingMessage.title}`)} {viewingMessage.senderEmail}
                </p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-text-muted-light dark:text-text-muted-dark mb-1">
                  Subject
                </label>
                <p className="text-text-title-light dark:text-text-title-dark">
                  {t(`contact:subjects.${viewingMessage.subject}`)}
                </p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-text-muted-light dark:text-text-muted-dark mb-1">
                  Status
                </label>
                <span
                  className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${
                    statusColors[viewingMessage.status]
                  }`}
                >
                  {viewingMessage.status}
                </span>
              </div>

              <div>
                <label className="block text-sm font-semibold text-text-muted-light dark:text-text-muted-dark mb-1">
                  Received
                </label>
                <p className="text-text-body-light dark:text-text-body-dark">
                  {new Date(viewingMessage.createdAt).toLocaleString()}
                </p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-text-muted-light dark:text-text-muted-dark mb-1">
                  Message
                </label>
                <div className="p-4 bg-background-surface-light dark:bg-background-app-dark rounded-lg">
                  <p className="text-text-body-light dark:text-text-body-dark whitespace-pre-wrap">
                    {viewingMessage.description}
                  </p>
                </div>
              </div>
            </div>
          )}
        </ModalBody>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmModal
        show={messageToDelete !== null}
        title="Delete Message"
        message={`Are you sure you want to delete the message from "${messageToDelete?.senderEmail}"? This action cannot be undone.`}
        confirmLabel="Yes, delete"
        cancelLabel="Cancel"
        onConfirm={handleDelete}
        onCancel={() => setMessageToDelete(null)}
      />
    </div>
  );
}