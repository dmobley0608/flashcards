import { Card } from "react-bootstrap";
import { useMutation } from "@apollo/client";
import { DELETE_DECK, GET_DECKS } from "../../Queries/DeckQueries";
import { useAuth, useSession } from "@clerk/clerk-react";
import { useState } from "react";
import { Trash, PencilSquare, PlusCircleDotted } from "react-bootstrap-icons";
import { useNavigate } from "react-router-dom";
import EditDeckModal from "./EditDeckModal";
import AddCardModal from "./AddCardModal";

type DeckCardProps = {
  deck: {
    id: number;
    title: string;
    description: string;
    categories: { name: string }[];
    userId: string;
    cards?: { question: string }[];
  };
};

export default function DeckCard({ deck }: DeckCardProps) {
  const auth = useAuth();
  const { session } = useSession();
  const navigate = useNavigate();
  const [deleteDeck] = useMutation(DELETE_DECK, { refetchQueries: [{ query: GET_DECKS }] });
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAddCardModal, setShowAddCardModal] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  const deleteCard = async () => {
    const token = await session?.getToken();
    await deleteDeck({
      variables: { id: deck.id },
      context: {
        headers: {
          authorization: `Bearer ${token}`,
        },
      },
    });
  };
  const categories = deck?.categories?.map((category) => category?.name);

  const handleDeckClick = () => {
    if (isAnimating) return;
    setIsAnimating(true);

    // Wait for fall animation to complete before navigating
    setTimeout(() => {
      navigate(`/deck/${deck.id}`);
    }, 800); // Match this with CSS animation duration
  };

  return (
    <div style={{ position: "relative", width: "15rem", height: "100%", minHeight: "18rem" }}>
      {[...Array(deck?.cards?.length || 3)].map((_, i) => (
        <div
          key={i}
          className={`card-stack-item `}
          style={{
            position: "absolute",
            width: "100%",
            transform: `rotate(${(i - 1) * 2}deg) translateY(${i * 2}px)`,
            zIndex: 2 - i,
            cursor: "pointer",
           
            // Add fall animation when clicked
            ...(isAnimating && {
              animation: `fallOut 1s ease-in ${i * 0.1}s forwards`,
            }),
          }}
          onClick={handleDeckClick}>
          <Card className="shadow-sm hover:shadow-lg transition-shadow duration-300" style={{ height: "18rem" }}>
            <Card.Body className="position-relative">
              {auth.userId === deck.userId && (
                <div className="position-absolute top-0 start-0 m-2">
                  <button onClick={() => setShowAddCardModal(true)} className="btn btn-link text-primary p-0" style={{ fontSize: "1.2rem" }}>
                    <PlusCircleDotted />
                  </button>
                </div>
              )}
              {auth.userId === deck.userId && (
                <div className="position-absolute top-0 end-0 m-2">
                  <button onClick={() => setShowEditModal(true)} className="btn btn-link text-primary p-0" style={{ fontSize: "1.2rem" }}>
                    <PencilSquare />
                  </button>
                </div>
              )}
              <Card.Title className="fw-bold mb-3 text-center mt-3">{deck?.title}</Card.Title>
              <Card.Text className="text-muted mb-2">{deck?.cards?.length || 0} cards</Card.Text>
              <div className="small text-muted" style={{ maxHeight: "100px", overflowY: "auto" }}>
                {deck?.cards?.slice(0, 3).map((card: { question: string }, index: number) => (
                  <div key={index} className="mb-1 text-truncate">
                    • {card.question}
                  </div>
                ))}
              </div>
            </Card.Body>
            <Card.Footer className="bg-transparent ">
              <div className="d-flex flex-wrap ">
                {categories?.map((category, index) => (
                  <span key={index} className="badge bg-light text-dark">
                    {category}
                  </span>
                ))}
              </div>
              {auth.userId === deck.userId && (
                <button onClick={deleteCard} className="btn btn-link text-danger p-0 float-end" style={{ fontSize: "1.2rem" }}>
                  <Trash />
                </button>
              )}
            </Card.Footer>
          </Card>
        </div>
      ))}
      <AddCardModal show={showAddCardModal} onHide={() => setShowAddCardModal(false)} deckId={deck.id} />
      <EditDeckModal show={showEditModal} onHide={() => setShowEditModal(false)} deck={deck} />
    </div>
  );
}
