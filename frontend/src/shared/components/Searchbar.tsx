import { TextInput } from 'flowbite-react';
import { HiSearch } from 'react-icons/hi';
import { useTranslation } from 'react-i18next';

interface SearchbarProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
}

function Searchbar({ searchTerm, setSearchTerm }: SearchbarProps) {
  const { t } = useTranslation('common');
  const SearchIcon = HiSearch;
  return (
    <div className="max-w-md">
      <TextInput
        id="search"
        placeholder={t('actions.searchPlaceholder')}
        icon={SearchIcon}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
    </div>
  );
}

export default Searchbar;
