import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RichiestaDetailsComponent } from './richiesta-details.component';

describe('RichiestaDetailsModalComponent', () => {
  let component: RichiestaDetailsComponent;
  let fixture: ComponentFixture<RichiestaDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RichiestaDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RichiestaDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
