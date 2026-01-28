import { useState, useEffect } from 'react';
import { Button, ModalBody, ModalFooter, ModalHeader, Select } from 'flowbite-react';
import { Modal } from 'flowbite-react';
import { HiPlus } from 'react-icons/hi';
import { useTranslation } from 'react-i18next';
import NoavaFooter from '../../shared/components/NoavaFooter';
import PageHeader from '../../shared/components/PageHeader';
import DeckCard from '../../shared/components/DeckCard';
import DeckModal from '../../shared/components/DeckModal';
import Searchbar from '../../shared/components/Searchbar';
import { useDeckService } from '../../services/DeckService';
import { useToast } from '../../contexts/ToastContext';
import type { Deck, CreateDeckRequest } from '../../models/Deck';




function DecksPage() {
  
  const { t } = useTranslation('decks');

  const deckService = useDeckService();  
  const [decks, setDecks] = useState<Deck[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDeck, setEditingDeck] = useState<Deck | undefined>(undefined);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest');
  const { showSuccess, showError } = useToast();
  const [deleteDeckId, setDeleteDeckId] = useState<number | null>(null);


  useEffect(() => {
    fetchDecks();
  }, []); 

const fetchDecks = async () => {
  try {
    setLoading(true);
    
    const data = await deckService.getMyDecks();
    
    setDecks(data);
  } catch (error) {
    
    showError(t('toast.loadError'), t('toast.loadError'));
  } finally {
  
    setLoading(false);
  }
};

  const handleCreate = async (deckData: CreateDeckRequest) => {
    try {
      await deckService.create(deckData);
      showSuccess(t('toast.createSuccess'), t('toast.createSuccess'));
      setIsModalOpen(false);
      fetchDecks();
    } catch (error) {
      showError(t('toast.createError'), t('toast.createError'));
    }
  };

  const handleUpdate = async (deckData: CreateDeckRequest) => {
    if (!editingDeck) return;

    try {
      await deckService.update(editingDeck.deckId, deckData);
      showSuccess(t('toast.updateSuccess'), t('toast.updateSuccess'));
      setIsModalOpen(false);
      setEditingDeck(undefined);
      fetchDecks();
    } catch (error) {
      showError(t('toast.updateError'), t('toast.updateError'));
    }
  };

const handleDelete = (deckId: number) => {
  setDeleteDeckId(deckId);
};

const confirmDelete = async () => {
  if (deleteDeckId === null) return;

  try {
    await deckService.delete(deleteDeckId);
    showSuccess(t('toast.deleteSuccess'), t('toast.deleteSuccess'));
    fetchDecks();
  } catch (error) {
    showError(t('toast.deleteError'), t('toast.deleteError'));
  } finally {
    setDeleteDeckId(null);
  }
};

const cancelDelete = () => {
  setDeleteDeckId(null);
};



  const handleEdit = (deck: Deck) => {
    setEditingDeck(deck);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingDeck(undefined);
  };

  const filteredDecks = decks.filter(deck =>
    deck.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    deck.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    deck.language?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedDecks = [...filteredDecks].sort((a, b) => {
    const dateA = new Date(a.createdAt).getTime();
    const dateB = new Date(b.createdAt).getTime();
    return sortOrder === 'newest' ? dateB - dateA : dateA - dateB;
  });

  if (loading) {
    return (
      <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="ml-0 flex-1 w-full">
          <PageHeader>
            <div className="pt-4 md:pt-8">
              <div className="animate-pulse">
                <div className="h-8 md:h-12 bg-gray-200 dark:bg-gray-700 rounded w-32 md:w-48 mb-4"></div>
                <div className="h-4 md:h-6 bg-gray-200 dark:bg-gray-700 rounded w-48 md:w-96"></div>
              </div>
            </div>
          </PageHeader>
          <div className="bg-white dark:bg-gray-900 min-h-screen">
            <div className="container mx-auto px-4 py-8 md:py-20 max-w-7xl">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="animate-pulse">
                    <div className="bg-gray-200 dark:bg-gray-700 h-64 rounded-lg"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <NoavaFooter />
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="ml-0  flex-1 w-full">
        <PageHeader>
          {/* Hero Section */}
          <div className="mb-6 md:mb-8 pt-4 md:pt-8">
            <div className="flex flex-col gap-4 md:gap-6">
              <div className="space-y-2">
                <h1 className="text-3xl md:text-5xl font-extrabold text-gray-900 dark:text-white tracking-tight">
                  {t('title')}
                </h1>
                <p className="text-base md:text-xl text-gray-500 dark:text-gray-400">
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
                size="lg"
                className="w-full md:w-auto bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800"
              >
                <HiPlus className="mr-2 h-5 w-5" />
                {t('createButton')}
              </Button>
            </div>
          </div>

          {/* Search & Filter Card */}
          <div className="bg-gray-50 dark:bg-gray-800/50 rounded-2xl p-4 md:p-6 shadow-sm border border-gray-100 dark:border-gray-700">
            <div className="grid grid-cols-1 md:grid-cols-[1fr_280px] gap-4">
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

        <section className="bg-white dark:bg-gray-900 py-8 md:py-12 min-h-screen">
          <div className="container mx-auto px-4 max-w-7xl">
            {sortedDecks.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
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
              <div className="text-center py-12 md:py-20">
                <div className="mb-6">
                  <svg className="w-16 h-16 md:w-24 md:h-24 text-gray-400 dark:text-gray-500 mx-auto opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <p className="text-gray-900 dark:text-white text-xl md:text-2xl font-semibold mb-3">
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
              <div className="text-center py-12 md:py-20">
                <p className="text-gray-500 dark:text-gray-400 text-xl md:text-2xl mb-6">
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

        {/* Delete Confirmation Modal */}
      <Modal show={deleteDeckId !== null} onClose={cancelDelete} size="md">
        <ModalHeader>
          {t('deleteModal.title')}
        </ModalHeader>
        
        <ModalBody>
          <p className="text-gray-600 dark:text-gray-400">
            {t('deleteModal.message')}
          </p>
        </ModalBody>
        
        <ModalFooter>
          <div className="flex justify-end gap-3 w-full">
            <Button 
              color="gray" 
              onClick={cancelDelete}
              size="sm"
            >
              {t('deleteModal.no')}
            </Button>
            <Button 
              color="red" 
              onClick={confirmDelete}
              size="sm"
            >
              {t('deleteModal.yes')}
            </Button>
          </div>
        </ModalFooter>
      </Modal>

        <NoavaFooter />
      </div>
    </div>
  );
}

export default DecksPage;