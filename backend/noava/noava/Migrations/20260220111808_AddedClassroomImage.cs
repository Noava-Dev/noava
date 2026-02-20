using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace noava.Migrations
{
    /// <inheritdoc />
    public partial class AddedClassroomImage : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "CoverImageBlobName",
                table: "Classrooms",
                type: "text",
                nullable: true);

            migrationBuilder.UpdateData(
                table: "Decks",
                keyColumn: "DeckId",
                keyValue: 1,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2026, 2, 20, 11, 18, 8, 393, DateTimeKind.Utc).AddTicks(7562), new DateTime(2026, 2, 20, 11, 18, 8, 393, DateTimeKind.Utc).AddTicks(7563) });

            migrationBuilder.UpdateData(
                table: "Decks",
                keyColumn: "DeckId",
                keyValue: 2,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2026, 2, 20, 11, 18, 8, 393, DateTimeKind.Utc).AddTicks(7565), new DateTime(2026, 2, 20, 11, 18, 8, 393, DateTimeKind.Utc).AddTicks(7566) });

            migrationBuilder.UpdateData(
                table: "Decks",
                keyColumn: "DeckId",
                keyValue: 3,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2026, 2, 20, 11, 18, 8, 393, DateTimeKind.Utc).AddTicks(7568), new DateTime(2026, 2, 20, 11, 18, 8, 393, DateTimeKind.Utc).AddTicks(7568) });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "CoverImageBlobName",
                table: "Classrooms");

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
    }
}
