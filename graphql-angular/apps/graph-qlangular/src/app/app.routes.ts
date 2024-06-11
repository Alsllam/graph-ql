import { Route } from "@angular/router";
import { FeedDetailsComponent } from "./feed-details/feed-details.component";
import { QueriesComponent } from "./queries/queries.component";

export const appRoutes: Route[] = [
    {path:'' ,component:QueriesComponent},
    {path:'feed/:id' ,component:FeedDetailsComponent},
];
