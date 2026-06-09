import { TestBed } from '@angular/core/testing';

import { IUserServices } from './iuser.services';

describe('IUserServices', () => {
  let service: IUserServices;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(IUserServices);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
