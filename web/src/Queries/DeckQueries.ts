import { gql } from "@apollo/client";

export const GET_DECKS = gql`
  query getDecks {
    decks {
      id
      title
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
