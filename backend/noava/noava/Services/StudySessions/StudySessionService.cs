using noava.DTOs.StudySessions;
using noava.Models;
using noava.Repositories.Decks;
using noava.Repositories.StudySessions; 
using noava.Services.StudySessions;
using noava.Mappers.StudySessions;
using noava.Models.Enums;
using DocumentFormat.OpenXml.Drawing;
using System.ComponentModel;
using noava.Exceptions;
using noava.Shared;

namespace noava.Services.StudySessions
{
    public class StudySessionService : IStudySessionService
    {
        private readonly IStudySessionRepository _sessionRepository;  
        private readonly IDeckRepository _deckRepository;
        private readonly IAggregateStatisticsService _aggregateStatisticsService;

        public StudySessionService(
            IStudySessionRepository sessionRepository,  
            IDeckRepository deckRepository,
            IAggregateStatisticsService aggregateStatisticsService)
        {
            _sessionRepository = sessionRepository; 
            _deckRepository = deckRepository;
            _aggregateStatisticsService = aggregateStatisticsService;
        }

        public async Task<StudySessionResponse> StartSessionAsync(int deckId, string userId)
        {
            var deck = await _deckRepository.GetByIdAsync(deckId)
                ?? throw new NotFoundException("Deck not found.");

            var hasAccess = await _deckRepository.IsUserLinkedToDeckAsync(deckId, userId);

            if (!hasAccess)
                throw new UnauthorizedException("You don't have access to this deck.");

            var session = new Models.StudySession
            {
                DeckId = deckId,
                ClerkId = userId,
                StartTime = DateTime.UtcNow,
                EndTime = DateTime.UtcNow,
                TotalCards = 0,
                CorrectCount = 0,
            };

            var createdSession = await _sessionRepository.CreateAsync(session); 

            return createdSession.ToResponseDto();
        }

        public async Task<StudySessionResponse> EndSessionAsync(int sessionId, string userId, EndStudySessionRequest request)
        {
            var session = await _sessionRepository.GetByIdAsync(sessionId) 
                ?? throw new NotFoundException("Session not found.");

            if (session.ClerkId != userId)
                throw new UnauthorizedException("You don't have access to this session.");

            session.EndTime = DateTime.UtcNow;
            session.TotalCards = request.TotalCardsReviewed;
            session.CorrectCount = request.CorrectAnswers;

            var updatedSession = await _sessionRepository.UpdateAsync(session);

            await _aggregateStatisticsService.UpdateStudySessionStatsAsync(updatedSession);
            return updatedSession.ToResponseDto();
        }

        public async Task<StudySessionResponse> GetSessionAsync(int sessionId, string userId)
        {
            var session = await _sessionRepository.GetByIdAsync(sessionId)  
                ?? throw new NotFoundException("Session not found.");

            if (session.ClerkId != userId)
                throw new UnauthorizedException("You don't have access to this session.");

            return session.ToResponseDto();
        }
    }
}