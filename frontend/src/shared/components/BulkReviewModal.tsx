import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import {
  Modal,
  Button,
  ModalBody,
  ModalHeader,
  Label,
  Checkbox,
  Radio,
} from 'flowbite-react';
import type { Deck } from '../../models/Deck';
import { BulkReviewMode } from '../../models/Flashcard';

interface BulkReviewModalProps {
  opened: boolean;
  onClose: () => void;
  decks: Deck[];
  classroomId: number;
}

export const BulkReviewModal: React.FC<BulkReviewModalProps> = ({
  opened,
  onClose,
  decks,
  classroomId,
}) => {
  const { t } = useTranslation('classrooms');
  const navigate = useNavigate();

  const [selectedDeckIds, setSelectedDeckIds] = useState<number[]>([]);
  const [shuffleMode, setShuffleMode] = useState<BulkReviewMode>(
    BulkReviewMode.ShuffleAll
  );

  useEffect(() => {
    if (opened) {
      setSelectedDeckIds([]);
      setShuffleMode(BulkReviewMode.ShuffleAll);
    }
  }, [opened]);

  const handleToggleDeck = (deckId: number) => {
    setSelectedDeckIds((prev) =>
      prev.includes(deckId)
        ? prev.filter((id) => id !== deckId)
        : [...prev, deckId]
    );
  };

  const handleSelectAll = () => {
    if (selectedDeckIds.length === decks.length) {
      setSelectedDeckIds([]);
    } else {
      setSelectedDeckIds(decks.map((d) => d.deckId));
    }
  };

  const handleStartReview = () => {
    if (selectedDeckIds.length === 0) return;

    const deckIdsParam = selectedDeckIds.join(',');
    navigate(
      `/classrooms/${classroomId}/review?deckIds=${deckIdsParam}&mode=${shuffleMode}`
    );
    onClose();
  };

  const handleClose = () => {
    setSelectedDeckIds([]);
    setShuffleMode(BulkReviewMode.ShuffleAll);
    onClose();
  };

  const totalCards = decks
    .filter((d) => selectedDeckIds.includes(d.deckId))
    .length;

  return (
    <Modal show={opened} onClose={handleClose} size="lg" dismissible>
      <ModalHeader>{t('bulkReview.title')}</ModalHeader>
      <ModalBody>
        <div className="space-y-6">
          <p className="text-sm text-text-muted-light dark:text-text-muted-dark">
            {t('bulkReview.description')}
          </p>

          <div className="flex items-center justify-between pb-3 border-b border-gray-200 dark:border-gray-700">
            <Button
              size="sm"
              color="gray"
              onClick={handleSelectAll}
            >
              {selectedDeckIds.length === decks.length
                ? t('bulkReview.deselectAll')
                : t('bulkReview.selectAll')}
            </Button>
            <span className="text-sm text-text-muted-light dark:text-text-muted-dark">
              {t('bulkReview.selectedCount', {
                selected: selectedDeckIds.length,
                total: decks.length,
              })}
            </span>
          </div>

          <div className="space-y-2 max-h-64 overflow-y-auto">
            {decks.length > 0 ? (
              decks.map((deck) => (
                <div
                  key={deck.deckId}
                  className="flex items-center p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                  <Checkbox
                    id={`deck-${deck.deckId}`}
                    checked={selectedDeckIds.includes(deck.deckId)}
                    onChange={() => handleToggleDeck(deck.deckId)}
                    className="mr-3"
                  />
                  <label
                    htmlFor={`deck-${deck.deckId}`}
                    className="flex-1 cursor-pointer"
                  >
                    <div className="font-medium text-text-title-light dark:text-text-title-dark">
                      {deck.title}
                    </div>
                    <div className="text-sm text-text-muted-light dark:text-text-muted-dark">
                      {t('bulkReview.cards')}
                    </div>
                  </label>
                </div>
              ))
            ) : (
              <p className="text-center py-8 text-text-muted-light dark:text-text-muted-dark">
                {t('bulkReview.noDecks')}
              </p>
            )}
          </div>

          {selectedDeckIds.length > 0 && (
            <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
              <Label className="mb-3 block">
                {t('bulkReview.shuffleMode.label')}
              </Label>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Radio
                    id="shuffle-none"
                    name="shuffleMode"
                    value={BulkReviewMode.None}
                    checked={shuffleMode === BulkReviewMode.None}
                    onChange={() => setShuffleMode(BulkReviewMode.None)}
                  />
                  <Label htmlFor="shuffle-none" className="font-normal cursor-pointer">
                    {t('bulkReview.shuffleMode.none')}
                  </Label>
                </div>
                <div className="flex items-center gap-2">
                  <Radio
                    id="shuffle-per-deck"
                    name="shuffleMode"
                    value={BulkReviewMode.ShufflePerDeck}
                    checked={shuffleMode === BulkReviewMode.ShufflePerDeck}
                    onChange={() => setShuffleMode(BulkReviewMode.ShufflePerDeck)}
                  />
                  <Label htmlFor="shuffle-per-deck" className="font-normal cursor-pointer">
                    {t('bulkReview.shuffleMode.perDeck')}
                  </Label>
                </div>
                <div className="flex items-center gap-2">
                  <Radio
                    id="shuffle-all"
                    name="shuffleMode"
                    value={BulkReviewMode.ShuffleAll}
                    checked={shuffleMode === BulkReviewMode.ShuffleAll}
                    onChange={() => setShuffleMode(BulkReviewMode.ShuffleAll)}
                  />
                  <Label htmlFor="shuffle-all" className="font-normal cursor-pointer">
                    {t('bulkReview.shuffleMode.all')}
                  </Label>
                </div>
              </div>
            </div>
          )}

          {selectedDeckIds.length > 0 && (
            <div className="p-4 rounded-lg bg-primary-50 dark:bg-primary-900/20">
              <p className="text-sm font-medium text-primary-700 dark:text-primary-300">
                {t('bulkReview.summary', {
                  decks: selectedDeckIds.length,
                  cards: totalCards,
                })}
              </p>
            </div>
          )}

          <div className="flex justify-end gap-3 pt-2">
            <Button color="gray" onClick={handleClose}>
              {t('common:actions.cancel')}
            </Button>
            <Button
              onClick={handleStartReview}
              disabled={selectedDeckIds.length === 0}
            >
              {t('bulkReview.startReview')}
            </Button>
          </div>
        </div>
      </ModalBody>
    </Modal>
  );
};