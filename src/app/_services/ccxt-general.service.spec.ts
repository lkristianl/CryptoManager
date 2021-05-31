import { TestBed } from '@angular/core/testing';

import { CcxtGeneralService } from './ccxt-general.service';

describe('CcxtGeneralService', () => {
  let service: CcxtGeneralService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CcxtGeneralService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
