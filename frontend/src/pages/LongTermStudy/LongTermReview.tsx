import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate} from 'react-router-dom';
import { Button, Progress, Badge, TextInput, Spinner } from 'flowbite-react';
import { HiX, HiCheck, HiPlay, HiVolumeUp } from 'react-icons/hi';
import { useTranslation } from 'react-i18next';
import { useDeckService } from '../../services/DeckService';
import { useFlashcardService } from '../../services/FlashcardService';
import { useStudySessionService } from '../../services/StudySessionService';
import { useCardInteractionService } from '../../services/CardInteractionService';
import { useToast } from '../../contexts/ToastContext';
import { useAzureBlobService } from '../../services/AzureBlobService';
import { ReviewMode } from '../../models/Flashcard';
import { StudyMode } from '../../models/CardInteraction';
import { getLanguageCode } from '../../shared/utils/speechHelpers';
import ConfirmationModal from '../../shared/components/ConfirmModal';
import type { Deck } from '../../models/Deck';
import type { Flashcard } from '../../models/Flashcard';
import { FiRepeat } from 'react-icons/fi';
import { FaRepeat } from 'react-icons/fa6';

interface CardWithUrls extends Flashcard {
  frontImageUrl?: string | null;
  backImageUrl?: string | null;
  frontAudioUrl?: string | null;
  backAudioUrl?: string | null;
}

