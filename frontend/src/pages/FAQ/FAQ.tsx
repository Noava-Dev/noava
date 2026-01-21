import { Accordion, AccordionContent, AccordionPanel, AccordionTitle } from "flowbite-react";
import { useState, useEffect } from "react";
import type { FAQ } from "../../models/FAQ";
import { faqService } from "../../services/FAQService";
import Header from "../Home/components/Header";
import PageHeader from "../../shared/components/PageHeader";

function FAQPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [allFaqs, setAllFaqs] = useState<FAQ[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Haal FAQs op van de backend
  useEffect(() => {
    const fetchFaqs = async () => {
      try {
        setLoading(true);
        const data = await faqService.getAll();
        setAllFaqs(data);
        setError(null);
      } catch (err) {
        setError('Failed to load FAQs. Please try again later.');
        console.error('Error fetching FAQs:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchFaqs();
  }, []);

  const filteredFaqs = allFaqs.filter(faq => 
    faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Loading state
  if (loading) {
    return (
      <>
        <Header />
        <PageHeader
          title="Frequently Asked Questions"
          subtitle="Find answers to common questions about Noava"
        />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-4 border-primary-500 mb-4"></div>
            <p className="text-text-body-light dark:text-text-body-dark text-lg">Loading FAQs...</p>
          </div>
        </div>
      </>
    );
  }

  // Error state
  if (error) {
    return (
      <>
        <Header />
        <PageHeader
          title="Frequently Asked Questions"
          subtitle="Find answers to common questions about Noava"
        />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <p className="text-red-500 text-lg mb-4">{error}</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Header />
      
      {/* PageHeader */}
      <PageHeader
        title="Frequently Asked Questions"
        subtitle="Find answers to common questions about Noava"
        showSearch
        searchPlaceholder="Search FAQs..."
        searchValue={searchTerm}
        onSearchChange={setSearchTerm}
      >
        {/* Results count als children */}
        {searchTerm && (
          <p className="text-sm text-text-muted-light dark:text-text-muted-dark bg-primary-100 dark:bg-primary-900 inline-block px-4 py-2 rounded-full">
            Showing <span className="font-semibold">{filteredFaqs.length}</span> of <span className="font-semibold">{allFaqs.length}</span> results
          </p>
        )}
      </PageHeader>

      {/* Content Section */}
      <section className="container mx-auto px-4 py-8 max-w-4xl">
        
        {/* FAQ Accordion */}
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
                  <AccordionPanel className="bg-background-surface-light dark:bg-background-surface-dark rounded-lg shadow-sm hover:shadow-md transition-all duration-300 border border-border dark:border-border-dark overflow-hidden">
                    <AccordionTitle className="hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-colors duration-200 py-4 px-5">
                      <div className="flex items-center justify-between w-full">
                        <span className="text-lg font-semibold text-text-title-light dark:text-text-title-dark pr-4">
                          {faq.question}
                        </span>
                      </div>
                    </AccordionTitle>
                    <AccordionContent className="px-5 py-4 bg-background-subtle-light dark:bg-background-subtle-dark">
                      <p className="text-text-body-light dark:text-text-body-dark leading-relaxed">
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
                <svg className="w-24 h-24 text-text-muted-light dark:text-text-muted-dark mx-auto opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p className="text-text-title-light dark:text-text-title-dark text-xl font-semibold mb-2">
                No results found
              </p>
              <p className="text-text-muted-light dark:text-text-muted-dark mb-6">
                We couldn't find any FAQs matching "<span className="font-semibold">{searchTerm}</span>"
              </p>
              <button 
                onClick={() => setSearchTerm('')}
                className="bg-primary-500 text-white px-6 py-3 rounded-lg hover:bg-primary-600 transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
              >
                Clear search
              </button>
            </div>
          )}
        </div>

        {/* Footer CTA */}{/* 
        {filteredFaqs.length > 0 && (
          <div className="mt-16 text-center bg-primary-50 dark:bg-primary-900/20 rounded-2xl p-8 border border-border dark:border-border-dark">
            <h3 className="text-2xl font-bold text-text-title-light dark:text-text-title-dark mb-2">
              Still have questions?
            </h3>
            <p className="text-text-body-light dark:text-text-body-dark mb-6">
              Can't find the answer you're looking for? Our team is here to help.
            </p>
            <button className="bg-primary-500 text-white px-8 py-3 rounded-lg hover:bg-primary-600 transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5">
              Contact Support
            </button>
          </div>
        )} */}
      </section>
    </>
  );
}

export default FAQPage;