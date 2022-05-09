import { TestBed } from '@angular/core/testing';

import { AdministrarBovedaService } from './administrar-boveda.service';

describe('AdministrarBovedaService', () => {
  let service: AdministrarBovedaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AdministrarBovedaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
