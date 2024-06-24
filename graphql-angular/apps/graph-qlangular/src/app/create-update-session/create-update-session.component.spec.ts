import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CreateUpdateSessionComponent } from './create-update-session.component';

describe('CreateUpdateSessionComponent', () => {
  let component: CreateUpdateSessionComponent;
  let fixture: ComponentFixture<CreateUpdateSessionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CreateUpdateSessionComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CreateUpdateSessionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
