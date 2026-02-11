import {
  LuBuilding2 as SchoolBuilding,
  LuTrash2 as Trash,
  LuPencil as Pencil,
  LuUsers as Admins,
} from "react-icons/lu";

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
};

export function SchoolCard({ id, name, admins, createdAt, onEdit, onDelete }: SchoolCardProps) {
  return (
    <div className="rounded-lg border border-border bg-card p-5 shadow-sm hover:shadow-sm flex justify-between">
      <div className="flex items-start gap-4">
        <div className="flex size-12 items-center justify-center rounded-lg bg-background-app-light">
          <SchoolBuilding className="size-6" />
        </div>

        <div className="flex flex-col gap-2">
          <h3 className="text-base font-semibold text-foreground">{name}</h3>
          <div className="mt-3 flex items-center gap-4 text-xs text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <Admins className="size-3.5" />
              {/* added the logic below to see if it should say admin or adminS so it's
              gramatically correct  */}
              <span>{admins.length} admin{admins.length !== 1 ? "s" : ""}</span>
            </div>
            <span>Created {createdAt.toLocaleDateString()}</span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-1">
        <button 
            onClick={() => onEdit?.(id)}
            className="rounded-lg p-2 text-muted-foreground hover:bg-muted hover:text-foreground">
          <Pencil className="size-4" />
        </button>
        <button 
            onClick={() => onDelete?.(id)}
            className="rounded-lg p-2 text-muted-foreground hover:bg-destructive/10 hover:text-destructive">
          <Trash className="size-4" />
        </button>
      </div>
    </div>
  );
}
