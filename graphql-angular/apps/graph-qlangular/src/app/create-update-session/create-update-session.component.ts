import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Apollo } from 'apollo-angular';
import { CREATE_SESSION, UPDATE_SESSION } from '../gql/events-mutations';
import { SESSION_BY_ID } from '../gql/events-query';

const transform = (value: number, digits: number = 2): string => {
  let paddedNumber = value.toString();
  while (paddedNumber.length < digits) {
    paddedNumber = '0' + paddedNumber;
  }
  return paddedNumber;
};

@Component({
  selector: 'graphql-angular-create-update-session',
  templateUrl: './create-update-session.component.html',
  styleUrls: ['./create-update-session.component.scss'],
})
export class CreateUpdateSessionComponent implements OnInit {
  public form: FormGroup;
  isUpdateMode = false;
  @Input() eventId: number;
  sessionId: number;
  @Input() isComponent = false;
  @Input() session: any;
  constructor(
    private apollo: Apollo,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    if (this.isComponent) {
      this.initForm();
      this.isUpdateMode = this.session?.id > 0;
      this.sessionId = this.session?.id;
      if (this.session?.id) {
        const startDate = new Date(+this.session.startTime);
        const endDate = new Date(+this.session.endTime);
        // console.log(`${startDate.getMonth()}-${startDate.getDate()}-${startDate.getFullYear()}`);
        this.form.patchValue({
          title: this.session.title,
          sDate: `${startDate.getFullYear()}-${transform(
            startDate.getMonth()
          )}-${transform(startDate.getDate())}T${transform(
            startDate.getHours()
          )}:${transform(startDate.getMinutes())}`,
          eDate: `${endDate.getFullYear()}-${transform(
            endDate.getMonth()
          )}-${transform(endDate.getDate())}T${transform(
            endDate.getHours()
          )}:${transform(endDate.getMinutes())}`,
        });
      }
      return;
    }
  }

  initForm() {
    this.form = this.formBuilder.group({
      title: [],
      sDate: [],
      eDate: [],
    });
  }

  createSession() {
    return this.apollo
      .mutate({
        mutation: CREATE_SESSION,
        variables: {
          eventId: this.eventId,
          title: this.form.controls['title'].value,
          startTime: this.form.controls['sDate'].value,
          endTime: this.form.controls['eDate'].value,
        },
      })
      .subscribe(({ data, errors }) => {
        if (data) {
          this.router.navigate(['/']);
        }
      });
  }

  getSessionById() {
    this.apollo
      .watchQuery({
        query: SESSION_BY_ID,
        variables: {
          id: this.sessionId,
        },
      })
      .valueChanges.subscribe((data: any) => {
        console.log(data);
      });
  }

  updateSession() {
    this.apollo
      .mutate({
        mutation: UPDATE_SESSION,
        variables: {
          id: this.sessionId,
          title: this.form.controls['title'].value,
          startTime: this.form.controls['sDate'].value,
          endTime: this.form.controls['eDate'].value,
        },
      })
      .subscribe(({ data, errors }) => {
        console.log(data);
      });
  }

  onSubmit() {
    if (this.isUpdateMode) {
      this.updateSession();
    } else {
      this.createSession();
    }
  }
}
