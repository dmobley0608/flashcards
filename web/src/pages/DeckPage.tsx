import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useMutation, useQuery } from "@apollo/client";
import { Card, Form, Button, Alert } from "react-bootstrap";
import { GET_DECK } from "../Queries/DeckQueries";
import CircleTimer from "../components/CircleTimer";
import Scoreboard from "../components/Scoreboard";

export default function DeckPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [shuffledCards, setShuffledCards] = useState<any[]>([]);
  const [userAnswer, setUserAnswer] = useState("");
  const [score, setScore] = useState(0);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [timeLeft, setTimeLeft] = useState(20);
  const [isGameOver, setIsGameOver] = useState(false);

  const { loading, error, data } = useQuery(GET_DECK, {
    variables: { id: parseInt(id || "0") },
    onCompleted: (data) => {
      // Shuffle cards when data is loaded
      const shuffled = [...data.deck.cards].sort(() => Math.random() - 0.5);
      setShuffledCards(shuffled);
    },
  });

  useEffect(() => {
    if (!showFeedback && !isGameOver) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            handleTimeUp();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [currentCardIndex, showFeedback, isGameOver]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const currentCard = shuffledCards[currentCardIndex]; // Use shuffledCards instead of data.deck.cards
    const isAnswerCorrect = userAnswer.toLowerCase().trim() === currentCard.answer.toLowerCase().trim();

    setIsCorrect(isAnswerCorrect);
    setShowFeedback(true);

    if (isAnswerCorrect) {
      setScore(score + 1);
    }
  };

  const handleTimeUp = () => {
    setIsCorrect(false);
    setShowFeedback(true);
    setTimeLeft(0);
  };

  const handleNext = () => {
    setUserAnswer("");
    setShowFeedback(false);
    setTimeLeft(20);

    if (currentCardIndex < shuffledCards.length - 1) {
      setCurrentCardIndex(currentCardIndex + 1);
    } else {
      setIsGameOver(true);
    }
  };

  const getSnarkyComment = (finalScore: number, totalQuestions: number) => {
    const percentage = (finalScore / totalQuestions) * 100;
    if (percentage === 100) return "Perfect! You're almost too smart to be here.";
    if (percentage >= 80) return "Not bad... for a human.";
    if (percentage >= 60) return "Well, at least you're trying.";
    if (percentage >= 40) return "Maybe flashcards aren't your thing?";
    if (percentage >= 20) return "I've seen rocks score better than this.";
    return "Wow. Just... wow.";
  };

  if (isGameOver) {
    return (
      <div className="container mt-5">
        <div className="row justify-content-center">
          <div className="col-md-8">
            <Card className="shadow text-center">
              <Card.Body>
                <h2 className="mb-4">Game Over!</h2>
                <h3 className="mb-3">
                  Final Score: {score}/{shuffledCards.length}
                </h3>
                <p className="text-muted mb-4">{getSnarkyComment(score, shuffledCards.length)}</p>
                <div className="d-flex gap-2 justify-content-center">
                  <Button variant="primary" onClick={() => window.location.reload()}>
                    Try Again
                  </Button>
                  <Button variant="outline-primary" onClick={() => navigate("/")}>
                    Back to Decks
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  if (!data?.deck?.cards?.length) return <div>No cards found in this deck</div>;

  const currentCard = shuffledCards[currentCardIndex] || data.deck.cards[0];

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="mb-3 d-flex justify-content-between align-items-center">
            <Scoreboard score={score} total={data.deck.cards.length} />
            <CircleTimer timeLeft={timeLeft} maxTime={20} />
          </div>

          <Card className="shadow">
            <Card.Body>
              <Card.Title className="text-center mb-4">
                Question {currentCardIndex + 1} of {data.deck.cards.length}
              </Card.Title>

              <Card.Text className="text-center h4 mb-4">{currentCard.question}</Card.Text>

              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Control type="text" placeholder="Enter your answer" value={userAnswer} onChange={(e) => setUserAnswer(e.target.value)} disabled={showFeedback} required />
                </Form.Group>

                {!showFeedback ? (
                  <Button variant="primary" type="submit" className="w-100">
                    Submit Answer
                  </Button>
                ) : (
                  <>
                    <Alert variant={isCorrect ? "success" : "danger"} className="mb-3">
                      {isCorrect ? "Correct!" : `Incorrect. The correct answer is: ${currentCard.answer}`}
                    </Alert>
                    <Button variant="primary" onClick={handleNext} className="w-100">
                     {currentCardIndex + 1 === data.deck.cards.length ?
                     "Tally Score":
                     "Next Question"
                }
                    </Button>
                  </>
                )}
              </Form>
            </Card.Body>
          </Card>
        </div>
      </div>
    </div>
  );
}
