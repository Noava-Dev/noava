using noava.Models;

namespace noava.Services.Contracts
{
    public interface ILeitnerBoxService
    {
        int GetIntervalForBox(int boxNumber);
        int GetNextBox(int currentBox, bool isCorrect);
        void UpdateCardProgress(CardProgress card, bool isCorrect);
    }
}