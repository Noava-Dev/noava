import {  Dropdown, DropdownItem, DropdownDivider, Badge } from 'flowbite-react';
import { HiDotsVertical, HiPencil, HiTrash } from 'react-icons/hi';
import { useTranslation } from 'react-i18next';
import { useState, useEffect } from 'react';
import { useAzureBlobService } from '../../services/AzureBlobService';
import type { Deck } from '../../models/Deck';
import { useNavigate } from 'react-router-dom';
import { getVisibilityBadgeColor } from '../utils/visibilityUtils';

interface DeckCardProps {
  deck: Deck;
  onEdit?: (deck: Deck) => void;
  onDelete?: (deckId: number) => void;
}

function DeckCard({ deck, onEdit, onDelete }: DeckCardProps) {
  const { t } = useTranslation('decks');
  const navigate = useNavigate();
  const azureBlobService = useAzureBlobService();
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loadingImage, setLoadingImage] = useState(false);

  useEffect(() => {
    if (deck.coverImageBlobName) {
      setLoadingImage(true);
      azureBlobService.getBlobSasUrl(deck.coverImageBlobName)
        .then(url => setImageUrl(url))
        .catch(err => {
          console.error('Failed to get image URL:', err);
          setImageUrl(null);
        })
        .finally(() => setLoadingImage(false));
    }
  }, [deck.coverImageBlobName]);

  const getVisibilityLabel = (visibility: number) => {
    switch (visibility) {
      case 0: return t('visibility.public');
      case 1: return t('visibility.shared');
      case 2: return t('visibility.private');
      default: return 'Unknown';
    }
  };

  //  const getVisibilityColor = (visibility: number) => {
  //   switch (visibility) {
  //     case 0: return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
  //     case 1: return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
  //     case 2: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
  //     default: return 'bg-gray-100 text-gray-800';
  //   }
  // };

  const handleCardClick = () => {
    navigate(`/decks/${deck.deckId}/cards`);
  };

  // Prevent navigation when clicking dropdown or Study button
  const handleStopPropagation = (e: React.MouseEvent) => {
    e.stopPropagation();
  };


  return (
    <div className="relative rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 hover:cursor-pointer" onClick={handleCardClick}>
      <div className="relative w-full h-64 sm:h-72 md:h-80">
        {loadingImage ? (
          <div className="w-full h-full bg-gray-200 dark:bg-gray-700 animate-pulse flex items-center justify-center">
            <span className="text-gray-400 text-sm">Loading...</span>
          </div>
        ) : imageUrl ? (
          <img src={imageUrl} alt={deck.title} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center">
            <span className="text-6xl sm:text-7xl md:text-8xl text-white font-bold opacity-30">
              {deck.title.charAt(0).toUpperCase()}
            </span>
          </div>
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>

        {/* 3-Dots Dropdown */}
        <div className="absolute top-2 right-2 sm:top-3 sm:right-3 z-20" onClick={handleStopPropagation}>
          <Dropdown
            label=""
            dismissOnClick={true}
            renderTrigger={() => (
              <button className="p-1.5 sm:p-2 rounded-lg bg-black/30 hover:bg-black/50 backdrop-blur-sm transition-all">
                <HiDotsVertical className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
              </button>
            )}
          >
            <DropdownItem icon={HiPencil} onClick={() => onEdit?.(deck)}>
              {t('card.edit')}
            </DropdownItem>
            <DropdownDivider />
            <DropdownItem 
              icon={HiTrash} 
              onClick={() => onDelete?.(deck.deckId)} 
              className="text-red-600 dark:text-red-400"
            >
              {t('card.delete')}
            </DropdownItem>
          </Dropdown>
        </div>

        {/* Content Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4 z-10">
          <div className="flex items-center justify-between mb-2 sm:mb-3">
            <span className="text-xs bg-white/20 backdrop-blur-md text-white px-2 sm:px-3 py-1 rounded-full font-medium uppercase tracking-wide border border-white/30">
              {deck.language}
            </span>
            <Badge color={getVisibilityBadgeColor(deck.visibility)}>  {/* ← USE UTILITY */}
              {getVisibilityLabel(deck.visibility)}  {/* ← USE UTILITY */}
            </Badge>
          </div>
          <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-white mb-1 sm:mb-2 drop-shadow-lg line-clamp-2">
            {deck.title}
          </h3>

          {deck.description && (
            <p className="text-white/90 text-xs sm:text-sm mb-2 sm:mb-3 line-clamp-2 drop-shadow">
              {deck.description}
            </p>
          )}

          <button onClick={handleStopPropagation} className="w-full bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-600 hover:to-cyan-700 text-white font-semibold py-2 sm:py-3 rounded-lg transition-all flex items-center justify-center gap-2 shadow-lg text-sm sm:text-base">
            <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
            </svg>
            Study Now
          </button>
        </div>
      </div>
    </div>
  );
}

export default DeckCard;