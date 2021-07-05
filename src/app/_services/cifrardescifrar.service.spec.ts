import { TestBed } from '@angular/core/testing';

import { CifrardescifrarService } from './cifrardescifrar.service';

describe('CifrardescifrarService', () => {
  let service: CifrardescifrarService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CifrardescifrarService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
