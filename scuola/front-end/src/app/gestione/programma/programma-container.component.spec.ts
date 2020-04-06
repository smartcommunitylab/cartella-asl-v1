import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProgrammaContainerComponent } from './programma-container.component';

describe('ProgrammaContainerComponent', () => {
  let component: ProgrammaContainerComponent;
  let fixture: ComponentFixture<ProgrammaContainerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ProgrammaContainerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProgrammaContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
