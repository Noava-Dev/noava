import {
  Dropdown,
  DropdownItem,
  DropdownDivider,
  Button,
} from 'flowbite-react';
import { HiDotsVertical, HiPencil, HiTrash, HiRefresh } from 'react-icons/hi';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
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

  const handleCardClick = () => {
    navigate(`/classrooms/${classroom.id}`);
  };

  const handleStopPropagation = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  const handleShow = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`/classrooms/${classroom.id}`);
  };

  return (
    <div
      className="relative flex h-full overflow-visible transition-shadow duration-300 bg-white border border-gray-100 rounded-lg shadow-lg hover:shadow-xl hover:cursor-pointer dark:bg-gray-800 dark:border-gray-700"
      onClick={handleCardClick}>
      <div className="flex flex-col flex-1 p-4 sm:p-6">
        <div className="flex items-start justify-between mb-2">
          <h3 className="mb-1 text-lg font-bold text-gray-900 sm:text-xl md:text-2xl dark:text-white line-clamp-2">
            {classroom.name}
          </h3>

          {(classroom.permissions.canEdit ||
            classroom.permissions.canDelete) && (
            <div className="ml-2" onClick={handleStopPropagation}>
              <Dropdown
                label=""
                dismissOnClick={true}
                renderTrigger={() => (
                  <button className="p-1.5 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all">
                    <HiDotsVertical className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                  </button>
                )}>
                {classroom.permissions.canEdit && (
                  <DropdownItem
                    icon={HiPencil}
                    onClick={() => onEdit?.(classroom)}>
                    {t('card.edit')}
                  </DropdownItem>
                )}
                {classroom.permissions.canEdit && (
                  <DropdownItem
                    icon={HiRefresh}
                    onClick={() => onRequestNewCode?.(classroom.id)}>
                    {t('card.regenerateCode')}
                  </DropdownItem>
                )}
                {classroom.permissions.canDelete && <DropdownDivider />}
                {classroom.permissions.canDelete && (
                  <DropdownItem
                    icon={HiTrash}
                    onClick={() => onDelete?.(classroom.id)}
                    className="text-red-600 dark:text-red-600 hover:text-red-600 dark:hover:text-red-600 hover:border-red-600"
                    color="red">
                    {t('card.delete')}
                  </DropdownItem>
                )}
              </Dropdown>
            </div>
          )}
        </div>

        {classroom.description && (
          <p className="mb-3 text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
            {classroom.description}
          </p>
        )}

        <div className="mt-auto">
          <Button size="sm" onClick={handleShow} className="w-full">
            {t('card.show')}
          </Button>
        </div>
      </div>
    </div>
  );
}

export default ClassroomCard;
