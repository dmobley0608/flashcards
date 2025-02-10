import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import userSchema from "./schema/userSchema.js";
import userResolver from "./resolvers/userResolver.js";
import categorySchema from "./schema/categorySchema.js";
import categoryResolver from "./resolvers/categoryResolver.js";
import deckSchema from "./schema/deckSchema.js";
import deckResolver from "./resolvers/deckResolver.js";
import flashCardSchema from "./schema/flashCardSchema.js";
import flashCardResolver from "./resolvers/flashCardResolver.js";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();


const server = new ApolloServer({
  typeDefs: [
    userSchema,
    categorySchema,
    deckSchema,
    flashCardSchema
  ],
  resolvers: [
    userResolver,
    categoryResolver,
    deckResolver,
    flashCardResolver
  ],
});


const { url } = await startStandaloneServer(server, {
  listen: {
    port: 4000
  },
  context: async ({ req }) => {
    const token = req.headers?.authorization?.split(' ')[1] || "";

    if(token){
      const {email} = jwt.verify(token, process.env.JWT_SECRET);
      const user = await prisma.user.findUnique({ where: { email } });
      return { user };
    }
    return {user: null};

  }
});
console.log(`Server ready at ${url}`);
