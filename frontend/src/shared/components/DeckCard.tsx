import { Card } from 'flowbite-react';
import { HiPencil, HiTrash } from 'react-icons/hi';
import { useTranslation } from 'react-i18next';
import type { Deck } from '../../models/Deck';

interface DeckCardProps {
  deck: Deck;
  onEdit?: (deck: Deck) => void;
  onDelete?: (deckId: number) => void;
}

function DeckCard({ deck, onEdit, onDelete }: DeckCardProps) {
  const { t } = useTranslation('decks');

  const getVisibilityLabel = (visibility: number) => {
    switch (visibility) {
      case 0: return t('visibility.public');
      case 1: return t('visibility.shared');
      case 2: return t('visibility.private');
      default: return 'Unknown';
    }
  };

  const getVisibilityColor = (visibility: number) => {
    switch (visibility) {
      case 0: return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 1: return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 2: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card className="hover:shadow-lg transition-shadow duration-300">
      

      {/* Content */}
      <div className="p-4">
        {/* Title  */}
        <div className="flex items-start justify-between mb-2">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white flex-1">
            {deck.title}
          </h3>
          <span className={`text-xs px-2 py-1 rounded-full ${getVisibilityColor(deck.visibility)}`}>
            {getVisibilityLabel(deck.visibility)}
          </span>
        </div>

        {/* Description */}
        {deck.description && (
          <p className="text-gray-600 dark:text-gray-400 text-sm mb-3 line-clamp-2">
            {deck.description}
          </p>
        )}

        {/* Language */}
        {deck.language && (
          <div className="mb-4">
            <span className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-2 py-1 rounded">
              {deck.language}
            </span>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2 pt-3 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={() => onEdit?.(deck)}
            className="flex-1 flex items-center justify-center gap-2 bg-primary-500 text-white px-4 py-2 rounded-lg hover:bg-primary-600 transition-colors"
          >
            <HiPencil className="h-4 w-4" />
            {t('card.edit')}
          </button>
          <button
            onClick={() => onDelete?.(deck.deckId)}
            className="flex items-center justify-center gap-2 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
          >
            <HiTrash className="h-4 w-4" />
          </button>
        </div>
      </div>
    </Card>
  );
}

export default DeckCard;