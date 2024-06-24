import { Route } from '@angular/router';
import { AddCommentComponent } from './add-comment/add-comment.component';
import { QueriesComponent } from './queries/queries.component';
import { CreateUpdateFeedComponent } from './create-update-feed/create-update-feed.component';
import { EventListComponent } from './event-list/event-list.component';
import { CreateUpdateEventComponent } from './create-update-event/create-update-event.component';
import { CreateUpdateSessionComponent } from './create-update-session/create-update-session.component';

export const appRoutes: Route[] = [
  { path: '', component: EventListComponent },
  // { path: '', component: QueriesComponent },
  { path: 'feed/:id', component: AddCommentComponent },
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
    path: 'event/create',
    component: CreateUpdateEventComponent,
  },
  {
    path: 'event/update/:id',
    component: CreateUpdateEventComponent,
    data: { mode: 'update' },
  },
  {
    path: 'session/create/:id',
    component: CreateUpdateSessionComponent,
  },
  {
    path: 'session/update/:id',
    component: CreateUpdateSessionComponent,
  },
  {
    path: 'add-comment',
    component: AddCommentComponent,
  },
];
