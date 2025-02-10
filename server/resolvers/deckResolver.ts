import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const deckResolver = {
  Query: {
    decks: async () => {
      return await prisma.deck.findMany({include: { categories: true, cards: true }});
    },
    deck: async (_, { id }) => {
      return await prisma.deck.findUnique({
        where: { id },
        include: { categories: true, cards: true },
      });
    },
  },
  Mutation: {
    createDeck: async (_, { title, userId, categories }) => {
      const deckCats = [];
      for (const cat of categories) {
        deckCats.push({ create: { name: cat }, where: { name: cat } });
      }
      return await prisma.deck.create({
        data: {
          title,
          userId: parseInt(userId),
          categories: { connectOrCreate: deckCats },
        },
      });
    },
    updateDeck: async (_, { id, title, userId }) => {
      const deck = await prisma.deck.update({
        where: { id },
        data: { title, userId },
      });
      return deck;
    },
    deleteDeck: async (_, { id }) => {
      try {
        const deck = await prisma.deck.delete({ where: { id:parseInt(id) } });
        if (deck) {
          await prisma.deck.delete({ where: { id:parseInt(id) } });
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
