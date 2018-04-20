import { TestBed, inject } from '@angular/core/testing';

import { SearchandfilterService } from './searchandfilter.service';

describe('SearchandfilterService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SearchandfilterService]
    });
  });

  it('should be created', inject([SearchandfilterService], (service: SearchandfilterService) => {
    expect(service).toBeTruthy();
  }));
});
