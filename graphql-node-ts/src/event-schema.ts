import { createSchema } from 'graphql-yoga'
import { type Event, type Session, type Attendee } from '@prisma/client'
import type { GraphQLContext } from './context'

const typeDefinitions = /* GraphQL */ `
  type Event {
    id: ID!
    body: String!
    date: String!
    details: String
    sessions: [Session]
    attendees: [Attendee]
  }
  type Attendee {
    id: ID!
    name: String!
    email: String!
    sessions: [Session]
  }
  type Session {
    id: ID!
    title: String!
    startTime: String!
    endTime: String!
    event: Event
    eventId: ID!
    attendees: [Attendee]
  }
  type Query {
    info: String!
    events: [Event]!
    attendees: [Attendee]!
    session: [Session]!
  }
  type Mutation {
    createEvent(name: String!, date: String!, details: String): Event
    updateEvent(id: ID!, name: String, date: String, details: String): Event
    deleteEvent(id: ID!): Event

    registerAttendee(sessionId: ID!, name: String!, email: String!): Attendee

    createSession(eventId: ID!, title: String!, startTime: String!, endTime: String!): Session
    updateSession(id: ID!, title: String, startTime: String, endTime: String): Session
    deleteSession(id: ID!): Session
  }
`
// speakers: [Speaker]


const resolvers = {
    Query: {
      info: () => `This is the API of a Hackernews Clone`,
      events: (parent: unknown, args: {}, context: GraphQLContext) => context.prisma.event.findMany(),
      attendees: (parent: unknown, args: {}, context: GraphQLContext) => context.prisma.attendee.findMany(),
      session: (parent: unknown, args: {}, context: GraphQLContext) => context.prisma.session.findMany(),
    },
    Event: {
      id: (parent: Event) => parent.id,
      body: (parent: Event) => parent.body,
      date: (parent: Event) => parent.date,
      details: (parent: Event) => parent.details,
      sessions(parent: Event, args: {}, context: GraphQLContext) {
        return context.prisma.session.findMany({
          where: {
            eventId: parent.id
          }
        })
      },
      async attendees(parent: Event, args: {}, context: GraphQLContext) {
        const session = await context.prisma.session.findMany({
          where: { eventId: parent.id}
        })
        const sessionAttendees = await context.prisma.sessionAttendees.findMany({
          where: { sessionId: {in : session.map(e => e.id)}}
        })
        return context.prisma.attendee.findMany({
          where: {
            id: {in: sessionAttendees.map(e => e.attendeeId)}
          }
        })
      }
    },
    Session: {
      id: (parent: Session) => parent.id,
      title: (parent: Session) => parent.title,
      startTime: (parent: Session) => parent.startTime,
      endTime: (parent: Session) => parent.endTime,
      eventId: (parent: Session) => parent.eventId,
      event(parent: Session, args: {}, context: GraphQLContext) {
        return context.prisma.event.findUnique({
          where: {
            id: parent.eventId
          }
        })
      },
      async attendees(parent: Event, args: {}, context: GraphQLContext) {
        const sessionAttendees = await context.prisma.sessionAttendees.findMany({
          where: { sessionId: parent.id}
        })
        return context.prisma.attendee.findMany({
          where: {
            id: {in: sessionAttendees.map(e => e.attendeeId)}
          }
        })
      }
    },
    Attendee: {
      id: (parent: Attendee) => parent.id,
      name: (parent: Attendee) => parent.name,
      email: (parent: Attendee) => parent.email,
      async sessions(parent: Event, args: {}, context: GraphQLContext) {
        const sessionAttendees = await context.prisma.sessionAttendees.findMany({
          where: { attendeeId: parent.id}
        })
        return context.prisma.session.findMany({
          where: {
            id: {in: sessionAttendees.map(e => e.sessionId)}
          }
        })
      }
    },
    Mutation: {
      async createEvent(parent: unknown, args: {name: string; date: string; details: string}, context: GraphQLContext){
        const newEvent = await context.prisma.event.create({
            data: {
              body: args.name,
              date: new Date(),
              details: args.details,
            }
          })
          return newEvent
      },
      async registerAttendee(parent: unknown, args: {sessionId: string; name: string; email: string}, context: GraphQLContext){
        let attendee = await context.prisma.attendee.findFirst({
          where: {
            name: args.name,
            email: args.email
          }
        })

        if(!attendee){
          attendee = await context.prisma.attendee.create({
            data: {
              email: args.email,
              name: args.name
            }
          })
        }

        const newAttendee = await context.prisma.sessionAttendees.create({
            data: {
              sessionId: parseInt(args.sessionId),
              attendeeId: attendee.id
            }
          })
          return newAttendee
      },

      async createSession(parent: unknown, args: {eventId: string; title: string; startTime: string; endTime: string}, context: GraphQLContext){
        const newSession = await context.prisma.session.create({
            data: {
              eventId: parseInt(args.eventId),
              title: args.title,
              startTime: new Date(),
              endTime: new Date(),
            }
          })
          return newSession
      }
   
    }
  }

export const schema = createSchema({
    resolvers: [resolvers],
    typeDefs: [typeDefinitions]
})