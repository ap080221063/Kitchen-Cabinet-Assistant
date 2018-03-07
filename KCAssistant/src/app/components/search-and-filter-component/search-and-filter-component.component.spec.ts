import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchAndFilterComponentComponent } from './search-and-filter-component.component';

describe('SearchAndFilterComponentComponent', () => {
  let component: SearchAndFilterComponentComponent;
  let fixture: ComponentFixture<SearchAndFilterComponentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SearchAndFilterComponentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchAndFilterComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
