using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace noava.Migrations
{
    /// <inheritdoc />
    public partial class AddedTitleToNotifications : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "TitleKey",
                table: "Notifications",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.UpdateData(
                table: "Decks",
                keyColumn: "DeckId",
                keyValue: 1,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2026, 2, 19, 10, 40, 28, 745, DateTimeKind.Utc).AddTicks(4405), new DateTime(2026, 2, 19, 10, 40, 28, 745, DateTimeKind.Utc).AddTicks(4407) });

            migrationBuilder.UpdateData(
                table: "Decks",
                keyColumn: "DeckId",
                keyValue: 2,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2026, 2, 19, 10, 40, 28, 745, DateTimeKind.Utc).AddTicks(4413), new DateTime(2026, 2, 19, 10, 40, 28, 745, DateTimeKind.Utc).AddTicks(4414) });

            migrationBuilder.UpdateData(
                table: "Decks",
                keyColumn: "DeckId",
                keyValue: 3,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2026, 2, 19, 10, 40, 28, 745, DateTimeKind.Utc).AddTicks(4418), new DateTime(2026, 2, 19, 10, 40, 28, 745, DateTimeKind.Utc).AddTicks(4419) });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "TitleKey",
                table: "Notifications");

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
    }
}
