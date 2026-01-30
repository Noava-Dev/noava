import { useTranslation } from 'react-i18next';
import PageHeader from '../../shared/components/PageHeader';
import DashboardStatCard from './components/DashboardStatCard';
import {
  LuBrain,
  LuClock,
  LuLayers,
  LuTarget,
  LuTrendingUp,
} from 'react-icons/lu';
import { Button } from 'flowbite-react';
import { HiChevronRight } from 'react-icons/hi';
import { useNavigate } from 'react-router-dom';
import { useDeckService } from '../../services/DeckService';
import type { Deck } from '../../models/Deck';
import { useEffect, useState } from 'react';
import { useToast } from '../../contexts/ToastContext';
import DeckCard from '../../shared/components/DeckCard';

function Dashboard() {
  const { t } = useTranslation('dashboard');
  const navigate = useNavigate();
  const deckService = useDeckService();
  const [decks, setDecks] = useState<Deck[]>([]);
  const [loading, setLoading] = useState(true);
  const { showSuccess, showError } = useToast();

  useEffect(() => {
    fetchDecks();
  }, []);

  const fetchDecks = async () => {
    try {
      setLoading(true);

      const data = await deckService.getMyDecks(4);

      setDecks(data);
    } catch (error) {
      showError(t('toast.loadError'), t('toast.loadError'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="flex-1 w-full ml-0">
          <PageHeader>
            {/* Hero Section */}
            <div className="pt-4 mb-6 md:mb-8 md:pt-8">
              <div className="flex flex-col gap-4 md:gap-6">
                <div className="space-y-2">
                  <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 md:text-5xl dark:text-white">
                    {t('title')}
                  </h1>
                  <p className="text-base text-gray-500 md:text-xl dark:text-gray-400">
                    {t('subtitle')}
                  </p>
                </div>
              </div>
            </div>
          </PageHeader>

          <section className="min-h-screen py-8 bg-white dark:bg-gray-900 md:py-12">
            <div className="container flex flex-col gap-6 px-4 mx-auto max-w-7xl">
              {/* Stat Cards */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <DashboardStatCard
                  title={t('statcard.cardsreviewed.title')}
                  value="1,247"
                  tooltip={t('statcard.cardsreviewed.tooltip')}
                  icon={LuBrain}
                />
                <DashboardStatCard
                  title={t('statcard.accuracyrate.title')}
                  value="84%"
                  tooltip={t('statcard.accuracyrate.tooltip')}
                  icon={LuTarget}
                />
                <DashboardStatCard
                  title={t('statcard.studytime.title')}
                  value="12,5h"
                  tooltip={t('statcard.studytime.tooltip')}
                  icon={LuClock}
                />
                <DashboardStatCard
                  title={t('statcard.cardsdue.title')}
                  value="45"
                  tooltip={t('statcard.cardsdue.tooltip')}
                  icon={LuTrendingUp}
                />
              </div>

              {/* Your Decks */}
              <div className="w-3/5">
                <div className="flex flex-row items-center justify-between">
                  {/* Header */}
                  <h3 className="text-lg font-semibold">{t('yourDecks')}</h3>
                  <Button
                    color="alternative"
                    className="p-0 text-sm border-0 outline-none text-text-muted-light dark:text-text-muted-dark focus:outline-none active:outline-none focus:ring-0 active:ring-0 hover:text-text-body-light dark:hover:text-text-body-dark"
                    onClick={() => navigate('/decks')}
                    outline>
                    {t('decks.viewAll')}
                    <HiChevronRight className="size-4" />
                  </Button>
                </div>

                {/* Decks (Max 4) */}
                {decks.length > 0 ? (
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 md:gap-6">
                    {decks.map((deck) => (
                      <DeckCard
                        key={deck.deckId}
                        deck={deck}
                        onEdit={() => console.log('onEdit')}
                        onDelete={() => console.log('onDelete')}
                      />
                    ))}
                  </div>
                ) : (
                  // No decks yet
                  <div className="flex flex-col items-center justify-center gap-2 mt-4">
                    <LuLayers className="w-10 h-10 text-gray-400 dark:text-gray-600" />
                    <p className="mb-3 text-xl font-semibold text-gray-700 dark:text-gray-400">
                      {t('decks.empty')}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </section>
        </div>
      </div>
    </>
  );
}

export default Dashboard;
