import { Dropdown, DropdownItem, DropdownDivider, Badge } from 'flowbite-react';
import { HiDotsVertical, HiPencil, HiTrash, HiChartBar } from 'react-icons/hi';
import { useTranslation } from 'react-i18next';
import { useState, useEffect } from 'react';
import { useAzureBlobService } from '../../services/AzureBlobService';
import type { Deck } from '../../models/Deck';
import { useNavigate } from 'react-router-dom';
import {
  getVisibilityLabel,
  getVisibilityBadgeColor,
} from '../utils/deckVisibilityUtils';

interface DeckCardProps {
  deck: Deck;
  onEdit?: (deck: Deck) => void;
  onDelete?: (deckId: number) => void;
  onView?: (deckId: number) => void;  
  onAnalytics?: (deck: Deck) => void;
  showEdit?: boolean;  
}

function DeckCard({ 
  deck, 
  onEdit, 
  onDelete, 
  onView,  
  onAnalytics,
  showEdit = true  
}: DeckCardProps) {
  const { t } = useTranslation('decks');
  const navigate = useNavigate();
  const azureBlobService = useAzureBlobService();
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loadingImage, setLoadingImage] = useState(false);

  useEffect(() => {
    if (deck.coverImageBlobName) {
      setLoadingImage(true);
      azureBlobService
        .getSasUrl('deck-images', deck.coverImageBlobName)
        .then((url) => setImageUrl(url))
        .catch((err) => {
          console.error('Failed to get image URL:', err);
          setImageUrl(null);
        })
        .finally(() => setLoadingImage(false));
    }
  }, [deck.coverImageBlobName]);

  const handleCardClick = () => {
    if (onView) {
      onView(deck.deckId);
    } else {
      navigate(`/decks/${deck.deckId}/cards`);
    }
  };


  const handleStopPropagation = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <div
      className="relative overflow-hidden transition-shadow duration-300 rounded-lg shadow-lg hover:shadow-xl hover:cursor-pointer"
      onClick={handleCardClick}>
      <div className="relative w-full h-64 sm:h-72 md:h-80">
        {loadingImage ? (
          <div className="flex items-center justify-center w-full h-full bg-gray-200 dark:bg-gray-700 animate-pulse">
            <span className="text-sm text-gray-400">Loading...</span>
          </div>
        ) : imageUrl ? (
          <img
            src={imageUrl}
            alt={deck.title}
            className="object-cover w-full h-full"
          />
        ) : (
          <div className="flex items-center justify-center w-full h-full bg-gradient-to-br from-primary-500 to-primary-700">
            <span className="text-6xl font-bold text-white sm:text-7xl md:text-8xl opacity-30">
              {deck.title.charAt(0).toUpperCase()}
            </span>
          </div>
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>

        {/* 3-Dots Dropdown */}
        <div
          className="absolute z-20 top-2 right-2 sm:top-3 sm:right-3"
          onClick={handleStopPropagation}>
          <Dropdown
            label=""
            dismissOnClick={true}
            renderTrigger={() => (
              <button className="p-1.5 sm:p-2 rounded-lg bg-black/30 hover:bg-black/50 backdrop-blur-sm transition-all">
                <HiDotsVertical className="w-4 h-4 text-white sm:h-5 sm:w-5" />
              </button>
            )}>
            {/* Only show edit if showEdit is true */}
            {showEdit && onEdit && (
              <>
                <DropdownItem icon={HiPencil} onClick={() => onEdit(deck)}>
                  {t('common:actions.edit')}
                </DropdownItem>
                <DropdownDivider />
              </>
            )}
            
            {/* Always show analytics if onAnalytics is provided */}
            {onAnalytics && (
              <>
                <DropdownItem icon={HiChartBar} onClick={() => onAnalytics(deck)}>
                  {t('common:actions.analytics')}
                </DropdownItem>
                <DropdownDivider />
              </>
            )}
            
            {/* Always show delete if onDelete is provided */}
            {onDelete && (
              <DropdownItem
                icon={HiTrash}
                onClick={() => onDelete(deck.deckId)}
                className="text-red-600 dark:text-red-400">
                {t('common:actions.delete')}
              </DropdownItem>
            )}
          </Dropdown>
        </div>

        {/* Content Overlay */}
        <div className="absolute bottom-0 left-0 right-0 z-10 p-3 sm:p-4">
          <div className="flex items-center justify-between mb-2 sm:mb-3">
            <span className="px-2 py-1 text-xs font-medium tracking-wide text-white uppercase border rounded-full bg-white/20 backdrop-blur-md sm:px-3 border-white/30">
              {deck.language}
            </span>
            <Badge color={getVisibilityBadgeColor(deck.visibility)}>
              {getVisibilityLabel(deck.visibility, t)}
            </Badge>
          </div>
          <h3 className="mb-1 text-lg font-bold text-white sm:text-xl md:text-2xl sm:mb-2 drop-shadow-lg line-clamp-2">
            {deck.title}
          </h3>

          {deck.description && (
            <p className="mb-2 text-xs text-white/90 sm:text-sm sm:mb-3 line-clamp-2 drop-shadow">
              {deck.description}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default DeckCard;