import {
  LuBookOpen as OpenBook,
  LuLayers as Layers,
  LuSchool as School,
  LuFolder as Folder,
} from "react-icons/lu";

export const defaultIcon = Folder;

export const iconMap: Record<string, any> = {
  classrooms: School,
  decks: Layers,
  schools: OpenBook,
};
