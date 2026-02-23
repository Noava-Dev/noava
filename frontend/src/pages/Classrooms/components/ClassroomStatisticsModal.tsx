import { Modal, ModalHeader, ModalBody, Badge } from 'flowbite-react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { LuBrain, LuTarget, LuClock, LuTrendingUp } from 'react-icons/lu';
import { HiChartBar } from 'react-icons/hi';
import { ClassroomStatistics } from '../../../models/Statistics';
import EmptyState from '../../../shared/components/EmptyState';
import { useStatisticsService } from '../../../services/StatisticsService';
import { ClassroomResponse } from '../../../models/Classroom';

interface ClassroomStatisticsModalProps {
  show: boolean;
  onClose: () => void;
  classroom: ClassroomResponse | null;
}

function ClassroomStatisticsModal({
  show,
  onClose,
  classroom,
}: ClassroomStatisticsModalProps) {
  const { t } = useTranslation(['classroom', 'dashboard']);
  const statisticsService = useStatisticsService();
  const [statistics, setStatistics] = useState<ClassroomStatistics | null>(
    null
  );
  const [loading, setLoading] = useState(false);
  const [hasData, setHasData] = useState(true);

  useEffect(() => {
    if (show && classroom) {
      fetchStatistics();
    }
  }, [show, classroom]);

  const fetchStatistics = async () => {
    if (!classroom) return;

    try {
      setLoading(true);
      const data = await statisticsService.getClassroomStatistics(
        classroom?.id
      );

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

  const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);

    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  const StatCard = ({
    icon: Icon,
    label,
    value,
    color = 'text-primary-500',
  }: {
    icon: any;
    label: string;
    value: string | number;
    color?: string;
  }) => (
    <div className="p-4 rounded-lg bg-background-subtle-light dark:bg-background-subtle-dark">
      <div className="flex items-center gap-3">
        <div
          className={`p-2 rounded-lg bg-background-surface-light dark:bg-background-surface-dark ${color}`}>
          <Icon className="w-5 h-5" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm truncate text-text-muted-light dark:text-text-muted-dark">
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
    <Modal show={show} onClose={onClose} size="2xl" dismissible>
      <ModalHeader>
        <div className="flex items-center gap-3">
          <HiChartBar className="w-6 h-6 text-primary-500" />
          <div>
            <h3 className="text-xl font-bold">
              {t('classrooms:analytics.title')}
            </h3>
            {classroom && (
              <p className="text-sm text-text-muted-light dark:text-text-muted-dark">
                {classroom.name}
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
              {t('classrooms:analytics.noData.title')}
            </h4>
            <p className="text-text-muted-light dark:text-text-muted-dark">
              {t('classrooms:analytics.noData.description')}
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
                value={`${Math.round((statistics.correctCards / statistics.cardsReviewed) * 100)}%`}
                color="text-green-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <StatCard
                icon={LuClock}
                label={t('classrooms:analytics.timeSpent')}
                value={formatTime(statistics.timeSpentSeconds)}
                color="text-purple-500"
              />
              <StatCard
                icon={LuTrendingUp}
                label={t('classrooms:analytics.avgMastery')}
                value={`${statistics.avgMasteryLevel.toFixed(1)}`}
                color="text-yellow-500"
              />
            </div>

            <div className="p-4 space-y-3 rounded-lg bg-background-subtle-light dark:bg-background-subtle-dark">
              <div className="flex items-center justify-between">
                <span className="text-sm text-text-muted-light dark:text-text-muted-dark">
                  {t('classrooms:analytics.correctCards')}
                </span>
                <span className="text-sm font-medium text-text-body-light dark:text-text-body-dark">
                  {statistics.correctCards}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-text-muted-light dark:text-text-muted-dark">
                  {t('classrooms:analytics.activeUsers')}
                </span>
                <span className="text-sm font-medium text-text-body-light dark:text-text-body-dark">
                  {statistics.activeUsersCount}
                </span>
              </div>
            </div>
          </div>
        ) : (
          <EmptyState
            title={t('classrooms:analytics.noData.title')}
            description={t('classrooms:analytics.noData.description')}
            icon={HiChartBar}
          />
        )}
      </ModalBody>
    </Modal>
  );
}

export default ClassroomStatisticsModal;
