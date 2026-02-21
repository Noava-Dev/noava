import {
  Dropdown,
  DropdownItem,
  DropdownDivider,
} from 'flowbite-react';
import { HiDotsVertical, HiPencil, HiTrash, HiRefresh } from 'react-icons/hi';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useAzureBlobService } from '../../services/AzureBlobService';
import type { ClassroomResponse } from '../../models/Classroom';

interface ClassroomCardProps {
  classroom: ClassroomResponse;
  onEdit?: (c: ClassroomResponse) => void;
  onDelete?: (id: number) => void;
  onRequestNewCode?: (id: number) => void;
}

function ClassroomCard({
  classroom,
  onEdit,
  onDelete,
  onRequestNewCode,
}: ClassroomCardProps) {
  const { t } = useTranslation('classrooms');
  const navigate = useNavigate();
  const azureBlobService = useAzureBlobService();
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loadingImage, setLoadingImage] = useState(false);

  useEffect(() => {
    if (classroom.coverImageBlobName) {
      setLoadingImage(true);
      azureBlobService
        .getSasUrl('classroom-images', classroom.coverImageBlobName)
        .then((url) => setImageUrl(url))
        .catch((err) => {
          console.error('Failed to get classroom image URL:', err);
          setImageUrl(null);
        })
        .finally(() => setLoadingImage(false));
    }
  }, [classroom.coverImageBlobName]);

  const handleCardClick = () => {
    navigate(`/classrooms/${classroom.id}`);
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
            alt={classroom.name}
            className="object-cover w-full h-full"
          />
        ) : (
          <div className="flex items-center justify-center w-full h-full bg-gradient-to-br from-primary-500 to-primary-700">
            <span className="text-6xl font-bold text-white sm:text-7xl md:text-8xl opacity-30">
              {classroom.name.charAt(0).toUpperCase()}
            </span>
          </div>
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>

        {/* 3-Dots Dropdown */}
        {(classroom.permissions.canEdit || classroom.permissions.canDelete) && (
          <div
            className="absolute z-20 top-2 right-2 sm:top-3 sm:right-3"
            onClick={handleStopPropagation}>
            <Dropdown
              label=""
              dismissOnClick={true}
              className="min-w-max"
              renderTrigger={() => (
                <button className="p-1.5 sm:p-2 rounded-lg bg-black/30 hover:bg-black/50 backdrop-blur-sm transition-all">
                  <HiDotsVertical className="w-4 h-4 text-white sm:h-5 sm:w-5" />
                </button>
              )}>
              {classroom.permissions.canEdit && (
                <DropdownItem
                  icon={HiPencil}
                  onClick={() => onEdit?.(classroom)}
                  className="whitespace-nowrap">
                  {t('common:actions.edit')}
                </DropdownItem>
              )}
              {classroom.permissions.canEdit && (
                <DropdownItem
                  icon={HiRefresh}
                  onClick={() => onRequestNewCode?.(classroom.id)}
                  className="whitespace-nowrap">
                  {t('card.regenerateCode')}
                </DropdownItem>
              )}
              {classroom.permissions.canDelete && <DropdownDivider />}
              {classroom.permissions.canDelete && (
                <DropdownItem
                  icon={HiTrash}
                  onClick={() => onDelete?.(classroom.id)}
                  className="text-red-600 dark:text-red-400">
                  {t('common:actions.delete')}
                </DropdownItem>
              )}
            </Dropdown>
          </div>
        )}

        {/* Content Overlay */}
        <div className="absolute bottom-0 left-0 right-0 z-10 p-3 sm:p-4">
          <h3 className="mb-1 text-lg font-bold text-white sm:text-xl md:text-2xl sm:mb-2 drop-shadow-lg line-clamp-2">
            {classroom.name}
          </h3>

          {classroom.description && (
            <p className="mb-2 text-xs text-white/90 sm:text-sm sm:mb-3 line-clamp-2 drop-shadow">
              {classroom.description}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default ClassroomCard;
