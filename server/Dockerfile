FROM node:18-alpine

WORKDIR /app

# Install dependencies first
COPY package*.json ./
RUN npm install

# Copy prisma files and generate client
COPY prisma ./prisma/
RUN npx prisma generate

# Copy rest of the application
COPY . .

RUN mkdir -p /app/data

EXPOSE 4000:4000
CMD ["npm", "start"]
