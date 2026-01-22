import { useState, useEffect } from 'react';
import { Button, Select } from 'flowbite-react';
import { HiPlus } from 'react-icons/hi';
import { useTranslation } from 'react-i18next';
import NoavaFooter from '../../shared/components/NoavaFooter';
import PageHeader from '../../shared/components/PageHeader';
import Searchbar from '../../shared/components/Searchbar';
import DeckCard from '../../shared/components/DeckCard';
import DeckModal from '../../shared/components/DeckModal';
import { deckService } from '../../services/DeckService';
import { useToast } from '../../contexts/ToastContext';
import type { Deck, CreateDeckRequest } from '../../models/Deck';

function DecksPage() {
  const { t } = useTranslation('decks');
  const [decks, setDecks] = useState<Deck[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDeck, setEditingDeck] = useState<Deck | undefined>(undefined);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest');
  const { showSuccess, showError } = useToast();

  useEffect(() => {
    fetchDecks();
  }, []);

  const fetchDecks = async () => {
    try {
      setLoading(true);
      const data = await deckService.getAll();
      setDecks(data);
    } catch (error) {
      showError(t('toast.loadError'), '');
      console.error('Error fetching decks:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (deckData: CreateDeckRequest) => {
    try {
      await deckService.create(deckData);
      showSuccess(t('toast.createSuccess'), '');
      setIsModalOpen(false);
      fetchDecks();
    } catch (error) {
      showError(t('toast.createError'), '');
      console.error('Error creating deck:', error);
    }
  };

  const handleUpdate = async (deckData: CreateDeckRequest) => {
    if (!editingDeck) return;

    try {
      await deckService.update(editingDeck.deckId, deckData);
      showSuccess(t('toast.updateSuccess'), '');
      setIsModalOpen(false);
      setEditingDeck(undefined);
      fetchDecks();
    } catch (error) {
      showError(t('toast.updateError'), '');
      console.error('Error updating deck:', error);
    }
  };

  const handleDelete = async (deckId: number) => {
    if (!confirm(t('deleteConfirm'))) return;

    try {
      await deckService.delete(deckId);
      showSuccess(t('toast.deleteSuccess'), '');
      fetchDecks();
    } catch (error) {
      showError(t('toast.deleteError'), '');
      console.error('Error deleting deck:', error);
    }
  };

  const handleEdit = (deck: Deck) => {
    setEditingDeck(deck);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingDeck(undefined);
  };

  // Filter decks based on search term
  const filteredDecks = decks.filter(deck =>
    deck.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    deck.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    deck.language?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Sort decks
  const sortedDecks = [...filteredDecks].sort((a, b) => {
    const dateA = new Date(a.createdAt).getTime();
    const dateB = new Date(b.createdAt).getTime();
    return sortOrder === 'newest' ? dateB - dateA : dateA - dateB;
  });

 if (loading) {
  return (
    <>
      
      <PageHeader>
        <div className="pt-8">
          <div className="animate-pulse">
            <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded w-48 mb-4"></div>
            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-96"></div>
          </div>
        </div>
      </PageHeader>
      <div className="bg-white dark:bg-gray-900 min-h-screen">
        <div className="container mx-auto px-4 py-20 max-w-7xl">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-gray-200 dark:bg-gray-700 h-48 rounded-t-lg"></div>
                <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-b-lg">
                  <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded mb-3"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <NoavaFooter />
    </>
  );
}

return (
  <>
    

    <PageHeader>
      {/* Hero Section */}
      <div className="mb-8 pt-8">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
          <div className="space-y-2">
            <h1 className="text-5xl font-extrabold text-gray-900 dark:text-white tracking-tight">
              {t('title')}
            </h1>
            <p className="text-xl text-gray-500 dark:text-gray-400">
              {t('subtitle')}
            </p>
            {decks.length > 0 && !searchTerm && (
              <p className="text-sm text-gray-400 dark:text-gray-500">
                {decks.length} {decks.length === 1 ? 'deck' : 'decks'}
              </p>
            )}
          </div>
          
          <Button 
            onClick={() => setIsModalOpen(true)} 
            size="xl"
            className="bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 shadow-lg hover:shadow-xl transition-all duration-200"
          >
            <HiPlus className="mr-2 h-5 w-5" />
            {t('createButton')}
          </Button>
        </div>
      </div>

      {/* Search & Filter Card */}
      <div className="bg-gray-50 dark:bg-gray-800/50 p-6 shadow-sm ">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-4">
          {/* Search Section */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide">
              {t('search.label')}
            </label>
            <Searchbar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
            {searchTerm && (
              <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                <span className="inline-block w-2 h-2 bg-primary-500 rounded-full"></span>
                {sortedDecks.length} {t('results.found')}
              </p>
            )}
          </div>

          {/* Sort Section */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide">
              {t('sort.label')}
            </label>
            <Select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value as 'newest' | 'oldest')}
              className="cursor-pointer"
            >
              <option value="newest">{t('sort.newest')}</option>
              <option value="oldest">{t('sort.oldest')}</option>
            </Select>
          </div>
        </div>
      </div>
    </PageHeader>

      {/* Content Section */}
      <section className="bg-white dark:bg-gray-900 py-12 min-h-screen">
        <div className="container mx-auto px-4 max-w-7xl">
          {sortedDecks.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {sortedDecks.map((deck) => (
                <DeckCard
                  key={deck.deckId}
                  deck={deck}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          ) : searchTerm ? (
            <div className="text-center py-20">
              <div className="mb-6">
                <svg className="w-24 h-24 text-gray-400 dark:text-gray-500 mx-auto opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p className="text-gray-900 dark:text-white text-2xl font-semibold mb-3">
                {t('empty.noResults')}
              </p>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Probeer een andere zoekterm
              </p>
              <Button onClick={() => setSearchTerm('')}>
                {t('empty.clearSearch')}
              </Button>
            </div>
          ) : (
            <div className="text-center py-20">
              <p className="text-gray-500 dark:text-gray-400 text-2xl mb-6">
                {t('empty.message')}
              </p>
              <Button onClick={() => setIsModalOpen(true)} size="lg">
                <HiPlus className="mr-2 h-5 w-5" />
                {t('empty.button')}
              </Button>
            </div>
          )}
        </div>
      </section>

      <DeckModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={editingDeck ? handleUpdate : handleCreate}
        deck={editingDeck}
      />

      <NoavaFooter />
    </>
  );
}

export default DecksPage;