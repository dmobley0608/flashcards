
const userSchema = `#graphql
    type User {
        id: Int
        name: String
        email: String
        decks: [Deck]
        createdAt: String
        updatedAt: String

    }
    type Query {
        users: [User!]!
        user(id: Int): User
        me: User
    }
    type Mutation {
        createUser(name: String!, email: String!, password: String!): User!
        updateUser(id: ID, name: String, email: String, password: String):User
        deleteUser(id: ID!): Boolean!
        login(email: String!, password: String!): String!
    }

        `;
export default userSchema;