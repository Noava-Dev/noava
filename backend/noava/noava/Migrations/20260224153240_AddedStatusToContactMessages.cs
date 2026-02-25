using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace noava.Migrations
{
    /// <inheritdoc />
    public partial class AddedStatusToContactMessages : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Status",
                table: "ContactMessages",
                type: "text",
                nullable: false,
                defaultValue: "Pending");

            migrationBuilder.UpdateData(
                table: "Decks",
                keyColumn: "DeckId",
                keyValue: 1,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2026, 2, 24, 15, 32, 40, 255, DateTimeKind.Utc).AddTicks(5294), new DateTime(2026, 2, 24, 15, 32, 40, 255, DateTimeKind.Utc).AddTicks(5294) });

            migrationBuilder.UpdateData(
                table: "Decks",
                keyColumn: "DeckId",
                keyValue: 2,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2026, 2, 24, 15, 32, 40, 255, DateTimeKind.Utc).AddTicks(5297), new DateTime(2026, 2, 24, 15, 32, 40, 255, DateTimeKind.Utc).AddTicks(5297) });

            migrationBuilder.UpdateData(
                table: "Decks",
                keyColumn: "DeckId",
                keyValue: 3,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2026, 2, 24, 15, 32, 40, 255, DateTimeKind.Utc).AddTicks(5300), new DateTime(2026, 2, 24, 15, 32, 40, 255, DateTimeKind.Utc).AddTicks(5300) });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Status",
                table: "ContactMessages");

            migrationBuilder.UpdateData(
                table: "Decks",
                keyColumn: "DeckId",
                keyValue: 1,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2026, 2, 23, 12, 51, 41, 812, DateTimeKind.Utc).AddTicks(9601), new DateTime(2026, 2, 23, 12, 51, 41, 812, DateTimeKind.Utc).AddTicks(9601) });

            migrationBuilder.UpdateData(
                table: "Decks",
                keyColumn: "DeckId",
                keyValue: 2,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2026, 2, 23, 12, 51, 41, 812, DateTimeKind.Utc).AddTicks(9603), new DateTime(2026, 2, 23, 12, 51, 41, 812, DateTimeKind.Utc).AddTicks(9604) });

            migrationBuilder.UpdateData(
                table: "Decks",
                keyColumn: "DeckId",
                keyValue: 3,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2026, 2, 23, 12, 51, 41, 812, DateTimeKind.Utc).AddTicks(9606), new DateTime(2026, 2, 23, 12, 51, 41, 812, DateTimeKind.Utc).AddTicks(9606) });
        }
    }
}
