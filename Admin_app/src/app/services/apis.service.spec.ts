/*
  Authors : Anupam Mallick
  Website : 
  App Name : Agro App
  Created : 10-Sep-2021
  
*/
import { TestBed } from '@angular/core/testing';

import { ApisService } from './apis.service';

describe('ApisService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ApisService = TestBed.get(ApisService);
    expect(service).toBeTruthy();
  });
});
