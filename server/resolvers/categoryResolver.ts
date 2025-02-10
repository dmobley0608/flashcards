import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const categoryResolver = {
  Query: {
    categories: async () => {
      return await prisma.category.findMany()
    },
    category: async (_, { id }) => {
      return await prisma.category.findUnique(
        {
          where: { id },
          include: { decks: true }
        });
    }
  },
  Mutation: {
    createCategory: async (_, { name }) => {
      return await prisma.category.create({ data: { name } })},
    updateCategory: async (_, { id, name }) => {
      return prisma.category.update({where: { id }, data: { name }});},
    deleteCategory: async (_, { id }) => {
      try{
        await prisma.category.delete({ where: { id } })
        const category = await prisma.category.findUnique({ where: { id } });
        if (category) {
          return false;
        } else {
          return true
        }
      }catch(e){
        return false
      }

    }
  }
};

export default categoryResolver;