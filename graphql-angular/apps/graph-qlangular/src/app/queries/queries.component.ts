import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ColumnMode } from '@swimlane/ngx-datatable/public-api';
import { Apollo, gql } from "apollo-angular";
import { Subscription } from "rxjs";
@Component({
  selector: 'graphql-angular-queries',
  templateUrl: './queries.component.html',
  styleUrls: ['./queries.component.scss'],
})
export class QueriesComponent implements OnInit,OnDestroy  {
  sub$:Subscription;
  rows:any;
  // ColumnMode = ColumnMode;
  page:any;
  constructor(private readonly apollo: Apollo , private router:Router) { }
  ngOnInit(): void {
    this.getData();
  }
  public getData() {
    const GET_DATA = gql`
      query GetPosts {
        feed {
          id,
          description,
          url,
        }
      }
    `
    ;
     this.sub$ = this.apollo.watchQuery({ query: GET_DATA}).valueChanges.subscribe((res:any) => {
      this.rows = res?.data.feed
      console.log('res', res);

    })
  }
  setPage(pageNumber:any){
    console.log('page Number' , pageNumber);
    
  }
  viewDetails(id:number){
    this.router.navigate([`feed/${id}`]);
  }
  ngOnDestroy(): void {
    this.sub$?.unsubscribe();
  }
}
