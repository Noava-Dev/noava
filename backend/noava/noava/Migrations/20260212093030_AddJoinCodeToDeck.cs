using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace noava.Migrations
{
    /// <inheritdoc />
    public partial class AddJoinCodeToDeck : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "JoinCode",
                table: "Decks",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.UpdateData(
                table: "Decks",
                keyColumn: "DeckId",
                keyValue: 1,
                columns: new[] { "CreatedAt", "JoinCode", "UpdatedAt" },
                values: new object[] { new DateTime(2026, 2, 12, 9, 30, 30, 141, DateTimeKind.Utc).AddTicks(7294), "", new DateTime(2026, 2, 12, 9, 30, 30, 141, DateTimeKind.Utc).AddTicks(7295) });

            migrationBuilder.UpdateData(
                table: "Decks",
                keyColumn: "DeckId",
                keyValue: 2,
                columns: new[] { "CreatedAt", "JoinCode", "UpdatedAt" },
                values: new object[] { new DateTime(2026, 2, 12, 9, 30, 30, 141, DateTimeKind.Utc).AddTicks(7297), "", new DateTime(2026, 2, 12, 9, 30, 30, 141, DateTimeKind.Utc).AddTicks(7298) });

            migrationBuilder.UpdateData(
                table: "Decks",
                keyColumn: "DeckId",
                keyValue: 3,
                columns: new[] { "CreatedAt", "JoinCode", "UpdatedAt" },
                values: new object[] { new DateTime(2026, 2, 12, 9, 30, 30, 141, DateTimeKind.Utc).AddTicks(7300), "", new DateTime(2026, 2, 12, 9, 30, 30, 141, DateTimeKind.Utc).AddTicks(7300) });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "JoinCode",
                table: "Decks");

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
    }
}
