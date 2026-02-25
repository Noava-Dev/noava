import { Modal, ModalHeader, ModalBody, Badge } from 'flowbite-react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useStatisticsService } from '../../services/StatisticsService';
import { formatDateToEuropean, formatResponseTime, formatTimeSpent } from '../../services/DateService';
import type { DeckStatistics, InteractionCount } from '../../models/Statistics';
import type { Deck } from '../../models/Deck';
import { LuBrain, LuTarget, LuClock, LuTrendingUp, LuCalendar } from 'react-icons/lu';
import { HiChartBar } from 'react-icons/hi';
import EmptyState from './EmptyState';
import { InteractionHeatmap } from './InteractionHeatmap';

interface DeckStatisticsModalProps {
  show: boolean;
  onClose: () => void;
  deck: Deck | null;
}

function DeckStatisticsModal({
  show,
  onClose,
  deck,
}: DeckStatisticsModalProps) {
  const { t } = useTranslation(['decks', 'dashboard', 'heatmap']);
  const statisticsService = useStatisticsService();
  const [statistics, setStatistics] = useState<DeckStatistics | null>(null);
  const [loading, setLoading] = useState(false);
  const [hasData, setHasData] = useState(true);
  const [interactions, setInteractions] = useState<InteractionCount[]>([]);
  const [interactionsLoading, setInteractionsLoading] = useState(false);

  useEffect(() => {
    if (show && deck) {
      fetchStatistics();
      fetchInteractions();
    }
  }, [show, deck]);

  const fetchStatistics = async () => {
    if (!deck) return;

    try {
      setLoading(true);
      const data = await statisticsService.getDeckStatistics(deck.deckId);
      if (data.cardsReviewed === 0) {
        setHasData(false);
      } else {
        setHasData(true);
        setStatistics(data);
      }
    } catch (error) {
      console.error('Failed to fetch deck statistics:', error);
      setHasData(false);
    } finally {
      setLoading(false);
    }
  };

  const fetchInteractions = async () => {
    if (!deck) return;

    try {
      setInteractionsLoading(true);
      const interactionsData = await statisticsService.getInteractionsForDeck(deck.deckId);
      console.log('Fetched interactions data:', interactionsData);
      setInteractions(interactionsData);
    } catch (error) {
      console.error('Failed to load deck interactions:', error);
      setInteractions([]);
    } finally {
      setInteractionsLoading(false);
    }
  };

  const StatCard = ({
    icon: Icon,
    label,
    value,
    color = 'text-primary-500'
  }: {
    icon: any;
    label: string;
    value: string | number;
    color?: string;
  }) => (
    <div className="p-4 rounded-lg bg-background-subtle-light dark:bg-background-subtle-dark">
      <div className="flex items-center gap-3">
        <div className={`p-2 rounded-lg bg-background-surface-light dark:bg-background-surface-dark ${color}`}>
          <Icon className="w-5 h-5" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm text-text-muted-light dark:text-text-muted-dark truncate">
            {label}
          </p>
          <p className="text-xl font-bold text-text-title-light dark:text-text-title-dark">
            {value}
          </p>
        </div>
      </div>
    </div>
  );

  return (
    <Modal show={show} onClose={onClose} size="3xl" dismissible>
      <ModalHeader>
        <div className="flex items-center gap-3">
          <HiChartBar className="w-6 h-6 text-primary-500" />
          <div>
            <h3 className="text-xl font-bold">{t('decks:analytics.title')}</h3>
            {deck && (
              <p className="text-sm text-text-muted-light dark:text-text-muted-dark">
                {deck.title}
              </p>
            )}
          </div>
        </div>
      </ModalHeader>

      <ModalBody>
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="w-12 h-12 border-b-2 rounded-full animate-spin border-primary-500"></div>
          </div>
        ) : !hasData ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <HiChartBar className="w-16 h-16 mb-4 text-text-muted-light dark:text-text-muted-dark" />
            <h4 className="mb-2 text-lg font-semibold text-text-title-light dark:text-text-title-dark">
              {t('decks:analytics.noData.title')}
            </h4>
            <p className="text-text-muted-light dark:text-text-muted-dark">
              {t('decks:analytics.noData.description')}
            </p>
          </div>
        ) : statistics ? (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <StatCard
                icon={LuBrain}
                label={t('dashboard:statcard.cardsreviewed.title')}
                value={statistics.cardsReviewed}
                color="text-cyan-500"
              />
              <StatCard
                icon={LuTarget}
                label={t('dashboard:statcard.accuracyrate.title')}
                value={`${Math.round(statistics.accuracyRate * 100)}%`}
                color="text-green-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <StatCard
                icon={LuClock}
                label={t('decks:analytics.timeSpent')}
                value={formatTimeSpent(statistics.timeSpentSeconds)}
                color="text-purple-500"
              />
              <StatCard
                icon={LuTrendingUp}
                label={t('decks:analytics.avgMastery')}
                value={`${statistics.avgMasteryLevel.toFixed(1)}`}
                color="text-yellow-500"
              />
            </div>

            <div className="p-4 space-y-3 rounded-lg bg-background-subtle-light dark:bg-background-subtle-dark">
              <div className="flex justify-between items-center">
                <span className="text-sm text-text-muted-light dark:text-text-muted-dark">
                  {t('decks:analytics.correctCards')}
                </span>
                <span className="text-sm font-medium text-text-body-light dark:text-text-body-dark">
                  {statistics.correctCards}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-text-muted-light dark:text-text-muted-dark">
                  {t('decks:analytics.avgResponseTime')}
                </span>
                <Badge color="info" size="sm">
                  {formatResponseTime(statistics.avgResponseTimeMs)}
                </Badge>
              </div>
              {statistics.lastReviewedAt && (
                <div className="flex justify-between items-center">
                  <span className="text-sm text-text-muted-light dark:text-text-muted-dark">
                    {t('dashboard:statcard.lastreview.title')}
                  </span>
                  <span className="text-sm font-medium text-text-body-light dark:text-text-body-dark">
                    {formatDateToEuropean(statistics.lastReviewedAt)}
                  </span>
                </div>
              )}
            </div>

            <div className="hidden md:block">
              <div className="p-4 space-y-3 rounded-lg bg-background-subtle-light dark:bg-background-subtle-dark">
                <div className="flex items-center gap-3 mb-4">
                  <LuCalendar className="w-5 h-5 text-primary-500" />
                  <div>
                    <h3 className="text-base font-bold text-text-title-light dark:text-text-title-dark">
                      {t('decks:analytics.interactionActivity')}
                    </h3>
                    <p className="mt-1 text-sm text-text-muted-light dark:text-text-muted-dark">
                      {t('decks:analytics.interactionSubtitle')}
                    </p>
                  </div>
                </div>
                {interactionsLoading ? (
                  <div className="flex items-center justify-center h-40">
                    <div className="w-8 h-8 border-4 border-gray-200 rounded-full animate-spin border-t-emerald-500 dark:border-gray-700 dark:border-t-emerald-400"></div>
                  </div>
                ) : (
                  <InteractionHeatmap data={interactions} />
                )}
              </div>
            </div>
          </div>
        ) : (
          <EmptyState
            title={t('decks:analytics.noData.title')}
            description={t('decks:analytics.noData.description')}
            icon={HiChartBar}
          />
        )}
      </ModalBody>
    </Modal>
  );
}

export default DeckStatisticsModal;