function LongTermReview() {
  const { deckId } = useParams<{ deckId: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation('flashcards');
  const deckService = useDeckService();
  const flashcardService = useFlashcardService();
  const studySessionService = useStudySessionService();
  const cardInteractionService = useCardInteractionService();
  const azureBlobService = useAzureBlobService();
  const { showError, showInfo } = useToast();

  const [deck, setDeck] = useState<Deck | null>(null);
  const [cards, setCards] = useState<CardWithUrls[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [sessionId, setSessionId] = useState<number | null>(null);
  const [isProcessingNext, setIsProcessingNext] = useState(false);

  // Write mode state
  const [userAnswer, setUserAnswer] = useState('');
  const [isAnswerRevealed, setIsAnswerRevealed] = useState(false);
  const [isCorrectOverride, setIsCorrectOverride] = useState<boolean | null>(null);

  // Session tracking
  const [cardsReviewed, setCardsReviewed] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);

  // Exit confirmation
  const [showExitModal, setShowExitModal] = useState(false);
  
  // Timer for response time
  const [cardStartTime, setCardStartTime] = useState<number>(Date.now());
  
  const initialized = useRef(false);

  useEffect(() => {
    if (deckId && !initialized.current) {
      initialized.current = true;
      initializeSession();
    }
  }, [deckId]);

  useEffect(() => {
    setCardStartTime(Date.now());
    return () => {
      window.speechSynthesis.cancel();
    };
  }, [currentIndex]);

  const initializeSession = async () => {
    try {
      setLoading(true);

      const [deckData, cardsData] = await Promise.all([
        deckService.getById(Number(deckId)),
        flashcardService.getSpacedRepetitionCards(Number(deckId), ReviewMode.ShuffleAll),
      ]);

      if (cardsData.length === 0) {
        showInfo(t('longTerm.noCardsToReview'), t('longTerm.mode'));
        navigate(`/decks/${deckId}/cards`);
        return;
      }

      // Load images and audio for all cards
      const cardsWithUrls = await Promise.all(
        cardsData.map(async (card) => {
          const frontImageUrl = card.frontImage
            ? await azureBlobService.getSasUrl('card-images', card.frontImage).catch(() => null)
            : null;
          const backImageUrl = card.backImage
            ? await azureBlobService.getSasUrl('card-images', card.backImage).catch(() => null)
            : null;
          const frontAudioUrl = card.frontAudio
            ? await azureBlobService.getSasUrl('card-audio', card.frontAudio).catch(() => null)
            : null;
          const backAudioUrl = card.backAudio
            ? await azureBlobService.getSasUrl('card-audio', card.backAudio).catch(() => null)
            : null;

          return { ...card, frontImageUrl, backImageUrl, frontAudioUrl, backAudioUrl };
        })
      );

      setDeck(deckData);
      setCards(cardsWithUrls);

      // Start study session
      const session = await studySessionService.startSession(Number(deckId));
      setSessionId(session.sessionId);
    } catch (error) {
      console.error('Error initializing session:', error);
      showError(t('common:toast.error'), t('quickReview.error'));
      navigate(`/decks/${deckId}/cards`);
    } finally {
      setLoading(false);
    }
  };

  const checkAnswer = (answer: string, correctAnswer: string): boolean => {
    const normalize = (str: string) =>
      str
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]/g, '');

    return normalize(answer) === normalize(correctAnswer);
  };

  const handleRevealAnswer = () => {
    const isCorrect = checkAnswer(userAnswer, cards[currentIndex].backText);
    setIsAnswerRevealed(true);
    setIsCorrectOverride(isCorrect);
  };

  const recordCardInteraction = async (isCorrect: boolean) => {
    if (!sessionId || !deckId) return;

    const currentCard = cards[currentIndex];
    const responseTime = Date.now() - cardStartTime;

    const requestData = {
      Timestamp: new Date().toISOString(),
      IsCorrect: isCorrect,
      ResponseTimeMs: responseTime,
      StudyMode: StudyMode.SPACED,
    };

    console.log('Recording interaction:', {
      sessionId,
      deckId: Number(deckId),
      cardId: currentCard.cardId,
      requestData,
    });

    try {
      await cardInteractionService.recordInteraction(
        sessionId,
        Number(deckId),
        currentCard.cardId,
        requestData
      );
    } catch (error: any) {
      console.error('Error recording card interaction:', error);
      console.error('Request was:', requestData);
      if (error.response) {
        console.error('Backend response:', error.response.data);
        console.error('Status:', error.response.status);
      }
    }
  };

  const handleNext = async () => {
    setIsProcessingNext(true);
    try {
      const finalCorrectness = isCorrectOverride ?? false;

      // Record interaction before moving to next card
      await recordCardInteraction(finalCorrectness);

      const newCardsReviewed = cardsReviewed + 1;
      const newCorrectAnswers = finalCorrectness ? correctAnswers + 1 : correctAnswers;

      setCardsReviewed(newCardsReviewed);
      if (finalCorrectness) {
        setCorrectAnswers(newCorrectAnswers);
      }

      if (currentIndex < cards.length - 1) {
        setCurrentIndex(currentIndex + 1);
        setUserAnswer('');
        setIsAnswerRevealed(false);
        setIsCorrectOverride(null);
      } else {
        handleEndSession(newCardsReviewed, newCorrectAnswers);
      }
    } finally {
      setIsProcessingNext(false);
    }
  };

  const handleEndSession = async (finalCardsReviewed?: number, finalCorrectAnswers?: number) => {
    if (!sessionId) return;

    try {
      await studySessionService.endSession(sessionId, {
        totalCardsReviewed: finalCardsReviewed ?? cardsReviewed,
        correctAnswers: finalCorrectAnswers ?? correctAnswers,
      });
      navigate(`/decks/${deckId}/cards`);
    } catch (error) {
      console.error('Error ending session:', error);
      navigate(`/decks/${deckId}/cards`);
    }
  };

  const handleExit = () => {
    setShowExitModal(true);
  };

  const confirmExit = async () => {
    if (sessionId) {
      try {
        await studySessionService.endSession(sessionId, {
          totalCardsReviewed: cardsReviewed,
          correctAnswers: correctAnswers,
        });
      } catch (error) {
        console.error('Error ending session:', error);
      }
    }
    navigate(`/decks/${deckId}/cards`);
  };

  const handlePlayAudio = (side: 'front' | 'back', e?: React.MouseEvent) => {
    if (e) e.stopPropagation();

    const currentCard = cards[currentIndex];
    const audioUrl = side === 'front' ? currentCard.frontAudioUrl : currentCard.backAudioUrl;
    const text = side === 'front' ? currentCard.frontText : currentCard.backText;

    if (audioUrl) {
      const audio = new Audio(audioUrl);
      audio.play().catch((err) => console.error('Failed to play audio:', err));
    } else if (deck && currentCard.hasVoiceAssistant && text) {
      speakText(text, deck.language);
    }
  };

  const speakText = (text: string, deckLanguage: string) => {
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = getLanguageCode(deckLanguage);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    utterance.volume = 1.0;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  };

  const shouldShowAudioButton = (side: 'front' | 'back'): boolean => {
    const currentCard = cards[currentIndex];
    if (!currentCard) return false;

    if (side === 'front') {
      return !!(currentCard.frontAudioUrl || currentCard.hasVoiceAssistant);
    } else {
      return !!(currentCard.backAudioUrl || currentCard.hasVoiceAssistant);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background-app-light dark:bg-background-app-dark">
        <div className="text-center">
          <div className="w-12 h-12 mx-auto mb-4 border-b-2 rounded-full animate-spin border-cyan-500"></div>
          <p className="text-gray-600 dark:text-gray-400">{t('common:app.loading')}</p>
        </div>
      </div>
    );
  }

  if (!deck || cards.length === 0) {
    return null;
  }

  const currentCard = cards[currentIndex];
  const progress = (cardsReviewed / cards.length) * 100;

  return (
    <div className="flex min-h-screen bg-background-app-light dark:bg-background-app-dark">
      <main className="flex-1 w-full">
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
                <div className="flex gap-2 mt-1">
                  <Badge color="success" icon={FaRepeat}>
                    {t('longTerm.mode')}
                  </Badge>
                  <Badge color="cyan" icon={HiPlay}>
                    {t('longTerm.writeMode')}
                  </Badge>
                </div>
              </div>
            </div>
          </div>

          {/* Progress */}
          <div className="mb-6">
            <div className="flex justify-between mb-2 text-sm text-gray-600 dark:text-gray-400">
              <span>{t('quickReview.progress')}</span>
              <span>
                {cardsReviewed} / {cards.length}
              </span>
            </div>
            <Progress progress={progress} color="green" size="lg" />
          </div>

          {/* Card */}
          <div className="mb-6">
            <div className="relative p-8 bg-background-surface-light border-2 border-gray-200 shadow-xl dark:bg-background-surface-dark rounded-2xl dark:border-gray-700">
              {/* Audio button */}
              {shouldShowAudioButton('front') && (
                <button
                  onClick={(e) => handlePlayAudio('front', e)}
                  className={`absolute z-10 p-3 text-white transition-colors rounded-full shadow-lg top-4 right-4 ${
                    isSpeaking ? 'bg-cyan-600' : 'bg-cyan-500 hover:bg-cyan-600'
                  }`}>
                  <HiVolumeUp className={`w-5 h-5 ${isSpeaking ? 'animate-pulse' : ''}`} />
                </button>
              )}

              <div className="mb-4 text-sm font-semibold tracking-wide uppercase text-cyan-500">
                {t('flashcardModal.front')}
              </div>

              {/* Front Image */}
              {currentCard.frontImageUrl && (
                <div className="flex justify-center w-full mb-4">
                  <img
                    src={currentCard.frontImageUrl}
                    alt="Front"
                    className="object-contain max-w-full rounded-lg max-h-40"
                  />
                </div>
              )}

              {/* Question */}
              <p className="mb-6 text-2xl font-bold text-center text-gray-900 dark:text-white">
                {currentCard.frontText}
              </p>

              {/* Answer Input */}
              {!isAnswerRevealed ? (
                <div className="space-y-4">
                  <TextInput
                    value={userAnswer}
                    onChange={(e) => setUserAnswer(e.target.value)}
                    placeholder={t('longTerm.typeAnswer')}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter' && userAnswer.trim()) {
                        handleRevealAnswer();
                      }
                    }}
                    autoFocus
                    className="w-full"
                  />
                  <Button
                    className="w-full bg-cyan-500 hover:bg-cyan-600"
                    onClick={handleRevealAnswer}
                    disabled={!userAnswer.trim()}>
                    {t('longTerm.checkAnswer')}
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Correct Answer */}
                  <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-700">
                    <p className="mb-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
                      {t('longTerm.correctAnswer')}:
                    </p>
                    <p className="text-lg font-bold text-gray-900 dark:text-white">
                      {currentCard.backText}
                    </p>
                    {currentCard.backImageUrl && (
                      <img
                        src={currentCard.backImageUrl}
                        alt="Back"
                        className="object-contain max-w-full mt-4 rounded-lg max-h-40"
                      />
                    )}
                  </div>

                  {/* Your Answer */}
                  <div className="p-4 border-2 rounded-lg border-gray-300 dark:border-gray-600">
                    <p className="mb-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
                      {t('longTerm.yourAnswer')}:
                    </p>
                    <p className="text-lg text-gray-900 dark:text-white">{userAnswer}</p>
                  </div>

                  {/* Override Buttons */}
                  <div className="flex gap-3">
                    <Button
                      size="lg"
                      className={`flex-1 font-semibold border-2 transition-all ${
                        isCorrectOverride === false
                          ? '!bg-red-600 !border-red-600 !text-white hover:!bg-red-700 hover:!border-red-700'
                          : '!bg-transparent !border-red-600 !text-red-600 hover:!bg-red-50 dark:!text-red-400 dark:!border-red-400 dark:hover:!bg-red-950'
                      }`}
                      onClick={() => setIsCorrectOverride(false)}>
                      <HiX className="w-5 h-5 mr-2" />
                      {t('longTerm.markIncorrect')}
                    </Button>
                    <Button
                      size="lg"
                      className={`flex-1 font-semibold border-2 transition-all ${
                        isCorrectOverride === true
                          ? '!bg-green-600 !border-green-600 !text-white hover:!bg-green-700 hover:!border-green-700'
                          : '!bg-transparent !border-green-600 !text-green-600 hover:!bg-green-50 dark:!text-green-400 dark:!border-green-400 dark:hover:!bg-green-950'
                      }`}
                      onClick={() => setIsCorrectOverride(true)}>
                      <HiCheck className="w-5 h-5 mr-2" />
                      {t('longTerm.markCorrect')}
                    </Button>
                  </div>

                  {/* Next Button */}
                  <Button
                    className="w-full bg-cyan-500 hover:bg-cyan-600"
                    onClick={handleNext}
                    disabled={isProcessingNext}>
                    {isProcessingNext ? (
                      <>
                        <Spinner size="sm" className="mr-2" />
                        {t('common:app.loading')}...
                      </>
                    ) : (
                      currentIndex === cards.length - 1
                        ? t('common:actions.finish')
                        : t('quickReview.next')
                    )}
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Stats */}
          <div className="p-4 rounded-lg bg-background-subtle-light dark:bg-background-subtle-dark">
            <div className="flex justify-around text-center">
              <div>
                <p className="text-2xl font-bold text-green-500">{correctAnswers}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">{t('longTerm.correct')}</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-red-500">{cardsReviewed - correctAnswers}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">{t('longTerm.incorrect')}</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-cyan-500">
                  {cardsReviewed > 0 ? Math.round((correctAnswers / cardsReviewed) * 100) : 0}%
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">{t('longTerm.accuracy')}</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Exit Confirmation Modal */}
      <ConfirmationModal
        show={showExitModal}
        title={t('common:actions.confirm')}
        message={t('quickReview.exitConfirm')}
        onConfirm={confirmExit}
        onCancel={() => setShowExitModal(false)}
      />
    </div>
  );
}

export default LongTermReview;