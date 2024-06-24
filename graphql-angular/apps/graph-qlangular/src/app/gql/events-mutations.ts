import gql from 'graphql-tag';

export const CREATE_Event = gql`
  mutation CreateEvent($name: String!, $date: String!, $details: String!) {
    createEvent(name: $name, date: $date, details: $details) {
      id
      body
      date
      details
      sessions {
        id
        title
      }
    }
  }
`;

export const UPDATE_Event = gql`
  mutation UpdateEvent(
    $id: ID!
    $name: String!
    $date: String!
    $details: String!
  ) {
    updateEvent(id: $id, name: $name, date: $date, details: $details) {
      id
      body
      date
      details
      sessions {
        id
        title
      }
    }
  }
`;

export const CREATE_SESSION = gql`
  mutation CreateSession(
    $eventId: ID!
    $title: String!
    $startTime: String!
    $endTime: String!
  ) {
    createSession(
      eventId: $eventId
      title: $title
      startTime: $startTime
      endTime: $endTime
    ) {
      id
      title
      startTime
      endTime
    }
  }
`;