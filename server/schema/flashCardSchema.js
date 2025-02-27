const flashCardSchema = `#graphql
  type MultipleChoiceOption {
    text: String!
    isCorrect: Boolean!
  }

  type MultipleChoiceQuestion {
    question: String!
    options: [MultipleChoiceOption!]!
  }

  type FlashCard {
    id: ID
    question: String
    answer: String
    deckId: ID
    deck: Deck
    createdAt: String
    updatedAt: String
    options: [MultipleChoiceOption!]
  }

  type Query {
    flashCards(deckId: ID!): [FlashCard!]!
    flashCard(id: ID!): FlashCard
    generateMultipleChoiceQuestions(topic: String!): [MultipleChoiceQuestion!]!
  }

  type Mutation {
    createFlashCard(question: String!, answer: String!, deckId: ID!): FlashCard!
    updateFlashCard(id: ID!, question: String, answer: String): FlashCard
    deleteFlashCard(id: ID!): Boolean!
  }
`;

export default flashCardSchema;
