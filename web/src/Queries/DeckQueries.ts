import { gql } from "@apollo/client";

export const GET_DECKS = gql`
  query getDecks {
    decks {
      id
      title
      userId
      cards {
        id
        question
        answer
      }
      categories {
        name
      }
    }
  }
`;

export const GET_DECKS_BY_USER_ID = gql`
  query getDecksByUserId {
    userDecks {
      id
      title
      userId
      cards {
        id
        question
        answer
      }
      categories {
        name
      }
    }
  }
`;

export const CREATE_DECK = gql`
  mutation createDeck($title: String!, $categories: [String!]!) {
    createDeck(title: $title, categories: $categories) {
      id
      title
      categories {
        name
      }
    }
  }
`;

export const DELETE_DECK = gql`
  mutation deleteDeck($id: Int!) {
    deleteDeck(id: $id)
  }
`;

export const UPDATE_DECK = gql`
  mutation updateDeck($id: Int!, $title: String!, $categories: [String!]!) {
    updateDeck(id: $id, title: $title, categories: $categories) {
      id
      title
      categories {
        name
      }
      cards {
        id
        question
        answer
      }
    }
  }
`;

export const ADD_CARD = gql`
  mutation AddCard($deckId: Int!, $question: String!, $answer: String!) {
    addCard(deckId: $deckId, question: $question, answer: $answer) {
      id
      question
      answer
    }
  }
`;

export const GET_DECK = gql`
  query getDeck($id: Int!) {
    deck(id: $id) {
      id
      title
      cards {
        id
        question
        answer
      }
    }
  }
`;

export const DELETE_CARD = gql`
  mutation DeleteCard($id: Int!) {
    deleteCard(id: $id)
  }
`;

export const UPDATE_CARD = gql`
  mutation UpdateCard($id: Int!, $question: String!, $answer: String!) {
    updateCard(id: $id, question: $question, answer: $answer) {
      id
      question
      answer
    }
  }
`;

export const GENERATE_MULTIPLE_CHOICE = gql`
  query GenerateMultipleChoice($topic: String!) {
    generateMultipleChoiceQuestions(topic: $topic) {
      question
      options {
        text
        isCorrect
      }
    }
  }
`;
