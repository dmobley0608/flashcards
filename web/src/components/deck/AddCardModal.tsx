import React, { useState } from "react";
import { Modal, Form, Button, FloatingLabel, Alert } from "react-bootstrap";
import { useMutation } from "@apollo/client";
import { ADD_CARD, GET_DECKS } from "../../Queries/DeckQueries";
import { useSession } from "@clerk/clerk-react";

interface AddCardModalProps {
  show: boolean;
  onHide: () => void;
  deckId: number;
  isNewDeck?: boolean;
}

export default function AddCardModal({ show, onHide, deckId, isNewDeck }: AddCardModalProps) {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [showAddAnother, setShowAddAnother] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const { session } = useSession();
  const [addCard] = useMutation(ADD_CARD, {
    refetchQueries: [{ query: GET_DECKS }],
  });

  const resetForm = () => {
    setQuestion("");
    setAnswer("");
    setSuccessMessage("");
    setShowAddAnother(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = await session?.getToken();
    try {
      await addCard({
        variables: {
          deckId,
          question,
          answer,
        },
        context: {
          headers: {
            authorization: `Bearer ${token}`,
          },
        },
      });
      setSuccessMessage("Card added successfully!");
      setShowAddAnother(true);
      setQuestion("");
      setAnswer("");
    } catch (error) {
      console.error("Error adding card:", error);
    }
  };

  const handleClose = () => {
    resetForm();
    onHide();
  };

  const handleAddAnother = () => {
    setSuccessMessage("");
    setShowAddAnother(false);
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>{isNewDeck ? "Add Cards to Your New Deck" : "Add New Card"}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {isNewDeck && <div className="alert alert-info mb-3">Let's add some cards to your new deck! You can add as many as you like.</div>}
        {successMessage && (
          <Alert variant="success" className="mb-3">
            {successMessage}
          </Alert>
        )}
        <Form onSubmit={handleSubmit}>
          <FloatingLabel controlId="questionInput" label="Question" className="mb-3">
            <Form.Control as="textarea" placeholder="Enter question" style={{ height: "100px" }} value={question} onChange={(e) => setQuestion(e.target.value)} required />
          </FloatingLabel>

          <FloatingLabel controlId="answerInput" label="Answer" className="mb-3">
            <Form.Control as="textarea" placeholder="Enter answer" style={{ height: "100px" }} value={answer} onChange={(e) => setAnswer(e.target.value)} required />
          </FloatingLabel>

          <div className="d-flex justify-content-end gap-2">
            {showAddAnother ? (
              <>
                <Button variant="secondary" onClick={handleClose}>
                  Done
                </Button>
                <Button variant="primary" onClick={handleAddAnother}>
                  Add Another Card
                </Button>
              </>
            ) : (
              <>
                <Button variant="secondary" onClick={handleClose}>
                  Cancel
                </Button>
                <Button variant="primary" type="submit">
                  Add Card
                </Button>
              </>
            )}
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
}
