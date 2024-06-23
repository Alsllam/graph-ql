import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CreateUpdateFeedComponent } from './create-update-feed.component';

describe('CreateUpdateFeedComponent', () => {
  let component: CreateUpdateFeedComponent;
  let fixture: ComponentFixture<CreateUpdateFeedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CreateUpdateFeedComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CreateUpdateFeedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
