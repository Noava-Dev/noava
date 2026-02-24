using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace noava.Migrations
{
    /// <inheritdoc />
    public partial class RemoveFAQSeedData : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
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

            migrationBuilder.UpdateData(
                table: "Decks",
                keyColumn: "DeckId",
                keyValue: 1,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2026, 2, 18, 11, 13, 41, 999, DateTimeKind.Utc).AddTicks(2681), new DateTime(2026, 2, 18, 11, 13, 41, 999, DateTimeKind.Utc).AddTicks(2682) });

            migrationBuilder.UpdateData(
                table: "Decks",
                keyColumn: "DeckId",
                keyValue: 2,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2026, 2, 18, 11, 13, 41, 999, DateTimeKind.Utc).AddTicks(2684), new DateTime(2026, 2, 18, 11, 13, 41, 999, DateTimeKind.Utc).AddTicks(2685) });

            migrationBuilder.UpdateData(
                table: "Decks",
                keyColumn: "DeckId",
                keyValue: 3,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2026, 2, 18, 11, 13, 41, 999, DateTimeKind.Utc).AddTicks(2687), new DateTime(2026, 2, 18, 11, 13, 41, 999, DateTimeKind.Utc).AddTicks(2687) });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "Decks",
                keyColumn: "DeckId",
                keyValue: 1,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2026, 2, 16, 10, 26, 13, 600, DateTimeKind.Utc).AddTicks(816), new DateTime(2026, 2, 16, 10, 26, 13, 600, DateTimeKind.Utc).AddTicks(816) });

            migrationBuilder.UpdateData(
                table: "Decks",
                keyColumn: "DeckId",
                keyValue: 2,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2026, 2, 16, 10, 26, 13, 600, DateTimeKind.Utc).AddTicks(819), new DateTime(2026, 2, 16, 10, 26, 13, 600, DateTimeKind.Utc).AddTicks(819) });

            migrationBuilder.UpdateData(
                table: "Decks",
                keyColumn: "DeckId",
                keyValue: 3,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2026, 2, 16, 10, 26, 13, 600, DateTimeKind.Utc).AddTicks(821), new DateTime(2026, 2, 16, 10, 26, 13, 600, DateTimeKind.Utc).AddTicks(821) });

            migrationBuilder.InsertData(
                table: "FAQs",
                columns: new[] { "Id", "Answer", "FaqKey", "Question" },
                values: new object[,]
                {
                    { 1, "Noava is a modern platform that helps you manage your business efficiently with cutting-edge technology and user-friendly interfaces.", "what_is_noava", "What is Noava?" },
                    { 2, "Simply sign up, configure your preferences, and start using our intuitive dashboard to manage all your operations in one place.", "how_does_it_work", "How does it work?" },
                    { 3, "We offer flexible pricing plans starting from €9.99 per month. Visit our pricing page for detailed information about features included in each plan.", "what_are_the_costs", "What are the costs?" },
                    { 4, "Yes, you can cancel your subscription at any time without any penalties or hidden fees. Your data will remain accessible for 30 days after cancellation.", "can_i_cancel_anytime", "Can I cancel anytime?" },
                    { 5, "Absolutely. We use industry-standard encryption, regular security audits, and comply with GDPR regulations to ensure your data is always protected.", "is_my_data_secure", "Is my data secure?" },
                    { 6, "We offer 24/7 email support, live chat during business hours, and comprehensive documentation. Premium plans include priority support and dedicated account managers.", "support_options_available", "What support options are available?" },
                    { 7, "Yes, Noava integrates with popular tools like Slack, Google Workspace, Microsoft 365, and many others through our API and pre-built connectors.", "integration_with_other_tools", "Can I integrate with other tools?" },
                    { 8, "Yes, we offer a 14-day free trial with full access to all features. No credit card required to start your trial.", "free_trial", "Do you offer a free trial?" }
                });
        }
    }
}
