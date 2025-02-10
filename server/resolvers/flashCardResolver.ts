import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const flashCardResolver = {
  Query: {
    flashCards: async (_, { deckId }) => {
      return await prisma.flashCard.findMany();
    },
    flashCard: async (_, { id }) => {
      return await prisma.flashCard.findUnique({ where: { id } });
    },
  },
  Mutation: {
    createFlashCard: async (_, { question, answer, deckId }, { user }) => {
      return await prisma.flashCard.create({
        data: { question, answer, deckId:parseInt(deckId) },
      });
    },
    updateFlashCard: async (_, { id, question, answer }, { user }) => {
      const flashCard = await prisma.flashCard.findUnique({
        where: { id:parseInt(id) },
        include: { deck: true },
      });
      if (flashCard.deck.userId !== user.id) {
        throw new Error("You are not authorized to update this card");
      }
      return await prisma.flashCard.update({
        where: { id:parseInt(id) },
        data: { question, answer },
      });
    },
    deleteFlashCard: async (_, { id }, { user }) => {
      const flashCard = await prisma.flashCard.findUnique({
        where: { id:parseInt(id) },
        include: { deck: true },
      });
      if(!flashCard){
        throw new Error("Flashcard not found");
      }
      if (flashCard.deck.userId !== user.id) {
        throw new Error("You are not authorized to delete this card");
      }
      try {
       const card = await prisma.flashCard.delete({ where: { id:parseInt(id) } });
        if (card) {
          return false;
        } else {
          return true;
        }
      } catch (e) {
        console.log(e);
        return false;
      }
    },
  },
};

export default flashCardResolver;
