using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace noava.Migrations
{
    /// <inheritdoc />
    public partial class AddClassroomStatistics : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<double>(
                name: "AccuracyRate",
                table: "DeckUserStatistics",
                type: "double precision",
                nullable: false,
                oldClrType: typeof(double),
                oldType: "numeric(5,2)");

            migrationBuilder.CreateTable(
                name: "ClassroomStatistics",
                columns: table => new
                {
                    ClassroomId = table.Column<int>(type: "integer", nullable: false),
                    CardsReviewed = table.Column<int>(type: "integer", nullable: false),
                    CorrectCards = table.Column<int>(type: "integer", nullable: false),
                    TimeSpentSeconds = table.Column<int>(type: "integer", nullable: false),
                    AvgMasteryLevel = table.Column<double>(type: "numeric(5,2)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ClassroomStatistics", x => x.ClassroomId);
                    table.ForeignKey(
                        name: "FK_ClassroomStatistics_Classrooms_ClassroomId",
                        column: x => x.ClassroomId,
                        principalTable: "Classrooms",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "ClassroomStatisticsUser",
                columns: table => new
                {
                    ActiveUsersClerkId = table.Column<string>(type: "text", nullable: false),
                    ClassroomStatisticsClassroomId = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ClassroomStatisticsUser", x => new { x.ActiveUsersClerkId, x.ClassroomStatisticsClassroomId });
                    table.ForeignKey(
                        name: "FK_ClassroomStatisticsUser_ClassroomStatistics_ClassroomStatis~",
                        column: x => x.ClassroomStatisticsClassroomId,
                        principalTable: "ClassroomStatistics",
                        principalColumn: "ClassroomId",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_ClassroomStatisticsUser_Users_ActiveUsersClerkId",
                        column: x => x.ActiveUsersClerkId,
                        principalTable: "Users",
                        principalColumn: "ClerkId",
                        onDelete: ReferentialAction.Cascade);
                });

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

            migrationBuilder.CreateIndex(
                name: "IX_ClassroomStatisticsUser_ClassroomStatisticsClassroomId",
                table: "ClassroomStatisticsUser",
                column: "ClassroomStatisticsClassroomId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "ClassroomStatisticsUser");

            migrationBuilder.DropTable(
                name: "ClassroomStatistics");

            migrationBuilder.AlterColumn<double>(
                name: "AccuracyRate",
                table: "DeckUserStatistics",
                type: "numeric(5,2)",
                nullable: false,
                oldClrType: typeof(double),
                oldType: "double precision");

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
