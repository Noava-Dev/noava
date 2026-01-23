import { Accordion, AccordionContent, AccordionPanel, AccordionTitle } from "flowbite-react";
import { useState, useEffect } from "react";
import Searchbar from "../../shared/components/Searchbar";
import type { FAQ } from "../../models/FAQ";
import { faqService } from "../../services/FAQService";
import Header from "../Home/components/Header";
import PageHeader from "../../shared/components/PageHeader";
import NoavaFooter from "../../shared/components/NoavaFooter";
import Loading from "../../shared/components/Loading";
import { useTranslation } from 'react-i18next';

function FAQPage() {
  const { t } = useTranslation('faq');
  const [searchTerm, setSearchTerm] = useState('');
  const [allFaqs, setAllFaqs] = useState<FAQ[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { getAll } = faqService();

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

  const filteredFaqs = allFaqs.filter(faq => 
    faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <>
        <Header />
        <PageHeader>
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              {t('title')}
            </h1>
            <p className="text-lg text-gray-700 dark:text-gray-300">
              {t('description')}
            </p>
          </div>
        </PageHeader>
        <div className="bg-white dark:bg-gray-900 min-h-screen">
          <div className="container mx-auto px-4 py-8">
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
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              {t('title')}
            </h1>
            <p className="text-lg text-gray-700 dark:text-gray-300">
              {t('description')}
            </p>
          </div>
        </PageHeader>
        <div className="bg-white dark:bg-gray-900 min-h-screen">
          <div className="container mx-auto px-4 py-8">
            <div className="text-center py-12">
              <p className="text-red-500 dark:text-red-400 text-lg mb-4">{error}</p>
              <button 
                onClick={() => window.location.reload()}
                className="bg-primary-500 text-white px-6 py-3 rounded-lg hover:bg-primary-600 transition-colors shadow-md hover:shadow-lg"
              >
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
      
      {/* PageHeader - altijd zichtbaar */}
      <PageHeader>
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            {t('title')}
          </h1>
          <p className="text-lg text-gray-700 dark:text-gray-300">
            {t('description')}
          </p>
        </div>

        {/* Searchbar */}
        <div className="max-w-2xl mx-auto mb-6">
          <Searchbar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        </div>

        {/* Results count - alleen als niet loading */}
        {searchTerm && !loading && (
          <div className="text-center mb-8">
            <p className="text-sm text-gray-600 dark:text-gray-400 bg-primary-100 dark:bg-primary-900/40 inline-block px-4 py-2 rounded-full">
              {t('results.showing')} <span className="font-semibold">{filteredFaqs.length}</span> {t('results.of')} <span className="font-semibold">{allFaqs.length}</span> {t('results.results')}
            </p>
          </div>
        )}
      </PageHeader>

      {/* Content Section */}
      <section className="bg-gray-50 dark:bg-gray-900 py-8 min-h-screen">
        <div className="container mx-auto px-4 max-w-4xl">
          
          {/* Loading State */}
          {loading && (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-4 border-primary-500 mb-4"></div>
              <p className="text-gray-700 dark:text-gray-300 text-lg">{t('loading')}</p>
            </div>
          )}

          {/* Error State */}
          {error && !loading && (
            <div className="text-center py-12">
              <p className="text-red-500 dark:text-red-400 text-lg mb-4">{error}</p>
            </div>
          )}

          {/* FAQ Accordion - alleen als niet loading en geen error */}
          {!loading && !error && (
            <div className="space-y-3">
              {filteredFaqs.length > 0 ? (
                filteredFaqs.map((faq, index) => (
                  <div
                    key={faq.id}
                    className="opacity-0 animate-slide-in"
                    style={{
                      animationDelay: `${index * 80}ms`,
                      animationFillMode: 'forwards'
                    }}
                  >
                    <Accordion collapseAll className="border-0">
                      <AccordionPanel className="bg-primary-100 dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden ">
                        <AccordionTitle className="hover:bg-primary-50 light:bg-primary-50 dark:hover:bg-primary-900/20 transition-colors duration-200 py-4 px-5 border border-gray-200 dark:border-gray-500 ">
                          <div className="flex items-center justify-between w-full">
                            <span className="text-lg font-semibold text-gray-900 dark:text-white pr-4">
                              {faq.question}
                            </span>
                          </div>
                        </AccordionTitle>
                        <AccordionContent className="px-5 py-4 bg-gray-50 dark:bg-gray-700/50">
                          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                            {faq.answer}
                          </p>
                        </AccordionContent>
                      </AccordionPanel>
                    </Accordion>
                  </div>
                ))
              ) : (
                <div className="text-center py-16 animate-fade-in">
                  <div className="mb-6">
                    <svg className="w-24 h-24 text-gray-400 dark:text-gray-500 mx-auto opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <p className="text-gray-900 dark:text-white text-xl font-semibold mb-2">
                    {t('empty.title')}
                  </p>
                  <p className="text-gray-600 dark:text-gray-400 mb-6">
                    {t('empty.message')} "<span className="font-semibold">{searchTerm}</span>"
                  </p>
                  <button 
                    onClick={() => setSearchTerm('')}
                    className="bg-primary-500 text-white px-6 py-3 rounded-lg hover:bg-primary-600 transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                  >
                    {t('empty.cta')}
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Footer CTA - alleen als niet loading en geen error */}
          {!loading && !error && filteredFaqs.length > 0 && (
            <div className="mt-16 text-center bg-primary-50 dark:bg-primary-900/20 rounded-2xl p-8 border border-gray-200 dark:border-gray-700">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                {t('contact.title')}
              </h3>
              <p className="text-gray-700 dark:text-gray-300 mb-6">
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