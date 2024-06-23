import { createSchema } from 'graphql-yoga'
import { type Link } from '@prisma/client'
import type { GraphQLContext } from './context'

const typeDefinitions = /* GraphQL */ `
 union Posts = Link | Comment

  type Link {
    id: ID!
    description: String!
    url: String!
    comments: [Comment!]!
  }
  
  type Comment {
    id: ID!
    body: String!
    linkId: String
  }
  
  type Query {
    searchInPosts(contains: String): [Posts]
    info: String!
    feed: [Link!]!
    feedFilter(filterNeedle: String): [Link!]!
    feedPaging(filterNeedle: String, skip: Int, take: Int): [Link!]!
    comment(id: ID!): Comment
  }
  
  type Mutation {
    postLink(url: String!, description: String!): Link!
    postCommentOnLink(linkId: ID!, body: String!): Comment!
  }
`



const resolvers = {
    Query: {
      searchInPosts(parent: unknown, args: { contains: String }, context: GraphQLContext){
        return context.prisma.comment.findMany();
      },
      info: () => `This is the API of a Hackernews Clone`,
      feed: (parent: unknown, args: {}, context: GraphQLContext) => context.prisma.link.findMany(),
      async comment(parent: unknown, args: { id: string }, context: GraphQLContext) {
            return context.prisma.comment.findUnique({
            where: { id: parseInt(args.id) }
        })
    },
      async feedFilter(parent: unknown, args: { filterNeedle?: string }, context: GraphQLContext) {
        const where = args.filterNeedle
          ? {
              OR: [
                { description: { contains: args.filterNeedle } },
                { url: { contains: args.filterNeedle } }
              ]
            }
          : {}
   
        return context.prisma.link.findMany({ where })
      },
      async feedPaging(
        parent: unknown,
        args: { filterNeedle?: string; skip?: number; take?: number },
        context: GraphQLContext
      ) {
        const where = args.filterNeedle
          ? {
              OR: [
                { description: { contains: args.filterNeedle } },
                { url: { contains: args.filterNeedle } }
              ]
            }
          : {}
   
        return context.prisma.link.findMany({
          where,
          skip: args.skip,
          take: args.take
        })
      },
    },
    Link: {
      id: (parent: Link) => parent.id,
      description: (parent: Link) => parent.description,
      url: (parent: Link) => parent.url,
      comments(parent: Link, args: {}, context: GraphQLContext) {
        return context.prisma.comment.findMany({
          where: {
            linkId: parent.id
          }
        })
      }
    },
    Mutation: {
      async postLink(
        parent: unknown,
        args: { description: string; url: string },
        context: GraphQLContext
      ) {
        const newLink = await context.prisma.link.create({
          data: {
            url: args.url,
            description: args.description
          }
        })
        return newLink
      },
      async postCommentOnLink(
        parent: unknown,
        args: { linkId: string; body: string },
        context: GraphQLContext
      ) {
        const newComment = await context.prisma.comment.create({
            data: {
              linkId: parseInt(args.linkId),
              body: args.body
            }
          })
     
          return newComment
      }
    }
  }

export const schema = createSchema({
    resolvers: [resolvers],
    typeDefs: [typeDefinitions]
})