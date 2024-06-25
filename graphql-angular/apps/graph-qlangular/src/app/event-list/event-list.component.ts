import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Apollo, QueryRef } from 'apollo-angular';
import { Subscription } from 'rxjs';
import { GET_EVENTS, GET_EVENTS_DETAILS, GET_EVENTS_SESSIONS, GET_EVENTS_ATENDEES } from '../gql/events-query';
import { WatchQueryFetchPolicy } from '@apollo/client';
@Component({
  selector: 'graphql-angular-event-list',
  templateUrl: './event-list.component.html',
  styleUrls: ['./event-list.component.scss'],
})
export class EventListComponent implements OnInit, OnDestroy {
  sub$: Subscription;
  rows: any;
  totalCount = 0;
  events: any;
  page: any;
  expanded: any = {};
  haveDetails: boolean;
  haveSessions: boolean;
  haveAtendees: boolean;
  cacheFirst:string;
  cacheOnly:string;
  cacheAndNetwork:string;
  filterText:string;
  networkOnly:string;
  noCache:string;
  standby:string;
  fetchPolicy:WatchQueryFetchPolicy;
  isPolling = false;
  eventsQuery: QueryRef<any>;
  skip = 0;
  @ViewChild('myTable') table: any;
  constructor(private readonly apollo: Apollo, private router: Router) {}
  ngOnInit(): void {
    this.getData();
  }
  public getData() {
    this.eventsQuery = this.apollo
      .watchQuery<any>({
        query: GET_EVENTS,
        variables:{filterNeedle:'', skip:this.skip, take:10},
      })
    this.eventsQuery.valueChanges.subscribe((res: any) => {
      this.rows = res?.data.events.items;
      this.totalCount = res?.data.events.total;
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
        variables:{filterNeedle:'', skip:this.skip, take:10},

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
        variables:{filterNeedle:'', skip:this.skip, take:10},

      })
      .valueChanges.subscribe((res: any) => {
        this.rows = res?.data.events.items;
        this.totalCount = res?.data.events.total;
      });
   }else{
    this.haveSessions = checked;
   }
  }
  public next(){
    this.skip = this.skip +10;
    this.eventsQuery.setVariables({
      skip: this.skip,
      filterNeedle:'',
      take:10
    })
    // this.eventsQuery.fetchMore({
    //   variables:{
    //     skip:this.skip
    //   }
    // })
  }
  public previous(){
    this.eventsQuery.fetchMore({
      variables:{
        skip:this.skip-10
      }
    })
  }
  public Polling(){
    this.isPolling = !this.isPolling;
   if(this.isPolling){
     this.eventsQuery.startPolling(1000);
    }else{
     this.eventsQuery.stopPolling();
   }
  }
  refresh(){
    this.eventsQuery.refetch();
  }
  public displayAttendees(isChecked:any) {
    this.haveDetails = false;
    this.haveSessions = false;
   const checked =  isChecked?.target.checked;
   if(checked){
    this.haveAtendees = checked;
    this.sub$ = this.apollo
      .watchQuery<any>({
        query: GET_EVENTS_ATENDEES,
        variables:{filterNeedle:'', skip:this.skip, take:10},

      })
      .valueChanges.subscribe((res: any) => {
        this.rows = res?.data.events.items;
        this.totalCount = res?.data.events.total;
      });
   }else{
    this.haveAtendees = checked;
   }
  }
  toggleExpandRow(row:any){
    this.table.rowDetail.toggleExpandRow(row);
  }
  viewDetails(id: number) {
    this.router.navigate([`event/view/${id}`]);
  }
  update(id: number) {
    this.router.navigate([`event/update/${id}`]);
  }
  createSession(id: number) {
    this.router.navigate([`session/create/${id}`]);
  }
  updateSession(id: number){
    this.router.navigate([`session/update/${id}`]);
  }
  ngOnDestroy(): void {
    this.sub$?.unsubscribe();
  }
  setPage(pageInfo: any) {
    this.haveAtendees = false;
    this.haveSessions = false;
    this.haveDetails = false;
    this.eventsQuery.setVariables({
      skip: pageInfo.offset * pageInfo.limit,
      filterNeedle:'',
      take: pageInfo.limit
    })
    this.eventsQuery.setOptions({
      fetchPolicy: this.fetchPolicy
    })
  }
  getSelectedNetwork(event:any){
    this.fetchPolicy = event.target.value;
    this.eventsQuery.setOptions({
      fetchPolicy: this.fetchPolicy
    })
  }
  search(){
    this.eventsQuery.setVariables({
      skip: this.skip,
      filterNeedle:this.filterText,
      take:10
    })
  }
}
