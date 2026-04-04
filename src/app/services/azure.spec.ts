import { TestBed } from '@angular/core/testing';

import { Azure } from './azure';

describe('Azure', () => {
  let service: Azure;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Azure);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
