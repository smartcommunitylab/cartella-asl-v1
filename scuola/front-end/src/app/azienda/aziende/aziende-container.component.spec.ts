import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CompetenzeContainerComponent } from './aziende-container.component';

describe('CompetenzeContainerComponent', () => {
  let component: CompetenzeContainerComponent;
  let fixture: ComponentFixture<CompetenzeContainerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CompetenzeContainerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompetenzeContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
