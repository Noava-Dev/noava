using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace noava.Migrations
{
    /// <inheritdoc />
    public partial class RemovedCardInteractionConstraint : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropCheckConstraint(
                name: "CK_CardInteractions_DueAtBefore_DueAtAfter",
                table: "CardInteractions");

            migrationBuilder.UpdateData(
                table: "Decks",
                keyColumn: "DeckId",
                keyValue: 1,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2026, 2, 18, 10, 11, 15, 19, DateTimeKind.Utc).AddTicks(7641), new DateTime(2026, 2, 18, 10, 11, 15, 19, DateTimeKind.Utc).AddTicks(7642) });

            migrationBuilder.UpdateData(
                table: "Decks",
                keyColumn: "DeckId",
                keyValue: 2,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2026, 2, 18, 10, 11, 15, 19, DateTimeKind.Utc).AddTicks(7646), new DateTime(2026, 2, 18, 10, 11, 15, 19, DateTimeKind.Utc).AddTicks(7647) });

            migrationBuilder.UpdateData(
                table: "Decks",
                keyColumn: "DeckId",
                keyValue: 3,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2026, 2, 18, 10, 11, 15, 19, DateTimeKind.Utc).AddTicks(7651), new DateTime(2026, 2, 18, 10, 11, 15, 19, DateTimeKind.Utc).AddTicks(7651) });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
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

            migrationBuilder.AddCheckConstraint(
                name: "CK_CardInteractions_DueAtBefore_DueAtAfter",
                table: "CardInteractions",
                sql: "\"DueAtAfter\" >= \"DueAtBefore\"");
        }
    }
}
