// app/post/_component/SearchBar.tsx
'use client';

import React, { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { BiSearch } from 'react-icons/bi';

type SearchBarProps = {
  searchUrl: string;
  initialQuery?: string;
  suggestions?: string[];
};

const SearchBar: React.FC<SearchBarProps> = ({
  searchUrl,
  initialQuery = '',
  suggestions = [],
}) => {
  const [searchTerm, setSearchTerm] = useState(initialQuery);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const router = useRouter();

  const filteredSuggestions = searchTerm
    ? suggestions
        .filter((suggestion) => suggestion.toLowerCase().includes(searchTerm.toLowerCase()))
        .slice(0, 5)
    : [];

  const handleSearch = useCallback(
    (term: string) => {
      if (term.trim() !== '') {
        router.push(`${searchUrl}?query=${encodeURIComponent(term)}`);
        setShowSuggestions(false);
      }
    },
    [router, searchUrl]
  );

  const handleSuggestionClick = (suggestion: string) => {
    setSearchTerm(suggestion);
    handleSearch(suggestion);
  };

  return (
    <div className="flex justify-center mx-4">
      <div className="relative w-full max-w-lg">
        <BiSearch
          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
          size={20}
        />
        <input
          type="text"
          placeholder="Search posts..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setShowSuggestions(true);
          }}
          onKeyPress={(e) => e.key === 'Enter' && handleSearch(searchTerm)}
          className="border border-gray-300 rounded-md p-2 pl-10 w-full"
        />
        {showSuggestions && filteredSuggestions.length > 0 && (
          <ul className="absolute z-10 w-full bg-white border border-gray-300 rounded-md mt-1">
            {filteredSuggestions.map((suggestion, index) => (
              <li
                key={index}
                className="p-2 hover:bg-gray-100 cursor-pointer"
                onClick={() => handleSuggestionClick(suggestion)}
              >
                {suggestion}
              </li>
            ))}
          </ul>
        )}
      </div>
      <Button onClick={() => handleSearch(searchTerm)} className="ml-2">
        Search
      </Button>
    </div>
  );
};

export default SearchBar;
