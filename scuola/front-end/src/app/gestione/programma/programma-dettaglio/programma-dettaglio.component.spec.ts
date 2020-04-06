import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProgrammaDettaglioComponent } from './programma-dettaglio.component';

describe('ProgrammaDettaglioComponent', () => {
  let component: ProgrammaDettaglioComponent;
  let fixture: ComponentFixture<ProgrammaDettaglioComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProgrammaDettaglioComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProgrammaDettaglioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
