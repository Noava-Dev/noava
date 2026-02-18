using noava.Models;

namespace noava.Data.Seeders
{
    public class FAQSeeder
    {
        public static void SeedOrUpdateFAQs(NoavaDbContext context)
        {
            var faqs = new List<FAQ>
            {
                new FAQ
                {
                    FaqKey = "what_is_noava",
                    Question = "What is Noava?",
                    Answer = "Noava is a modern flashcard platform designed for schools. We aim to make classroom and student management simple for teachers, while also providing all users with a platform to create and review flashcards for both short-term and long-term retention."
                },
                new FAQ
                {
                    FaqKey = "how_to_create_account",
                    Question = "How do I create an account?",
                    Answer = "You can create an account by visiting our homepage and clicking 'Register'."
                },
                new FAQ
                {
                    FaqKey = "forgot_password",
                    Question = "I forgot my password. What should I do?",
                    Answer = "If you forgot your password, go to the login page, enter your email or username, then click 'Forgot password?'. You will receive instructions to reset your password."
                },
                new FAQ
                {
                    FaqKey = "can_i_cancel_anytime",
                    Question = "Can I cancel anytime?",
                    Answer = "Yes, you can cancel your subscription at any time without any penalties or hidden fees. Your data will remain accessible for 30 days after cancellation."
                },
                new FAQ
                {
                    FaqKey = "update_profile_information",
                    Question = "How do I update my profile information?",
                    Answer = "To update your profile information, log in and click your profile icon anywhere on the website. A popup will appear where you can manage your account details, such as your name, email, and password."
                },
                new FAQ
                {
                    FaqKey = "how_contact_support",
                    Question = "How can I contact support?",
                    Answer = "You can contact our support team by using the contact form on our website or by sending an email to our support address. We’ll get back to you as soon as possible."
                },
                new FAQ
                {
                    FaqKey = "terms_of_service_privacy_policy",
                    Question = "What are your terms of service / privacy policy?",
                    Answer = "You can read our Terms of Service on our website. They explain the rules and guidelines for using Noava. Our Privacy Policy explains how we collect, use, and protect your information. You can read it here Privacy Policy."
                },
                new FAQ
                {
                    FaqKey = "personal_information_safe",
                    Question = "Is my personal information safe?",
                    Answer = "Yes. Your personal information is stored securely and handled according to our Privacy Policy. We never share your data with third parties without your consent and use industry-standard measures to protect your account."
                },
                new FAQ
                {
                    FaqKey = "use_cookies",
                    Question = "Do you use cookies?",
                    Answer = "No, we do not use cookies."
                },
                new FAQ
                {
                    FaqKey = "access_mobile",
                    Question = "Can I access this website on mobile devices?",
                    Answer = "Yes, Noava is fully accessible on mobile devices, with a responsive design that works on both phones and tablets."
                },
                new FAQ
                {
                    FaqKey = "free_to_use",
                    Question = "Is this website free to use? Are there paid features?",
                    Answer = "Noava is free for everyone to use. For schools or organizations that want access to advanced classroom features and schools, we offer custom paid plans."
                },
                new FAQ
                {
                    FaqKey = "support_multiple_languages",
                    Question = "Do you support multiple languages?",
                    Answer = "Yes, Noava supports multiple languages. We also plan to allow users to contribute translations to help improve the platform for everyone."
                },
                new FAQ
                {
                    FaqKey = "how_to_create_new_deck",
                    Question = "How do I create a new deck or set of flashcards?",
                    Answer = "After logging in, go to the 'Decks' page and click 'Create Deck' to start adding flashcards. For detailed instructions, see our documentation."
                },
                new FAQ
                {
                    FaqKey = "import_flashcards",
                    Question = "Can I import flashcards from other tools like Quizlet?",
                    Answer = "Yes, you can import flashcards from supported platforms such as Quizlet using our import feature. Detailed steps are available in our documentation."
                },
                new FAQ
                {
                    FaqKey = "adaptive_learning_spaced_repetition",
                    Question = "How does the adaptive learning / spaced repetition work?",
                    Answer = "Noava uses an algorithm inspired by the Leitner-Box method. Cards are scheduled for review based on your performance to optimize long-term retention. We also plan to add additional algorithms to further improve long-term learning in the future."
                },
                new FAQ
                {
                    FaqKey = "share_decks",
                    Question = "Can I share decks with others?",
                    Answer = "Yes, you can share decks publicly or with specific users within the platform."
                },
                new FAQ
                {
                    FaqKey = "track_student_progress",
                    Question = "How can teachers track student progress?",
                    Answer = "Teachers can view analytics and progress reports for their classrooms and decks, showing how students are performing."
                },
                new FAQ
                {
                    FaqKey = "offline_access",
                    Question = "Is Noava available offline?",
                    Answer = "Noava requires an internet connection to reach your data."
                },
                new FAQ
                {
                    FaqKey = "copy_deck",
                    Question = "Can I copy someone else’s deck into my own collection?",
                    Answer = "Yes, you can duplicate a deck to your own account. This allows you to make changes without affecting the original."
                },
                new FAQ
                {
                    FaqKey = "data_sync",
                    Question = "Is my data synced across devices?",
                    Answer = "Yes, your decks and progress are synced across all devices when you are logged in."
                }
            };

            var existingFaqs = context.FAQs.ToDictionary(f => f.FaqKey, f => f);


            foreach (var faq in faqs)
            {
                if (existingFaqs.TryGetValue(faq.FaqKey, out var existingFaq))
                {
                    existingFaq.Question = faq.Question;
                    existingFaq.Answer = faq.Answer;
                }
                else
                {
                    context.FAQs.Add(faq);
                }
            }

            context.SaveChanges();
        }
    }
}
