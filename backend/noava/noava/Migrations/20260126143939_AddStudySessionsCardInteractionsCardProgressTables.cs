using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace noava.Migrations
{
    /// <inheritdoc />
    public partial class AddStudySessionsCardInteractionsCardProgressTables : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                    name: "Cards",
                    columns: table => new
                    {
                        Id = table.Column<int>(type: "integer", nullable: false)
                            .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                        DeckId = table.Column<int>(type: "integer", nullable: false),
                        FrontText = table.Column<string>(type: "text", nullable: false),
                        BackText = table.Column<string>(type: "text", nullable: false),
                        FrontImage = table.Column<string>(type: "text", nullable: true),
                        FrontAudio = table.Column<string>(type: "text", nullable: true),
                        BackImage = table.Column<string>(type: "text", nullable: true),
                        BackAudio = table.Column<string>(type: "text", nullable: true),
                        Memo = table.Column<string>(type: "text", nullable: true),
                        CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false, defaultValueSql: "now()"),
                        UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false, defaultValueSql: "now()")
                    },
                    constraints: table =>
                    {
                        table.PrimaryKey("PK_Cards", x => x.Id);
                        table.ForeignKey(
                            name: "FK_Cards_Decks_DeckId",
                            column: x => x.DeckId,
                            principalTable: "Decks",
                            principalColumn: "DeckId",
                            onDelete: ReferentialAction.Cascade);
                    });

            migrationBuilder.CreateTable(
                name: "StudySessions",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    ClerkId = table.Column<string>(type: "text", nullable: false),
                    DeckId = table.Column<int>(type: "integer", nullable: false),
                    StartTime = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    EndTime = table.Column<DateTime>(type: "timestamp with time zone", nullable: false, defaultValueSql: "now()"),
                    TotalCards = table.Column<int>(type: "integer", nullable: false),
                    CorrectCount = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_StudySessions", x => x.Id);
                    table.CheckConstraint("CK_StartTime_EndTime", "\"EndTime\" >= \"StartTime\"");
                    table.CheckConstraint("CK_StudySessions_CorrectCount", "\"CorrectCount\" >= 0 AND \"CorrectCount\" <= \"TotalCards\"");
                    table.ForeignKey(
                        name: "FK_StudySessions_Decks_DeckId",
                        column: x => x.DeckId,
                        principalTable: "Decks",
                        principalColumn: "DeckId",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_StudySessions_Users_ClerkId",
                        column: x => x.ClerkId,
                        principalTable: "Users",
                        principalColumn: "ClerkId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "CardProgress",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    CardId = table.Column<int>(type: "integer", nullable: false),
                    ClerkId = table.Column<string>(type: "text", nullable: false),
                    NextReviewDate = table.Column<DateOnly>(type: "date", nullable: false),
                    BoxNumber = table.Column<int>(type: "integer", nullable: false, defaultValue: 1),
                    LastReviewedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    CorrectCount = table.Column<int>(type: "integer", nullable: false, defaultValue: 0),
                    IncorrectCount = table.Column<int>(type: "integer", nullable: false, defaultValue: 0),
                    Streak = table.Column<int>(type: "integer", nullable: false, defaultValue: 0)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CardProgress", x => x.Id);
                    table.CheckConstraint("CK_CardProgress_BoxNumber_NonNegative", "\"BoxNumber\" >= 1 AND \"BoxNumber\" <= 5");
                    table.CheckConstraint("CK_CardProgress_Counts_NonNegative", "\"CorrectCount\" >= 0 AND \"IncorrectCount\" >= 0 AND \"Streak\" >= 0");
                    table.ForeignKey(
                        name: "FK_CardProgress_Cards_CardId",
                        column: x => x.CardId,
                        principalTable: "Cards",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_CardProgress_Users_ClerkId",
                        column: x => x.ClerkId,
                        principalTable: "Users",
                        principalColumn: "ClerkId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "CardInteractions",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    CardId = table.Column<int>(type: "integer", nullable: false),
                    ClerkId = table.Column<string>(type: "text", nullable: false),
                    StudySessionId = table.Column<int>(type: "integer", nullable: false),
                    DeckId = table.Column<int>(type: "integer", nullable: false),
                    Timestamp = table.Column<DateTime>(type: "timestamp with time zone", nullable: false, defaultValueSql: "now()"),
                    IsCorrect = table.Column<bool>(type: "boolean", nullable: false),
                    ResponseTimeMs = table.Column<int>(type: "integer", nullable: false),
                    StudyMode = table.Column<int>(type: "integer", nullable: false),
                    InteractionType = table.Column<int>(type: "integer", nullable: false),
                    IntervalBefore = table.Column<int>(type: "integer", nullable: false),
                    IntervalAfter = table.Column<int>(type: "integer", nullable: false),
                    DueAtBefore = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    DueAtAfter = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CardInteractions", x => x.Id);
                    table.CheckConstraint("CK_CardInteractions_DueAtBefore_DueAtAfter", "\"DueAtAfter\" >= \"DueAtBefore\"");
                    table.CheckConstraint("CK_CardInteractions_ResponseTimeMs_NonNegative", "\"ResponseTimeMs\" >= 0");
                    table.ForeignKey(
                        name: "FK_CardInteractions_Cards_CardId",
                        column: x => x.CardId,
                        principalTable: "Cards",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_CardInteractions_Decks_DeckId",
                        column: x => x.DeckId,
                        principalTable: "Decks",
                        principalColumn: "DeckId",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_CardInteractions_StudySessions_StudySessionId",
                        column: x => x.StudySessionId,
                        principalTable: "StudySessions",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_CardInteractions_Users_ClerkId",
                        column: x => x.ClerkId,
                        principalTable: "Users",
                        principalColumn: "ClerkId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_CardInteractions_CardId",
                table: "CardInteractions",
                column: "CardId");

            migrationBuilder.CreateIndex(
                name: "IX_CardInteractions_ClerkId",
                table: "CardInteractions",
                column: "ClerkId");

            migrationBuilder.CreateIndex(
                name: "IX_CardInteractions_DeckId",
                table: "CardInteractions",
                column: "DeckId");

            migrationBuilder.CreateIndex(
                name: "IX_CardInteractions_StudySessionId",
                table: "CardInteractions",
                column: "StudySessionId");

            migrationBuilder.CreateIndex(
                name: "IX_CardProgress_CardId",
                table: "CardProgress",
                column: "CardId");

            migrationBuilder.CreateIndex(
                name: "IX_CardProgress_ClerkId",
                table: "CardProgress",
                column: "ClerkId");

            migrationBuilder.CreateIndex(
                name: "IX_StudySessions_ClerkId",
                table: "StudySessions",
                column: "ClerkId");

            migrationBuilder.CreateIndex(
                name: "IX_StudySessions_DeckId",
                table: "StudySessions",
                column: "DeckId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "CardInteractions");

            migrationBuilder.DropTable(
                name: "CardProgress");

            migrationBuilder.DropTable(
                name: "StudySessions");

            migrationBuilder.DropTable(
                name: "Cards");
        }
    }
}
