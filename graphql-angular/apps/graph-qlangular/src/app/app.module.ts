import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { appRoutes } from './app.routes';
import { NxWelcomeComponent } from './nx-welcome.component';
import { APOLLO_OPTIONS, ApolloModule, gql } from 'apollo-angular';
import { HttpLink } from 'apollo-angular/http';
import { HttpClientModule } from '@angular/common/http';
import { InMemoryCache } from '@apollo/client/core';
import { QueriesComponent } from './queries/queries.component';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { FeedDetailsComponent } from './feed-details/feed-details.component';
import { offsetLimitPagination } from '@apollo/client/utilities';
import { FormsModule } from '@angular/forms';
import { createFragmentRegistry } from '@apollo/client/cache';
@NgModule({
  declarations: [
    AppComponent,
    NxWelcomeComponent,
    QueriesComponent,
    FeedDetailsComponent,
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(appRoutes, { initialNavigation: 'enabledBlocking' }),
    HttpClientModule,
    ApolloModule,
    NgxDatatableModule,
    FormsModule,
  ],
  providers: [
    {
      provide: APOLLO_OPTIONS,
      useFactory(httpLink: HttpLink) {
        return {
          cache: new InMemoryCache({
            typePolicies: {
              Query: {
                fields: {
                  feedPaging: offsetLimitPagination(),
                },
              },
            },
            // fragments:createFragmentRegistry(gql`
            //         fragment FeedDetails on Link {
            //           id,
            //           description,
            //           url,
            //           }

            //   `)
          }),
          link: httpLink.create({
            uri: 'http://localhost:4000/graphql',
          }),
        };
      },
      deps: [HttpLink],
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}

// ...MoreFeedDetails

// fragment MoreFeedDetails on Link{
//   comments {
//     body
//   }
// }
