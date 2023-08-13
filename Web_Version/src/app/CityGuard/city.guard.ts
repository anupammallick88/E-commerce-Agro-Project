/*
Authors : Anupam Mallick
Website : 
App Name : Agro Web App
Created : 20-Nov-2021
*/
import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class CityGuard implements CanActivate {
  constructor(
    private router: Router,
  ) { }
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    const city = localStorage.getItem('city');
    console.log('city', localStorage.getItem('city'));
    if (city && city != null && city !== 'null') {
      return true;
    }
    // this.router.navigate(['/cities']);
    console.log('no city found.......');
    return false;
  }
}
