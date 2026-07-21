import Input from '@/components/forms/input';
import React from 'react'
import { Search } from "lucide-react";

interface SearchInputProps{
    size: number;
    searchPlaceholder: string;
    searchQuery: string;
    setSearchQuery?: React.Dispatch<React.SetStateAction<string>>;
}

const SearchInput = ({ size, searchPlaceholder, searchQuery, setSearchQuery }: SearchInputProps) => {
    if (size <= 0) return null;
    return (
            <div className="mb-6 relative">
            {/* <SearchInput className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-secondary-400" /> */}
             <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-secondary-400" />
                <Input
                    type="text"
                    placeholder={searchPlaceholder}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="input pl-10"
                />
            </div>
  )
}

export default SearchInput