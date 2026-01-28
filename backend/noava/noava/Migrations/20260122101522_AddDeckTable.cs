using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace noava.Migrations
{
    /// <inheritdoc />
    public partial class AddDeckTable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropPrimaryKey(
                name: "PK_Decks",
                table: "Decks");

            migrationBuilder.RenameColumn(
                name: "Id",
                table: "Decks",
                newName: "Visibility");

            migrationBuilder.AlterColumn<int>(
                name: "Visibility",
                table: "Decks",
                type: "integer",
                nullable: false,
                oldClrType: typeof(int),
                oldType: "integer")
                .OldAnnotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn);

            migrationBuilder.AddColumn<int>(
                name: "DeckId",
                table: "Decks",
                type: "integer",
                nullable: false,
                defaultValue: 0)
                .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn);

            migrationBuilder.AddColumn<DateTime>(
                name: "CreatedAt",
                table: "Decks",
                type: "timestamp with time zone",
                nullable: false,
                defaultValueSql: "CURRENT_TIMESTAMP");

            migrationBuilder.AddColumn<string>(
                name: "Description",
                table: "Decks",
                type: "character varying(1000)",
                maxLength: 1000,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Language",
                table: "Decks",
                type: "character varying(50)",
                maxLength: 50,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Title",
                table: "Decks",
                type: "character varying(200)",
                maxLength: 200,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<DateTime>(
                name: "UpdatedAt",
                table: "Decks",
                type: "timestamp with time zone",
                nullable: false,
                defaultValueSql: "CURRENT_TIMESTAMP");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Decks",
                table: "Decks",
                column: "DeckId");

            migrationBuilder.InsertData(
                table: "Decks",
                columns: new[] { "DeckId", "CreatedAt", "Description", "Language", "Title", "UpdatedAt", "Visibility" },
                values: new object[,]
                {
                    { 1, new DateTime(2026, 1, 22, 10, 15, 21, 865, DateTimeKind.Utc).AddTicks(5928), "Franse woorden voor beginners", "Frans", "Frans Woordenschat", new DateTime(2026, 1, 22, 10, 15, 21, 865, DateTimeKind.Utc).AddTicks(5929), 0 },
                    { 2, new DateTime(2026, 1, 22, 10, 15, 21, 865, DateTimeKind.Utc).AddTicks(5931), "Engelse grammatica oefeningen", "Engels", "Engels Grammatica", new DateTime(2026, 1, 22, 10, 15, 21, 865, DateTimeKind.Utc).AddTicks(5931), 2 },
                    { 3, new DateTime(2026, 1, 22, 10, 15, 21, 865, DateTimeKind.Utc).AddTicks(5933), "Spaanse zinnen voor dagelijks gebruik", "Spaans", "Spaans Conversatie", new DateTime(2026, 1, 22, 10, 15, 21, 865, DateTimeKind.Utc).AddTicks(5933), 1 }
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropPrimaryKey(
                name: "PK_Decks",
                table: "Decks");

            migrationBuilder.DeleteData(
                table: "Decks",
                keyColumn: "DeckId",
                keyColumnType: "integer",
                keyValue: 1);

            migrationBuilder.DeleteData(
                table: "Decks",
                keyColumn: "DeckId",
                keyColumnType: "integer",
                keyValue: 2);

            migrationBuilder.DeleteData(
                table: "Decks",
                keyColumn: "DeckId",
                keyColumnType: "integer",
                keyValue: 3);

            migrationBuilder.DropColumn(
                name: "DeckId",
                table: "Decks");

            migrationBuilder.DropColumn(
                name: "CreatedAt",
                table: "Decks");

            migrationBuilder.DropColumn(
                name: "Description",
                table: "Decks");

            migrationBuilder.DropColumn(
                name: "Language",
                table: "Decks");

            migrationBuilder.DropColumn(
                name: "Title",
                table: "Decks");

            migrationBuilder.DropColumn(
                name: "UpdatedAt",
                table: "Decks");

            migrationBuilder.RenameColumn(
                name: "Visibility",
                table: "Decks",
                newName: "Id");

            migrationBuilder.AlterColumn<int>(
                name: "Id",
                table: "Decks",
                type: "integer",
                nullable: false,
                oldClrType: typeof(int),
                oldType: "integer")
                .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn);

            migrationBuilder.AddPrimaryKey(
                name: "PK_Decks",
                table: "Decks",
                column: "Id");
        }
    }
}
