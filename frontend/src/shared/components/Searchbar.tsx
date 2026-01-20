import { Label, TextInput } from "flowbite-react";

interface SearchbarProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
}

function Searchbar({ searchTerm, setSearchTerm }: SearchbarProps) {
    const SearchIcon = () => (
        <svg 
            className="w-5 h-5 text-gray-500" 
            aria-hidden="true" 
            xmlns="http://www.w3.org/2000/svg" 
            fill="none" 
            viewBox="0 0 24 24"
        >
            <path 
                stroke="currentColor" 
                strokeLinecap="round" 
                strokeWidth="2" 
                d="m21 21-3.5-3.5M17 10a7 7 0 1 1-14 0 7 7 0 0 1 14 0Z"
            />
        </svg>
    );

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