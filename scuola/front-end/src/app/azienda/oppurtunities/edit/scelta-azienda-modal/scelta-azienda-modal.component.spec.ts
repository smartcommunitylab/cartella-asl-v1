import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SceltaAziendaModalComponent } from './scelta-azienda-modal.component';

describe('SceltaAziendaModalComponent', () => {
  let component: SceltaAziendaModalComponent;
  let fixture: ComponentFixture<SceltaAziendaModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SceltaAziendaModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SceltaAziendaModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
