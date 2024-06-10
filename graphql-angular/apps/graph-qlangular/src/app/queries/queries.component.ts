import { Component, OnDestroy } from '@angular/core';
import { Apollo, gql } from "apollo-angular";
import { Subscription } from "rxjs";

@Component({
  selector: 'graphql-angular-queries',
  templateUrl: './queries.component.html',
  styleUrls: ['./queries.component.scss'],
})
export class QueriesComponent implements OnDestroy {
  sub$:Subscription;
  rows:any;
  ColumnMode:any;
  page:any;
  constructor(private readonly apollo: Apollo) { }
  public getData() {
    const GET_DATA = gql`
      query GetPosts {
        feed {
          id,
          url,
          description,

        }
      }
    `;
     this.sub$ = this.apollo.watchQuery({ query: GET_DATA }).valueChanges.subscribe(res => {
      console.log('res', res);

    })
  }
  setPage(pageNumber:any){
    console.log('page Number' , pageNumber);
    
  }
  ngOnDestroy(): void {
    this.sub$?.unsubscribe();
  }
}
