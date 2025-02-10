
import { PrismaClient } from "@prisma/client";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
const prisma = new PrismaClient();

const userResolver = {
  Query: {
    users: async () => {
      return await prisma.user.findMany({
        include: { decks: true }
      });},
    user: async (_, { id }) => {
      return await prisma.user.findUnique({where: { id:id }, include: { decks: true }});
    },
    me: async (_, __, { user }) => {
      if(!user){
        throw new Error("You are not authenticated");
      }
      const authenticatedUser = await prisma.user.findUnique({ where: { id: user.id }, include: { decks: true } });
      return authenticatedUser;
    }
  },
  Mutation: {
    createUser: async (_, { name, email, password }) => {
      password = await bcrypt.hash(password, 10);
      return await prisma.user.create({ data: { name, email, password } })
    },
    updateUser: async (_, { id, name, email, password }) => {
      if(password){
        password = await bcrypt.hash(password, 10);
      }
      return await prisma.user.update({ where: { id }, data: { name, email, password } });
    },
    deleteUser: async (_, { id },{user}) => {
      if(user.id !== id){
        throw new Error("You are not authorized to delete this user");
      }
      try{
        const u = await prisma.deck.deleteMany({ where: { userId: id } });
        if(u){
          await prisma.user.delete({ where: { id } });
          return true;
        }else{
          return false;
        }
      }catch(e){
        return false;
      }
    },
    login: async (_, { email, password }) => {
      const user = await prisma.user.findUnique({ where: { email } });
      if(!user){
        throw new Error("User not found");
      }
      const valid = await bcrypt.compare(password, user.password);
      if(!valid){
        throw new Error("Invalid password");
      }
      const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '1d' });
      return token;
    },
  }
};

export default userResolver;
