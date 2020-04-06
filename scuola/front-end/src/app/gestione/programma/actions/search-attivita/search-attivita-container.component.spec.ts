import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchAttivitaContainer } from './search-attivita-container.component';

describe('SearchAttivitaComponent', () => {
  let component: SearchAttivitaContainer;
  let fixture: ComponentFixture<SearchAttivitaContainer>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SearchAttivitaContainer ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchAttivitaContainer);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
