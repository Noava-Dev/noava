using noava.Models;

namespace noava.DTOs
{
    public record CreateDeckRequest(
        string Title,
        string? Description,
        string? Language,
        DeckVisibility Visibility
    );

    public record UpdateDeckRequest(
        string Title,
        string? Description,
        string? Language,
        DeckVisibility Visibility
    );
}