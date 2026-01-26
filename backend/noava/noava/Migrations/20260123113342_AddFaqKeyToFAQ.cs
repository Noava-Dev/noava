using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace noava.Migrations
{
    /// <inheritdoc />
    public partial class AddFaqKeyToFAQ : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "FaqKey",
                table: "FAQs",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.UpdateData(
                table: "FAQs",
                keyColumn: "Id",
                keyValue: 1,
                column: "FaqKey",
                value: "what_is_noava");

            migrationBuilder.UpdateData(
                table: "FAQs",
                keyColumn: "Id",
                keyValue: 2,
                column: "FaqKey",
                value: "how_does_it_work");

            migrationBuilder.UpdateData(
                table: "FAQs",
                keyColumn: "Id",
                keyValue: 3,
                column: "FaqKey",
                value: "what_are_the_costs");

            migrationBuilder.UpdateData(
                table: "FAQs",
                keyColumn: "Id",
                keyValue: 4,
                column: "FaqKey",
                value: "can_i_cancel_anytime");

            migrationBuilder.UpdateData(
                table: "FAQs",
                keyColumn: "Id",
                keyValue: 5,
                column: "FaqKey",
                value: "is_my_data_secure");

            migrationBuilder.UpdateData(
                table: "FAQs",
                keyColumn: "Id",
                keyValue: 6,
                column: "FaqKey",
                value: "support_options_available");

            migrationBuilder.UpdateData(
                table: "FAQs",
                keyColumn: "Id",
                keyValue: 7,
                column: "FaqKey",
                value: "integration_with_other_tools");

            migrationBuilder.UpdateData(
                table: "FAQs",
                keyColumn: "Id",
                keyValue: 8,
                column: "FaqKey",
                value: "free_trial");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "FaqKey",
                table: "FAQs");
        }
    }
}
