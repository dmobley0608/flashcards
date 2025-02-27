import { useState, useEffect } from "react";
import { useQuery } from "@apollo/client";
import { GENERATE_MULTIPLE_CHOICE } from "../Queries/DeckQueries";
import { Form, Button, Card, Alert, ListGroup } from "react-bootstrap";
import Loader from "../components/Loader";
import AnalogTimer from "../components/AnalogTimer";

interface Option {
  text: string;
  isCorrect: boolean;
}

interface Question {
  question: string;
  options: Option[];
}

export default function MultipleChoicePage() {
  const [topic, setTopic] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [userAnswers, setUserAnswers] = useState<string[]>([]);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);

  const { data, loading, error, refetch } = useQuery(GENERATE_MULTIPLE_CHOICE, {
    variables: { topic },
    skip: !submitted,
  });

  useEffect(() => {
    if (loading) {
      // Simulate loading progress
      const interval = setInterval(() => {
        setLoadingProgress((prev) => {
          if (prev >= 90) return prev; // Cap at 90% until actual data arrives
          return prev + 10;
        });
      }, 500);

      return () => clearInterval(interval);
    } else if (data) {
      setLoadingProgress(100); // Complete the progress when data arrives
    }
  }, [loading, data]);

  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    // Only run timer when we have questions and aren't showing results
    if (submitted && data && !showResults) {
      // Reset timer whenever question changes
      setTimeLeft(30);

      intervalId = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(intervalId);
            handleTimeUp();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    // Cleanup function
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [submitted, currentQuestion, showResults, data]); // Dependencies that should trigger timer reset

  const handleTimeUp = () => {
    if (!data) return;

    const newUserAnswers = [...userAnswers];
    newUserAnswers[currentQuestion] = selectedAnswer || "Time's up!";
    setUserAnswers(newUserAnswers);

    if (currentQuestion < data.generateMultipleChoiceQuestions.length - 1) {
      setCurrentQuestion((prev) => prev + 1);
    } else {
      setShowResults(true);
    }
    setSelectedAnswer(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setScore(0);
    setCurrentQuestion(0);
    setShowResults(false);
    setTimeLeft(30);
    setUserAnswers([]);
    refetch();
  };

  const handleAnswerSelect = (answer: string) => {
    setSelectedAnswer(answer);
  };

  const handleNext = () => {
    if (!data || !selectedAnswer) return;

    const currentQuestionData = data.generateMultipleChoiceQuestions[currentQuestion];
    const isCorrect = currentQuestionData.options.find((opt: Option) => opt.text === selectedAnswer)?.isCorrect;

    if (isCorrect) {
      setScore((prev) => prev + 1);
    }

    const newUserAnswers = [...userAnswers];
    newUserAnswers[currentQuestion] = selectedAnswer;
    setUserAnswers(newUserAnswers);

    if (currentQuestion < data.generateMultipleChoiceQuestions.length - 1) {
      setCurrentQuestion((prev) => prev + 1);
    } else {
      setShowResults(true);
    }
    setSelectedAnswer(null);
  };

  const handleReset = () => {
    setSubmitted(false);
    setTopic("");
    setCurrentQuestion(0);
    setScore(0);
    setShowResults(false);
    setSelectedAnswer(null);
    setUserAnswers([]);
  };

  if (loading) {
    return (
      <div className="container mt-4 text-center text-white">
        <h3>Generating Questions about {topic}...</h3>
        <Loader progress={loadingProgress} />
        <p className="mt-3">
          {loadingProgress < 30 && "Analyzing topic..."}
          {loadingProgress >= 30 && loadingProgress < 60 && "Crafting questions..."}
          {loadingProgress >= 60 && loadingProgress < 90 && "Generating options..."}
          {loadingProgress >= 90 && "Almost ready..."}
        </p>
      </div>
    );
  }

  if (error) return <Alert variant="danger">Error: {error.message}</Alert>;

  if (!submitted) {
    return (
      <div className="container mt-4 text-white">
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Enter a topic to generate questions</Form.Label>
            <Form.Control type="text" value={topic} onChange={(e) => setTopic(e.target.value)} placeholder="e.g., JavaScript Fundamentals" required />
          </Form.Group>
          <Button type="submit">Generate Questions</Button>
        </Form>
      </div>
    );
  }

  if (showResults) {
    return (
      <div className="container my-4 text-white">
        <h2 className="text-center mb-4">Quiz Complete!</h2>
        <p className="text-center h4 mb-4">
          Your score: {score}/{data.generateMultipleChoiceQuestions.length}
        </p>

        <ListGroup className="mb-4">
          {data.generateMultipleChoiceQuestions.map((question: Question, index: number) => {
            const correctAnswer = question.options.find((opt: Option) => opt.isCorrect)?.text;
            const userAnswer = userAnswers[index];
            const isCorrect = correctAnswer === userAnswer;

            return (
              <ListGroup.Item key={index} className={`mb-3 ${isCorrect ? "border-success" : "border-danger"}`}>
                <h5>
                  Question {index + 1}: {question.question}
                </h5>
                <p>
                  <strong>Your answer:</strong> <span className={isCorrect ? "text-success" : "text-danger"}>{userAnswer}</span>
                </p>
                {!isCorrect && (
                  <p>
                    <strong>Correct answer:</strong> <span className="text-success">{correctAnswer}</span>
                  </p>
                )}
              </ListGroup.Item>
            );
          })}
        </ListGroup>

        <div className="text-center">
          <Button onClick={handleReset} size="lg">
            Try Another Topic
          </Button>
        </div>
      </div>
    );
  }

  const currentQuestionData = data?.generateMultipleChoiceQuestions[currentQuestion];

  return (
    <div className="container my-4 ">
      <Card>
        <Card.Body>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <Card.Title>
              Question {currentQuestion + 1}/{data.generateMultipleChoiceQuestions.length}
            </Card.Title>
            <AnalogTimer timeLeft={timeLeft} totalTime={30} />
          </div>
          <Card.Text>{currentQuestionData.question}</Card.Text>
          {currentQuestionData.options.map((option: Option, index: number) => (
            <Form.Check key={index} type="radio" id={`option-${index}`} label={option.text} name="answer" checked={selectedAnswer === option.text} onChange={() => handleAnswerSelect(option.text)} className="mb-2" />
          ))}
          <Button onClick={handleNext} disabled={!selectedAnswer} className="mt-3">
            {currentQuestion === data.generateMultipleChoiceQuestions.length - 1 ? "Finish" : "Next"}
          </Button>
        </Card.Body>
      </Card>
    </div>
  );
}
