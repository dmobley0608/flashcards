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
  mutation addCard($deckId: Int!, $question: String!, $answer: String!) {
    addCard(deckId: $deckId, question: $question, answer: $answer) {
      id
      question
      answer
    }
  }
`;
