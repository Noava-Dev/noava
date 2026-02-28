import { Pagination } from 'flowbite-react';
import { useTranslation } from 'react-i18next';
import DeckCard from '../../../shared/components/DeckCard';
import EmptyState from '../../../shared/components/EmptyState';
import { LuLayers } from 'react-icons/lu';
import type { Deck } from '../../../models/Deck';

interface MyDecksListProps {
  paginatedOwnedDecks: Deck[];
  paginatedSharedDecks: Deck[];
  totalItems: number;
  page: number;
  pageSize: number;
  searchTerm: string;
  onPageChange: (page: number) => void;
  onCopy: (deckId: number) => void;
  onEdit: (deck: Deck) => void;
  onDelete: (deckId: number) => void;
  onAnalytics: (deck: Deck) => void;
  setSearchTerm: (term: string) => void;
}

function MyDecksList({
  paginatedOwnedDecks,
  paginatedSharedDecks,
  totalItems,
  page,
  pageSize,
  searchTerm,
  onPageChange,
  onCopy,
  onEdit,
  onDelete,
  onAnalytics,
  setSearchTerm,
}: MyDecksListProps) {
  const { t } = useTranslation('decks');

  if (totalItems === 0) {
    return searchTerm ? (
      <EmptyState
        title={t('empty.noResults')}
        description={t('common:search.otherSearchTerm')}
        icon={LuLayers}
        buttonOnClick={() => setSearchTerm('')}
        clearButtonText={t('common:search.clearSearch')}
      />
    ) : (
      <EmptyState
        title={t('empty.title')}
        description={t('empty.message')}
        icon={LuLayers}
      />
    );
  }

  return (
    <>
      <div className="space-y-12">
        {/* My Decks Section */}
        {paginatedOwnedDecks.length > 0 && (
          <div>
            <h2 className="mb-6 text-2xl font-bold text-text-title-light dark:text-text-title-dark">
              {t('sections.myDecks')}
            </h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 md:gap-6">
              {paginatedOwnedDecks.map((deck) => (
                <DeckCard
                  key={deck.deckId}
                  deck={deck}
                  onCopy={onCopy}
                  onEdit={onEdit}
                  onDelete={onDelete}
                  onAnalytics={onAnalytics}
                />
              ))}
            </div>
          </div>
        )}

        {/* Shared Decks Section */}
        {paginatedSharedDecks.length > 0 && (
          <div>
            <h2 className="mb-6 text-2xl font-bold text-text-title-light dark:text-text-title-dark">
              {t('sections.sharedWithMe')}
            </h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 md:gap-6">
              {paginatedSharedDecks.map((deck) => (
                <DeckCard
                  key={deck.deckId}
                  deck={deck}
                  onCopy={onCopy}
                  onAnalytics={onAnalytics}
                  showEdit={false}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalItems > pageSize && (
        <div className="flex justify-center mt-8 overflow-x-auto sm:justify-center">
          <Pagination
            layout="table"
            currentPage={page}
            itemsPerPage={pageSize}
            totalItems={totalItems}
            onPageChange={onPageChange}
            showIcons
          />
        </div>
      )}
    </>
  );
}

export default MyDecksList;
