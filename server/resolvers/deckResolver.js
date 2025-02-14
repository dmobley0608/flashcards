import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const deckResolver = {
  Query: {
    decks: async () => {
      return await prisma.deck.findMany({ include: { categories: true, cards: true } });
    },
    deck: async (_, { id }) => {
      return await prisma.deck.findUnique({
        where: { id },
        include: { categories: true, cards: true },
      });
    },
  },
  Mutation: {
    createDeck: async (_, { title, categories },{user}) => {
      if (!user) {
        throw new Error("You must be logged in to create a deck");
      }
      const deckCats = [];
      for (const cat of categories) {
        deckCats.push({ create: { name: cat }, where: { name: cat } });
      }
    
      return await prisma.deck.create({
        data: {
          title,
          userId: user.id,
          categories: { connectOrCreate: deckCats },
        },
      });
    },
    updateDeck: async (_, { id, title, categories }, {user}) => {
      const deck = await prisma.deck.findUnique({ where: { id } });
      if (!deck) {
        throw new Error("Deck not found");
      }

      if (deck.userId !== user.id) {
        throw new Error("You are not authorized to update this deck");
      }
      const deckCats = [];


      for (const cat of categories) {
        deckCats.push({ create: { name: cat }, where: { name: cat } });
      }
      const updatedDeck = await prisma.deck.update({
        where: { id },
        data: {
          title,
          categories: {
        set: [],
        connectOrCreate: deckCats
          }
        }
      });
      return updatedDeck;
    },
    deleteDeck: async (_, { id },{user}) => {
      try {
        const deck = await prisma.deck.findUnique({ where: { id: parseInt(id) } });
        if (deck.userId !== user.id) {
          throw new Error("You are not authorized to delete this deck");
        }
        if (deck) {
          await prisma.deck.delete({ where: { id: parseInt(id) } });
          return true;
        } else {
          return false;
        }
      } catch (e) {
        console.log(e);
        return false;
      }
    },
    addCard: async (_, { deckId, question, answer }, { user }) => {
      const deck = await prisma.deck.findUnique({ where: { id: deckId } });
      if (deck.userId !== user.id) {
        throw new Error("You are not authorized to add a card to this deck");
      }
      const card = await prisma.flashCard.create({
        data: {
          question,
          answer,
          deckId,
        },
      });
      return card;
    },
  },
};

export default deckResolver;
