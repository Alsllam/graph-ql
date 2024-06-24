import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Apollo} from 'apollo-angular';
import { Subscription } from 'rxjs';
import { GET_EVENTS, GET_EVENTS_DETAILS, GET_EVENTS_SESSIONS, GET_EVENTS_SESSIONS_ATENDEES } from '../gql/events-query';
@Component({
  selector: 'graphql-angular-event-list',
  templateUrl: './event-list.component.html',
  styleUrls: ['./event-list.component.scss'],
})
export class EventListComponent  implements OnInit, OnDestroy {
  sub$: Subscription;
  rows: any;
  events: any;
  page: any;
  expanded: any = {};
  haveDetails: boolean;
  haveSessions: boolean;
  haveAtendees: boolean;
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
        this.rows = res?.data.events.items;
      });
  }
  public displayDetails(isChecked:any) {
    this.haveSessions = false;
this.haveAtendees = false;
   const checked =  isChecked?.target.checked;
   if(checked){
    this.haveDetails = checked;
    this.sub$ = this.apollo
      .watchQuery<any>({
        query: GET_EVENTS_DETAILS,
        fetchPolicy: 'no-cache',
      })
      .valueChanges.subscribe((res: any) => {
        this.rows = res?.data.events.items;
      });
   }else{
    this.haveDetails = checked;
   }
  }
  public displaySessions(isChecked:any) {
    this.haveDetails = false;
this.haveAtendees = false;
   const checked =  isChecked?.target.checked;
   if(checked){
    this.haveSessions = checked;
    this.sub$ = this.apollo
      .watchQuery<any>({
        query: GET_EVENTS_SESSIONS,
        fetchPolicy: 'no-cache',
      })
      .valueChanges.subscribe((res: any) => {
        this.rows = res?.data.events.items;
      });
   }else{
    this.haveSessions = checked;
   }
  }
  public displayAttendees(isChecked:any) {
    this.haveDetails = false;
this.haveSessions = false;
   const checked =  isChecked?.target.checked;
   if(checked){
    this.haveAtendees = checked;
    this.sub$ = this.apollo
      .watchQuery<any>({
        query: GET_EVENTS_SESSIONS_ATENDEES,
        fetchPolicy: 'no-cache',
      })
      .valueChanges.subscribe((res: any) => {
        this.rows = res?.data.events.items;
      });
   }else{
    this.haveAtendees = checked;
   }
  }
  toggleExpandRow(row:any){
    this.table.rowDetail.toggleExpandRow(row);
  }
  onDetailToggle(row:any){
    this.table.rowDetail.toggleExpandRow(row);
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

