import React, { useState, useEffect } from "react";
import { Modal, Form, Button, FloatingLabel } from "react-bootstrap";
import { useMutation } from "@apollo/client";
import { UPDATE_DECK, GET_DECKS } from "../../Queries/DeckQueries";
import { useSession } from "@clerk/clerk-react";

interface EditDeckModalProps {
  show: boolean;
  onHide: () => void;
  deck: {
    id: number;
    title: string;
    categories: { name: string }[];
  };
}

export default function EditDeckModal({ show, onHide, deck }: EditDeckModalProps) {
  const [title, setTitle] = useState("");
  const [categoryInput, setCategoryInput] = useState("");
  const [categories, setCategories] = useState<string[]>([]);
  const { session } = useSession();
  const [updateDeck] = useMutation(UPDATE_DECK, {
    refetchQueries: [{ query: GET_DECKS }],
    awaitRefetchQueries: true,
  });

  useEffect(() => {
    if (deck) {
      setTitle(deck.title || "");
      setCategories(deck.categories?.map((cat) => cat.name) || []);
    }
  }, [deck]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = await session?.getToken();
    try {
      await updateDeck({
        variables: {
          id: deck.id,
          title,
          categories: categories || [],
        },
        context: {
          headers: {
            authorization: `Bearer ${token}`,
          },
        },
      });
      onHide();
    } catch (error) {
      console.error("Error updating deck:", error);
    }
  };

  const handleAddCategory = () => {
    if (categoryInput.trim() && !categories?.includes(categoryInput.trim())) {
      setCategories([...(categories || []), categoryInput.trim()]);
      setCategoryInput("");
    }
  };

  const removeCategory = (categoryToRemove: string) => {
    setCategories(categories?.filter((category) => category !== categoryToRemove) || []);
  };

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>Edit Deck</Modal.Title>
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
              Save Changes
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
}
