import { gql } from 'apollo-angular';

export const GET_EVENTS = gql`
  query {
    events {
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
  query {
    events {
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
query {
    events {
        total
        items{
            id
            body
            date
            details
            sessions{
                title
                startTime
                endTime
    
            }
        }
  }
}
`;
export const GET_EVENTS_SESSIONS_ATENDEES = gql`
query {
    events {
        total
        items{
            id
            body
            date
            details
            sessions{
                title
                startTime
                endTime
                attendees{
                    name
                    email
                }
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
      }
    }
  }
`;
