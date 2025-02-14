import React, { useState } from 'react';
import { Form, FormControl } from 'react-bootstrap';

const SearchBar = ({ onSearch }) => {
    const [searchTerm, setSearchTerm] = useState('');

    const handleSearch = (e) => {
        const value = e.target.value;
        setSearchTerm(value);
        onSearch(value);
    };

    return (
        
        <Form className="d-flex my-3">
            <FormControl
                type="search"
                placeholder="Search decks by name or category..."
                className="me-2"
                value={searchTerm}
                onChange={handleSearch}
                aria-label="Search"
            />
        </Form>
    );
};

export default SearchBar;
