import { useState, useMemo } from 'react';
import { Button, Pagination } from 'flowbite-react';
import { HiPencil, HiTrash } from 'react-icons/hi';
import { useTranslation } from 'react-i18next';
import type { ClerkUserResponse } from '../../../models/User';
import Searchbar from '../../../shared/components/Searchbar';

interface MembersTableProps {
  items: ClerkUserResponse[];
  canEdit: boolean;
  canDelete: boolean;
  onEdit: (member: ClerkUserResponse) => void;
  onDelete: (member: ClerkUserResponse) => void;
}

export default function MembersTable({ items, canEdit, canDelete, onEdit, onDelete }: MembersTableProps) {
  const { t } = useTranslation('classrooms');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const filtered = useMemo(() => {
    const s = search.trim().toLowerCase();
    if (!s) return items;
    return items.filter(i => (`${i.firstName} ${i.lastName}`.toLowerCase().includes(s) || i.email.toLowerCase().includes(s) || i.clerkId.toLowerCase().includes(s)));
  }, [items, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const paged = filtered.slice((page - 1) * pageSize, page * pageSize);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <Searchbar searchTerm={search} setSearchTerm={(v) => { setSearch(v); setPage(1); }} />
      </div>

      <div className="overflow-x-auto bg-white dark:bg-gray-800 rounded-lg border border-gray-100 dark:border-gray-700">
        <table className="min-w-full text-left text-gray-700 dark:text-gray-200">
          <thead>
            <tr className="text-sm text-gray-500 dark:text-gray-300 uppercase">
              <th className="px-4 py-3">{t('members.columns.name')}</th>
              <th className="px-4 py-3">{t('members.columns.email')}</th>
              <th className="px-4 py-3">{t('members.columns.role')}</th>
              <th className="px-4 py-3">{t('members.columns.actions')}</th>
            </tr>
          </thead>
          <tbody>
            {paged.map(m => (
              <tr key={m.clerkId} className="border-t border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700">
                <td className="px-4 py-3">
                  <div className="font-medium text-gray-900 dark:text-gray-100">{m.firstName} {m.lastName}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">{m.clerkId}</div>
                </td>
                <td className="px-4 py-3 text-gray-700 dark:text-gray-200">{m.email}</td>
                <td className="px-4 py-3 text-gray-700 dark:text-gray-200">{m.isTeacher ? t('members.role.teacher') : t('members.role.student')}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <Button size="sm" color="gray" onClick={() => onEdit(m)} disabled={!canEdit} className="text-gray-700 dark:text-gray-200"><HiPencil /></Button>
                    <Button size="sm" color="red" onClick={() => onDelete(m)} disabled={!canDelete}><HiTrash /></Button>
                  </div>
                </td>
              </tr>
            ))}
            {paged.length === 0 && (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-gray-500 dark:text-gray-400">{t('members.noMembers')}</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-center">
        <Pagination currentPage={page} totalPages={totalPages} onPageChange={(p) => setPage(p)} />
      </div>
    </div>
  );
}