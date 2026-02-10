import { Modal, Button, TextInput, ModalFooter, ModalBody, ModalHeader } from 'flowbite-react';
import { useTranslation } from 'react-i18next';
import { useState, useEffect } from 'react';
import { HiSearch } from 'react-icons/hi';
import { useDeckService } from '../../services/DeckService';
import { useToast } from '../../contexts/ToastContext';
import type { Deck } from '../../models/Deck';
import Loading from './loading/Loading';

interface AddDeckModalProps {
  opened: boolean;
  onClose: () => void;
  classroomId: number;
  onDeckAdded: () => void;
  onAddDeck: (deckId: number) => Promise<void>;
}

export const AddDeckModal: React.FC<AddDeckModalProps> = ({
  opened,
  onClose,
  onDeckAdded,
  onAddDeck
}) => {
  const { t } = useTranslation('classrooms');
  const deckService = useDeckService();
  const { showError } = useToast();

  const [decks, setDecks] = useState<Deck[]>([]);
  const [filteredDecks, setFilteredDecks] = useState<Deck[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [addingDeckId, setAddingDeckId] = useState<number | null>(null);

  useEffect(() => {
    if (opened) {
      fetchDecks();
    }
  }, [opened]);

  useEffect(() => {
    if (searchTerm.trim()) {
      const filtered = decks.filter(deck =>
        deck.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        deck.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        deck.language.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredDecks(filtered);
    } else {
      setFilteredDecks(decks);
    }
  }, [searchTerm, decks]);

  const fetchDecks = async () => {
    setLoading(true);
    try {
      const data = await deckService.getMyDecks();
      setDecks(data);
      setFilteredDecks(data);
    } catch (error) {
      console.error('Error loading decks:', error);
      showError(t('app.error'), t('addDeck.loadError'));
    } finally {
      setLoading(false);
    }
  };

  const handleAddDeck = async (deckId: number) => {
    setAddingDeckId(deckId);
    try {
      await onAddDeck(deckId);
      onDeckAdded();
    } catch (error) {
      console.error('Error adding deck:', error);
    } finally {
      setAddingDeckId(null);
    }
  };

  const handleClose = () => {
    setSearchTerm('');
    onClose();
  };

  return (
    <Modal show={opened} onClose={handleClose} size="lg" dismissible>
      <ModalHeader>{t('addDeck.title')}</ModalHeader>
      <ModalBody>
        <p className="mb-4 text-sm text-text-muted-light dark:text-text-muted-dark">
          {t('addDeck.description')}
        </p>

        {/* Search Input */}
        <div className="mb-4">
          <TextInput
            type="text"
            placeholder={t('addDeck.searchPlaceholder')}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            icon={HiSearch}
          />
        </div>

        {/* Deck List */}
        <div className="max-h-96 overflow-y-auto">
          {loading ? (
            <div className="py-12">
              <Loading center size="md" />
            </div>
          ) : filteredDecks.length === 0 ? (
            <div className="py-12 text-center text-text-muted-light dark:text-text-muted-dark">
              {searchTerm ? t('addDeck.noResults') : t('addDeck.noDecks')}
            </div>
          ) : (
            <div className="space-y-2">
              {filteredDecks.map((deck) => (
                <div
                  key={deck.deckId}
                  className="flex items-center justify-between p-3 rounded-lg bg-background-surface-light dark:bg-background-surface-dark hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-primary-500 flex items-center justify-center">
                      <span className="text-2xl font-bold text-white">
                        {deck.title.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-text-title-light dark:text-text-title-dark truncate">
                        {deck.title}
                      </h4>
                      <p className="text-sm text-text-muted-light dark:text-text-muted-dark">
                         {t('addDeck.cards')} • {deck.language}
                      </p>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    onClick={() => handleAddDeck(deck.deckId)}
                    disabled={addingDeckId === deck.deckId}
                  >
                    {addingDeckId === deck.deckId ? '...' : t('addDeck.addButton')}
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
      </ModalBody>
      <ModalFooter>
        <Button color="gray" onClick={handleClose}>
          {t('addDeck.done')}
        </Button>
      </ModalFooter>
    </Modal>
  );
};