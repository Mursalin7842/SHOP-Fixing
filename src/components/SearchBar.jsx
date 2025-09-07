import React from 'react';
import SearchIcon from './icons/SearchIcon';

// This is a comment to explain the purpose of this component.
// The SearchBar component is a simple search input field with an icon.
const SearchBar = ({ searchTerm, setSearchTerm, placeholder }) => (
    <div className="relative w-full max-w-xs">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <SearchIcon />
        </div>
        <input
            type="text"
            placeholder={placeholder}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-gray-700 border border-gray-600 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
    </div>
);

export default SearchBar;
