import { gql } from "apollo-angular";

export const GET_EVENTS = gql`
query {
    events {
        id
        body
        date
  }
}
`;

export const GET_EVENTS_DETAILS = gql`
query {
    events {
        id
        body
        date
        details
  }
}
`;