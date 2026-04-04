import { TestBed } from '@angular/core/testing';

import { Express } from './express';

describe('Express', () => {
  let service: Express;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Express);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
