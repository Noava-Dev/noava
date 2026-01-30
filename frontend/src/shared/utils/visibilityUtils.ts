import { DeckVisibility } from '../../models/Deck';

// Map string names to numbers
const visibilityStringToNumber = (visibility: any): number => {
  if (typeof visibility === 'number') return visibility;
  
  if (typeof visibility === 'string') {
    switch (visibility.toLowerCase()) {
      case 'public': return DeckVisibility.Public;
      case 'shared': return DeckVisibility.Shared;
      case 'private': return DeckVisibility.Private;
      default: return -1;
    }
  }
  
  return -1;
};

export const getVisibilityLabel = (visibility: any, t: (key: string) => string): string => {
  const numVisibility = visibilityStringToNumber(visibility);
  
  switch (numVisibility) {
    case DeckVisibility.Public:
      return t('visibility.public');
    case DeckVisibility.Shared:
      return t('visibility.shared');
    case DeckVisibility.Private:
      return t('visibility.private');
    default:
      console.warn('Unknown visibility:', visibility);
      return 'Unknown';
  }
};

export const getVisibilityColor = (visibility: any): string => {
  const numVisibility = visibilityStringToNumber(visibility);
  
  switch (numVisibility) {
    case DeckVisibility.Public:
      return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
    case DeckVisibility.Shared:
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
    case DeckVisibility.Private:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

export const getVisibilityBadgeColor = (visibility: any): 'success' | 'info' | 'gray' => {
  const numVisibility = visibilityStringToNumber(visibility);
  
  switch (numVisibility) {
    case DeckVisibility.Public:
      return 'success';
    case DeckVisibility.Shared:
      return 'info';
    case DeckVisibility.Private:
      return 'gray';
    default:
      return 'gray';
  }
};