/*
Authors : Anupam Mallick
Website : 
App Name : Agro Web App
Created : 20-Nov-2021
*/
import { TestBed, async, inject } from '@angular/core/testing';
import { CityGuard } from './city.guard';

describe('AuthGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CityGuard]
    });
  });

  it('should ...', inject([CityGuard], (guard: CityGuard) => {
    expect(guard).toBeTruthy();
  }));
});
