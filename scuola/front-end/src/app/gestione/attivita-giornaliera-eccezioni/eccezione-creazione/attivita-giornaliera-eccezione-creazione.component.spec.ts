import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AttivitaGiornalieraEccezioneCreazioneComponent } from './attivita-giornaliera-eccezione-creazione.component';

describe('AttivitaGiornalieraEccezioneCreazioneComponent', () => {
  let component: AttivitaGiornalieraEccezioneCreazioneComponent;
  let fixture: ComponentFixture<AttivitaGiornalieraEccezioneCreazioneComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AttivitaGiornalieraEccezioneCreazioneComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AttivitaGiornalieraEccezioneCreazioneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
