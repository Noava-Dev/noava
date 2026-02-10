using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace noava.Migrations
{
    /// <inheritdoc />
    public partial class AddClassroomDeckLink : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "ClassroomDecks",
                columns: table => new
                {
                    ClassroomId = table.Column<int>(type: "integer", nullable: false),
                    DeckId = table.Column<int>(type: "integer", nullable: false),
                    AddedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ClassroomDecks", x => new { x.ClassroomId, x.DeckId });
                    table.ForeignKey(
                        name: "FK_ClassroomDecks_Classrooms_ClassroomId",
                        column: x => x.ClassroomId,
                        principalTable: "Classrooms",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_ClassroomDecks_Decks_DeckId",
                        column: x => x.DeckId,
                        principalTable: "Decks",
                        principalColumn: "DeckId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.UpdateData(
                table: "Decks",
                keyColumn: "DeckId",
                keyValue: 1,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2026, 2, 9, 10, 33, 3, 494, DateTimeKind.Utc).AddTicks(2897), new DateTime(2026, 2, 9, 10, 33, 3, 494, DateTimeKind.Utc).AddTicks(2898) });

            migrationBuilder.UpdateData(
                table: "Decks",
                keyColumn: "DeckId",
                keyValue: 2,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2026, 2, 9, 10, 33, 3, 494, DateTimeKind.Utc).AddTicks(2906), new DateTime(2026, 2, 9, 10, 33, 3, 494, DateTimeKind.Utc).AddTicks(2907) });

            migrationBuilder.UpdateData(
                table: "Decks",
                keyColumn: "DeckId",
                keyValue: 3,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2026, 2, 9, 10, 33, 3, 494, DateTimeKind.Utc).AddTicks(2914), new DateTime(2026, 2, 9, 10, 33, 3, 494, DateTimeKind.Utc).AddTicks(2915) });

            migrationBuilder.CreateIndex(
                name: "IX_ClassroomDecks_DeckId",
                table: "ClassroomDecks",
                column: "DeckId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "ClassroomDecks");

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
