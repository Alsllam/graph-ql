import { Apollo } from 'apollo-angular';
import { Component, OnInit } from '@angular/core';
import { CREATE_Event, UPDATE_Event } from '../gql/events-mutations';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { FEED_SUBSCRIBE } from '../gql/feeds-mutations';
import { EVENT_BY_ID } from '../gql/events-query';

@Component({
  selector: 'graphql-angular-create-update-event',
  templateUrl: './create-update-event.component.html',
  styleUrls: ['./create-update-event.component.scss'],
})
export class CreateUpdateEventComponent implements OnInit {
  form: FormGroup;
  isUpdateMode: boolean;
  eventId: number;

  constructor(
    private apollo: Apollo,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.isUpdateMode = this.route.snapshot.data['mode'] === 'update';
    this.route.paramMap.subscribe((params) => {
      this.eventId = Number(params.get('id'));
      if (this.isUpdateMode) {
        this.getEventById(this.eventId);
      }
    });
    this.initForm();
  }

  initForm() {
    this.form = this.formBuilder.group({
      name: [],
      date: [],
      details: [],
    });
  }

  getEventById(id: number) {
    this.apollo
      .watchQuery<{ feedById: any }>({
        query: EVENT_BY_ID,
        variables: {
          id: id,
        },
        errorPolicy: 'all',
      })
      .valueChanges.subscribe((data: any) => {
        if (data.data) {
          console.log(data);
          const event = data?.data.event;
          this.form.patchValue({
            name: event.body,
            date: event.date,
            details: event.details,
          });
        }
      });
  }

  createEvent() {
    return this.apollo
      .mutate({
        mutation: CREATE_Event,
        variables: {
          name: this.form.controls['name'].value,
          date: this.form.controls['date'].value,
          details: this.form.controls['details'].value,
        },
      })
      .subscribe(({ data, errors }) => {
        console.log(data);
      });
  }

  onSubmit() {
    if (this.isUpdateMode) {
      this.apollo
        .mutate<{ updateFeed: any }>({
          mutation: UPDATE_Event,
          variables: {
            id: this.eventId,
            name: this.form.controls['name'].value,
            date: this.form.controls['date'].value,
            details: this.form.controls['details'].value,
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
      this.createEvent();
      // this.apollo
      //   .subscribe({
      //     query: FEED_SUBSCRIBE,
      //   })
      //   .subscribe((result) => {
      //     if (result) {
      //       console.log('Inserted data:', result.data);
      //     }
      //   });
    }
  }
}
