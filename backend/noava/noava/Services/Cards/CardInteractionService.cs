using noava.DTOs.Cards;
using noava.DTOs.Cards.Interactions;
using noava.DTOs.Cards.Progress;
using noava.Exceptions;
using noava.Mappers.Cards;
using noava.Models;
using noava.Repositories.Cards;
using noava.Repositories.Classrooms;
using noava.Repositories.StudySessions;
using noava.Shared;

namespace noava.Services.Cards
{
    public class CardInteractionService : ICardInteractionService
    {
        private readonly ICardInteractionRepository _interactionRepo;
        private readonly ICardProgressRepository _progressRepo;
        private readonly ILeitnerBoxService _leitner;
        private readonly IAggregateStatisticsService _aggregateStats;
        private readonly IStudySessionRepository _studySessionRepo;
        private readonly IClassroomDeckRepository _classroomDeckRepository;
        private readonly IClassroomRepository _classroomRepository;

        public CardInteractionService(
            ICardInteractionRepository interactionRepo,
            ICardProgressRepository progressRepo,
            ILeitnerBoxService leitner,
            IAggregateStatisticsService aggregateStatisticsService,
            IStudySessionRepository studySessionRepository,
            IClassroomRepository classroomRepository,
            IClassroomDeckRepository classroomDeckRepository)
        {
            _interactionRepo = interactionRepo;
            _progressRepo = progressRepo;
            _leitner = leitner;
            _aggregateStats = aggregateStatisticsService;
            _studySessionRepo = studySessionRepository;
            _classroomRepository = classroomRepository;
            _classroomDeckRepository = classroomDeckRepository;
        }

        public async Task<CardProgressResponse> CreateCardInteractionAsync(
            int studySessionId,
            int deckId,
            int cardId,
            string userId,
            CardInteractionRequest request)
        {
            var progress = await _progressRepo.GetByCardAndUserAsync(cardId, userId);

            if (progress == null)
            {
                progress = new CardProgress
                {
                    CardId = cardId,
                    ClerkId = userId,
                    NextReviewDate = DateOnly.FromDateTime(DateTime.UtcNow),
                    BoxNumber = 1,
                    LastReviewedAt = DateTime.UtcNow
                };

                progress = await _progressRepo.CreateAsync(progress);
            }

            var timeOfDay = TimeOnly.MinValue;

            int intervalBefore = _leitner.GetIntervalForBox(progress.BoxNumber);
            DateTime dueBefore = progress.NextReviewDate.ToDateTime(timeOfDay, DateTimeKind.Utc);

            _leitner.UpdateCardProgress(progress, request.IsCorrect);

            int intervalAfter = _leitner.GetIntervalForBox(progress.BoxNumber);
            DateTime dueAfter = progress.NextReviewDate.ToDateTime(timeOfDay, DateTimeKind.Utc);

            progress = await _progressRepo.UpdateAsync(progress);

            var intervalRequest = new CardInteractionIntervalRequest
            {
                IntervalBefore = intervalBefore,
                IntervalAfter = intervalAfter,
                DueAtBefore = dueBefore,
                DueAtAfter = dueAfter
            };

            var interactionEntity = CardInteractionMapper.ToEntity(
                studySessionId,
                deckId,
                cardId,
                userId,
                request,
                intervalRequest
            );

            await _interactionRepo.CreateAsync(interactionEntity);

            var interactions = new List<CardInteraction> { interactionEntity };
            await _aggregateStats.UpdateInteractionStatsAsync(interactions);

            return new CardProgressResponse
            {
                Id = progress.Id,
                CardId = progress.CardId,
                NextReviewDate = progress.NextReviewDate,
                BoxNumber = progress.BoxNumber,
                LastReviewedAt = progress.LastReviewedAt,
                CorrectCount = progress.CorrectCount,
                IncorrectCount = progress.IncorrectCount,
                Streak = progress.Streak
            };
        }

        public async Task<List<InteractionCount>> GetInteractionStatsAsync(string clerkId)
        {
            return await _interactionRepo.GetInteractionsWholeYearAsync(clerkId);
        }

        public async Task<List<InteractionCount>> GetInteractionStatsByDeckAsync(string clerkId, int deckId)
        {
            return await _interactionRepo
                .GetInteractionsWholeYearByDecksAsync(clerkId, [deckId]);
        }

        public async Task<List<InteractionCount>> GetInteractionStatsByDecksAsync(string clerkId, string ActionTakerId, int classroomId, IEnumerable<int> deckIds)
        {
            var isTeachter = await _classroomRepository.IsTeacherOfClassroomAsync(classroomId, ActionTakerId);
            if (!isTeachter)
                throw new ForbiddenException();

            var doDecksBelongToClassroom = await _classroomDeckRepository.ExistsAsync(deckIds, classroomId);
            if (!doDecksBelongToClassroom)
                return new List<InteractionCount>();

            return await _interactionRepo.GetInteractionsWholeYearByDecksAsync(clerkId, deckIds);
        }
    }
}