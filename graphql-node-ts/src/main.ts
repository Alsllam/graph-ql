import { createServer } from 'http'
import { createYoga } from 'graphql-yoga'
import { createContext } from './context'
import { schema } from './event-schema'
import { WebSocketServer } from 'ws'
import { useServer } from 'graphql-ws/lib/use/ws'
import { useAPQ } from '@graphql-yoga/plugin-apq'

function main() {
    const yoga = createYoga({ schema, context: createContext,  batching: { limit: 1000},  plugins: [useAPQ()] })
    const server = createServer(yoga)
    server.listen(4000, () => {
        console.info('Server is running on http://localhost:4000/graphql')
    })


    const yogaApp = createYoga({
        schema, context: createContext,
        graphiql: {
            // Use WebSockets in GraphiQL
            subscriptionsProtocol: 'WS'
        }
    });
    // Get NodeJS Server from Yoga
    const httpServer = createServer(yogaApp);
    // Create WebSocket server instance from our Node server
    const wsServer = new WebSocketServer({
        server: httpServer,
        path: yogaApp.graphqlEndpoint
    });
    // Integrate Yoga's Envelop instance and NodeJS server with graphql-ws
    useServer({
        execute: (args: any) => args.rootValue.execute(args),
        subscribe: (args: any) => args.rootValue.subscribe(args),
        onSubscribe: async (ctx, msg) => {
                const { schema, execute, subscribe, contextFactory, parse, validate } = yogaApp.getEnveloped({
                ...ctx,
                req: ctx.extra.request,
                socket: ctx.extra.socket,
                params: msg.payload
                })
        
                const args = {
                schema,
                operationName: msg.payload.operationName,
                document: parse(msg.payload.query),
                variableValues: msg.payload.variables,
                contextValue: await contextFactory(),
                rootValue: {
                    execute,
                    subscribe
                }
                }
        
                const errors = validate(args.schema, args.document)
                if (errors.length) return errors
                return args
            }
        },
        wsServer
    );
    httpServer.listen(5000, () => {
        console.log('Server is running on port 5000')
    })

}

main()