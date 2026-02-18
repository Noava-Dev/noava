import { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { Button, Progress, Badge, TextInput, Alert } from 'flowbite-react';
import { HiArrowLeft, HiRefresh, HiX, HiVolumeUp, HiCheckCircle, HiXCircle, HiPencil } from 'react-icons/hi';
import { useTranslation } from 'react-i18next';
import { useDeckService } from '../../services/DeckService';
import { useFlashcardService } from '../../services/FlashcardService';
import { useToast } from '../../contexts/ToastContext';
import { useAzureBlobService } from '../../services/AzureBlobService';
import { BulkReviewMode } from '../../models/Flashcard';
import { getLanguageCode } from '../../shared/utils/speechHelpers';
import type { Deck } from '../../models/Deck';
import type { ReviewSession } from '../../models/ReviewSessions';

function WriteReview() {
  const { deckId, classroomId } = useParams<{ deckId?: string; classroomId?: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { t } = useTranslation('flashcards');
  const deckService = useDeckService();
  const flashcardService = useFlashcardService();
  const azureBlobService = useAzureBlobService();
  const { showError } = useToast();

  const [decks, setDecks] = useState<Map<number, Deck>>(new Map());
  const [session, setSession] = useState<ReviewSession | null>(null);
  const [loading, setLoading] = useState(true);
  

  const [frontImageUrl, setFrontImageUrl] = useState<string | null>(null);
  const [backImageUrl, setBackImageUrl] = useState<string | null>(null);
  const [frontAudioUrl, setFrontAudioUrl] = useState<string | null>(null);
  const [backAudioUrl, setBackAudioUrl] = useState<string | null>(null);
  
  const [userAnswer, setUserAnswer] = useState('');
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [isBulkReview, setIsBulkReview] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  useEffect(() => {
    const deckIdsParam = searchParams.get('deckIds');
    const modeParam = searchParams.get('mode');

    if (deckIdsParam) {
      const deckIds = deckIdsParam.split(',').map(Number);
      const mode = modeParam ? Number(modeParam) : BulkReviewMode.ShuffleAll;
      setIsBulkReview(true);
      initializeSession(deckIds, mode);
    } else if (deckId) {
      setIsBulkReview(false);
      initializeSession([Number(deckId)], BulkReviewMode.ShuffleAll);
    }
  }, [deckId, classroomId, searchParams]);

  useEffect(() => {
    return () => {
      window.speechSynthesis.cancel();
    };
  }, [session?.currentIndex]);

  useEffect(() => {
    if (session && session.cards.length > 0) {
      const currentCard = session.cards[session.currentIndex];

      if (currentCard.frontImage) {
        azureBlobService
          .getSasUrl('card-images', currentCard.frontImage)
          .then((url) => setFrontImageUrl(url))
          .catch(() => setFrontImageUrl(null));
      } else {
        setFrontImageUrl(null);
      }

      if (currentCard.backImage) {
        azureBlobService
          .getSasUrl('card-images', currentCard.backImage)
          .then((url) => setBackImageUrl(url))
          .catch(() => setBackImageUrl(null));
      } else {
        setBackImageUrl(null);
      }

      if (currentCard.frontAudio) {
        azureBlobService
          .getSasUrl('card-audio', currentCard.frontAudio)
          .then((url) => setFrontAudioUrl(url))
          .catch(() => setFrontAudioUrl(null));
      } else {
        setFrontAudioUrl(null);
      }

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

  const initializeSession = async (deckIds: number[], mode: BulkReviewMode) => {
    try {
      setLoading(true);

      const isSingleDeck = deckIds.length === 1;

      // Haal kaarten en alle betrokken decks op
      const cardsData = await flashcardService.getBulkReviewCards(deckIds, mode);
      const decksData = await Promise.all(
        deckIds.map(id => deckService.getById(id))
      );

      if (cardsData.length === 0) {
        showError(t('quickReview.error'), t('quickReview.noCards'));
        if (isSingleDeck && deckId) {
          navigate(`/decks/${deckId}/cards`);
        } else if (classroomId) {
          navigate(`/classrooms/${classroomId}`);
        } else {
          navigate('/decks');
        }
        return;
      }

      // Maak een map van deckId -> Deck voor spraak functionaliteit
      const decksMap = new Map<number, Deck>();
      decksData.forEach(deck => {
        if (deck) {
          decksMap.set(deck.deckId, deck);
        }
      });
      setDecks(decksMap);

      setSession({
        deckId: isSingleDeck ? decksData[0]?.deckId : undefined,
        deckTitle: isSingleDeck ? decksData[0]?.title : t('quickReview.bulkTitle'),
        cards: cardsData,
        currentIndex: 0,
        isFlipped: false,
        completedCards: 0,
      });
    } catch (error: any) {
      console.error('Error loading review cards:', error);
      if (error.response?.status === 404 || error.response?.status === 403) {
        navigate('/not-found', { replace: true });
      } else {
        showError(t('quickReview.error'), t('common:toast.error'));
        if (deckIds.length === 1 && deckId) {
          navigate(`/decks/${deckId}/cards`);
        } else if (classroomId) {
          navigate(`/classrooms/${classroomId}`);
        } else {
          navigate('/decks');
        }
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCheckAnswer = () => {
    if (!session) return;

    const currentCard = session.cards[session.currentIndex];
    const correctAnswer = currentCard.backText.toLowerCase().trim();
    const userAnswerNormalized = userAnswer.toLowerCase().trim();

    const isAnswerCorrect = correctAnswer === userAnswerNormalized;

    setIsCorrect(isAnswerCorrect);
    setShowResult(true);
  };

  const handleNext = () => {
    if (!session) return;

    window.speechSynthesis.cancel();
    setIsSpeaking(false);

    setUserAnswer('');
    setShowResult(false);
    setIsCorrect(false);

    if (session.currentIndex < session.cards.length - 1) {
      setSession({
        ...session,
        currentIndex: session.currentIndex + 1,
        completedCards: session.completedCards + 1,
      });
    } else {
      setSession({
        ...session,
        completedCards: session.cards.length,
      });
    }
  };

  // Skip function (shows answer without checking)
  const handleSkip = () => {
    if (!session) return;

    window.speechSynthesis.cancel();
    setIsSpeaking(false);

    // Show result as incorrect (skipped)
    setIsCorrect(false);
    setShowResult(true);
  };

  const handleRestart = () => {
    if (!session) return;

    window.speechSynthesis.cancel();
    setIsSpeaking(false);

    const shuffledCards = [...session.cards].sort(() => Math.random() - 0.5);

    setSession({
      ...session,
      cards: shuffledCards,
      currentIndex: 0,
      completedCards: 0,
    });
    
    setUserAnswer('');
    setShowResult(false);
    setIsCorrect(false);
  };

  const handleExit = () => {
    window.speechSynthesis.cancel();
    setIsSpeaking(false);

    if (isBulkReview && classroomId) {
      navigate(`/classrooms/${classroomId}`);
    } else if (isBulkReview) {
      navigate('/decks');
    } else if (deckId) {
      navigate(`/decks/${deckId}/cards`);
    } else {
      navigate('/decks');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && userAnswer.trim() && !showResult) {
      handleCheckAnswer();
    }
  };

  const handlePlayAudio = (side: 'front' | 'back', e: React.MouseEvent) => {
    e.stopPropagation();

    if (!session) return;

    const currentCard = session.cards[session.currentIndex];
    const deck = decks.get(currentCard.deckId);

    if (side === 'front') {
      if (frontAudioUrl) {
        const audio = new Audio(frontAudioUrl);
        audio.play().catch((err) => console.error('Failed to play audio:', err));
      } else if (deck && currentCard.hasVoiceAssistant && currentCard.frontText) {
        speakText(currentCard.frontText, deck.language);
      }
    } else {
      if (backAudioUrl) {
        const audio = new Audio(backAudioUrl);
        audio.play().catch((err) => console.error('Failed to play audio:', err));
      } else if (deck && currentCard.hasVoiceAssistant && currentCard.backText) {
        speakText(currentCard.backText, deck.language);
      }
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
    utterance.onerror = (event) => {
      console.error('Speech synthesis error:', event);
      setIsSpeaking(false);
    };

    window.speechSynthesis.speak(utterance);
  };

  const shouldShowAudioButton = (side: 'front' | 'back'): boolean => {
    if (!session) return false;

    const currentCard = session.cards[session.currentIndex];

    if (side === 'front') {
      return !!(frontAudioUrl || currentCard.hasVoiceAssistant);
    } else {
      return !!(backAudioUrl || currentCard.hasVoiceAssistant);
    }
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

  if (!session) {
    return null;
  }

  const currentCard = session.cards[session.currentIndex];
  const progress = (session.completedCards / session.cards.length) * 100;
  const isComplete = session.completedCards === session.cards.length;

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="flex-1 w-full">
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
                  {session.deckTitle}
                </h1>
                <div className="flex gap-2 mt-1">
                  <Badge color="info">
                    {isBulkReview ? t('quickReview.bulkMode') : t('quickReview.mode')}
                  </Badge>
                  <Badge color="cyan">
                    <HiPencil className="w-3 h-3 mr-1" />
                    {t('quickReview.writeMode')}
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
                {session.completedCards} / {session.cards.length}
              </span>
            </div>
            <Progress progress={progress} color="cyan" size="lg" />
          </div>

          {/* Content */}
          {!isComplete ? (
            <div className="space-y-6">
              {/* Question Card */}
              <div className="relative flex flex-col items-center justify-center p-8 antialiased bg-white border-2 border-gray-200 shadow-xl h-96 dark:bg-gray-800 rounded-2xl dark:border-gray-700">
                {shouldShowAudioButton('front') && (
                  <button
                    onClick={(e) => handlePlayAudio('front', e)}
                    className={`absolute p-3 text-white transition-colors rounded-full shadow-lg top-4 right-4 ${
                      isSpeaking ? 'bg-cyan-600' : 'bg-cyan-500 hover:bg-cyan-600'
                    }`}
                    title={frontAudioUrl ? t('quickReview.playAudio') : t('quickReview.playVoiceAssistant')}>
                    <HiVolumeUp className={`w-5 h-5 ${isSpeaking ? 'animate-pulse' : ''}`} />
                  </button>
                )}

                <div className="mb-4 text-sm font-semibold tracking-wide uppercase text-cyan-500">
                  {t('quickReview.question')}
                </div>

                {frontImageUrl && (
                  <div className="flex justify-center w-full mb-4">
                    <img
                      src={frontImageUrl}
                      alt="Question"
                      className="object-contain max-w-full rounded-lg max-h-40"
                    />
                  </div>
                )}

                <div className="flex items-center justify-center flex-1 w-full px-4 text-center">
                  <p className="text-2xl font-bold text-gray-900 break-words md:text-3xl dark:text-white">
                    {currentCard.frontText}
                  </p>
                </div>
              </div>

              {/* Answer Section */}
              {!showResult ? (
                <div className="space-y-4">
                  <TextInput
                    type="text"
                    placeholder={t('quickReview.typeYourAnswer')}
                    value={userAnswer}
                    onChange={(e) => setUserAnswer(e.target.value)}
                    onKeyPress={handleKeyPress}
                    sizing="lg"
                    autoFocus
                  />
                  
                  {/*  Check and Skip buttons */}
                  <div className="flex gap-3">
                    <Button
                      size="lg"
                      color="gray"
                      className="flex-1"
                      onClick={handleSkip}>
                      {t('common:actions.skip')}
                    </Button>
                    <Button
                      size="lg"
                      className="flex-1 bg-cyan-500 hover:bg-cyan-600"
                      onClick={handleCheckAnswer}
                      disabled={!userAnswer.trim()}>
                      {t('quickReview.checkAnswer')}
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Result Alert */}
                  <Alert
                    color={isCorrect ? 'success' : 'failure'}
                    icon={isCorrect ? HiCheckCircle : HiXCircle}>
                    <span className="font-medium">
                      {isCorrect ? t('quickReview.correct') : t('quickReview.incorrect')}
                    </span>
                  </Alert>

                  {/* Correct Answer Card */}
                  <div className="relative p-6 antialiased bg-white border-2 border-gray-200 shadow-lg dark:bg-gray-800 rounded-2xl dark:border-gray-700">
                    {shouldShowAudioButton('back') && (
                      <button
                        onClick={(e) => handlePlayAudio('back', e)}
                        className={`absolute p-3 text-white transition-colors rounded-full shadow-lg top-4 right-4 ${
                          isSpeaking ? 'bg-yellow-600' : 'bg-yellow-500 hover:bg-yellow-600'
                        }`}
                        title={backAudioUrl ? t('quickReview.playAudio') : t('quickReview.playVoiceAssistant')}>
                        <HiVolumeUp className={`w-5 h-5 ${isSpeaking ? 'animate-pulse' : ''}`} />
                      </button>
                    )}

                    <div className="mb-3 text-sm font-semibold tracking-wide text-yellow-500 uppercase">
                      {t('quickReview.correctAnswer')}
                    </div>

                    {backImageUrl && (
                      <div className="flex justify-center w-full mb-4">
                        <img
                          src={backImageUrl}
                          alt="Answer"
                          className="object-contain max-w-full rounded-lg max-h-40"
                        />
                      </div>
                    )}

                    <p className="text-xl font-bold text-center text-gray-900 dark:text-white">
                      {currentCard.backText}
                    </p>

                    {currentCard.memo && (
                      <div className="p-3 mt-4 border border-yellow-200 rounded-lg bg-yellow-50 dark:bg-yellow-900/20 dark:border-yellow-800">
                        <p className="text-sm text-yellow-800 dark:text-yellow-200">
                          {currentCard.memo}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Next Button */}
                  <Button
                    size="lg"
                    className="w-full bg-cyan-500 hover:bg-cyan-600"
                    onClick={handleNext}>
                    {session.currentIndex === session.cards.length - 1
                      ? t('common:actions.finish')
                      : t('quickReview.next')}
                  </Button>
                </div>
              )}
            </div>
          ) : (
            /* Complete Screen */
            <div className="py-12 text-center">
              <div className="mb-6">
                <h2 className="mb-2 text-3xl font-bold text-gray-900 dark:text-white">
                  {t('quickReview.complete.title')}
                </h2>
                <p className="text-lg text-gray-600 dark:text-gray-400">
                  {isBulkReview
                    ? t('quickReview.complete.bulkMessage', {
                        count: session.cards.length,
                        deckCount: decks.size,
                      })
                    : t('quickReview.complete.message', {
                        count: session.cards.length,
                      })}
                </p>
              </div>

              <div className="flex justify-center gap-4">
                <Button size="lg" color="gray" onClick={handleExit}>
                  <HiArrowLeft className="w-5 h-5 mr-2" />
                  {isBulkReview && classroomId
                    ? t('quickReview.complete.backToClassroom')
                    : isBulkReview
                    ? t('quickReview.complete.backToDecks')
                    : t('quickReview.complete.backToDeck')}
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
      </div>
    </div>
  );
}

export default WriteReview;