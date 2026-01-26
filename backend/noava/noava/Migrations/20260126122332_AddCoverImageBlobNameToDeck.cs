using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace noava.Migrations
{
    /// <inheritdoc />
    public partial class AddCoverImageBlobNameToDeck : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<string>(
                name: "Language",
                table: "Decks",
                type: "character varying(50)",
                maxLength: 50,
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "character varying(50)",
                oldMaxLength: 50,
                oldNullable: true);

            migrationBuilder.AddColumn<string>(
                name: "CoverImageBlobName",
                table: "Decks",
                type: "character varying(500)",
                maxLength: 500,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "UserId",
                table: "Decks",
                type: "character varying(100)",
                maxLength: 100,
                nullable: false,
                defaultValue: "");

            migrationBuilder.UpdateData(
                table: "Decks",
                keyColumn: "DeckId",
                keyValue: 1,
                columns: new[] { "CoverImageBlobName", "CreatedAt", "UpdatedAt", "UserId" },
                values: new object[] { null, new DateTime(2026, 1, 26, 12, 23, 31, 803, DateTimeKind.Utc).AddTicks(8118), new DateTime(2026, 1, 26, 12, 23, 31, 803, DateTimeKind.Utc).AddTicks(8119), "user_38TGbnbcmzK7uZAbaABqTtzQtvz" });

            migrationBuilder.UpdateData(
                table: "Decks",
                keyColumn: "DeckId",
                keyValue: 2,
                columns: new[] { "CoverImageBlobName", "CreatedAt", "UpdatedAt", "UserId" },
                values: new object[] { null, new DateTime(2026, 1, 26, 12, 23, 31, 803, DateTimeKind.Utc).AddTicks(8121), new DateTime(2026, 1, 26, 12, 23, 31, 803, DateTimeKind.Utc).AddTicks(8121), "user_38TGbnbcmzK7uZAbaABqTtzQtvz" });

            migrationBuilder.UpdateData(
                table: "Decks",
                keyColumn: "DeckId",
                keyValue: 3,
                columns: new[] { "CoverImageBlobName", "CreatedAt", "UpdatedAt", "UserId" },
                values: new object[] { null, new DateTime(2026, 1, 26, 12, 23, 31, 803, DateTimeKind.Utc).AddTicks(8123), new DateTime(2026, 1, 26, 12, 23, 31, 803, DateTimeKind.Utc).AddTicks(8123), "user_38TGbnbcmzK7uZAbaABqTtzQtvz" });

            migrationBuilder.CreateIndex(
                name: "IX_Decks_UserId",
                table: "Decks",
                column: "UserId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_Decks_UserId",
                table: "Decks");

            migrationBuilder.DropColumn(
                name: "CoverImageBlobName",
                table: "Decks");

            migrationBuilder.DropColumn(
                name: "UserId",
                table: "Decks");

            migrationBuilder.AlterColumn<string>(
                name: "Language",
                table: "Decks",
                type: "character varying(50)",
                maxLength: 50,
                nullable: true,
                oldClrType: typeof(string),
                oldType: "character varying(50)",
                oldMaxLength: 50);

            migrationBuilder.UpdateData(
                table: "Decks",
                keyColumn: "DeckId",
                keyValue: 1,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2026, 1, 22, 10, 15, 21, 865, DateTimeKind.Utc).AddTicks(5928), new DateTime(2026, 1, 22, 10, 15, 21, 865, DateTimeKind.Utc).AddTicks(5929) });

            migrationBuilder.UpdateData(
                table: "Decks",
                keyColumn: "DeckId",
                keyValue: 2,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2026, 1, 22, 10, 15, 21, 865, DateTimeKind.Utc).AddTicks(5931), new DateTime(2026, 1, 22, 10, 15, 21, 865, DateTimeKind.Utc).AddTicks(5931) });

            migrationBuilder.UpdateData(
                table: "Decks",
                keyColumn: "DeckId",
                keyValue: 3,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2026, 1, 22, 10, 15, 21, 865, DateTimeKind.Utc).AddTicks(5933), new DateTime(2026, 1, 22, 10, 15, 21, 865, DateTimeKind.Utc).AddTicks(5933) });
        }
    }
}
