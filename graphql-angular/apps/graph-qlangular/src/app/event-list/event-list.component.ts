import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Apollo, QueryRef, gql } from 'apollo-angular';
import { Subscription } from 'rxjs';
import {
  GET_EVENTS,
  GET_EVENTS_DETAILS,
  GET_EVENTS_SESSIONS,
  GET_EVENTS_ATENDEES,
} from '../gql/events-query';
import { Observable, WatchQueryFetchPolicy } from '@apollo/client/core';
import { ToastrService } from 'ngx-toastr';
import { EVENT_IMPORTANCE, UPLOAD_FILE } from '../gql/events-mutations';
// import { themeVar } from '../app.module';

const GET_THEME = gql`
  query GetTheme {
    theme @client
  }
`;

// const uploadFile = gql`
//   mutation uploadFile($file: Upload!) {
//     uploadFile(file: { file: $file })
//   }
// `;

@Component({
  selector: 'graphql-angular-event-list',
  templateUrl: './event-list.component.html',
  styleUrls: ['./event-list.component.scss'],
})
export class EventListComponent implements OnInit, OnDestroy {
  theme: string;
  sub$: Subscription;
  getSub$: Subscription;
  rows: any;
  totalCount = 0;
  events: any;
  page: any;
  expanded: any = {};
  haveDetails: boolean;
  haveSessions: boolean;
  haveAtendees: boolean;
  cacheFirst: string;
  cacheOnly: string;
  cacheAndNetwork: string;
  filterText: string;
  networkOnly: string;
  noCache: string;
  standby: string;
  fetchPolicy: WatchQueryFetchPolicy = 'no-cache';
  isPolling = false;
  eventsQuery: QueryRef<any>;
  skip = 0;
  @ViewChild('myTable') table: any;
  selectedOption = '';
  selectedFile: File | null = null;

  constructor(
    private readonly apollo: Apollo,
    private router: Router,
    private toasterService: ToastrService
  ) {}
  ngOnInit(): void {
    // this.apollo.watchQuery({ query: GET_THEME }).valueChanges.subscribe((data: any) => {
    //   console.log('data.theme',data.data.theme);

    //   this.theme = data.data.theme;
    // });

    this.getData();
  }

  // toggleTheme() {
  //   themeVar(this.theme === 'light' ? 'dark' : 'light');
  // }

