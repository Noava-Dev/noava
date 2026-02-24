import { DeckVisibility } from '../../models/Deck';

export const getVisibilityLabel = (
  visibility: DeckVisibility,
  t: (key: string) => string
): string => {
  switch (visibility) {
    case DeckVisibility.Public:
      return t('common:visibility.public');
    case DeckVisibility.Private:
      return t('common:visibility.private');
    default:
      return 'Unknown';
  }
};

export const getVisibilityColor = (visibility: DeckVisibility): string => {
  switch (visibility) {
    case DeckVisibility.Public:
      return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
    case DeckVisibility.Private:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
  }
};

export const getVisibilityBadgeColor = (
  visibility: DeckVisibility
): 'success' | 'gray' => {
  switch (visibility) {
    case DeckVisibility.Public:
      return 'success';
    case DeckVisibility.Private:
      return 'gray';
    default:
      return 'gray';
  }
};
