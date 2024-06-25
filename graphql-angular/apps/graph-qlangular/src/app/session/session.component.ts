import { ATTENDEES, SESSION } from './../gql/events-query';
import { Apollo } from 'apollo-angular';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
//import { Attendees } from '../session';
import { ActivatedRoute } from '@angular/router';
import {
  ATTENDEES_SUBSCRIBE,
  REGISTER_ATTENDEE,
  SESSION_SUBSCRIBE,
} from '../gql/events-mutations';

const transform = (value: number, digits: number = 2): string => {
  let paddedNumber = value.toString();
  while (paddedNumber.length < digits) {
    paddedNumber = '0' + paddedNumber;
  }
  return paddedNumber;
};
@Component({
  selector: 'graphql-angular-session',
  templateUrl: './session.component.html',
  styleUrls: ['./session.component.scss'],
})
export class SessionComponent implements OnInit {
  @ViewChild('closebutton') closebutton: any;

  form: FormGroup;
  attendanceForm: FormGroup;
  attendees: any[];
  sessionId: number | string | null;
  attendanceFormValues: { name: ''; email: '' };
  constructor(
    private apollo: Apollo,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.initForm();
    // this.getAttendeeList()
    this.route.paramMap.subscribe((params) => {
      this.sessionId = params.get('id');
      this.getSectionDetails(Number(this.sessionId));
    });
  }

  initForm() {
    this.form = this.formBuilder.group({
      eventBody: [],
      eventDetails: [],
      title: [],
      sDate: [],
      eDate: [],
    });
  }

  initAttendanceForm() {
    this.attendanceForm = this.formBuilder.group({
      name: [],
      email: [],
    });
  }

  getSectionDetails(id: number) {
    return this.apollo
      .watchQuery({
        query: SESSION,
        variables: {
          id: id,
        },
      })
      .valueChanges.subscribe((data: any) => {
        console.log('SESSION', data.data.session);
        const session = data?.data?.session;
        const startDate = new Date(+session.startTime);
        const endDate = new Date(+session.endTime);
        this.attendees = session.attendees;
        this.getAttendeeState();

        this.form.patchValue({
          eventBody: session.event.body,
          eventDetails: session.event.details,
          title: session.title,
          sDate: `${startDate.getFullYear()}-${transform(
            startDate.getMonth()
          )}-${transform(startDate.getDate())}`,
          eDate: `${endDate.getFullYear()}-${transform(
            endDate.getMonth()
          )}-${transform(endDate.getDate())}`,
        });
        this.getEventState(session.event?.id);
      });
  }

  onRegisterAtt(name: string, email: string) {
    return this.apollo
      .mutate({
        mutation: REGISTER_ATTENDEE,
        variables: {
          sessionId: this.sessionId,
          name: name,
          email: email,
        },
      })
      .subscribe((data) => {
        console.log('REGISTER_ATTENDEE', data);
      });
  }

  getEventState(id: string) {
    return this.apollo
      .subscribe({
        query: SESSION_SUBSCRIBE,
        variables: {
          eventId: id,
        },
      })
      .subscribe((data: any) => {
        console.log(data);
        this.form.patchValue({
          eventBody: data?.data.eventUpdated.body,
          eventDetails: data?.data.eventUpdated.details,
        });
      });
  }

  getAttendeeState() {
    return this.apollo
      .subscribe({
        query: ATTENDEES_SUBSCRIBE,
        variables: {
          sessionId: this.sessionId,
        },
      })
      .subscribe((data: any) => {
        const newAttendee = data.data.attendeeRegistered;
        this.attendees = [...this.attendees, newAttendee];
        console.log(newAttendee);
      });
  }

  onSubmit() {
    if (this.attendanceForm.value) {
      const nameFieldValue = this.attendanceForm.controls['name'].value;
      const emailFieldValue = this.attendanceForm.controls['email'].value;
      this.closebutton.nativeElement.click();
      this.onRegisterAtt(nameFieldValue, emailFieldValue);

    }
  }
}
