import { useQuery } from "@apollo/client";
import { useState } from "react";
import { GET_DECKS } from "../Queries/DeckQueries";
import DeckContainer from "../components/deck/DeckContainer";
import SearchBar from "../components/SearchBar";

export default function Homepage() {
  const { data, loading, error } = useQuery(GET_DECKS);
  const [filteredDecks, setFilteredDecks] = useState([]);

  const handleSearch = (searchTerm:string) => {
    if (!data?.decks) return;

    const filtered = data.decks.filter((deck: { id:number, name: string; category: { name: string; }; }) => {
      const matchName = deck.title.toLowerCase().includes(searchTerm.toLowerCase());
      const matchCategory = deck.categories.some((category: { name: string; }) => category.name.toLowerCase().includes(searchTerm.toLowerCase()));
      return matchName || matchCategory ;
    });

    setFilteredDecks(filtered);
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error...</p>;

  return (
    <div className="container mt-4">
      <SearchBar onSearch={handleSearch} />
      <DeckContainer decks={filteredDecks.length > 0 ? filteredDecks : data.decks} />
    </div>
  );
}
