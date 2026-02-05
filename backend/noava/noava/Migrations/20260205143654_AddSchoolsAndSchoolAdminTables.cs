using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace noava.Migrations
{
    /// <inheritdoc />
    public partial class AddSchoolsAndSchoolAdminTables : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Decks_Users_Decks_DeckId1",
                table: "Decks_Users");

            migrationBuilder.DropIndex(
                name: "IX_Decks_Users_DeckId1",
                table: "Decks_Users");

            migrationBuilder.DropColumn(
                name: "DeckId1",
                table: "Decks_Users");

            migrationBuilder.CreateTable(
                name: "Schools",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Name = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: false),
                    CreatedBy = table.Column<string>(type: "text", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Schools", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Schools_Users_CreatedBy",
                        column: x => x.CreatedBy,
                        principalTable: "Users",
                        principalColumn: "ClerkId",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "SchoolAdmins",
                columns: table => new
                {
                    SchoolId = table.Column<int>(type: "integer", nullable: false),
                    ClerkId = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SchoolAdmins", x => new { x.SchoolId, x.ClerkId });
                    table.ForeignKey(
                        name: "FK_SchoolAdmins_Schools_SchoolId",
                        column: x => x.SchoolId,
                        principalTable: "Schools",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_SchoolAdmins_Users_ClerkId",
                        column: x => x.ClerkId,
                        principalTable: "Users",
                        principalColumn: "ClerkId",
                        onDelete: ReferentialAction.Restrict);
                });

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

            migrationBuilder.CreateIndex(
                name: "IX_SchoolAdmins_ClerkId",
                table: "SchoolAdmins",
                column: "ClerkId");

            migrationBuilder.CreateIndex(
                name: "IX_Schools_CreatedBy",
                table: "Schools",
                column: "CreatedBy");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "SchoolAdmins");

            migrationBuilder.DropTable(
                name: "Schools");

            migrationBuilder.AddColumn<int>(
                name: "DeckId1",
                table: "Decks_Users",
                type: "integer",
                nullable: true);

            migrationBuilder.UpdateData(
                table: "Decks",
                keyColumn: "DeckId",
                keyValue: 1,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2026, 1, 30, 12, 36, 43, 515, DateTimeKind.Utc).AddTicks(4055), new DateTime(2026, 1, 30, 12, 36, 43, 515, DateTimeKind.Utc).AddTicks(4056) });

            migrationBuilder.UpdateData(
                table: "Decks",
                keyColumn: "DeckId",
                keyValue: 2,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2026, 1, 30, 12, 36, 43, 515, DateTimeKind.Utc).AddTicks(4058), new DateTime(2026, 1, 30, 12, 36, 43, 515, DateTimeKind.Utc).AddTicks(4058) });

            migrationBuilder.UpdateData(
                table: "Decks",
                keyColumn: "DeckId",
                keyValue: 3,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2026, 1, 30, 12, 36, 43, 515, DateTimeKind.Utc).AddTicks(4060), new DateTime(2026, 1, 30, 12, 36, 43, 515, DateTimeKind.Utc).AddTicks(4061) });

            migrationBuilder.CreateIndex(
                name: "IX_Decks_Users_DeckId1",
                table: "Decks_Users",
                column: "DeckId1");

            migrationBuilder.AddForeignKey(
                name: "FK_Decks_Users_Decks_DeckId1",
                table: "Decks_Users",
                column: "DeckId1",
                principalTable: "Decks",
                principalColumn: "DeckId");
        }
    }
}
