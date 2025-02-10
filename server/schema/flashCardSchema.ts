const flashCardSchema = `#graphql
  type FlashCard {
    id: ID
    question: String
    answer: String
    deckId: ID
    deck: Deck
    createdAt: String
    updatedAt: String
  }

  type Query {
    flashCards(deckId: ID!): [FlashCard!]!
    flashCard(id: ID!): FlashCard
  }

  type Mutation {
    createFlashCard(question: String!, answer: String!, deckId: ID!): FlashCard!
    updateFlashCard(id: ID!, question: String, answer: String): FlashCard
    deleteFlashCard(id: ID!): Boolean!
  }
`;

export default flashCardSchema;
