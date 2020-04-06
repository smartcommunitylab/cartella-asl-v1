import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AttivitaContainerComponent } from './attivita-container.component';

describe('AttivitaContainerComponent', () => {
  let component: AttivitaContainerComponent;
  let fixture: ComponentFixture<AttivitaContainerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AttivitaContainerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AttivitaContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
