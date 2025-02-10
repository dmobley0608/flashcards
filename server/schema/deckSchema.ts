const deckSchema = `#graphql
  type Deck {
    id: Int
    title: String
    userId: Int
    user: User
    categories: [Category]
    cards: [FlashCard]
    createdAt: String
    updatedAt: String
  }

  type Query {
    decks: [Deck!]!
    deck(id: Int): Deck
  }

  type Mutation {
    createDeck(title: String!, userId: ID!, categories: [String!]!): Deck!
    updateDeck(id: ID!, title: String, userId: ID): Deck
    deleteDeck(id: ID!): Boolean!
    addCard(deckId: ID!, question: String!, answer: String!): FlashCard!
  }
`;

export default deckSchema;
