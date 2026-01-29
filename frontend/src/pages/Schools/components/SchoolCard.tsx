import {
  LuBuilding2 as SchoolBuilding,
  LuTrash2 as Trash,
  LuPencil as Pencil,
//   LuPlus,
//   LuX,
//   LuSearch,
  LuUsers as Admins,
} from "react-icons/lu";

type SchoolCardType = {};

export function SchoolCard({}: SchoolCardType) {
  return (
    <div className="flex bg-card w-1/2 justify-between p-5 shadow-sm hover:shadow-md rounded-xl border-r ">
      <div className="flex items-center gap-4">
        <div className="flex size-14 items-center justify-center rounded-lg bg-background-subtle-light ">
          <SchoolBuilding className="size-7"/>
        </div>
        <div className="de-info flex flex-col gap-1">
          <div>
            <h2 className="text-base font-semibold text-foreground">
              <b>Erasmushogeschool Brussel</b>
            </h2>
          </div>
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <div className="icoontje">
                <Admins className="size-3.5" />
              </div>
              <div className="admin">
                <p>2 admins</p>
              </div>
            </div>
            <div>
              <p>Created 29 januari, 2024</p>
            </div>
          </div>
          <div></div>
        </div>
      </div>
      <div className="flex gap-4">
        <div className="flex size-8 cursor-pointer items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground">
          <Pencil/>
        </div>
        <div className="flex size-8 cursor-pointer items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground">
          <Trash/>
        </div>
      </div>
    </div>
  );
}

//TODO: add Badges for the people that are school admins
