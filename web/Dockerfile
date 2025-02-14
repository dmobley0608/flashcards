FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Clean install dependencies
RUN rm -rf node_modules
RUN npm cache clean --force
RUN npm install

COPY . .

EXPOSE 3007
CMD ["npm", "run", "dev", "--", "--host"]
