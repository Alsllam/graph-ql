import { gql } from 'apollo-angular';

export const CREATE_Feed = gql`
  mutation postLink($url: String!, $description: String!) {
    postLink(url: $url, description: $description) {
      id
      description
      url
    }
  }
`;

export const UPDATE_Feed = gql`
  mutation updateFeed($id: Int!, $url: String!, $description: String!) {
    updateFeed(id: $id, url: $url, description: $description) {
      id
      description
      url
    }
  }
`;

export const CREATE_Comment = gql`
  mutation postCommentOnLink($linkId: ID!, $body: String!) {
    postCommentOnLink(linkId: $linkId, body: $body) {
      id
      body
    }
  }
`;
