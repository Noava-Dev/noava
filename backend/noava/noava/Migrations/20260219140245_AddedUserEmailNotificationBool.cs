using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace noava.Migrations
{
    /// <inheritdoc />
    public partial class AddedUserEmailNotificationBool : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "ReceiveNotificationEmails",
                table: "Users",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.UpdateData(
                table: "Decks",
                keyColumn: "DeckId",
                keyValue: 1,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2026, 2, 19, 14, 2, 45, 444, DateTimeKind.Utc).AddTicks(7325), new DateTime(2026, 2, 19, 14, 2, 45, 444, DateTimeKind.Utc).AddTicks(7325) });

            migrationBuilder.UpdateData(
                table: "Decks",
                keyColumn: "DeckId",
                keyValue: 2,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2026, 2, 19, 14, 2, 45, 444, DateTimeKind.Utc).AddTicks(7327), new DateTime(2026, 2, 19, 14, 2, 45, 444, DateTimeKind.Utc).AddTicks(7328) });

            migrationBuilder.UpdateData(
                table: "Decks",
                keyColumn: "DeckId",
                keyValue: 3,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2026, 2, 19, 14, 2, 45, 444, DateTimeKind.Utc).AddTicks(7330), new DateTime(2026, 2, 19, 14, 2, 45, 444, DateTimeKind.Utc).AddTicks(7330) });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ReceiveNotificationEmails",
                table: "Users");

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
    }
}
