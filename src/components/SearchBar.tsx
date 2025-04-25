
import React, { useState, useEffect, useRef } from 'react';
import { Input } from "@/components/ui/input";
import { Search } from 'lucide-react';
import { Doctor, getSearchSuggestions } from '@/services/doctorService';

interface SearchBarProps {
  doctors: Doctor[];
  onSearch: (searchTerm: string) => void;
  initialSearchTerm?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({ doctors, onSearch, initialSearchTerm = '' }) => {
  const [searchTerm, setSearchTerm] = useState(initialSearchTerm);
  const [suggestions, setSuggestions] = useState<Doctor[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (searchTerm.length > 0) {
      const newSuggestions = getSearchSuggestions(doctors, searchTerm);
      setSuggestions(newSuggestions);
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [searchTerm, doctors]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      onSearch(searchTerm);
      setShowSuggestions(false);
    }
  };

  const handleSelectSuggestion = (suggestion: Doctor) => {
    setSearchTerm(suggestion.name);
    onSearch(suggestion.name);
    setShowSuggestions(false);
  };

  return (
    <div className="relative w-full max-w-md mx-auto" ref={searchRef}>
      <div className="relative">
        <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
        <Input
          data-testid="autocomplete-input"
          type="text"
          placeholder="Search for doctors..."
          className="pl-10 pr-4 py-2 w-full border-gray-300 focus:border-medical-blue focus:ring-medical-blue"
          value={searchTerm}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          onFocus={() => searchTerm.length > 0 && setShowSuggestions(true)}
        />
      </div>
      
      {showSuggestions && suggestions.length > 0 && (
        <ul className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
          {suggestions.map((suggestion) => (
            <li
              key={suggestion.name}
              data-testid="suggestion-item"
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-left"
              onClick={() => handleSelectSuggestion(suggestion)}
            >
              {suggestion.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SearchBar;
