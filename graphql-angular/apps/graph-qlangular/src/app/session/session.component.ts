import { ATTENDEES, SESSION } from './../gql/events-query';
import { Apollo } from 'apollo-angular';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
//import { Attendees } from '../session';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'graphql-angular-session',
  templateUrl: './session.component.html',
  styleUrls: ['./session.component.scss'],
})
export class SessionComponent implements OnInit {
  form: FormGroup;
  attendees: any[];
  sessionId: number;

  constructor(
    private apollo: Apollo,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.initForm();
    // this.getAttendeeList()
    this.route.paramMap.subscribe((params) => {
      this.sessionId = Number(params.get('id'));
      this.getSectionDetails(this.sessionId);
    });
  }

  initForm() {
    this.form = this.formBuilder.group({
      title: [],
      sDate: [],
      eDate: [],
    });
  }

  // getAttendeeList() {
  //   return this.apollo
  //     .watchQuery<{ Attendees: Attendees[] }>({
  //       query: ATTENDEES,
  //     })
  //     .valueChanges.subscribe((data) => console.log(data.data.attendees));
  // }
  getSectionDetails(id: number) {
    return this.apollo
      .watchQuery({
        query: SESSION,
        variables: {
          id: id,
        },
      })
      .valueChanges.subscribe((data: any) => {
        console.log(data);
      });
  }
  onSubmit() {
    return;
  }
}
