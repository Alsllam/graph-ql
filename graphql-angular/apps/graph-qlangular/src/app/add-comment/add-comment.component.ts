import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Apollo } from 'apollo-angular';
import { Feeds } from '../feeds';
import { GET_Feeds_Lookups } from '../gql/feeds-query';
import { CREATE_Comment } from '../gql/feeds-mutations';

@Component({
  selector: 'graphql-angular-add-comment',
  templateUrl: './add-comment.component.html',
  styleUrls: ['./add-comment.component.scss'],
})
export class AddCommentComponent implements OnInit {
  feeds: Feeds[] = [];
  form: FormGroup;
  constructor(
    private route: ActivatedRoute,
    private apollo: Apollo,
    private fb: FormBuilder
  ) {}
  ngOnInit(): void {
    this.apollo
      .watchQuery<{ feed: Feeds[] }>({
        query: GET_Feeds_Lookups,
      })
      .valueChanges.subscribe(({ data }) => (this.feeds = data?.feed));
    this.initForm();
  }

  initForm() {
    this.form = this.fb.group({
      feed: [],
      description: [],
    });
  }

  submit() {
    this.apollo
      .mutate<{ postCommentOnLink: [] }>({
        mutation: CREATE_Comment,
        variables: {
          linkId: this.form.controls['feed'].value,
          body: this.form.controls['description'].value,
        },
      })
      .subscribe(({ data }) => console.log(data));
  }
}
