import { Route } from '@angular/router';
import { EventListComponent } from './event-list/event-list.component';
import { CreateUpdateEventComponent } from './create-update-event/create-update-event.component';
import { CreateUpdateSessionComponent } from './create-update-session/create-update-session.component';
import { SessionComponent } from './session/session.component';

export const appRoutes: Route[] = [
  { path: '', component: EventListComponent },
  // { path: '', component: QueriesComponent },
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
    data: { mode: 'update' },
  },
  {
    path: 'session/:id',
    component: SessionComponent,
  },
];
