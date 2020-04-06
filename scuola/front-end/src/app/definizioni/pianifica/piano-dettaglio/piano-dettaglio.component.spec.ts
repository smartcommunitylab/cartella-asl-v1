import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PianoDettaglioComponent } from './piano-dettaglio.component';

describe('PianoDettaglioComponent', () => {
  let component: PianoDettaglioComponent;
  let fixture: ComponentFixture<PianoDettaglioComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PianoDettaglioComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PianoDettaglioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
