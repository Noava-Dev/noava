using noava.DTOs.Clerk;
using noava.DTOs.Decks;
using noava.Models;

namespace noava.Services.Decks
{
    public interface IDeckService
    {
        Task<List<DeckResponse>> GetAllDecksAsync();
        Task<List<DeckResponse>> GetUserDecksAsync(string userId, int? limit);
        Task<DeckResponse?> GetDeckByIdAsync(int id);
        Task<List<DeckResponse>> GetDeckByIdsAsync(IEnumerable<int> id, string userId);
        Task<DeckResponse> CreateDeckAsync(DeckRequest request, string userId);
        Task<DeckResponse?> UpdateDeckAsync(int id, DeckRequest request, string userId);
        Task<bool> DeleteDeckAsync(int id, string userId);
        Task<bool> CanUserViewDeckAsync(int deckId, string userId);
        Task<Deck?> GetDeckIfUserCanViewAsync(int deckId, string userId);
        Task<DeckResponse> InviteUserByEmailAsync(int deckId, string userId, string email, bool isOwner);
        Task<DeckResponse> JoinByJoinCodeAsync(string joinCode, string userId, bool isOwner);
        Task<DeckResponse> UpdateJoinCodeAsync(int deckId, string userId);
        Task<IEnumerable<ClerkUserResponseDto>> GetAllUsersByDeckAsync(int deckId, int page, int pageSize, string userId);
        Task<DeckResponse> RemoveOwnerAsync(int deckId, string targetUserId, string userId);
        Task<DeckResponse> RemoveUserAsync(int deckId, string targetUserId, string userId);
        Task<DeckResponse> CopyDeckAsync(int deckId, string userId);
    }
}