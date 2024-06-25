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

export const UPDATE_SESSION = gql`
  mutation UpdateSession(
    $id: ID!
    $title: String
    $startTime: String
    $endTime: String
  ) {
    updateSession(
      id: $id
      title: $title
      startTime: $startTime
      endTime: $endTime
    ) {
      title
      startTime
      endTime
    }
  }
`;

export const SESSION_SUBSCRIBE = gql`
  subscription OnEventUpdated($eventId: String!) {
    eventUpdated(eventId: $eventId) {
      body
      details
    }
  }
`;
export const ATTENDEES_SUBSCRIBE = gql`
  subscription OnAttendeeRegistered($sessionId: String!) {
    attendeeRegistered(sessionId: $sessionId) {
      name
      email
    }
  }
`;

export const DELETE_SESSION = gql`
  mutation DeleteSession($id: ID!) {
    deleteSession(id: $id) {
      title
      startTime
      endTime
    }
  }
`;

export const REGISTER_ATTENDEE = gql`
  mutation RegisterAttendee($sessionId: ID!, $name: String!, $email: String!) {
    registerAttendee(sessionId: $sessionId, name: $name, email: $email) {
      id
      name
      email
    }
  }
`;
