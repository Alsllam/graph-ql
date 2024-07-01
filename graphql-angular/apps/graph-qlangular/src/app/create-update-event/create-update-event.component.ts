import { Apollo } from 'apollo-angular';
import { Component, OnInit, ViewChildren } from '@angular/core';
import {
  CREATE_Event,
  CREATE_SESSION,
  DELETE_SESSION,
  UPDATE_Event,
} from '../gql/events-mutations';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { EVENT_BY_ID } from '../gql/events-query';
import { CreateUpdateSessionComponent } from '../create-update-session/create-update-session.component';
import { NgxSpinnerService } from 'ngx-spinner';

const transform = (value: number, digits: number = 2): string => {
  let paddedNumber = value.toString();
  while (paddedNumber.length < digits) {
    paddedNumber = '0' + paddedNumber;
  }
  return paddedNumber;
};
@Component({
  selector: 'graphql-angular-create-update-event',
  templateUrl: './create-update-event.component.html',
  styleUrls: ['./create-update-event.component.scss'],
})
export class CreateUpdateEventComponent implements OnInit {
  @ViewChildren('session') sessionForms: CreateUpdateSessionComponent[];
  form: FormGroup;
  isUpdateMode: boolean;
  eventId: number;
  sessions: any[] = [];
  deletedItems: any[] = [];

  constructor(
    private apollo: Apollo,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private spinner: NgxSpinnerService
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
          this.sessions = [...data.data?.event?.sessions];
          const event = data?.data.event;
          const date = new Date(+event.date);
          this.form.patchValue({
            name: event.body,
            date: `${date.getFullYear()}-${transform(date.getMonth())}-${transform(date.getDate())}T${transform(date.getHours())}:${transform(date.getMinutes())}`,
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
        this.eventId = (data as any).createEvent.id;
        this.sessions.forEach(item => item.eventId =  this.eventId);
        setTimeout(() => {
          this.submitSessionForms();
        }, 100);
      });
  }

  onSubmit() {
    this.spinner.show();
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
        .subscribe((data) => {
          if (!data.loading) {
            setTimeout(() => {
              this.spinner.hide();
              this.router.navigate(['/']);
            }, 1000);
          }
          console.log({
            loading: data.loading,
            data: data.data,
          });
        });
      this.submitSessionForms();
    } else {
      this.createEvent();
    }
  }

  submitSessionForms() {
    this.sessionForms.forEach((item) => item.onSubmit());
    //OnSubmit Array Delete Session BY ID
    this.deletedItems.forEach((sessionId) =>
      this._deleteSessionById(sessionId)
    );
  }
  addSession() {
    this.sessions.push({});
  }
  deleteSession(sessionIndex: number, sessionId: number) {
    //array Deleted Session IDs - push   [10, 49]
    if(sessionId){
      this.deletedItems.push(sessionId);
    }
    this.sessions.splice(sessionIndex, 1);
  }
  private _deleteSessionById(sessionId: number) {
    this.apollo
      .mutate({
        mutation: DELETE_SESSION,
        variables: {
          id: sessionId,
        },
      })
      .subscribe((data) => console.log(data));
  }

  startSession(id: number){
    this.router.navigate(['session', id]);
  }
}
