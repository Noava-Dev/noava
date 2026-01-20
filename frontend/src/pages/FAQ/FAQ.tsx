import { Accordion, AccordionContent, AccordionPanel, AccordionTitle } from "flowbite-react";
import { useState, useEffect } from "react";
import Searchbar from "../../shared/components/Searchbar";
import type { FAQ } from "../../models/FAQ";
import { faqService } from "../../services/FAQService";

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
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">Loading FAQs...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <p className="text-red-500 text-lg">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-4 text-cyan-600 hover:underline"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Frequently Asked Questions</h1>
      
      <Searchbar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      
      <Accordion className="mt-8">
        {filteredFaqs.length > 0 ? (
          filteredFaqs.map((faq) => (
            <AccordionPanel key={faq.id}>
              <AccordionTitle>{faq.question}</AccordionTitle>
              <AccordionContent>
                <p className="text-gray-500 dark:text-gray-400">
                  {faq.answer}
                </p>
              </AccordionContent>
            </AccordionPanel>
          ))
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg dark:text-gray-400">
              No results found for "<span className="font-semibold">{searchTerm}</span>"
            </p>
            <button 
              onClick={() => setSearchTerm('')}
              className="mt-4 text-cyan-600 hover:text-cyan-700 dark:text-cyan-500 underline"
            >
              Clear search
            </button>
          </div>
        )}
      </Accordion>
    </div>
  );
}

export default FAQPage;