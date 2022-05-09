import { TestBed } from '@angular/core/testing';

import { PredioComplementsService } from './predio-complements.service';

describe('PredioComplementsService', () => {
  let service: PredioComplementsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PredioComplementsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
