import { Feeds } from '../feeds';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Apollo, QueryRef, gql } from "apollo-angular";
import { Observable, Subscription, map} from "rxjs";
import { FEED_DETAILS} from './fragmant';

interface FeedDto {
  id: string;
  url: string;
  description: string;
}
@Component({
  selector: 'graphql-angular-queries',
  templateUrl: './queries.component.html',
  styleUrls: ['./queries.component.scss'],
})
export class QueriesComponent implements OnInit,OnDestroy  {
  sub$:Subscription;
  feeds:Observable<FeedDto[]>;
  page:any;
  pageNumber= 0;
  feedQuery: QueryRef<{feedPaging: FeedDto[]}>;
  filterText:string;
  value:string;
  limit=5
  constructor(private readonly apollo: Apollo , private router:Router) { }
  ngOnInit(): void {
    // this.simpleQuery();
    this.getData();
  }
  simpleQuery(){
    const GET_DATA = gql`
    query GetFeeds{
      feed{
        id,
        description,
      }
    }
  `
  ;
  this.apollo.watchQuery<any>({ 
    query: GET_DATA,
    }).valueChanges.subscribe(({data})=>console.log('data',data.feed));
  }
  private getData() {
    // ${FEED_DETAILS}
    const GET_DATA = gql`
      query GetFeeds($filterNeedle: String, $skip: Int, $take: Int) {
        feedPaging(filterNeedle:$filterNeedle , skip:$skip , take:$take){
          id,
          description,
          url,
        }
      }
    `
    ;
    this.feedQuery = this.apollo.watchQuery<{feedPaging: FeedDto[]}>({ 
      query: GET_DATA,
      variables:{filterNeedle:this.value ,skip:this.pageNumber , take:this.limit},
      // pollInterval:500
      });
    this.feeds=this.feedQuery.valueChanges.pipe(map(res=>{
      return res?.data.feedPaging
    })) ;
  }
 public next(){
    this.pageNumber = this.pageNumber+5;
    this.feedQuery.fetchMore({
      variables: {
        skip: this.pageNumber,
      },
    })
  }
  public refetch(){
    this.feedQuery.refetch();
  //  this.feedQuery.refetch({take:10});
  }
  public stopPolling(){
    this.feedQuery.stopPolling();
  }
 public previous(){
    this.pageNumber = this.pageNumber-5;
    this.feedQuery.fetchMore({
      variables: {
        skip: this.pageNumber,
      },
    })
  }
 public loadMore(){
    this.feedQuery.fetchMore({
      variables: {
        take: this.limit+5,
      },
    })
  }
 public search(){
    this.feedQuery.setVariables({filterNeedle:this.value}).then();  
  }
  update(id: number) {
    this.router.navigate([`feed/update/${id}`]);
  }
 public viewDetails(id:number){
    this.router.navigate([`feed-details/${id}`]);
  }
  ngOnDestroy(): void {
    this.sub$?.unsubscribe();
  }
}
