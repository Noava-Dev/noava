using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace noava.Migrations
{
    /// <inheritdoc />
    public partial class AddDeckSharingFeatures : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<string>(
                name: "Memo",
                table: "Cards",
                type: "text",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "text");

            //migrationBuilder.CreateTable(
            //    name: "Classrooms",
            //    columns: table => new
            //    {
            //        Id = table.Column<int>(type: "integer", nullable: false)
            //            .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
            //        Name = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
            //        Description = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: false),
            //        JoinCode = table.Column<string>(type: "text", nullable: false),
            //        CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
            //        UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
            //    },
            //    constraints: table =>
            //    {
            //        table.PrimaryKey("PK_Classrooms", x => x.Id);
            //    });

            migrationBuilder.CreateTable(
                name: "DeckInvitations",
                columns: table => new
                {
                    InvitationId = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    DeckId = table.Column<int>(type: "integer", nullable: false),
                    InvitedByClerkId = table.Column<string>(type: "text", nullable: false),
                    InvitedUserEmail = table.Column<string>(type: "text", nullable: false),
                    InvitedUserClerkId = table.Column<string>(type: "text", nullable: true),
                    Status = table.Column<string>(type: "text", nullable: false),
                    InvitedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    RespondedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_DeckInvitations", x => x.InvitationId);
                    table.ForeignKey(
                        name: "FK_DeckInvitations_Decks_DeckId",
                        column: x => x.DeckId,
                        principalTable: "Decks",
                        principalColumn: "DeckId",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_DeckInvitations_Users_InvitedByClerkId",
                        column: x => x.InvitedByClerkId,
                        principalTable: "Users",
                        principalColumn: "ClerkId",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_DeckInvitations_Users_InvitedUserClerkId",
                        column: x => x.InvitedUserClerkId,
                        principalTable: "Users",
                        principalColumn: "ClerkId",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "Decks_Users",
                columns: table => new
                {
                    ClerkId = table.Column<string>(type: "text", nullable: false),
                    DeckId = table.Column<int>(type: "integer", nullable: false),
                    IsOwner = table.Column<bool>(type: "boolean", nullable: false, defaultValue: false),
                    AddedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    DeckId1 = table.Column<int>(type: "integer", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Decks_Users", x => new { x.ClerkId, x.DeckId });
                    table.ForeignKey(
                        name: "FK_Decks_Users_Decks_DeckId",
                        column: x => x.DeckId,
                        principalTable: "Decks",
                        principalColumn: "DeckId",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Decks_Users_Decks_DeckId1",
                        column: x => x.DeckId1,
                        principalTable: "Decks",
                        principalColumn: "DeckId");
                    table.ForeignKey(
                        name: "FK_Decks_Users_Users_ClerkId",
                        column: x => x.ClerkId,
                        principalTable: "Users",
                        principalColumn: "ClerkId",
                        onDelete: ReferentialAction.Cascade);
                });

            //migrationBuilder.CreateTable(
            //    name: "ClassroomUsers",
            //    columns: table => new
            //    {
            //        ClassroomId = table.Column<int>(type: "integer", nullable: false),
            //        UserId = table.Column<string>(type: "text", nullable: false),
            //        IsTeacher = table.Column<bool>(type: "boolean", nullable: false)
            //    },
            //    constraints: table =>
            //    {
            //        table.PrimaryKey("PK_ClassroomUsers", x => new { x.ClassroomId, x.UserId });
            //        table.ForeignKey(
            //            name: "FK_ClassroomUsers_Classrooms_ClassroomId",
            //            column: x => x.ClassroomId,
            //            principalTable: "Classrooms",
            //            principalColumn: "Id",
            //            onDelete: ReferentialAction.Cascade);
            //        table.ForeignKey(
            //            name: "FK_ClassroomUsers_Users_UserId",
            //            column: x => x.UserId,
            //            principalTable: "Users",
            //            principalColumn: "ClerkId",
            //            onDelete: ReferentialAction.Cascade);
            //    });

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

            //migrationBuilder.CreateIndex(
            //    name: "IX_Classrooms_JoinCode",
            //    table: "Classrooms",
            //    column: "JoinCode",
            //    unique: true);

            //migrationBuilder.CreateIndex(
            //    name: "IX_ClassroomUsers_UserId",
            //    table: "ClassroomUsers",
            //    column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_DeckInvitations_DeckId",
                table: "DeckInvitations",
                column: "DeckId");

            migrationBuilder.CreateIndex(
                name: "IX_DeckInvitations_InvitedByClerkId",
                table: "DeckInvitations",
                column: "InvitedByClerkId");

            migrationBuilder.CreateIndex(
                name: "IX_DeckInvitations_InvitedUserClerkId",
                table: "DeckInvitations",
                column: "InvitedUserClerkId");

            migrationBuilder.CreateIndex(
                name: "IX_DeckInvitations_InvitedUserEmail",
                table: "DeckInvitations",
                column: "InvitedUserEmail");

            migrationBuilder.CreateIndex(
                name: "IX_DeckInvitations_Status",
                table: "DeckInvitations",
                column: "Status");

            migrationBuilder.CreateIndex(
                name: "IX_Decks_Users_ClerkId",
                table: "Decks_Users",
                column: "ClerkId");

            migrationBuilder.CreateIndex(
                name: "IX_Decks_Users_DeckId",
                table: "Decks_Users",
                column: "DeckId");

            migrationBuilder.CreateIndex(
                name: "IX_Decks_Users_DeckId1",
                table: "Decks_Users",
                column: "DeckId1");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            //migrationBuilder.DropTable(
            //    name: "ClassroomUsers");

            migrationBuilder.DropTable(
                name: "DeckInvitations");

            migrationBuilder.DropTable(
                name: "Decks_Users");

            //migrationBuilder.DropTable(
            //    name: "Classrooms");

            migrationBuilder.AlterColumn<string>(
                name: "Memo",
                table: "Cards",
                type: "text",
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "text",
                oldNullable: true);

            migrationBuilder.UpdateData(
                table: "Decks",
                keyColumn: "DeckId",
                keyValue: 1,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2026, 1, 28, 13, 12, 38, 637, DateTimeKind.Utc).AddTicks(5260), new DateTime(2026, 1, 28, 13, 12, 38, 637, DateTimeKind.Utc).AddTicks(5260) });

            migrationBuilder.UpdateData(
                table: "Decks",
                keyColumn: "DeckId",
                keyValue: 2,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2026, 1, 28, 13, 12, 38, 637, DateTimeKind.Utc).AddTicks(5262), new DateTime(2026, 1, 28, 13, 12, 38, 637, DateTimeKind.Utc).AddTicks(5263) });

            migrationBuilder.UpdateData(
                table: "Decks",
                keyColumn: "DeckId",
                keyValue: 3,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2026, 1, 28, 13, 12, 38, 637, DateTimeKind.Utc).AddTicks(5265), new DateTime(2026, 1, 28, 13, 12, 38, 637, DateTimeKind.Utc).AddTicks(5265) });
        }
    }
}
