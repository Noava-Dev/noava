import { LuBookOpen, LuLayers, LuFolder, LuHouse } from 'react-icons/lu';
import { HiOutlineCube } from 'react-icons/hi';

export const defaultIcon = LuFolder;

export const iconMap: Record<string, any> = {
  'noava docs': LuHouse,
  'getting started': LuBookOpen,
  'core concepts': HiOutlineCube,
  decks: LuLayers,
};
