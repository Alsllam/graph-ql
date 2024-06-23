import { Feeds } from '../feeds';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ColumnMode } from '@swimlane/ngx-datatable/public-api';
import { Apollo, gql } from 'apollo-angular';
import { Subscription } from 'rxjs';
import { GET_Feeds } from '../gql/feeds-query';
import { FEED_SUBSCRIBE } from '../gql/feeds-mutations';
@Component({
  selector: 'graphql-angular-queries',
  templateUrl: './queries.component.html',
  styleUrls: ['./queries.component.scss'],
})
export class QueriesComponent implements OnInit, OnDestroy {
  sub$: Subscription;
  rows: Feeds[];
  // ColumnMode = ColumnMode;
  page: any;
  constructor(private readonly apollo: Apollo, private router: Router) {}
  ngOnInit(): void {
    this.apollo
      .subscribe({
        query: FEED_SUBSCRIBE,
      })
      .subscribe((result) => {
        if (result) {
          console.log('New data:', result);
        }
      });
    this.getData();
  }
  public getData() {
    this.sub$ = this.apollo
      .watchQuery<{ feed: Feeds[] }>({
        query: GET_Feeds,
        fetchPolicy: 'no-cache',
      })
      .valueChanges.subscribe((res: any) => {
        this.rows = res?.data.feed;
      });
  }
  setPage(pageNumber: any) {
    console.log('page Number', pageNumber);
  }
  viewDetails(id: number) {
    this.router.navigate([`feed/view/${id}`]);
  }
  update(id: number) {
    this.router.navigate([`feed/update/${id}`]);
  }
  ngOnDestroy(): void {
    this.sub$?.unsubscribe();
  }
}
