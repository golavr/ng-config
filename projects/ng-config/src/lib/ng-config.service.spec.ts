import { TestBed } from '@angular/core/testing';

import { NgConfigService } from './ng-config.service';

describe('NgConfigService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: NgConfigService = TestBed.get(NgConfigService);
    expect(service).toBeTruthy();
  });
});
