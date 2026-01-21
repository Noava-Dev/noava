import { Label, TextInput } from "flowbite-react";
import { HiSearch } from "react-icons/hi";

interface SearchbarProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
}

function Searchbar({ searchTerm, setSearchTerm }: SearchbarProps) {
    const SearchIcon = HiSearch;
    return (
        <div className="max-w-md">
            <div className="mb-2 block">
                <Label htmlFor="search">Search</Label>
            </div>
            <TextInput 
                id="search" 
                placeholder="Search FAQs..." 
                icon={SearchIcon}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
        </div>
    );
}

export default Searchbar;