import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentUploadModalComponent } from './document-upload-modal.component';

describe('DocumentUploadModalComponent', () => {
  let component: DocumentUploadModalComponent;
  let fixture: ComponentFixture<DocumentUploadModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DocumentUploadModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DocumentUploadModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
