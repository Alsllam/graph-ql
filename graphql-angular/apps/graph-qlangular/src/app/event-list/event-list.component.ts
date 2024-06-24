import { Feeds } from '../feeds';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Apollo } from 'apollo-angular';
import { Subscription } from 'rxjs';
import { GET_EVENTS, GET_EVENTS_DETAILS } from '../gql/events-query';
@Component({
  selector: 'graphql-angular-event-list',
  templateUrl: './event-list.component.html',
  styleUrls: ['./event-list.component.scss'],
})
export class EventListComponent implements OnInit, OnDestroy {
  sub$: Subscription;
  rows: any;
  page: any;
  expanded: any = {};
  haveDetails: boolean;
  @ViewChild('myTable') table: any;
  constructor(private readonly apollo: Apollo, private router: Router) {}
  ngOnInit(): void {
    this.getData();
  }
  public getData() {
    this.sub$ = this.apollo
      .watchQuery<any>({
        query: GET_EVENTS,
        fetchPolicy: 'no-cache',
      })
      .valueChanges.subscribe((res: any) => {
        this.rows = res?.data.events;
      });
  }
  public displayDetails(isChecked: any) {
    const checked = isChecked?.target.checked;
    if (checked) {
      this.haveDetails = checked;
      this.sub$ = this.apollo
        .watchQuery<any>({
          query: GET_EVENTS_DETAILS,
          fetchPolicy: 'no-cache',
        })
        .valueChanges.subscribe((res: any) => {
          this.rows = res?.data.events;
        });
    } else {
      this.haveDetails = checked;
    }
  }
  toggleExpandRow(row: any) {
    this.table.rowDetail.toggleExpandRow(row);
  }
  onDetailToggle(row: any) {
    this.table.rowDetail.toggleExpandRow(row);
  }
  viewDetails(id: number) {
    this.router.navigate([`feed/view/${id}`]);
  }
  update(id: number) {
    this.router.navigate([`feed/update/${id}`]);
  }
  createSession(id: number) {
    this.router.navigate([`session/create/${id}`]);
  }
  ngOnDestroy(): void {
    this.sub$?.unsubscribe();
  }
}
