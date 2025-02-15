import React, { useState } from 'react';
import { FormControl } from 'react-bootstrap';
import { useUser } from "@clerk/clerk-react";
import './SearchBar.css';

const SearchBar = ({ onSearch, onFilterMyDecks }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [showMyDecks, setShowMyDecks] = useState(false);
    const { user } = useUser();

    const handleSearch = (e) => {
        const value = e.target.value;
        setSearchTerm(value);
        onSearch(value);
    };

    const handleCheckbox = (e) => {
        const checked = e.target.checked;
        setShowMyDecks(checked);
        onFilterMyDecks(checked);
    };

    return (
        <div className="d-flex align-items-center gap-3 my-3">
            <FormControl
                type="search"
                placeholder="Search decks by name or category..."
                value={searchTerm}
                onChange={handleSearch}
                aria-label="Search"
            />
            {user && (
                <div className="toggle-wrapper">
                    <span className="toggle-label">My Decks</span>
                    <label className="switch">
                        <input
                            type="checkbox"
                            checked={showMyDecks}
                            onChange={handleCheckbox}
                        />
                        <span className="slider round"></span>
                    </label>
                </div>
            )}
        </div>
    );
};

export default SearchBar;
