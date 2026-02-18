using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using noava.Models;

namespace noava.Data.Configurations.FAQs
{
    public class FAQConfiguration : IEntityTypeConfiguration<FAQ>
    {
        public void Configure(EntityTypeBuilder<FAQ> builder)
        {
            builder.HasKey(d => d.Id);
            builder.Property(d => d.Question)
                .IsRequired();
            builder.Property(d => d.Answer)
                .IsRequired();
            builder.Property(d => d.FaqKey)
                .IsRequired();

            // Seed data
            builder.HasData(
                new FAQ
                {
                    Id = 1,
                    FaqKey = "what_is_noava",
                    Question = "What is Noava?",
                    Answer = "Noava is a modern flashcard platform designed for schools. We aim to make classroom and student management simple for teachers, while also providing all users with a platform to create and review flashcards for both short-term and long-term retention."
                },
                new FAQ
                {
                    Id = 2,
                    FaqKey = "how_to_create_account",
                    Question = "How do I create an account?",
                    Answer = "You can create an account by visiting our homepage and clicking 'Register'."
                },
                new FAQ
                {
                    Id = 3,
                    FaqKey = "forgot_password",
                    Question = "I forgot my password. What should I do?",
                    Answer = "If you forgot your password, go to the login page, enter your email or username, then click 'Forgot password?'. You will receive instructions to reset your password."
                },
                new FAQ
                {
                    Id = 4,
                    FaqKey = "can_i_cancel_anytime",
                    Question = "Can I cancel anytime?",
                    Answer = "Yes, you can cancel your subscription at any time without any penalties or hidden fees. Your data will remain accessible for 30 days after cancellation."
                },
                new FAQ
                {
                    Id = 5,
                    FaqKey = "update_profile_information",
                    Question = "How do I update my profile information?",
                    Answer = "To update your profile information, log in and click your profile icon anywhere on the website. A popup will appear where you can manage your account details, such as your name, email, and password."
                },
                new FAQ
                {
                    Id = 6,
                    FaqKey = "how_contact_support",
                    Question = "How can I contact support?",
                    Answer = "You can contact our support team by using the contact form on our website or by sending an email to our support address. We’ll get back to you as soon as possible."
                },
                new FAQ
                {
                    Id = 7,
                    FaqKey = "terms_of_service_privacy_policy",
                    Question = "What are your terms of service / privacy policy?",
                    Answer = "You can read our <a href=\"/terms-of-service\" target=\"_blank\">Terms of Service</a> on our website. They explain the rules and guidelines for using Noava. Our Privacy Policy explains how we collect, use, and protect your information. You can read it here <a href=\"/privacy\" target=\"_blank\">Privacy Policy</a>."
                },
                new FAQ
                {
                    Id = 8,
                    FaqKey = "personal_information_safe",
                    Question = "Is my personal information safe?",
                    Answer = "Yes. Your personal information is stored securely and handled according to our Privacy Policy. We never share your data with third parties without your consent and use industry-standard measures to protect your account."
                }, 
                new FAQ
                {
                    Id = 9,
                    FaqKey = "use_cookies",
                    Question = "Do you use cookies?",
                    Answer = "No, we do not use cookies."
                },
                new FAQ
                {
                    Id = 10,
                    FaqKey = "access_mobile",
                    Question = "Can I access this website on mobile devices?",
                    Answer = "Yes, Noava is fully accessible on mobile devices, with a responsive design that works on both phones and tablets."
                },
                new FAQ
                {
                    Id = 11,
                    FaqKey = "free_to_use",
                    Question = "Is this website free to use? Are there paid features?",
                    Answer = "Noava is free for everyone to use. For schools or organizations that want access to advanced classroom features and schools, we offer custom paid plans."
                },
                new FAQ
                {
                    Id = 12,
                    FaqKey = "support_multiple_languages",
                    Question = "Do you support multiple languages?",
                    Answer = "Yes, Noava supports multiple languages. We also plan to allow users to contribute translations to help improve the platform for everyone."
                }
//                Other questions that can still be added:
//                What is Noava and how does it work ?

//Who can use Noava ? Is it only for students or also teachers ?

//How do I create a new deck or set of flashcards?

//Can I import flashcards from other tools like Quizlet?

//How does the adaptive learning / spaced repetition work?

//Can I share decks with other students or teachers?

//How can teachers track student progress?

//Is Noava available offline?

//How do I change the language or translation settings in the app?

//How do notifications and reminders work?

//Can I copy someone else’s deck into my own collection?

//How do I report a bug or request a new feature?

//Is my data synced across devices?

//What analytics are available for teachers?

//How do I manage class groups and assign decks?
            );
        }
    }
}