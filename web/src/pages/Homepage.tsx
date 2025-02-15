import { useQuery } from "@apollo/client";
import { useState } from "react";
import { GET_DECKS } from "../Queries/DeckQueries";
import DeckContainer from "../components/deck/DeckContainer";
import SearchBar from "../components/SearchBar";
import { useUser } from "@clerk/clerk-react";
import Loader from "../components/Loader";

export default function Homepage() {
  const { data, loading, error } = useQuery(GET_DECKS);
  const [filteredDecks, setFilteredDecks] = useState([]);
  const [showMyDecks, setShowMyDecks] = useState(false);
  const { user } = useUser();

  const handleSearch = (searchTerm: string) => {
    filterDecks(searchTerm, showMyDecks);
  };

  const handleFilterMyDecks = (checked: boolean) => {
    setShowMyDecks(checked);
    filterDecks("", checked);
  };

  const filterDecks = (searchTerm: string, onlyMyDecks: boolean) => {
    if (!data?.decks) return;

    let filtered = data.decks;

    // Filter by user's decks if toggle is on
    if (onlyMyDecks && user) {
      filtered = filtered.filter((deck: { userId: string }) => deck.userId === user.id);
    }

    // Then apply search term filter
    if (searchTerm) {
      filtered = filtered.filter((deck: { title: string; categories: { name: string }[] }) => {
        const matchName = deck.title.toLowerCase().includes(searchTerm.toLowerCase());
        const matchCategory = deck.categories.some((category) => category.name.toLowerCase().includes(searchTerm.toLowerCase()));
        return matchName || matchCategory;
      });
    }

    setFilteredDecks(filtered);
  };

  if (loading) {
    return <Loader progress={50} />;
  }

  if (error) return <p>Error...</p>;

  return (
    <div className="container mt-4">
      <SearchBar onSearch={handleSearch} onFilterMyDecks={handleFilterMyDecks} />
      <DeckContainer decks={filteredDecks.length > 0 ? filteredDecks : data.decks} />
    </div>
  );
}
