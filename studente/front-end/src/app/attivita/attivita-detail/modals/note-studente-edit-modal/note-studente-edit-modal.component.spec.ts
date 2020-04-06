import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NoteStudenteEditModalComponent } from './note-studente-edit-modal.component';

describe('NoteStudenteEditModalComponent', () => {
  let component: NoteStudenteEditModalComponent;
  let fixture: ComponentFixture<NoteStudenteEditModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NoteStudenteEditModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NoteStudenteEditModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
