import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RefuseRequestConfirmModalComponent } from './refuse-request-confirm-modal.component';

describe('RefuseRequestConfirmModalComponent', () => {
  let component: RefuseRequestConfirmModalComponent;
  let fixture: ComponentFixture<RefuseRequestConfirmModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RefuseRequestConfirmModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RefuseRequestConfirmModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
