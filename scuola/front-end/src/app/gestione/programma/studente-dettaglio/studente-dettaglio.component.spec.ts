import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StudenteDettaglioComponent } from './studente-dettaglio.component';

describe('ProgrammaDettaglioComponent', () => {
  let component: StudenteDettaglioComponent;
  let fixture: ComponentFixture<StudenteDettaglioComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StudenteDettaglioComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StudenteDettaglioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
