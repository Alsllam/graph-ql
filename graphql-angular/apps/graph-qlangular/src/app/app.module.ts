import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { appRoutes } from './app.routes';
import { NxWelcomeComponent } from './nx-welcome.component';
import { APOLLO_NAMED_OPTIONS, APOLLO_OPTIONS, ApolloModule, NamedOptions } from 'apollo-angular';
import { HttpBatchLink, HttpLink } from 'apollo-angular/http';
import { HttpClientModule } from '@angular/common/http';
import { ApolloClientOptions, InMemoryCache, split } from '@apollo/client/core';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { getMainDefinition, offsetLimitPagination } from '@apollo/client/utilities';
import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
import { createClient } from 'graphql-ws';
import { Kind, OperationTypeNode } from 'graphql';

import { EventListComponent } from './event-list/event-list.component';
import { CreateUpdateEventComponent } from './create-update-event/create-update-event.component';
import { CreateUpdateSessionComponent } from './create-update-session/create-update-session.component';
import { SessionComponent } from './session/session.component';
import { createPersistedQueryLink } from 'apollo-angular/persisted-queries';
import { sha256 } from 'crypto-hash';
import { ToastrModule } from 'ngx-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SSELink } from './sse-link';


@NgModule({
  declarations: [
    AppComponent,
    NxWelcomeComponent,
    CreateUpdateEventComponent,
    EventListComponent,
    CreateUpdateSessionComponent,
    SessionComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    RouterModule.forRoot(appRoutes, { initialNavigation: 'enabledBlocking' }),
    HttpClientModule,
    ToastrModule.forRoot(),
    ApolloModule,
    ReactiveFormsModule,
    NgxDatatableModule,
    FormsModule
  ],
  providers: [
    // {
    //   provide: APOLLO_OPTIONS,
    //   useFactory(httpLink: HttpBatchLink): ApolloClientOptions<unknown> {
    //     // Create an http link:
    //     const http = httpLink.create({
    //       uri: 'http://localhost:4000/graphql',
    //       batchMax: 1000,
    //     });
    //     // hashing query
    //     const persistedHttp = createPersistedQueryLink({sha256}).concat(http);

    //     // Create a WebSocket link:
    //     const ws = new GraphQLWsLink(
    //       createClient({
    //         url: 'ws://localhost:5000/graphql',
    //       })
    //     );

    //     // Using the ability to split links, you can send data to each link
    //     // depending on what kind of operation is being sent
    //     const link = split(
    //       // Split based on operation type
    //       ({ query }) => {
    //         const definition = getMainDefinition(query);
    //         return (
    //           definition.kind === Kind.OPERATION_DEFINITION &&
    //           definition.operation === OperationTypeNode.SUBSCRIPTION
    //         );
    //       },
    //       ws,
    //       // persistedHttp
    //       http
    //     );
        
    //     return {
    //       link,
    //       cache: new InMemoryCache({
    //         // typePolicies:{
    //         //   Query:{
    //         //     fields:{
    //         //       events:offsetLimitPagination(),
    //         //     }

    //         //   }
    //         // }
    //       }),
    //       // ... Options
    //     };
    //   },
    //   deps: [HttpBatchLink],
    // },
    {
      provide: APOLLO_NAMED_OPTIONS, // <-- Different from standard initialization
      useFactory(httpLink: HttpBatchLink): NamedOptions {
        // Create an http link:
        const http = httpLink.create({
          uri: 'http://localhost:4000/graphql',
          batchMax: 1000,
        });
        // hashing query
        const persistedHttp = createPersistedQueryLink({sha256}).concat(http);
         // Create a WebSocket link:
         const ws = new GraphQLWsLink(
          createClient({
            url: 'ws://localhost:5000/graphql',
          })
        );
        const ssehttp = httpLink.create({
          uri: 'http://localhost:4000/graphql',
        });
        const sseLink = new SSELink({
          url: 'http://localhost:4000/graphql', // Your SSE subscriptions endpoint

        });
        const seeLinkConcat = sseLink.concat(ssehttp);

        // Using the ability to split links, you can send data to each link
        // depending on what kind of operation is being sent
        const link = split(
          // Split based on operation type
          ({ query }) => {
            const definition = getMainDefinition(query);
            return (
              definition.kind === Kind.OPERATION_DEFINITION &&
              definition.operation === OperationTypeNode.SUBSCRIPTION
            );
          },
          ws,
          http
        );
        const hashedLink = split(
          // Split based on operation type
          ({ query }) => {
            const definition = getMainDefinition(query);
            return (
              definition.kind === Kind.OPERATION_DEFINITION &&
              definition.operation === OperationTypeNode.SUBSCRIPTION
            );
          },
          ws,
          persistedHttp
        );
        return {
          default: /* <-- This settings will be saved as default client */ {
            cache: new InMemoryCache(),
            link:link,
          },
          newClientName: /* <-- These settings will be saved by name: newClientName */ {
            cache: new InMemoryCache(),
            link:hashedLink
          },
          sseLink: /* <-- These settings will be saved by name: newClientName */ {
            cache: new InMemoryCache(),
            link:seeLinkConcat
          },
        };
        
      },
      deps: [HttpBatchLink],
    }
  ],

  bootstrap: [AppComponent],
})
export class AppModule {

}
