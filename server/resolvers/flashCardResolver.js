import { PrismaClient } from "@prisma/client";
import OpenAI from 'openai';

const prisma = new PrismaClient();
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

const flashCardResolver = {
  Query: {
    flashCards: async (_, { deckId }) => {
      return await prisma.flashCard.findMany();
    },
    flashCard: async (_, { id }) => {
      return await prisma.flashCard.findUnique({ where: { id } });
    },
    generateMultipleChoiceQuestions: async (_, { topic }) => {
      const prompt = `Generate 10 multiple choice questions about ${topic}.
        Return them in the following JSON format, and nothing else:
        {
          "questions": [
            {
              "question": "What is...",
              "options": [
                {"text": "option 1", "isCorrect": false},
                {"text": "option 2", "isCorrect": true},
                {"text": "option 3", "isCorrect": false},
                {"text": "option 4", "isCorrect": false}
              ]
            }
          ]
        }`;

      const completion = await openai.chat.completions.create({
        messages: [{
          role: "system",
          content: "You are a helpful assistant that generates multiple choice questions. Always respond with valid JSON."
        },
        {
          role: "user",
          content: prompt
        }],
        model: "gpt-3.5-turbo",
        temperature: 0.7,
      });

      try {
        const response = JSON.parse(completion.choices[0].message.content);
        return response.questions;
      } catch (error) {
        console.error('Error parsing OpenAI response:', error);
        throw new Error('Failed to generate questions');
      }
    },
  },
  Mutation: {
    createFlashCard: async (_, { question, answer, deckId }, { user }) => {
      return await prisma.flashCard.create({
        data: { question, answer, deckId: parseInt(deckId) },
      });
    },
    updateFlashCard: async (_, { id, question, answer }, { user }) => {
      const flashCard = await prisma.flashCard.findUnique({
        where: { id: parseInt(id) },
        include: { deck: true },
      });
      if (flashCard.deck.userId !== user.id) {
        throw new Error("You are not authorized to update this card");
      }
      return await prisma.flashCard.update({
        where: { id: parseInt(id) },
        data: { question, answer },
      });
    },
    deleteFlashCard: async (_, { id }, { user }) => {
      const flashCard = await prisma.flashCard.findUnique({
        where: { id: parseInt(id) },
        include: { deck: true },
      });
      if (!flashCard) {
        throw new Error("Flashcard not found");
      }
      if (flashCard.deck.userId !== user.id) {
        throw new Error("You are not authorized to delete this card");
      }
      try {
        const card = await prisma.flashCard.delete({ where: { id: parseInt(id) } });
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
