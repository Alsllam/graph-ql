import { Apollo } from 'apollo-angular';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Feeds } from '../feeds';
import { CREATE_Feed, UPDATE_Feed } from '../gql/feeds-mutations';
import { FEED_ById } from '../gql/feeds-query';

@Component({
  selector: 'graphql-angular-create-update-feed',
  templateUrl: './create-update-feed.component.html',
  styleUrls: ['./create-update-feed.component.scss'],
})
export class CreateUpdateFeedComponent implements OnInit {
  isUpdateMode: boolean;
  isViewMode: boolean;
  isSubmitMode: boolean;
  errorMessage: string;
  feedComments: any = [];
  feedId: number;
  form: FormGroup;
  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private apollo: Apollo
  ) {}

  ngOnInit(): void {
    this.isSubmitMode = this.route.snapshot.data['mode'] === 'submit';
    this.isUpdateMode = this.route.snapshot.data['mode'] === 'update';
    this.isViewMode = this.route.snapshot.data['mode'] === 'view';
    this.route.paramMap.subscribe((params) => {
      this.feedId = Number(params.get('id'));
      if (this.isViewMode || this.isUpdateMode) {
        this.getFeedById(this.feedId);
      }
    });

    this.initForm();
  }

  initForm() {
    this.form = this.formBuilder.group({
      url: [],
      description: [],
    });
  }

  getFeedById(id: number) {
    this.apollo
      .watchQuery<{ feedById: Feeds }>({
        query: FEED_ById,
        variables: {
          id: id,
        },
        errorPolicy: 'all',
      })
      .valueChanges.subscribe((data: any) => {
        if (data.data) {
          const feed = data?.data.feedById;
          this.feedComments = data?.data.feedById.comments;
          this.form.patchValue({
            url: feed.url,
            description: feed.description,
          });
          if (this.isViewMode) {
            this.form.disable();
          }
        } else {
          console.log(data);

          this.errorMessage =
            data?.errors[0].extensions?.originalError?.message;
        }
      });
  }

  onSubmit() {
    if (this.isUpdateMode && this.feedId) {
      this.apollo
        .mutate<{ updateFeed: Feeds }>({
          mutation: UPDATE_Feed,
          variables: {
            id: this.feedId,
            description: this.form.controls['description'].value,
            url: this.form.controls['url'].value,
          },
          errorPolicy: 'all',
        })
        .subscribe(({ data, errors }) => {
          this.router.navigate(['/']);
          if (errors) {
            console.log(errors[0].originalError?.message);
          }
        });
    } else {
      this.apollo
        .mutate<{ postLink: Feeds }>({
          mutation: CREATE_Feed,
          variables: {
            url: this.form.controls['url'].value,
            description: this.form.controls['description'].value,
          },
        })
        .subscribe({
          next: ({ data }) => this.router.navigate(['/']),
          error: (err) => console.error('Observable emitted an error: ' + err),
        });
    }
  }
}
