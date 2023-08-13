/*
Authors : Anupam Mallick
Website : 
App Name : Agro Web App
Created : 20-Nov-2021
*/
import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { CartService } from '../services/cart.service';


@Injectable({
  providedIn: 'root'
})
export class cartGuard implements CanActivate {
  constructor(
    private navCtrl: Router,
    private cart: CartService
  ) { }
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {

    if (this.cart.cart && this.cart.cart.length) {
      return true;
    }
    this.navCtrl.navigate(['/home']);
    return false;
  }
}
