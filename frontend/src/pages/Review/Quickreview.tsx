import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button, Progress, Badge } from 'flowbite-react';
import { HiArrowLeft, HiRefresh, HiX, HiVolumeUp } from 'react-icons/hi'; // ← ADD HiVolumeUp
import { useTranslation } from 'react-i18next';
import { useDeckService } from '../../services/DeckService';
import { useFlashcardService } from '../../services/FlashcardService';
import { useToast } from '../../contexts/ToastContext';
import { useAzureBlobService } from '../../services/AzureBlobService';
import type { Deck } from '../../models/Deck';
import type { ReviewSession } from '../../models/ReviewSessions';

function QuickReview() {
  const { deckId } = useParams<{ deckId: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation('flashcards');
  const deckService = useDeckService();
  const flashcardService = useFlashcardService();
  const azureBlobService = useAzureBlobService();
  const { showError } = useToast();

  const [deck, setDeck] = useState<Deck | null>(null);
  const [session, setSession] = useState<ReviewSession | null>(null);
  const [isFlipped, setIsFlipped] = useState(false);
  const [loading, setLoading] = useState(true);
  const [frontImageUrl, setFrontImageUrl] = useState<string | null>(null);
  const [backImageUrl, setBackImageUrl] = useState<string | null>(null);
  const [frontAudioUrl, setFrontAudioUrl] = useState<string | null>(null); // ← ADD
  const [backAudioUrl, setBackAudioUrl] = useState<string | null>(null); // ← ADD

  useEffect(() => {
    if (deckId) {
      initializeSession();
    }
  }, [deckId]);

  // Load images and audio for current card
  useEffect(() => {
    if (session && session.cards.length > 0) {
      const currentCard = session.cards[session.currentIndex];

      // Load front image
      if (currentCard.frontImage) {
        azureBlobService
          .getSasUrl('card-images', currentCard.frontImage)
          .then((url) => setFrontImageUrl(url))
          .catch(() => setFrontImageUrl(null));
      } else {
        setFrontImageUrl(null);
      }

      // Load back image
      if (currentCard.backImage) {
        azureBlobService
          .getSasUrl('card-images', currentCard.backImage)
          .then((url) => setBackImageUrl(url))
          .catch(() => setBackImageUrl(null));
      } else {
        setBackImageUrl(null);
      }

      // ← ADD: Load front audio
      if (currentCard.frontAudio) {
        azureBlobService
          .getSasUrl('card-audio', currentCard.frontAudio)
          .then((url) => setFrontAudioUrl(url))
          .catch(() => setFrontAudioUrl(null));
      } else {
        setFrontAudioUrl(null);
      }

      // ← ADD: Load back audio
      if (currentCard.backAudio) {
        azureBlobService
          .getSasUrl('card-audio', currentCard.backAudio)
          .then((url) => setBackAudioUrl(url))
          .catch(() => setBackAudioUrl(null));
      } else {
        setBackAudioUrl(null);
      }
    }
  }, [session?.currentIndex]);

  const initializeSession = async () => {
    try {
      setLoading(true);

      const [deckData, cardsData] = await Promise.all([
        deckService.getById(Number(deckId)),
        flashcardService.getByDeckId(Number(deckId)),
      ]);

      if (!deckData || cardsData.length === 0) {
        showError(t('quickReview.noCards'), t('quickReview.error'));
        navigate(`/decks/${deckId}/cards`);
        return;
      }

      const shuffledCards = [...cardsData].sort(() => Math.random() - 0.5);

      setDeck(deckData);
      setSession({
        deckId: deckData.deckId,
        deckTitle: deckData.title,
        cards: shuffledCards,
        currentIndex: 0,
        isFlipped: false,
        completedCards: 0,
      });
    } catch (error) {
      showError(t('quickReview.noCards'), t('quickReview.error'));
      navigate(`/decks/${deckId}/cards`);
    } finally {
      setLoading(false);
    }
  };

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const handleNext = () => {
    if (!session) return;

    if (session.currentIndex < session.cards.length - 1) {
      setSession({
        ...session,
        currentIndex: session.currentIndex + 1,
        completedCards: session.completedCards + 1,
      });
      setIsFlipped(false);
    } else {
      setSession({
        ...session,
        completedCards: session.cards.length,
      });
    }
  };

  const handleRestart = () => {
    if (!session) return;

    const shuffledCards = [...session.cards].sort(() => Math.random() - 0.5);

    setSession({
      ...session,
      cards: shuffledCards,
      currentIndex: 0,
      completedCards: 0,
    });
    setIsFlipped(false);
  };

  const handleExit = () => {
    navigate(`/decks/${deckId}/cards`);
  };

  const handlePlayAudio = (audioUrl: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card flip
    const audio = new Audio(audioUrl);
    audio.play().catch((err) => console.error('Failed to play audio:', err));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="w-12 h-12 mx-auto mb-4 border-b-2 rounded-full animate-spin border-cyan-500"></div>
          <p className="text-gray-600 dark:text-gray-400">
            {t('common:app.loading')}
          </p>
        </div>
      </div>
    );
  }

  if (!session || !deck) {
    return null;
  }

  const currentCard = session.cards[session.currentIndex];
  const progress = (session.completedCards / session.cards.length) * 100;
  const isComplete = session.completedCards === session.cards.length;

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
      <main className="flex-1 w-full ml-0 md:ml-64">
        <div className="container max-w-4xl px-4 py-6 mx-auto md:py-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <button
                onClick={handleExit}
                className="p-2 transition-colors rounded-lg hover:bg-gray-200 dark:hover:bg-gray-800">
                <HiX className="w-6 h-6 text-gray-600 dark:text-gray-400" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {deck.title}
                </h1>
                <Badge color="info" className="mt-1">
                  {t('quickReview.mode')}
                </Badge>
              </div>
            </div>
          </div>

          {/* Progress */}
          <div className="mb-6">
            <div className="flex justify-between mb-2 text-sm text-gray-600 dark:text-gray-400">
              <span>{t('quickReview.progress')}</span>
              <span>
                {session.completedCards} / {session.cards.length}
              </span>
            </div>
            <Progress progress={progress} color="cyan" size="lg" />
          </div>

          {/* Card or Complete Screen */}
          {!isComplete ? (
            <>
              {/* Card */}
              <div className="mb-6 perspective-1000">
                <div
                  className={`relative w-full h-96 transition-transform duration-500 transform-style-3d cursor-pointer ${
                    isFlipped ? 'rotate-y-180' : ''
                  }`}
                  onClick={handleFlip}>
                  {/* Front */}
                  <div className="absolute inset-0 backface-hidden">
                    <div className="flex flex-col items-center justify-center w-full h-full p-8 bg-white border-2 border-gray-200 shadow-xl dark:bg-gray-800 rounded-2xl dark:border-gray-700">
                      {/* Audio button - top right */}
                      {frontAudioUrl && (
                        <button
                          onClick={(e) => handlePlayAudio(frontAudioUrl, e)}
                          className="absolute z-10 p-3 text-white transition-colors rounded-full shadow-lg top-4 right-4 bg-cyan-500 hover:bg-cyan-600"
                          title="Play audio">
                          <HiVolumeUp className="w-5 h-5" />
                        </button>
                      )}

                      <div className="mb-4 text-sm font-semibold tracking-wide uppercase text-cyan-500">
                        {t('flashcardModal.front')}
                      </div>

                      {/* Image */}
                      {frontImageUrl && (
                        <div className="flex justify-center w-full mb-4">
                          <img
                            src={frontImageUrl}
                            alt="Front"
                            className="object-contain max-w-full rounded-lg max-h-40"
                          />
                        </div>
                      )}

                      {/* Text */}
                      <div className="flex items-center justify-center flex-1 w-full px-4 text-center">
                        <p className="text-2xl font-bold text-gray-900 break-words md:text-3xl dark:text-white">
                          {currentCard.frontText}
                        </p>
                      </div>

                      {/* Memo */}
                      {currentCard.memo && (
                        <div className="w-full p-3 mt-4 border border-yellow-200 rounded-lg bg-yellow-50 dark:bg-yellow-900/20 dark:border-yellow-800">
                          <p className="text-sm text-yellow-800 dark:text-yellow-200">
                            {currentCard.memo}
                          </p>
                        </div>
                      )}

                      <div className="mt-6 text-sm text-gray-500 dark:text-gray-400">
                        {t('flashcardModal.clickToFlip')}
                      </div>
                    </div>
                  </div>

                  {/* Back */}
                  <div className="absolute inset-0 backface-hidden rotate-y-180">
                    <div className="flex flex-col items-center justify-center w-full h-full p-8 bg-white border-2 border-gray-200 shadow-xl dark:bg-gray-800 rounded-2xl dark:border-gray-700">
                      {/* Audio button - top right */}
                      {backAudioUrl && (
                        <button
                          onClick={(e) => handlePlayAudio(backAudioUrl, e)}
                          className="absolute z-10 p-3 text-white transition-colors bg-yellow-500 rounded-full shadow-lg top-4 right-4 hover:bg-yellow-600"
                          title="Play audio">
                          <HiVolumeUp className="w-5 h-5" />
                        </button>
                      )}

                      <div className="mb-4 text-sm font-semibold tracking-wide text-yellow-500 uppercase">
                        {t('flashcardModal.back')}
                      </div>

                      {/* Image */}
                      {backImageUrl && (
                        <div className="flex justify-center w-full mb-4">
                          <img
                            src={backImageUrl}
                            alt="Back"
                            className="object-contain max-w-full rounded-lg max-h-40"
                          />
                        </div>
                      )}

                      {/* Text */}
                      <div className="flex items-center justify-center flex-1 w-full px-4 text-center">
                        <p className="text-2xl font-bold text-gray-900 break-words md:text-3xl dark:text-white">
                          {currentCard.backText}
                        </p>
                      </div>

                      <div className="mt-6 text-sm text-gray-500 dark:text-gray-400">
                        {t('flashcardModal.clickToFlip')}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex justify-center gap-4">
                <Button size="lg" color="gray" onClick={handleNext}>
                  {t('common:actions.skip')}
                </Button>
                <Button
                  size="lg"
                  className="bg-cyan-500 hover:bg-cyan-600"
                  onClick={handleNext}
                  disabled={!isFlipped}>
                  {session.currentIndex === session.cards.length - 1
                    ? t('common:actions.skip')
                    : t('quickReview.next')}
                </Button>
              </div>
            </>
          ) : (
            /* Complete Screen */
            <div className="py-12 text-center">
              <div className="mb-6">
                <h2 className="mb-2 text-3xl font-bold text-gray-900 dark:text-white">
                  {t('quickReview.complete.title')}
                </h2>
                <p className="text-lg text-gray-600 dark:text-gray-400">
                  {t('quickReview.complete.message', {
                    count: session.cards.length,
                  })}
                </p>
              </div>

              <div className="flex justify-center gap-4">
                <Button size="lg" color="gray" onClick={handleExit}>
                  <HiArrowLeft className="w-5 h-5 mr-2" />
                  {t('quickReview.complete.backToDeck')}
                </Button>
                <Button
                  size="lg"
                  className="bg-cyan-500 hover:bg-cyan-600"
                  onClick={handleRestart}>
                  <HiRefresh className="w-5 h-5 mr-2" />
                  {t('quickReview.complete.restart')}
                </Button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default QuickReview;
