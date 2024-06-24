import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { appRoutes } from './app.routes';
import { NxWelcomeComponent } from './nx-welcome.component';
import { APOLLO_OPTIONS, ApolloModule } from 'apollo-angular';
import { HttpLink } from 'apollo-angular/http';
import { HttpClientModule } from '@angular/common/http';
import { ApolloClientOptions, InMemoryCache, split } from '@apollo/client/core';
import { QueriesComponent } from './queries/queries.component';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { FeedDetailsComponent } from './feed-details/feed-details.component';
import { CreateUpdateFeedComponent } from './create-update-feed/create-update-feed.component';
import { AddCommentComponent } from './add-comment/add-comment.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { getMainDefinition } from '@apollo/client/utilities';
import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
import { createClient } from 'graphql-ws';
import { Kind, OperationTypeNode } from 'graphql';

import { EventListComponent } from './event-list/event-list.component';
import { CreateUpdateEventComponent } from './create-update-event/create-update-event.component';
import { CreateUpdateSessionComponent } from './create-update-session/create-update-session.component';
@NgModule({
  declarations: [
    AppComponent,
    NxWelcomeComponent,
    QueriesComponent,
    CreateUpdateFeedComponent,
    AddCommentComponent,
    CreateUpdateEventComponent,
    EventListComponent,
    CreateUpdateSessionComponent,
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(appRoutes, { initialNavigation: 'enabledBlocking' }),
    HttpClientModule,
    ApolloModule,
    ReactiveFormsModule,
    NgxDatatableModule,
    FormsModule
  ],
  providers: [
    {
      provide: APOLLO_OPTIONS,
      useFactory(httpLink: HttpLink): ApolloClientOptions<unknown> {
        // Create an http link:
        const http = httpLink.create({
          uri: 'http://localhost:4000/graphql',
        });

        // Create a WebSocket link:
        const ws = new GraphQLWsLink(
          createClient({
            url: 'ws://localhost:4000/graphql',
          })
        );

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

        return {
          link,
          cache: new InMemoryCache(),
          // ... Options
        };
      },
      deps: [HttpLink],
    },
  ],

  bootstrap: [AppComponent],
})
export class AppModule {}
