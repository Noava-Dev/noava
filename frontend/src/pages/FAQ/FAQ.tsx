import {
  Accordion,
  AccordionContent,
  AccordionPanel,
  AccordionTitle,
} from 'flowbite-react';
import { useState, useEffect } from 'react';
import Searchbar from '../../shared/components/Searchbar';
import type { FAQ } from '../../models/FAQ';
import { useFaqService } from '../../services/FAQService';
import Header from '../../shared/components/navigation/Header';
import PageHeader from '../../shared/components/PageHeader';
import NoavaFooter from '../../shared/components/navigation/NoavaFooter';
import Loading from '../../shared/components/loading/Loading';
import { useTranslation } from 'react-i18next';

function FAQPage() {
  const { t } = useTranslation('faq');
  const [searchTerm, setSearchTerm] = useState('');
  const [allFaqs, setAllFaqs] = useState<FAQ[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { getAll } = useFaqService();

  useEffect(() => {
    const fetchFaqs = async () => {
      try {
        setLoading(true);
        const data = await getAll();
        setAllFaqs(data);
        setError(null);
      } catch (err) {
        setError(t('error'));
        console.error('Error fetching FAQs:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchFaqs();
  }, [t]);

  const getTranslatedQuestion = (faq: FAQ): string => {
    if (faq.faqKey && t(`faq.${faq.faqKey}.question`, { defaultValue: '' })) {
      return t(`faq.${faq.faqKey}.question`, { defaultValue: faq.question });
    }
    return faq.question;
  };

  const getTranslatedAnswer = (faq: FAQ): string => {
    if (faq.faqKey && t(`faq.${faq.faqKey}.answer`, { defaultValue: '' })) {
      return t(`faq.${faq.faqKey}.answer`, { defaultValue: faq.answer });
    }
    return faq.answer;
  };

  const filteredFaqs = allFaqs.filter((faq) => {
    const question = getTranslatedQuestion(faq);
    const answer = getTranslatedAnswer(faq);
    return (
      question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      answer.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  if (loading) {
    return (
      <>
        <Header />
        <PageHeader>
          <div className="text-center">
            <h1 className="mb-4 text-4xl font-bold text-text-title-light md:text-5xl dark:text-text-title-dark">
              {t('title')}
            </h1>
            <p className="text-lg text-text-body-light dark:text-text-body-dark">
              {t('description')}
            </p>
          </div>
        </PageHeader>
        <div className="min-h-screen bg-background-app-light dark:bg-background-app-dark">
          <div className="container px-4 py-8 mx-auto">
            <div className="py-12">
              <Loading size="xl" color="info" center />
            </div>
          </div>
        </div>
        <NoavaFooter />
      </>
    );
  }

  // Error state
  if (error) {
    return (
      <>
        <Header />
        <PageHeader>
          <div className="text-center">
            <h1 className="mb-4 text-4xl font-bold text-text-title-light md:text-5xl dark:text-text-title-dark">
              {t('title')}
            </h1>
            <p className="text-lg text-text-body-light dark:text-text-body-dark">
              {t('description')}
            </p>
          </div>
        </PageHeader>
        <div className="min-h-screen bg-background-app-light dark:bg-background-app-dark">
          <div className="container px-4 py-8 mx-auto">
            <div className="py-12 text-center">
              <p className="mb-4 text-lg text-red-500 dark:text-red-400">
                {error}
              </p>
              <button
                onClick={() => window.location.reload()}
                className="px-6 py-3 text-white transition-colors rounded-lg shadow-md bg-primary-500 hover:bg-primary-600 hover:shadow-lg">
                Retry
              </button>
            </div>
          </div>
        </div>
        <NoavaFooter />
      </>
    );
  }

  return (
    <>
      <Header />

      {/* PageHeader*/}
      <PageHeader>
        <div className="mb-8 text-center">
          <h1 className="mb-6 text-4xl font-bold text-text-title-light md:text-5xl dark:text-text-title-dark">
            {t('title')}
          </h1>
          <p className="text-lg text-text-body-light dark:text-text-body-dark">
            {t('description')}
          </p>
        </div>

        {/* Searchbar */}
        <div className="max-w-md mx-auto mb-4">
          <Searchbar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        </div>

        {/* Results count */}
        {searchTerm && !loading && (
          <div className="text-center">
            <p className="inline-block px-4 py-2 text-sm rounded-full text-text-body-light dark:text-text-body-dark bg-primary-100 dark:bg-primary-900/40">
              {t('results.showing')}{' '}
              <span className="font-semibold">{filteredFaqs.length}</span>{' '}
              {t('results.of')}{' '}
              <span className="font-semibold">{allFaqs.length}</span>{' '}
              {t('results.results')}
            </p>
          </div>
        )}
      </PageHeader>

      {/* Content Section */}
      <section className="min-h-screen py-8 bg-background-app-light dark:bg-background-app-dark">
        <div className="container max-w-4xl px-4 mx-auto">
          {/* Loading State */}
          {loading && (
            <div className="py-12 text-center">
              <div className="inline-block w-12 h-12 mb-4 border-b-4 rounded-full animate-spin border-primary-500"></div>
              <p className="text-lg text-text-body-light dark:text-text-body-dark">
                {t('loading')}
              </p>
            </div>
          )}

          {/* Error State */}
          {error && !loading && (
            <div className="py-12 text-center">
              <p className="mb-4 text-lg text-red-500 dark:text-red-400">
                {error}
              </p>
            </div>
          )}

          {/* FAQ Accordion */}
          {!loading && !error && (
            <div className="space-y-3">
              {filteredFaqs.length > 0 ? (
                filteredFaqs.map((faq, index) => (
                  <div
                    key={faq.id}
                    className="opacity-0 animate-slide-in"
                    style={{
                      animationDelay: `${index * 80}ms`,
                      animationFillMode: 'forwards',
                    }}>
                    <Accordion collapseAll className="border-0">
                      <AccordionPanel className="overflow-hidden transition-all duration-300 rounded-lg shadow-sm hover:shadow-md">
                        <AccordionTitle className="px-5 py-4 transition-colors duration-200 border border-border hover:border-border bg-background-surface-light dark:bg-background-surface-dark hover:bg-background-app-light dark:hover:bg-background-app-dark dark:border-border-dark focus:outline-none focus:ring-0">
                          <div className="flex items-center justify-between w-full">
                            <span className="pr-4 text-lg font-semibold text-text-title-light dark:text-text-title-dark">
                              {getTranslatedQuestion(faq)}
                            </span>
                          </div>
                        </AccordionTitle>
                        <AccordionContent className="px-5 py-4 bg-background-surface-light dark:bg-background-surface-dark">
                          <p className="leading-relaxed text-text-body-light dark:text-text-body-dark">
                            {getTranslatedAnswer(faq)}
                          </p>
                        </AccordionContent>
                      </AccordionPanel>
                    </Accordion>
                  </div>
                ))
              ) : (
                <div className="py-16 text-center animate-fade-in">
                  <div className="mb-6">
                    <svg
                      className="w-24 h-24 mx-auto text-gray-400 opacity-50 dark:text-gray-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <p className="mb-2 text-xl font-semibold text-text-title-light dark:text-text-title-dark">
                    {t('empty.title')}
                  </p>
                  <p className="mb-6 text-gray-600 dark:text-gray-400">
                    {t('empty.message')} "
                    <span className="font-semibold">{searchTerm}</span>"
                  </p>
                  <button
                    onClick={() => setSearchTerm('')}
                    className="bg-primary-500 text-white px-6 py-3 rounded-lg hover:bg-primary-600 transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5">
                    {t('empty.cta')}
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Footer CTA */}
          {!loading && !error && filteredFaqs.length > 0 && (
            <div className="p-8 mt-16 text-center border border-border bg-background-surface-light dark:bg-background-surface-dark rounded-2xl dark:border-border-dark">
              <h3 className="mb-2 text-2xl font-bold text-text-title-light dark:text-text-title-dark">
                {t('contact.title')}
              </h3>
              <p className="mb-6 text-text-body-light dark:text-text-body-dark">
                {t('contact.description')}
              </p>
              <button className="bg-primary-500 text-white px-8 py-3 rounded-lg hover:bg-primary-600 transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5">
                {t('contact.cta')}
              </button>
            </div>
          )}
        </div>
      </section>

      <NoavaFooter />
    </>
  );
}

export default FAQPage;
