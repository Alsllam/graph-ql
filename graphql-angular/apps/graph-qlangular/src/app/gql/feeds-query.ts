import { gql } from 'apollo-angular';

export const GET_Feeds = gql`
  query {
    feed {
      id
      url
      description
    }
  }
`;

export const GET_Feeds_Lookups = gql`
  query {
    feed {
      id
      url
    }
  }
`;

export const FEED_ById = gql`
  query ($id: Int!) {
    feedById(id: $id) {
      id
      description
      url
      comments {
        id
        body
      }
    }
  }
`;
