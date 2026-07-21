import Input from '@/components/forms/input';
import React from 'react'

interface SearchInputProps{
    size: number;
    searchPlaceholder: string;
    searchQuery: string;
    setSearchQuery?: () => void;
}

const SearchInput = ({size, searchPlaceholder, searchQuery, setSearchQuery}:SearchInputProps) => {
    return (
        <>
        {size > 0 && (
            <div className="mb-6 relative">
            <SearchInput className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-secondary-400" />
            <Input
              type="text"
              placeholder={searchPlaceholder}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input pl-10"
              />
          </div>
        )}
        </>
  )
}

export default SearchInput