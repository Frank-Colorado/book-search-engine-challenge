import { gql } from "@apollo/client";

// This is a query called QUERY_ME that returns a User type.
export const QUERY_ME = gql`
  query me {
    me {
      _id
      username
      email
      bookCount
      savedBooks {
        bookId
        authors
        description
        image
        link
        title
      }
    }
  }
`;
