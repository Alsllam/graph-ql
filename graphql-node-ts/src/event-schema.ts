import { createSchema, createPubSub } from 'graphql-yoga'
import { type Event, type Session, type Attendee } from '@prisma/client'
import type { GraphQLContext } from './context'

const pubSub = createPubSub<{
  "eventUpdated" : [eventId: string, payload: Event],
  "attendeeRegistered" : [sessionId: string, payload: Attendee],
}>()

const typeDefinitions = /* GraphQL */ `
 type EventPagedResult {
    items: [Event!]!
    total: Int
  }
  type Event {
    id: ID!
    body: String!
    date: String!
    details: String
    sessions: [Session]
    attendees: [Attendee]
  }
  type AttendeePagedResult {
    items: [Attendee!]!
    total: Int
  }
  type Attendee {
    id: ID!
    name: String!
    email: String!
    sessions: [Session]
  }
  type SessionPagedResult {
    items: [Session!]!
    total: Int
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
    events(filterNeedle: String, skip: Int, take: Int): EventPagedResult!
    event(id: ID!): Event!
    attendees(filterNeedle: String, skip: Int, take: Int): AttendeePagedResult!
    attendee(id: ID!): Attendee!
    sessions(filterNeedle: String, skip: Int, take: Int): SessionPagedResult!
    session(id: ID!): Session!
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
  
  type Subscription {
    countdown(from: Int!): Int!
    attendeeRegistered(sessionId: String!): Attendee
    eventUpdated(eventId: String!): Event
  }

`
// speakers: [Speaker]


const resolvers = {
    Query: {
      info: () => `This is the API of a Hackernews Clone`,
      async events(parent: unknown, args: {filterNeedle?: string; skip?: number; take?: number}, context: GraphQLContext) {
        const where = args.filterNeedle 
          ? {
              OR: [
                { body: { contains: args.filterNeedle } },
                { details: { contains: args.filterNeedle } }
              ]
            }
          : {}

          const items = await context.prisma.event.findMany({
            where,
            skip: args.skip,
            take: args.take
          })
          const totalCount = await context.prisma.event.count({
            where,
          })
          return {items: items, total: totalCount }
      },
      event: (parent: unknown, args: {id: string}, context: GraphQLContext) => context.prisma.event.findUnique({where: {id: parseInt(args.id)}}),
      async attendees(parent: unknown, args: {filterNeedle?: string; skip?: number; take?: number}, context: GraphQLContext) {
        const where = args.filterNeedle 
          ? {
              OR: [
                { name: { contains: args.filterNeedle } },
                { email: { contains: args.filterNeedle } }
              ]
            }
          : {}

          const items = await context.prisma.attendee.findMany({
            where,
            skip: args.skip,
            take: args.take
          })
          const totalCount = await context.prisma.attendee.count({
            where,
          })
          return {items: items, total: totalCount }
      },
      attendee: (parent: unknown, args: {id: string}, context: GraphQLContext) => context.prisma.attendee.findUnique({where: {id: parseInt(args.id)}}),
      async sessions(parent: unknown, args: {filterNeedle?: string; skip?: number; take?: number}, context: GraphQLContext)  {
        const where = args.filterNeedle 
          ? {
              OR: [
                { title: { contains: args.filterNeedle } },
              ]
            }
          : {}

          const items = await context.prisma.session.findMany({
            where,
            skip: args.skip,
            take: args.take
          })
          const totalCount = await context.prisma.session.count({
            where,
          })
          return {items: items, total: totalCount }
      },
      session: (parent: unknown, args: {id: string}, context: GraphQLContext) => context.prisma.session.findUnique({where: {id: parseInt(args.id)}}),
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
      async updateEvent(parent: unknown, args: {id: string;name: string; date: string; details: string}, context: GraphQLContext){
        const newEvent = await context.prisma.event.update({
            data: {
              body: args.name,
              date: new Date(),
              details: args.details,
            },
            where: {
              id: parseInt(args.id)
            }
          });
          pubSub.publish('eventUpdated', args.id , newEvent)
          return newEvent
      },
      async deleteEvent(parent: unknown, args: {id: string}, context: GraphQLContext){
        const newEvent = await context.prisma.event.delete({
            where: {
              id: parseInt(args.id)
            }
          });
          pubSub.publish('eventUpdated', args.id, newEvent)
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
        pubSub.publish('attendeeRegistered',args.sessionId, attendee)
        return attendee
        
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
      },
      async updateSession(parent: unknown, args: {id: string; title: string; startTime: string; endTime: string}, context: GraphQLContext){
        const newSession = await context.prisma.session.update({
            data: {
              title: args.title,
              startTime: new Date(),
              endTime: new Date(),
            },
            where: {
              id: parseInt(args.id)
            }
          });
          return newSession
      },
      async deleteSession(parent: unknown, args: {id: string}, context: GraphQLContext){
        const newEvent = await context.prisma.session.delete({
            where: {
              id: parseInt(args.id)
            }
          });
          // pubSub.publish('eventUpdated',args.id, newEvent)
          return newEvent
      },
   
    },
    Subscription: {
      countdown: {
        // This will return the value on every 1 sec until it reaches 0
        subscribe: async function* (a: any, { from }: any) {
          for (let i = from; i >= 0; i--) {
            await new Promise(resolve => setTimeout(resolve, 1000))
            yield { countdown: i }
          }
        }
      },
      attendeeRegistered: {
        subscribe: (a: any,args: {sessionId: string}) => pubSub.subscribe('attendeeRegistered',args.sessionId),
        resolve: (payload: any) => payload
      },
      eventUpdated: {
        subscribe: (a: any,args: {eventId: string}) => pubSub.subscribe('eventUpdated', args.eventId),
        resolve: (payload: any) => payload
      }
    }
  }

export const schema = createSchema({
    resolvers: [resolvers],
    typeDefs: [typeDefinitions]
})