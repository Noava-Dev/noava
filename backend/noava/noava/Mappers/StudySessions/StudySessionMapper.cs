using noava.DTOs.StudySessions;

namespace noava.Mappers.StudySessions
{
    public static class StudySessionMapper
    {
        public static StudySessionResponse ToResponseDto(this Models.StudySession session)
        {
            return new StudySessionResponse
            {
                SessionId = session.Id,
                StartTime = session.StartTime,
                EndTime = session.EndTime,
                TotalCards = session.TotalCards,
                CorrectCount = session.CorrectCount
            };
        }

        public static List<StudySessionResponse> ToResponseDtoList(this IEnumerable<Models.StudySession> sessions)
        {
            return sessions.Select(s => s.ToResponseDto()).ToList();
        }
    }
}