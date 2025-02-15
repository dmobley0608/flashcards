const deckSchema = `#graphql
  type Deck {
    id: Int
    title: String
    userId: String
    categories: [Category]
    cards: [FlashCard]
    createdAt: String
    updatedAt: String
  }

  type Query {
    decks: [Deck!]!
    deck(id: Int): Deck
    userDecks(userId: String): [Deck]
  }

  type Mutation {
    createDeck(title: String!, userId:String categories: [String!]!): Deck!
    updateDeck(id: Int!, title: String, categories:[String]): Deck
    deleteDeck(id: Int!): Boolean!
    addCard(deckId: Int!, question: String!, answer: String!): FlashCard!
    deleteCard(id: Int!): Boolean!
    updateCard(id: Int!, question: String, answer: String): FlashCard!
  }
`;

export default deckSchema;
