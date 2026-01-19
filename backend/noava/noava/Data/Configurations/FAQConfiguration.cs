using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using noava.Models;

namespace noava.Data.Configurations
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
            // Seed data
            builder.HasData(
                new FAQ
                {
                    Id = 1,
                    Question = "What is Noava?",
                    Answer = "Noava is a modern platform that helps you manage your business efficiently with cutting-edge technology and user-friendly interfaces."
                },
                new FAQ
                {
                    Id = 2,
                    Question = "How does it work?",
                    Answer = "Simply sign up, configure your preferences, and start using our intuitive dashboard to manage all your operations in one place."
                },
                new FAQ
                {
                    Id = 3,
                    Question = "What are the costs?",
                    Answer = "We offer flexible pricing plans starting from €9.99 per month. Visit our pricing page for detailed information about features included in each plan."
                },
                new FAQ
                {
                    Id = 4,
                    Question = "Can I cancel anytime?",
                    Answer = "Yes, you can cancel your subscription at any time without any penalties or hidden fees. Your data will remain accessible for 30 days after cancellation."
                },
                new FAQ
                {
                    Id = 5,
                    Question = "Is my data secure?",
                    Answer = "Absolutely. We use industry-standard encryption, regular security audits, and comply with GDPR regulations to ensure your data is always protected."
                },
                new FAQ
                {
                    Id = 6,
                    Question = "What support options are available?",
                    Answer = "We offer 24/7 email support, live chat during business hours, and comprehensive documentation. Premium plans include priority support and dedicated account managers."
                },
                new FAQ
                {
                    Id = 7,
                    Question = "Can I integrate with other tools?",
                    Answer = "Yes, Noava integrates with popular tools like Slack, Google Workspace, Microsoft 365, and many others through our API and pre-built connectors."
                },
                new FAQ
                {
                    Id = 8,
                    Question = "Do you offer a free trial?",
                    Answer = "Yes, we offer a 14-day free trial with full access to all features. No credit card required to start your trial."
                }
            );
        }
    }
}
