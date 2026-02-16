using ClosedXML.Excel;
using CsvHelper;
using CsvHelper.Configuration;
using noava.DTOs.Cards;
using noava.Models;
using noava.Repositories.Cards;
using noava.Repositories.Decks;
using System.Globalization;

namespace noava.Services.Cards
{
    public class CardImportService : ICardImportService
    {
        private readonly ICardRepository _cardRepository;
        private readonly IDeckRepository _deckRepository;

        public CardImportService(ICardRepository cardRepository, IDeckRepository deckRepository)
        {
            _cardRepository = cardRepository;
            _deckRepository = deckRepository;
        }


        public async Task<int> ImportCardsAsync(int deckId, IFormFile file, string userId)
        {
            var deck = await _deckRepository.GetByIdAsync(deckId);
            if (deck == null || deck.UserId != userId)
                throw new UnauthorizedAccessException("Not authorized to add cards to this deck");

            var extension = Path.GetExtension(file.FileName).ToLowerInvariant();

            using var stream = file.OpenReadStream();
            List<Card> importedCards = extension switch
            {
                ".csv" => ParseCsv(stream),
                ".xls" or ".xlsx" => ParseExcel(stream),
                _ => throw new InvalidOperationException("Unsupported file type")
            };

            foreach (var card in importedCards)
            {
                card.DeckId = deckId;
            }

            await _cardRepository.CreateBulkAsync(importedCards);

            return importedCards.Count;
        }

        private List<Card> ParseExcel(Stream fileStream)
        {
            var importedCards = new List<Card>();

            using var workbook = new XLWorkbook(fileStream);
            var ws = workbook.Worksheets.First();

            var headerRow = ws.Row(1);
            int frontCol = 0, backCol = 0, memoCol = 0, hasVoiceAssistantCol = 0;

            foreach (var cell in headerRow.CellsUsed())
            {
                var value = cell.GetString().Trim().ToLower();
                if (value == "fronttext") frontCol = cell.Address.ColumnNumber;
                if (value == "backtext") backCol = cell.Address.ColumnNumber;
                if (value == "memo") memoCol = cell.Address.ColumnNumber;
                if (value == "hasvoiceassistant") hasVoiceAssistantCol = cell.Address.ColumnNumber;
            }

            if (frontCol == 0 || backCol == 0)
            {
                throw new InvalidOperationException("Excel must have 'FrontText' and 'BackText' columns.");
            }

            // iterate rows
            foreach (var row in ws.RowsUsed().Skip(1))
            {
                var front = row.Cell(frontCol).GetString().Trim();
                var back = row.Cell(backCol).GetString().Trim();
                var memo = memoCol > 0 ? row.Cell(memoCol).GetString().Trim() : null;
                var hasVoiceAssistant = false;

                if (hasVoiceAssistantCol > 0)
                {
                    var raw = row.Cell(hasVoiceAssistantCol).GetString().Trim();

                    if (!string.IsNullOrWhiteSpace(raw))
                    {
                        hasVoiceAssistant = !raw.Equals("false", StringComparison.OrdinalIgnoreCase);
                    }
                }

                // skip invalid rows
                if (string.IsNullOrEmpty(front) || string.IsNullOrEmpty(back))
                {
                    continue;
                }

                importedCards.Add(new Card
                {
                    FrontText = front,
                    BackText = back,
                    Memo = string.IsNullOrEmpty(memo) ? null : memo,
                    HasVoiceAssistant = hasVoiceAssistant
                });
            }

            return importedCards;
        }

        private List<Card> ParseCsv(Stream fileStream)
        {
            using var reader = new StreamReader(fileStream);
            using var csv = new CsvReader(reader, new CsvConfiguration(CultureInfo.InvariantCulture)
            {
                HasHeaderRecord = true,
                TrimOptions = TrimOptions.Trim,
                IgnoreBlankLines = true,
                MissingFieldFound = null,
                BadDataFound = null,
                HeaderValidated = null,
                PrepareHeaderForMatch = args => args.Header.Trim().ToLowerInvariant(),
            });

            var rows = csv.GetRecords<CardCsvImportDto>();

            var cards = new List<Card>();

            foreach (var row in rows)
            {
                if (string.IsNullOrWhiteSpace(row.FrontText) || string.IsNullOrWhiteSpace(row.BackText))
                {
                    throw new InvalidOperationException("CSV must have 'FrontText' and 'BackText' headers.");
                }

                var raw = row.HasVoiceAssistant?.Trim();

                cards.Add(new Card
                {
                    FrontText = row.FrontText,
                    BackText = row.BackText,
                    Memo = row.Memo,
                    HasVoiceAssistant = !string.IsNullOrWhiteSpace(raw) && !raw.Equals("false", StringComparison.OrdinalIgnoreCase)
                });
            }

            return cards;
        }
    }
}
