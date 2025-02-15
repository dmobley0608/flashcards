import React, { useState } from "react";
import { Container, Button } from "react-bootstrap";
import DeckCard from "./DeckCard";
import { useUser, useSession } from "@clerk/clerk-react";
import { Plus } from "react-bootstrap-icons";
import CreateDeckModal from "./CreateDeckModal";
import AddCardModal from "./AddCardModal";
import { useMutation } from "@apollo/client";
import { CREATE_DECK, GET_DECKS } from "../../Queries/DeckQueries";

type DeckContainerProps = {
  decks: { title: string; description: string; categories: [] }[];
};

export default function DeckContainer({ decks }: DeckContainerProps) {
  const { isSignedIn } = useUser();
  const { session } = useSession();
  const [showModal, setShowModal] = useState(false);
  const [showAddCardModal, setShowAddCardModal] = useState(false);
  const [newDeckId, setNewDeckId] = useState<number | null>(null);

  const [addDeck] = useMutation(CREATE_DECK, {
    update(cache, { data: { createDeck } }) {
      const existingData = cache.readQuery<{ decks: any[] }>({
        query: GET_DECKS,
      });

      cache.writeQuery({
        query: GET_DECKS,
        data: {
          decks: [...(existingData?.decks || []), createDeck],
        },
      });

      // Store the new deck's ID and show the add card modal
      setNewDeckId(createDeck.id);
      setShowAddCardModal(true);
    },
  });

  const handleCreateDeck = async (deckData: { title: string; categories: string[] }) => {
    try {
      const token = await session?.getToken();
      await addDeck({
        variables: {
          title: deckData.title,
          categories: deckData.categories,
        },
        context: {
          headers: {
            authorization: `Bearer ${token}`,
          },
        },
      });
      setShowModal(false);
    } catch (error) {
      console.error("Error creating deck:", error);
    }
  };

  const handleAddCardModalClose = () => {
    setShowAddCardModal(false);
    setNewDeckId(null);
  };

  return (
    <Container className="position-relative">

      <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
        {decks.map((deck: { title: string; description: string; categories: [] }, index: React.Key) => (
          <div className="col d-flex justify-content-center align-items-center" key={index}>
            <DeckCard deck={deck} />
          </div>
        ))}
      </div>
    </Container>
  );
}
