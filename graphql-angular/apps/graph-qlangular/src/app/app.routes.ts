import { Route } from '@angular/router';
import { AddCommentComponent } from './add-comment/add-comment.component';
import { QueriesComponent } from './queries/queries.component';
import { CreateUpdateFeedComponent } from './create-update-feed/create-update-feed.component';
import { FeedDetailsComponent } from './feed-details/feed-details.component';

export const appRoutes: Route[] = [
  { path: '', component: QueriesComponent },
  { path: 'feed/:id', component: AddCommentComponent },
  {path:'feed-details/:id' ,component:FeedDetailsComponent},
  {
    path: 'create',
    component: CreateUpdateFeedComponent,
    data: { mode: 'submit' },
  },
  {
    path: 'feed/update/:id',
    component: CreateUpdateFeedComponent,
    data: { mode: 'update' },
  },
  {
    path: 'feed/view/:id',
    component: CreateUpdateFeedComponent,
    data: { mode: 'view' },
  },
  {
    path: 'add-comment',
    component: AddCommentComponent,
  },
];
