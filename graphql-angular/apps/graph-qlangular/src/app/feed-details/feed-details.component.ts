import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Apollo, QueryRef, gql } from 'apollo-angular';
interface Comment{
  body:string,
  linkId:string
}
@Component({
  selector: 'graphql-angular-feed-details',
  templateUrl: './feed-details.component.html',
  styleUrls: ['./feed-details.component.scss'],
})
export class FeedDetailsComponent implements OnInit {
  feedQuery:QueryRef<{comment: Comment}>;
  details:Comment;
  constructor(private activatedRoute:ActivatedRoute , private apollo:Apollo){}
  ngOnInit(): void {
      this.activatedRoute.params.subscribe(res=>{
        this.getData(res['id']);
      })
  }
  private getData(id:number) {
    const GET_DATA = gql`
      query GetComment($id: ID!) {
        comment(id:$id){
            body,
        }
      }
    `
    ;
    this.feedQuery = this.apollo.watchQuery<{comment: Comment}>({ 
      query: GET_DATA,
      variables:{id:id},
    });
    this.feedQuery.valueChanges.subscribe(({data})=>{
      this.details = data?.comment;
    })
    
  }
}
