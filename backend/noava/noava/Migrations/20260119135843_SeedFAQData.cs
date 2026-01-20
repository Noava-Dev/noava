using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace noava.Migrations
{
    /// <inheritdoc />
    public partial class SeedFAQData : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.InsertData(
                table: "FAQs",
                columns: new[] { "Id", "Answer", "Question" },
                values: new object[,]
                {
                    { 1, "Noava is a modern platform that helps you manage your business efficiently with cutting-edge technology and user-friendly interfaces.", "What is Noava?" },
                    { 2, "Simply sign up, configure your preferences, and start using our intuitive dashboard to manage all your operations in one place.", "How does it work?" },
                    { 3, "We offer flexible pricing plans starting from €9.99 per month. Visit our pricing page for detailed information about features included in each plan.", "What are the costs?" },
                    { 4, "Yes, you can cancel your subscription at any time without any penalties or hidden fees. Your data will remain accessible for 30 days after cancellation.", "Can I cancel anytime?" },
                    { 5, "Absolutely. We use industry-standard encryption, regular security audits, and comply with GDPR regulations to ensure your data is always protected.", "Is my data secure?" },
                    { 6, "We offer 24/7 email support, live chat during business hours, and comprehensive documentation. Premium plans include priority support and dedicated account managers.", "What support options are available?" },
                    { 7, "Yes, Noava integrates with popular tools like Slack, Google Workspace, Microsoft 365, and many others through our API and pre-built connectors.", "Can I integrate with other tools?" },
                    { 8, "Yes, we offer a 14-day free trial with full access to all features. No credit card required to start your trial.", "Do you offer a free trial?" }
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "FAQs",
                keyColumn: "Id",
                keyValue: 1);

            migrationBuilder.DeleteData(
                table: "FAQs",
                keyColumn: "Id",
                keyValue: 2);

            migrationBuilder.DeleteData(
                table: "FAQs",
                keyColumn: "Id",
                keyValue: 3);

            migrationBuilder.DeleteData(
                table: "FAQs",
                keyColumn: "Id",
                keyValue: 4);

            migrationBuilder.DeleteData(
                table: "FAQs",
                keyColumn: "Id",
                keyValue: 5);

            migrationBuilder.DeleteData(
                table: "FAQs",
                keyColumn: "Id",
                keyValue: 6);

            migrationBuilder.DeleteData(
                table: "FAQs",
                keyColumn: "Id",
                keyValue: 7);

            migrationBuilder.DeleteData(
                table: "FAQs",
                keyColumn: "Id",
                keyValue: 8);
        }
    }
}
