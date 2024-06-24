import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Apollo } from 'apollo-angular';
import { CREATE_SESSION } from '../gql/events-mutations';

@Component({
  selector: 'graphql-angular-create-update-session',
  templateUrl: './create-update-session.component.html',
  styleUrls: ['./create-update-session.component.scss'],
})
export class CreateUpdateSessionComponent {
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
    });
    this.initForm();
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
        console.log(data);
      });
  }

  onSubmit() {
    if (this.isUpdateMode) {
      console.log('update');
    } else {
      this.createSession();
    }
  }
}
