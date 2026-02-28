import { Pagination } from 'flowbite-react';
import { useTranslation } from 'react-i18next';
import { HiPlay } from 'react-icons/hi';
import DeckCard from '../../../shared/components/DeckCard';
import EmptyState from '../../../shared/components/EmptyState';
import type { Deck } from '../../../models/Deck';

interface ClassroomDecksListProps {
  paginatedClassroomDecks: (Deck & { classroomName?: string; classroomId?: number })[];
  totalClassroomItems: number;
  classroomPage: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onEdit: (deck: Deck) => void;
  onDelete: (deckId: number) => void;
  onCopy: (deckId: number) => void;
  onAnalytics: (deck: Deck) => void;
}

function ClassroomDecksList({
  paginatedClassroomDecks,
  totalClassroomItems,
  classroomPage,
  pageSize,
  onPageChange,
  onEdit,
  onDelete,
  onCopy,
  onAnalytics,
}: ClassroomDecksListProps) {
  const { t } = useTranslation('decks');

  if (totalClassroomItems === 0) {
    return (
      <EmptyState
        title={t('empty.noClassroomDecks')}
        description={t('empty.noClassroomDecksMessage')}
        icon={HiPlay}
      />
    );
  }

  // Group by classroom
  const grouped = paginatedClassroomDecks.reduce((acc, deck) => {
    const key = deck.classroomName || 'Unknown';
    if (!acc[key]) acc[key] = [];
    acc[key].push(deck);
    return acc;
  }, {} as Record<string, typeof paginatedClassroomDecks>);

  return (
    <>
      <div className="space-y-8">
        {Object.entries(grouped).map(([classroomName, decks]) => (
          <div key={classroomName}>
            <div className="flex items-center gap-3 mb-4">
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-cyan-100 dark:bg-cyan-900/30">
                <HiPlay className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
              </div>
              <h2 className="text-xl font-bold text-text-title-light dark:text-text-title-dark">
                {classroomName}
              </h2>
              <span className="px-2 py-1 text-xs font-medium rounded-full bg-cyan-100 dark:bg-cyan-900/30 text-cyan-700 dark:text-cyan-300">
                {decks.length}
              </span>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 md:gap-6">
              {decks.map((deck) => (
                <DeckCard
                  key={deck.deckId}
                  deck={deck}
                  onEdit={onEdit}
                  onDelete={onDelete}
                  onCopy={onCopy}
                  onAnalytics={onAnalytics}
                />
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {totalClassroomItems > pageSize && (
        <div className="flex justify-center mt-8 overflow-x-auto sm:justify-center">
          <Pagination
            layout="table"
            currentPage={classroomPage}
            itemsPerPage={pageSize}
            totalItems={totalClassroomItems}
            onPageChange={onPageChange}
            showIcons
          />
        </div>
      )}
    </>
  );
}

export default ClassroomDecksList;
