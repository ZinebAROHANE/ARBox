import { TestBed } from '@angular/core/testing';

import { DispoService } from './dispo.service';

describe('DispoService', () => {
  let service: DispoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DispoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
