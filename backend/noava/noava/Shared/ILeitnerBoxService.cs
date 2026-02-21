using noava.Models;

namespace noava.Services
{
    public interface ILeitnerBoxService
    {
        int GetIntervalForBox(int boxNumber);
        int GetBoxFromInterval(int intervalDays);
        int GetNextBox(int currentBox, bool isCorrect);
        void UpdateCardProgress(CardProgress card, bool isCorrect);
    }
}