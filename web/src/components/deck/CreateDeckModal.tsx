import React, { useState } from "react";
import { Modal, Form, Button, FloatingLabel } from "react-bootstrap";
import { useMutation } from "@apollo/client";
import { CREATE_DECK, GET_DECKS_BY_USER_ID, GET_DECKS } from "../../Queries/DeckQueries";
import AddCardModal from "../manage/AddCardModal";

interface CreateDeckModalProps {
  show: boolean;
  onHide: () => void;
}

export default function CreateDeckModal({ show, onHide }: CreateDeckModalProps) {
  const [title, setTitle] = useState("");
  const [categoryInput, setCategoryInput] = useState("");
  const [categories, setCategories] = useState<string[]>([]);
  const [showAddCards, setShowAddCards] = useState(false);
  const [newDeckId, setNewDeckId] = useState<number | null>(null);

  const [createDeck] = useMutation(CREATE_DECK, {
    refetchQueries: [{ query: GET_DECKS_BY_USER_ID }, { query: GET_DECKS }],
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const result = await createDeck({
        variables: {
          title,
          categories,
        },
      });
      setNewDeckId(result.data.createDeck.id);
      setShowAddCards(true);
      resetForm();
    } catch (error) {
      console.error("Error creating deck:", error);
    }
  };

  const resetForm = () => {
    setTitle("");
    setCategories([]);
    setCategoryInput("");
  };

  const handleAddCardsClose = () => {
    setShowAddCards(false);
    setNewDeckId(null);
    onHide();
  };

  const handleAddCategory = () => {
    if (categoryInput.trim() && !categories.includes(categoryInput.trim())) {
      setCategories([...categories, categoryInput.trim()]);
      setCategoryInput("");
    }
  };

  const removeCategory = (categoryToRemove: string) => {
    setCategories(categories.filter((category) => category !== categoryToRemove));
  };

  return (
    <>
      <Modal show={show && !showAddCards} onHide={onHide} centered>
        <Modal.Header closeButton>
          <Modal.Title>Create New Deck</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <FloatingLabel controlId="titleInput" label="Title" className="mb-3">
              <Form.Control type="text" placeholder="Enter deck title" value={title} onChange={(e) => setTitle(e.target.value)} required />
            </FloatingLabel>

            <div className="mb-3">
              <FloatingLabel controlId="categoryInput" label="Add Category">
                <Form.Control
                  type="text"
                  placeholder="Enter category"
                  value={categoryInput}
                  onChange={(e) => setCategoryInput(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddCategory();
                    }
                  }}
                />
              </FloatingLabel>
              <Button variant="outline-secondary" size="sm" className="mt-2" onClick={handleAddCategory}>
                Add Category
              </Button>
            </div>

            {categories.length > 0 && (
              <div className="mb-3">
                <label className="form-label">Categories:</label>
                <div className="d-flex flex-wrap gap-2">
                  {categories.map((category, index) => (
                    <div key={index} className="border rounded p-2 d-flex align-items-center">
                      {category}
                      <Button variant="link" className="p-0 ms-2" onClick={() => removeCategory(category)}>
                        ×
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="d-flex justify-content-end gap-2">
              <Button variant="secondary" onClick={onHide}>
                Cancel
              </Button>
              <Button variant="primary" type="submit">
                Create Deck
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>

      {showAddCards && newDeckId && <AddCardModal show={showAddCards} onHide={handleAddCardsClose} deckId={newDeckId} />}
    </>
  );
}
