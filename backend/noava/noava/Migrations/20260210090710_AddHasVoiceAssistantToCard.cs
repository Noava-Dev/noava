using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace noava.Migrations
{
    /// <inheritdoc />
    public partial class AddHasVoiceAssistantToCard : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "HasVoiceAssistant",
                table: "Cards",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.UpdateData(
                table: "Decks",
                keyColumn: "DeckId",
                keyValue: 1,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2026, 2, 10, 9, 7, 10, 443, DateTimeKind.Utc).AddTicks(7129), new DateTime(2026, 2, 10, 9, 7, 10, 443, DateTimeKind.Utc).AddTicks(7130) });

            migrationBuilder.UpdateData(
                table: "Decks",
                keyColumn: "DeckId",
                keyValue: 2,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2026, 2, 10, 9, 7, 10, 443, DateTimeKind.Utc).AddTicks(7133), new DateTime(2026, 2, 10, 9, 7, 10, 443, DateTimeKind.Utc).AddTicks(7133) });

            migrationBuilder.UpdateData(
                table: "Decks",
                keyColumn: "DeckId",
                keyValue: 3,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2026, 2, 10, 9, 7, 10, 443, DateTimeKind.Utc).AddTicks(7135), new DateTime(2026, 2, 10, 9, 7, 10, 443, DateTimeKind.Utc).AddTicks(7136) });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "HasVoiceAssistant",
                table: "Cards");

            migrationBuilder.UpdateData(
                table: "Decks",
                keyColumn: "DeckId",
                keyValue: 1,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2026, 2, 5, 14, 36, 53, 335, DateTimeKind.Utc).AddTicks(544), new DateTime(2026, 2, 5, 14, 36, 53, 335, DateTimeKind.Utc).AddTicks(545) });

            migrationBuilder.UpdateData(
                table: "Decks",
                keyColumn: "DeckId",
                keyValue: 2,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2026, 2, 5, 14, 36, 53, 335, DateTimeKind.Utc).AddTicks(547), new DateTime(2026, 2, 5, 14, 36, 53, 335, DateTimeKind.Utc).AddTicks(547) });

            migrationBuilder.UpdateData(
                table: "Decks",
                keyColumn: "DeckId",
                keyValue: 3,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2026, 2, 5, 14, 36, 53, 335, DateTimeKind.Utc).AddTicks(549), new DateTime(2026, 2, 5, 14, 36, 53, 335, DateTimeKind.Utc).AddTicks(549) });
        }
    }
}
