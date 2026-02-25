import {
  LuBuilding2 as SchoolBuilding,
  LuTrash2 as Trash,
  LuPencil as Pencil,
  LuUsers as Admins,
} from "react-icons/lu";
import { useTranslation } from 'react-i18next';

type SchoolAdminDto = {
  id: string;
  name: string;
  email: string;
};

type SchoolCardProps = {
  id: number;
  name: string;
  description?: string;
  admins: SchoolAdminDto[];
  createdAt: Date;
  onEdit?: (id: number) => void;
  onDelete?: (id: number) => void;
  onClick?: (id: number) => void;
};

export function SchoolCard({ id, name, admins, createdAt, onEdit, onDelete, onClick }: SchoolCardProps) {
  const { t, i18n } = useTranslation('schools');

  return (
    <div 
        onClick={() => onClick?.(id)}
        className="rounded-lg bg-background-app-light border border-primary-100 dark:border-none dark:bg-background-surface-dark p-5 shadow-sm hover:shadow-sm flex justify-between cursor-pointer">
      <div className="flex items-start gap-4">
        <div className="flex size-12 items-center justify-center rounded-lg bg-primary-200 dark:bg-primary-600 dark:text-text-title-dark">
          <SchoolBuilding className="size-6" />
        </div>

        <div className="flex flex-col gap-2">
          <h3 className="text-base font-semibold text-text-title-light dark:text-text-title-dark">{name}</h3>
          <div className="mt-3 flex items-center gap-4 text-xs text-text-muted-light dark:text-text-muted-dark">
            <div className="flex items-center gap-1.5">
              <Admins className="size-3.5 text-text-muted-light dark:text-text-muted-dark" />
              <span className="text-text-muted-light dark:text-text-muted-dark">{t('card.adminsCount', { count: admins.length })}</span>
            </div>
            <span className="text-text-muted-light dark:text-text-muted-dark">{t('card.createdAt', { date: createdAt.toLocaleDateString(i18n.language) })}</span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-1">
        <button 
            onClick={(e) => {
              e.stopPropagation();
              onEdit?.(id)
            }}
            className="rounded-lg p-2 text-muted-foreground hover:bg-muted hover:text-foreground">
          <Pencil className="size-4" />
        </button>
        <button 
            onClick={(e) => {
              e.stopPropagation();
              onDelete?.(id)
            }}
            className="rounded-lg p-2 text-muted-foreground hover:bg-destructive/10 hover:text-destructive">
          <Trash className="size-4" />
        </button>
      </div>
    </div>
  );
}
