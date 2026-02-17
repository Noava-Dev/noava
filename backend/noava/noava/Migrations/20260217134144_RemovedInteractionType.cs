using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace noava.Migrations
{
    /// <inheritdoc />
    public partial class RemovedInteractionType : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "InteractionType",
                table: "CardInteractions");

            migrationBuilder.UpdateData(
                table: "Decks",
                keyColumn: "DeckId",
                keyValue: 1,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2026, 2, 17, 13, 41, 44, 139, DateTimeKind.Utc).AddTicks(1786), new DateTime(2026, 2, 17, 13, 41, 44, 139, DateTimeKind.Utc).AddTicks(1787) });

            migrationBuilder.UpdateData(
                table: "Decks",
                keyColumn: "DeckId",
                keyValue: 2,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2026, 2, 17, 13, 41, 44, 139, DateTimeKind.Utc).AddTicks(1789), new DateTime(2026, 2, 17, 13, 41, 44, 139, DateTimeKind.Utc).AddTicks(1790) });

            migrationBuilder.UpdateData(
                table: "Decks",
                keyColumn: "DeckId",
                keyValue: 3,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2026, 2, 17, 13, 41, 44, 139, DateTimeKind.Utc).AddTicks(1791), new DateTime(2026, 2, 17, 13, 41, 44, 139, DateTimeKind.Utc).AddTicks(1792) });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "InteractionType",
                table: "CardInteractions",
                type: "integer",
                nullable: false,
                defaultValue: 0);

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
        }
    }
}
