import React, { useState } from "react";
import { Modal, Button, Form, Toast, ToastContainer } from "react-bootstrap";
import { useMutation } from "@apollo/client";
import { ADD_CARD, GET_DECKS_BY_USER_ID, GET_DECKS } from "../../Queries/DeckQueries";

interface AddCardModalProps {
  show: boolean;
  onHide: () => void;
  deckId: number;
}

export default function AddCardModal({ show, onHide, deckId }: AddCardModalProps) {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [showToast, setShowToast] = useState(false);

  const [addCard] = useMutation(ADD_CARD, {
    refetchQueries: [{ query: GET_DECKS_BY_USER_ID }, { query: GET_DECKS }],
  });

  const resetForm = () => {
    setQuestion("");
    setAnswer("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addCard({
        variables: {
          deckId,
          question,
          answer,
        },
      });
      resetForm(); // Just clear the form and keep modal open
      setShowToast(true); // Show success toast
    } catch (error) {
      console.error("Error adding card:", error);
    }
  };

  return (
    <>
      <Modal show={show} onHide={onHide}>
        <Modal.Header closeButton>
          <Modal.Title>Add New Card</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Question</Form.Label>
              <Form.Control type="text" value={question} onChange={(e) => setQuestion(e.target.value)} required />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Answer</Form.Label>
              <Form.Control type="text" value={answer} onChange={(e) => setAnswer(e.target.value)} required />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={onHide}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              Add Card
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>

      <ToastContainer position="top-end" className="p-3">
        <Toast onClose={() => setShowToast(false)} show={showToast} delay={3000} autohide bg="success">
          <Toast.Header closeButton={false}>
            <strong className="me-auto">Success</strong>
          </Toast.Header>
          <Toast.Body className="text-white">Card added successfully!</Toast.Body>
        </Toast>
      </ToastContainer>
    </>
  );
}
