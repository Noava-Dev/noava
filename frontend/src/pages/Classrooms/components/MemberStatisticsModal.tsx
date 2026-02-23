import { Modal, ModalHeader, ModalBody, Badge, Checkbox, Label, Button } from 'flowbite-react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useStatisticsService } from '../../../services/StatisticsService';
import { formatDateToEuropean, formatResponseTime, formatTimeSpent } from '../../../services/DateService';
import type { DeckStatistics } from '../../../models/Statistics';
import type { ClerkUserResponse } from '../../../models/User';
import type { Deck } from '../../../models/Deck';
import {
  LuBrain,
  LuTarget,
  LuClock,
  LuTrendingUp,
  LuFilter,
  LuChevronDown,
  LuChevronUp
} from 'react-icons/lu';
import { HiChartBar } from 'react-icons/hi';

interface MemberStatisticsModalProps {
  show: boolean;
  onClose: () => void;
  member: ClerkUserResponse | null;
  classroomId: number;
  availableDecks: Deck[];
}

function MemberStatisticsModal({
  show,
  onClose,
  member,
  classroomId,
  availableDecks
}: MemberStatisticsModalProps) {
  const { t } = useTranslation(['classrooms', 'dashboard', 'decks']);
  const statisticsService = useStatisticsService();
  const [statistics, setStatistics] = useState<DeckStatistics | null>(null);
  const [loading, setLoading] = useState(false);
  const [hasData, setHasData] = useState(true);
  const [selectedDeckIds, setSelectedDeckIds] = useState<number[]>([]);
  const [showFilters, setShowFilters] = useState(true);

  useEffect(() => {
    if (show && member && availableDecks.length > 0) {
      // Select all decks by default
      const allDeckIds = availableDecks.map(d => d.deckId);
      setSelectedDeckIds(allDeckIds);
    }
  }, [show, member, availableDecks]);

  useEffect(() => {
    if (show && member && selectedDeckIds.length > 0) {
      fetchStatistics();
    }
  }, [show, member, selectedDeckIds]);

  const fetchStatistics = async () => {
    if (!member || selectedDeckIds.length === 0) return;

    try {
      setLoading(true);
      const data = await statisticsService.getDeckStatisticsByUser(
        selectedDeckIds,
        classroomId,
        member.clerkId
      );

      console.log('Fetched member statistics:', data);

      if (data.cardsReviewed === 0) {
        setHasData(false);
      } else {
        setHasData(true);
        setStatistics(data);
      }
    } catch (error) {
      console.error('Failed to fetch member statistics:', error);
      setHasData(false);
    } finally {
      setLoading(false);
    }
  };

  const handleDeckToggle = (deckId: number) => {
    setSelectedDeckIds(prev => {
      if (prev.includes(deckId)) {
        return prev.filter(id => id !== deckId);
      } else {
        return [...prev, deckId];
      }
    });
  };

  const handleSelectAll = () => {
    const allDeckIds = availableDecks.map(d => d.deckId);
    setSelectedDeckIds(allDeckIds);
  };

  const handleDeselectAll = () => {
    setSelectedDeckIds([]);
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

  const allSelected = selectedDeckIds.length === availableDecks.length;
  const noneSelected = selectedDeckIds.length === 0;

  return (
    <Modal show={show} onClose={onClose} size="3xl" dismissible>
      <ModalHeader>
        <div className="flex items-center gap-3">
          <HiChartBar className="w-6 h-6 text-primary-500" />
          <div>
            <h3 className="text-xl font-bold">
              {t('classrooms:members.statistics.title')}
            </h3>
            {member && (
              <p className="text-sm text-text-muted-light dark:text-text-muted-dark">
                {member.firstName} {member.lastName}
              </p>
            )}
          </div>
        </div>
      </ModalHeader>

      <ModalBody>
        <div className="space-y-4">
          {/* Deck Filter Section */}
          <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
            <div className="bg-gray-100 dark:bg-gray-800 p-4">
              <div className="flex items-center justify-between">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="flex border border-gray-300 dark:border-gray-600 items-center gap-2 text-base font-semibold text-text-title-light dark:text-text-title-dark hover:text-primary-600 dark:bg-gray-800 dark:hover:text-primary-400 transition-colors group">
                  <LuFilter className="w-5 h-5 text-primary-600 dark:text-white" />
                  <span className="text-primary-600 dark:text-white">
                    {t('classrooms:members.statistics.filterDecks')}
                  </span>
                  {showFilters ? (
                    <LuChevronUp className="w-4 h-4 transition-transform group-hover:translate-y-[-2px] text-primary-600 dark:text-white" />
                  ) : (
                    <LuChevronDown className="w-4 h-4 transition-transform group-hover:translate-y-[2px] text-primary-600 dark:text-white" />
                  )}
                </button>
                <div className="flex items-center gap-2">
                  <Badge color={noneSelected ? 'failure' : allSelected ? 'success' : 'info'} size="sm" className="px-3 py-1">
                    {selectedDeckIds.length} / {availableDecks.length}
                  </Badge>
                </div>
              </div>
            </div>

            {showFilters && (
              <div className="p-4 bg-white dark:bg-gray-800 ">
                <div className="flex gap-2 mb-4">
                  <Button
                    size="sm"
                    color="blue"
                    onClick={handleSelectAll}
                    disabled={allSelected}
                    className="flex-1">
                    {t('common:actions.selectAll')}
                  </Button>
                  <Button
                    size="sm"
                    color="gray"
                    onClick={handleDeselectAll}
                    disabled={noneSelected}
                    className="flex-1">
                    {t('common:actions.deselectAll')}
                  </Button>
                </div>

                <div className="space-y-2 max-h-64 overflow-y-auto pr-2">
                  {availableDecks.map(deck => {
                    const isSelected = selectedDeckIds.includes(deck.deckId);
                    return (
                      <div
                        key={deck.deckId}
                        onClick={() => handleDeckToggle(deck.deckId)}
                        className={`flex items-center gap-3 p-3 rounded-lg border-2 transition-all cursor-pointer ${
                          isSelected
                            ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20 shadow-sm'
                            : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700/50'
                        }`}>
                        <Checkbox
                          id={`deck-${deck.deckId}`}
                          checked={isSelected}
                          onChange={() => handleDeckToggle(deck.deckId)}
                          className="pointer-events-none"
                        />
                        <Label
                          htmlFor={`deck-${deck.deckId}`}
                          className="flex-1 cursor-pointer font-medium text-sm">
                          <div className="flex items-center justify-between">
                            <span className={isSelected ? 'text-primary-700 dark:text-primary-300' : ''}>
                              {deck.title}
                            </span>
                          </div>
                        </Label>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Statistics Section */}
          {noneSelected ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <LuFilter className="w-16 h-16 mb-4 text-text-muted-light dark:text-text-muted-dark" />
              <h4 className="mb-2 text-lg font-semibold text-text-title-light dark:text-text-title-dark">
                {t('classrooms:members.statistics.noDeckSelected.title')}
              </h4>
              <p className="text-text-muted-light dark:text-text-muted-dark">
                {t('classrooms:members.statistics.noDeckSelected.description')}
              </p>
            </div>
          ) : loading ? (
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
                {t('classrooms:members.statistics.noData.description')}
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
            </div>
          ) : null}
        </div>
      </ModalBody>
    </Modal>
  );
}

export default MemberStatisticsModal;
