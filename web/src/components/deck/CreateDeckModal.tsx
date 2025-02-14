import React, { useState } from "react";
import { Modal, Form, Button, FloatingLabel } from "react-bootstrap";

interface CreateDeckModalProps {
  show: boolean;
  onHide: () => void;
  onSubmit: (deckData: { title: string; categories: string[] }) => void;
}

export default function CreateDeckModal({ show, onHide, onSubmit }: CreateDeckModalProps) {
  const [title, setTitle] = useState("");
  const [categoryInput, setCategoryInput] = useState("");
  const [categories, setCategories] = useState<string[]>([]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ title, categories });
    setTitle("");
    setCategories([]);
    setCategoryInput("");
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
    <Modal show={show} onHide={onHide} centered>
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
  );
}
