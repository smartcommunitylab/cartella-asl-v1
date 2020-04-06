import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClasseDettaglioComponent } from './classe-dettaglio.component';

describe('ProgrammaDettaglioComponent', () => {
  let component: ClasseDettaglioComponent;
  let fixture: ComponentFixture<ClasseDettaglioComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClasseDettaglioComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClasseDettaglioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