  public getData() {
    this.getSub$?.unsubscribe();
    this.eventsQuery = this.apollo.watchQuery<any>({
      query: GET_EVENTS,
      variables: { filterNeedle: '', skip: this.skip, take: 10 },
      fetchPolicy: this.fetchPolicy,
    });
    this.getSub$ = this.eventsQuery.valueChanges.subscribe((res: any) => {
      if (
        Object.keys(res.data).length === 0 &&
        this.fetchPolicy === 'cache-only'
      ) {
        this.rows = [];
        this.toasterService.warning('There is No Data');
      } else {
        this.rows = res?.data.events.items;
        this.totalCount = res?.data.events.total;
      }
    });
    this.eventsQuery = this.apollo.watchQuery<any>({
      query: GET_EVENTS,
      variables: { filterNeedle: '', skip: this.skip, take: 10 },
      fetchPolicy: this.fetchPolicy,
    });
    this.getSub$ = this.eventsQuery.valueChanges.subscribe((res: any) => {
      if (
        Object.keys(res.data).length === 0 &&
        this.fetchPolicy === 'cache-only'
      ) {
        this.rows = [];
        this.toasterService.warning('There is No Data');
      } else {
        this.rows = res?.data.events.items;
        this.totalCount = res?.data.events.total;
      }
    });
  }
  public displayDetails(isChecked: any) {
    this.haveSessions = false;
    this.haveAtendees = false;
    const checked = isChecked?.target.checked;
    if (checked) {
      this.haveDetails = checked;
      this.sub$ = this.apollo
        .watchQuery<any>({
          query: GET_EVENTS_DETAILS,
          variables: { filterNeedle: '', skip: this.skip, take: 10 },
        })
        .valueChanges.subscribe((res: any) => {
          this.rows = res?.data.events.items;
        });
    } else {
      this.haveDetails = checked;
    }
  }
  public displaySessions(isChecked: any) {
    this.haveDetails = false;
    this.haveAtendees = false;
    const checked = isChecked?.target.checked;
    if (checked) {
      this.haveSessions = checked;
      this.sub$ = this.apollo
        .watchQuery<any>({
          query: GET_EVENTS_SESSIONS,
          variables: { filterNeedle: '', skip: this.skip, take: 10 },
        })
        .valueChanges.subscribe((res: any) => {
          this.rows = res?.data.events.items;
          this.totalCount = res?.data.events.total;
        });
    } else {
      this.haveSessions = checked;
    }
  }
  public next() {
    this.skip = this.skip + 10;
    this.eventsQuery.setVariables({
      filterNeedle: '',
      skip: this.skip,
      take: 10,
    });
    // this.eventsQuery.fetchMore({
    //   variables:{
    //     skip:this.skip
    //   }
    // })
  }
  public previous() {
    this.eventsQuery.fetchMore({
      variables: {
        skip: this.skip - 10,
      },
    });
  }
  public Polling() {
    this.isPolling = !this.isPolling;
    if (this.isPolling) {
      this.eventsQuery.startPolling(1000);
    } else {
      this.eventsQuery.stopPolling();
    }
  }
  refresh() {
    this.eventsQuery.refetch();
  }
  public displayAttendees(isChecked: any) {
    this.haveDetails = false;
    this.haveSessions = false;
    const checked = isChecked?.target.checked;
    if (checked) {
      this.haveAtendees = checked;
      this.sub$ = this.apollo
        .watchQuery<any>({
          query: GET_EVENTS_ATENDEES,
          variables: { filterNeedle: '', skip: this.skip, take: 10 },
        })
        .valueChanges.subscribe((res: any) => {
          this.rows = res?.data.events.items;
          this.totalCount = res?.data.events.total;
        });
    } else {
      this.haveAtendees = checked;
    }
  }
  toggleExpandRow(row: any) {
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
  updateSession(id: number) {
    this.router.navigate([`session/update/${id}`]);
  }
  ngOnDestroy(): void {
    this.sub$?.unsubscribe();
    this.getSub$?.unsubscribe();
  }
  setPage(pageInfo: any) {
    this.haveAtendees = false;
    this.haveSessions = false;
    this.haveDetails = false;
    this.eventsQuery.setVariables({
      filterNeedle: '',
      skip: pageInfo.offset * pageInfo.limit,
      take: pageInfo.limit,
    });
  }
  getSelectedNetwork(event: any) {
    this.fetchPolicy = event.target.value;
    this.getData();
  }
  getRequestOptions(event: any) {
    const REQUEST_OPTIONS = event.target.value;
    if (REQUEST_OPTIONS === 'default') {
      this.getData();
    } else {
      this.getDataWithHashing();
    }
  }
  private getDataWithHashing() {
    this.getSub$?.unsubscribe();
    this.eventsQuery = this.apollo.use('newClientName').watchQuery<any>({
      query: GET_EVENTS,
      variables: { filterNeedle: '', skip: this.skip, take: 10 },
      fetchPolicy: this.fetchPolicy,
    });
    this.getSub$ = this.eventsQuery.valueChanges.subscribe((res: any) => {
      if (
        Object.keys(res.data).length === 0 &&
        this.fetchPolicy === 'cache-only'
      ) {
        this.rows = [];
        this.toasterService.warning('There is No Data');
      } else {
        this.rows = res?.data.events.items;
        this.totalCount = res?.data.events.total;
      }
    });
  }
  search() {
    this.eventsQuery.setVariables({
      skip: this.skip,
      filterNeedle: this.filterText,
      take: 10,
    });
  }

  onSelected(value: string, event: any): void {
    this.apollo
      .mutate({
        mutation: EVENT_IMPORTANCE,
        variables: {
          eventId: event.id,
          importanceId: +value,
        },
        optimisticResponse: {
          __typename: 'Mutation',
          addEventImportance: {
            __typename: 'Event',
            body: event.body,
            date: event.date,
            id: event.id,
            importance: value,
          },
        },
        update: (cache, data) => {
          console.log(cache, data);
        },
      })
      .subscribe((res) => {
        console.log(res);
      });
  }

  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0];
  }

  upload(): void {
    if (this.selectedFile) {
      console.log(this.selectedFile);

      this.uploadFile(this.selectedFile).subscribe({
        next: (result) => {
          console.log('File uploaded:', result);
          // Handle success
        },
        error: (error) => {
          console.error('Error uploading file:', error);
          // Handle error
        },
      });
    }
  }

  uploadFile(file: File) {
    return this.apollo.mutate({
      mutation: UPLOAD_FILE,
      context: {
        useMultipart: true,
      },
      variables: { file: file },
    });
  }
}
