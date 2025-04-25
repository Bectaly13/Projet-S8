import { TestBed } from '@angular/core/testing';

import { SharedVariablesService } from './shared-variables.service';

describe('SharedVariablesService', () => {
  let service: SharedVariablesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SharedVariablesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
