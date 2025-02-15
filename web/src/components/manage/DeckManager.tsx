import React, { useState } from "react";
import { Accordion, Button, ListGroup } from "react-bootstrap";
import { PencilSquare, Trash, PlusCircle, XCircle } from "react-bootstrap-icons";
import { useMutation } from "@apollo/client";
import { DELETE_DECK, GET_DECKS_BY_USER_ID, DELETE_CARD } from "../../Queries/DeckQueries";
import EditDeckModal from "../deck/EditDeckModal";
import CreateDeckModal from "../deck/CreateDeckModal";
import AddCardModal from "./AddCardModal";
import EditCardModal from "./EditCardModal";

type DeckManagerProps = {
  decks: Array<{
    id: number;
    title: string;
    categories: { name: string }[];
    cards: { question: string; answer: string; id: number }[];
  }>;
};

export default function DeckManager({ decks = [] }: DeckManagerProps) {
  const [deleteDeck] = useMutation(DELETE_DECK, {
    refetchQueries: [{ query: GET_DECKS_BY_USER_ID }],
  });
  const [showEditModal, setShowEditModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showAddCardModal, setShowAddCardModal] = useState(false);
  const [showEditCardModal, setShowEditCardModal] = useState(false);
  const [selectedDeck, setSelectedDeck] = useState<any>(null);
  const [selectedDeckId, setSelectedDeckId] = useState<number | null>(null);
  const [selectedCard, setSelectedCard] = useState<any>(null);

  const [deleteCard] = useMutation(DELETE_CARD, {
    refetchQueries: [{ query: GET_DECKS_BY_USER_ID }],
  });

  const handleDelete = async (e: React.MouseEvent, deckId: number) => {
    e.stopPropagation(); // Prevent accordion from toggling
    if (window.confirm("Are you sure you want to delete this deck?")) {
      try {
        await deleteDeck({
          variables: { id: parseInt(deckId.toString()) },
        });
      } catch (error) {
        console.error("Error deleting deck:", error);
      }
    }
  };

  const handleDeleteCard = async (e: React.MouseEvent, cardId: number) => {
    e.stopPropagation();
    if (window.confirm("Are you sure you want to delete this card?")) {
      try {
        await deleteCard({
          variables: { id: parseInt(cardId.toString()) },
        });
      } catch (error) {
        console.error("Error deleting card:", error);
      }
    }
  };

  const handleButtonClick = (e: React.MouseEvent, callback: () => void) => {
    e.preventDefault();
    e.stopPropagation();
    callback();
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3>Your Decks</h3>
        <Button variant="primary" onClick={(e) => handleButtonClick(e, () => setShowCreateModal(true))}>
          <PlusCircle className="me-2" />
          New Deck
        </Button>
      </div>

      <Accordion>
        {decks.map((deck) => (
          <Accordion.Item key={deck.id} eventKey={deck.id.toString()}>
            <Accordion.Header>
              <div className="d-flex justify-content-between align-items-center w-100 me-3">
                <div>
                  <span onClick={(e) => handleDelete(e, deck.id)} style={{ cursor: "pointer", marginRight: "10px" }}>
                    <Trash />
                  </span>
                  <span> {deck.title}</span>
                </div>
                <small>{deck.cards.length} cards</small>
              </div>
            </Accordion.Header>
            <Accordion.Body>
              <div className="mb-3">
                <Button
                  variant="success"
                  size="sm"
                  onClick={(e) =>
                    handleButtonClick(e, () => {
                      setSelectedDeckId(deck.id);
                      setShowAddCardModal(true);
                    })
                  }>
                  <PlusCircle /> Add Card
                </Button>
              </div>
              <ListGroup variant="flush">
                {deck.cards.map((card, index) => (
                  <ListGroup.Item key={index} className="d-flex flex-wrap justify-content-between align-items-center">
                     <div className="w-100 d-flex justify-content-between align-items-center">
                      <Button
                        variant="link"
                        className="p-0 me-2"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedCard(card);
                          setShowEditCardModal(true);
                        }}>
                        <PencilSquare />
                      </Button>
                      <Button variant="link" className="p-0 text-danger" onClick={(e) => handleDeleteCard(e, card.id)}>
                        <XCircle />
                      </Button>
                    </div>
                    <div>
                      <strong>Q: </strong>
                      {card.question}
                      <br />
                      <strong>A: </strong>
                      {card.answer}
                    </div>

                  </ListGroup.Item>
                ))}
              </ListGroup>
              <div className="mt-3">
                <Button
                  variant="outline-primary"
                  size="sm"
                  className="me-2"
                  onClick={(e) =>
                    handleButtonClick(e, () => {
                      setSelectedDeck(deck);
                      setShowEditModal(true);
                    })
                  }>
                  <PencilSquare /> Edit Deck
                </Button>
              </div>
            </Accordion.Body>
          </Accordion.Item>
        ))}
      </Accordion>

      {selectedDeck && <EditDeckModal show={showEditModal} onHide={() => setShowEditModal(false)} deck={selectedDeck} />}
      <CreateDeckModal show={showCreateModal} onHide={() => setShowCreateModal(false)} />
      {selectedDeckId && <AddCardModal show={showAddCardModal} onHide={() => setShowAddCardModal(false)} deckId={selectedDeckId} />}
      {selectedCard && (
        <EditCardModal
          show={showEditCardModal}
          onHide={() => {
            setShowEditCardModal(false);
            setSelectedCard(null);
          }}
          card={selectedCard}
        />
      )}
    </div>
  );
}
