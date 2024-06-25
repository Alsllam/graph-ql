import { gql } from 'apollo-angular';

export const GET_EVENTS = gql`
  query getEvent($filterNeedle: String!, $skip: Int!, $take: Int!){
    events(filterNeedle:$filterNeedle , skip:$skip ,take:$take){
        total
        items{
            id
            body
            date
        }
  }
}
`;

export const GET_EVENTS_DETAILS = gql`
  query getEventDetails($filterNeedle: String!, $skip: Int!, $take: Int!){
    events(filterNeedle:$filterNeedle , skip:$skip ,take:$take) {
        total
        items{
            id
            body
            date
            details
        }
  }
}
`;
export const GET_EVENTS_SESSIONS = gql`
query getEventSessions($filterNeedle: String!, $skip: Int!, $take: Int!){
  events(filterNeedle:$filterNeedle , skip:$skip ,take:$take){
        total
        items{
            id
            body
            date
            details
            sessions{
                id
                title
                startTime
                endTime

            }
        }
  }
}
`;
export const GET_EVENTS_ATENDEES = gql`
query getEventAtendees($filterNeedle: String!, $skip: Int!, $take: Int!){
  events(filterNeedle:$filterNeedle , skip:$skip ,take:$take) {
        total
        items{
            id
            body
            date
            details
            attendees{
                name
                email
            }
        }
  }
}
`;

export const EVENT_BY_ID = gql`
  query EventById($id: ID!) {
    event(id: $id) {
      id
      body
      date
      details
      sessions {
        id
        title
        startTime
        endTime
      }
    }
  }
`;

export const SESSION_BY_ID = gql`
  query GetSessionById($id: ID!) {
    session(id: $id) {
      title
      startTime
      endTime
    }
  }
`;

export const SESSION = gql`
query Session($id: ID!) {
  session(id: $id) {
    id
    title
    event {
      id
      body
      sessions {
        title
        startTime
        endTime
      }
    }
    attendees{
      name
      email
    }
  }
}
`;

export const ATTENDEES = gql`
  query Attendees {
    attendees {
      items {
        id
        name
        email
        sessions {
          title
          startTime
          endTime
        }
      }
    }
  }
`;
