using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace noava.Migrations
{
    /// <inheritdoc />
    public partial class AddedContactMessages : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "ContactMessages",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Title = table.Column<string>(type: "text", nullable: false),
                    SenderEmail = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: false),
                    Subject = table.Column<string>(type: "text", nullable: false),
                    Description = table.Column<string>(type: "character varying(4000)", maxLength: 4000, nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ContactMessages", x => x.Id);
                });

            migrationBuilder.UpdateData(
                table: "Decks",
                keyColumn: "DeckId",
                keyValue: 1,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2026, 2, 23, 14, 34, 1, 199, DateTimeKind.Utc).AddTicks(3923), new DateTime(2026, 2, 23, 14, 34, 1, 199, DateTimeKind.Utc).AddTicks(3923) });

            migrationBuilder.UpdateData(
                table: "Decks",
                keyColumn: "DeckId",
                keyValue: 2,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2026, 2, 23, 14, 34, 1, 199, DateTimeKind.Utc).AddTicks(3928), new DateTime(2026, 2, 23, 14, 34, 1, 199, DateTimeKind.Utc).AddTicks(3928) });

            migrationBuilder.UpdateData(
                table: "Decks",
                keyColumn: "DeckId",
                keyValue: 3,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2026, 2, 23, 14, 34, 1, 199, DateTimeKind.Utc).AddTicks(3932), new DateTime(2026, 2, 23, 14, 34, 1, 199, DateTimeKind.Utc).AddTicks(3933) });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "ContactMessages");

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
    }
}
