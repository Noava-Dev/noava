using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace noava.Migrations
{
    /// <inheritdoc />
    public partial class AddAggregateStatisticsTables : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "ClassroomDeckStatistics",
                columns: table => new
                {
                    ClassroomId = table.Column<int>(type: "integer", nullable: false),
                    DeckId = table.Column<int>(type: "integer", nullable: false),
                    CardsReviewed = table.Column<int>(type: "integer", nullable: false),
                    CorrectCards = table.Column<int>(type: "integer", nullable: false),
                    AccuracyRate = table.Column<double>(type: "numeric(5,2)", nullable: false),
                    AvgResponseTimeMs = table.Column<int>(type: "integer", nullable: false),
                    AvgTimeSpentSeconds = table.Column<int>(type: "integer", nullable: false),
                    LastReviewedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    AvgMasteryLevel = table.Column<double>(type: "numeric(5,2)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ClassroomDeckStatistics", x => new { x.ClassroomId, x.DeckId });
                    table.ForeignKey(
                        name: "FK_ClassroomDeckStatistics_Classrooms_ClassroomId",
                        column: x => x.ClassroomId,
                        principalTable: "Classrooms",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_ClassroomDeckStatistics_Decks_DeckId",
                        column: x => x.DeckId,
                        principalTable: "Decks",
                        principalColumn: "DeckId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "ClassroomUserStatistics",
                columns: table => new
                {
                    ClassroomId = table.Column<int>(type: "integer", nullable: false),
                    ClerkId = table.Column<string>(type: "text", nullable: false),
                    CardsReviewed = table.Column<int>(type: "integer", nullable: false),
                    CorrectCards = table.Column<int>(type: "integer", nullable: false),
                    AccuracyRate = table.Column<double>(type: "numeric(5,2)", nullable: false),
                    TimeSpentSeconds = table.Column<int>(type: "integer", nullable: false),
                    LastReviewedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    AvgMasteryLevel = table.Column<double>(type: "numeric(5,2)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ClassroomUserStatistics", x => new { x.ClassroomId, x.ClerkId });
                    table.ForeignKey(
                        name: "FK_ClassroomUserStatistics_Classrooms_ClassroomId",
                        column: x => x.ClassroomId,
                        principalTable: "Classrooms",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_ClassroomUserStatistics_Users_ClerkId",
                        column: x => x.ClerkId,
                        principalTable: "Users",
                        principalColumn: "ClerkId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "DeckUserStatistics",
                columns: table => new
                {
                    DeckId = table.Column<int>(type: "integer", nullable: false),
                    ClerkId = table.Column<string>(type: "text", nullable: false),
                    CardsReviewed = table.Column<int>(type: "integer", nullable: false),
                    CorrectCards = table.Column<int>(type: "integer", nullable: false),
                    AccuracyRate = table.Column<double>(type: "numeric(5,2)", nullable: false),
                    TimeSpentSeconds = table.Column<int>(type: "integer", nullable: false),
                    AvgResponseTimeMs = table.Column<int>(type: "integer", nullable: false),
                    LastReviewedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    AvgMasteryLevel = table.Column<double>(type: "numeric(5,2)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_DeckUserStatistics", x => new { x.DeckId, x.ClerkId });
                    table.ForeignKey(
                        name: "FK_DeckUserStatistics_Decks_DeckId",
                        column: x => x.DeckId,
                        principalTable: "Decks",
                        principalColumn: "DeckId",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_DeckUserStatistics_Users_ClerkId",
                        column: x => x.ClerkId,
                        principalTable: "Users",
                        principalColumn: "ClerkId",
                        onDelete: ReferentialAction.Cascade);
                });

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

            migrationBuilder.CreateIndex(
                name: "IX_ClassroomDeckStatistics_DeckId",
                table: "ClassroomDeckStatistics",
                column: "DeckId");

            migrationBuilder.CreateIndex(
                name: "IX_ClassroomUserStatistics_ClerkId",
                table: "ClassroomUserStatistics",
                column: "ClerkId");

            migrationBuilder.CreateIndex(
                name: "IX_DeckUserStatistics_ClerkId",
                table: "DeckUserStatistics",
                column: "ClerkId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "ClassroomDeckStatistics");

            migrationBuilder.DropTable(
                name: "ClassroomUserStatistics");

            migrationBuilder.DropTable(
                name: "DeckUserStatistics");

            migrationBuilder.UpdateData(
                table: "Decks",
                keyColumn: "DeckId",
                keyValue: 1,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2026, 2, 12, 9, 30, 30, 141, DateTimeKind.Utc).AddTicks(7294), new DateTime(2026, 2, 12, 9, 30, 30, 141, DateTimeKind.Utc).AddTicks(7295) });

            migrationBuilder.UpdateData(
                table: "Decks",
                keyColumn: "DeckId",
                keyValue: 2,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2026, 2, 12, 9, 30, 30, 141, DateTimeKind.Utc).AddTicks(7297), new DateTime(2026, 2, 12, 9, 30, 30, 141, DateTimeKind.Utc).AddTicks(7298) });

            migrationBuilder.UpdateData(
                table: "Decks",
                keyColumn: "DeckId",
                keyValue: 3,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2026, 2, 12, 9, 30, 30, 141, DateTimeKind.Utc).AddTicks(7300), new DateTime(2026, 2, 12, 9, 30, 30, 141, DateTimeKind.Utc).AddTicks(7300) });
        }
    }
}
