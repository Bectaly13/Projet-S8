import { TestBed } from '@angular/core/testing';

import { UpdateQuestionsDataService } from './update-questions-data.service';

describe('UpdateQuestionsDataService', () => {
  let service: UpdateQuestionsDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UpdateQuestionsDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
