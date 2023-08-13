/*
Authors : Anupam Mallick
Website : 
App Name : Agro Web App
Created : 20-Nov-2021
*/
import { TestBed, async, inject } from '@angular/core/testing';

import { cartGuard } from './auth.guard';

describe('AuthGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [cartGuard]
    });
  });

  it('should ...', inject([cartGuard], (guard: cartGuard) => {
    expect(guard).toBeTruthy();
  }));
});
