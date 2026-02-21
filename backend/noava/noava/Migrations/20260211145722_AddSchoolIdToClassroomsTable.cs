using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace noava.Migrations
{
    /// <inheritdoc />
    public partial class AddSchoolIdToClassroomsTable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "SchoolId",
                table: "Classrooms",
                type: "integer",
                nullable: true);

            migrationBuilder.UpdateData(
                table: "Decks",
                keyColumn: "DeckId",
                keyValue: 1,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2026, 2, 11, 14, 57, 21, 520, DateTimeKind.Utc).AddTicks(3921), new DateTime(2026, 2, 11, 14, 57, 21, 520, DateTimeKind.Utc).AddTicks(3922) });

            migrationBuilder.UpdateData(
                table: "Decks",
                keyColumn: "DeckId",
                keyValue: 2,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2026, 2, 11, 14, 57, 21, 520, DateTimeKind.Utc).AddTicks(3928), new DateTime(2026, 2, 11, 14, 57, 21, 520, DateTimeKind.Utc).AddTicks(3929) });

            migrationBuilder.UpdateData(
                table: "Decks",
                keyColumn: "DeckId",
                keyValue: 3,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2026, 2, 11, 14, 57, 21, 520, DateTimeKind.Utc).AddTicks(3933), new DateTime(2026, 2, 11, 14, 57, 21, 520, DateTimeKind.Utc).AddTicks(3934) });

            migrationBuilder.CreateIndex(
                name: "IX_Classrooms_SchoolId",
                table: "Classrooms",
                column: "SchoolId");

            migrationBuilder.AddForeignKey(
                name: "FK_Classrooms_Schools_SchoolId",
                table: "Classrooms",
                column: "SchoolId",
                principalTable: "Schools",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Classrooms_Schools_SchoolId",
                table: "Classrooms");

            migrationBuilder.DropIndex(
                name: "IX_Classrooms_SchoolId",
                table: "Classrooms");

            migrationBuilder.DropColumn(
                name: "SchoolId",
                table: "Classrooms");

            migrationBuilder.UpdateData(
                table: "Decks",
                keyColumn: "DeckId",
                keyValue: 1,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2026, 2, 10, 9, 7, 10, 443, DateTimeKind.Utc).AddTicks(7129), new DateTime(2026, 2, 10, 9, 7, 10, 443, DateTimeKind.Utc).AddTicks(7130) });

            migrationBuilder.UpdateData(
                table: "Decks",
                keyColumn: "DeckId",
                keyValue: 2,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2026, 2, 10, 9, 7, 10, 443, DateTimeKind.Utc).AddTicks(7133), new DateTime(2026, 2, 10, 9, 7, 10, 443, DateTimeKind.Utc).AddTicks(7133) });

            migrationBuilder.UpdateData(
                table: "Decks",
                keyColumn: "DeckId",
                keyValue: 3,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2026, 2, 10, 9, 7, 10, 443, DateTimeKind.Utc).AddTicks(7135), new DateTime(2026, 2, 10, 9, 7, 10, 443, DateTimeKind.Utc).AddTicks(7136) });
        }
    }
}
