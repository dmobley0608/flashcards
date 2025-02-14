import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import categorySchema from "./schema/categorySchema.js";
import categoryResolver from "./resolvers/categoryResolver.js";
import deckSchema from "./schema/deckSchema.js";
import deckResolver from "./resolvers/deckResolver.js";
import flashCardSchema from "./schema/flashCardSchema.js";
import flashCardResolver from "./resolvers/flashCardResolver.js";
import {verifyToken, createClerkClient} from "@clerk/backend"


const clerk = createClerkClient({
  secretKey: process.env.CLERK_SECRET_KEY
});

const server = new ApolloServer({
  typeDefs: [
    categorySchema,
    deckSchema,
    flashCardSchema
  ],
  resolvers: [
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
    try{
      const  validToken  = await verifyToken(token,{secretKey:process.env.CLERK_SECRET_KEY});
      const user = await clerk.users.getUser(validToken.sub);
      return { user:{...user} };
    }catch(e){

      return { user: null };
    }
    }
});
console.log(`Server ready at ${url}`);
