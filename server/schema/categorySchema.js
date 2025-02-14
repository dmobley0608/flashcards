const categorySchema = `#graphql
  type Category {
    id: Int
    name: String
    decks: [Deck]
    createdAt: String
    updatedAt: String
  }

  type Query {
    categories: [Category!]!
    category(id: Int): Category
  }

  type Mutation {
    createCategory(name: String!): Category!
    updateCategory(id: Int, name: String!): Category
    deleteCategory(id: Int): Boolean!
  }
`;

export default categorySchema;
