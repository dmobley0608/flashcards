import React, { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { useMutation } from "@apollo/client";
import { UPDATE_CARD, GET_DECKS_BY_USER_ID } from "../../Queries/DeckQueries";

interface EditCardModalProps {
  show: boolean;
  onHide: () => void;
  card: {
    id: number;
    question: string;
    answer: string;
  };
}

export default function EditCardModal({ show, onHide, card }: EditCardModalProps) {
  const [question, setQuestion] = useState(card.question);
  const [answer, setAnswer] = useState(card.answer);

  const [updateCard] = useMutation(UPDATE_CARD, {
    refetchQueries: [{ query: GET_DECKS_BY_USER_ID }],
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateCard({
        variables: {
          id: parseInt(card.id.toString()),
          question,
          answer,
        },
      });
      onHide();
    } catch (error) {
      console.error("Error updating card:", error);
    }
  };

  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>Edit Card</Modal.Title>
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
            Save Changes
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}
