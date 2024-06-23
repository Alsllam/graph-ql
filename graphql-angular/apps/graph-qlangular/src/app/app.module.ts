import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { appRoutes } from './app.routes';
import { NxWelcomeComponent } from './nx-welcome.component';
import { APOLLO_OPTIONS, ApolloModule } from 'apollo-angular';
import { HttpLink } from 'apollo-angular/http';
import { HttpClientModule } from '@angular/common/http';
import { InMemoryCache } from '@apollo/client/core';
import { QueriesComponent } from './queries/queries.component';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { FeedDetailsComponent } from './feed-details/feed-details.component';
import { CreateUpdateFeedComponent } from './create-update-feed/create-update-feed.component';
import { AddCommentComponent } from './add-comment/add-comment.component';
import { ReactiveFormsModule } from '@angular/forms';
import { EventListComponent } from './event-list/event-list.component';
@NgModule({
  declarations: [
    AppComponent,
    NxWelcomeComponent,
    QueriesComponent,
    CreateUpdateFeedComponent,
    AddCommentComponent,
    EventListComponent,
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(appRoutes, { initialNavigation: 'enabledBlocking' }),
    HttpClientModule,
    ApolloModule,
    ReactiveFormsModule,
    NgxDatatableModule,
  ],
  providers: [
    {
      provide: APOLLO_OPTIONS,
      useFactory(httpLink: HttpLink) {
        return {
          cache: new InMemoryCache(),
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
