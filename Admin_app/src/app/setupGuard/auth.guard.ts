import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { ApisService } from '../services/apis.service';

@Injectable({
  providedIn: 'root'
})
export class SetupAuthGuard implements CanActivate {

  constructor(
    private api: ApisService,
    private router: Router) { }

  canActivate(route: ActivatedRouteSnapshot): any {
    return this.api.get('users/get_admin').then((user: any) => {
      console.log('user', user);
      if (user && user.status === 200 && user.data.id) {
        return true;
      } else {
        this.router.navigate(['/setup']);
      }
    }).catch(error => {
      console.log(error);
      this.router.navigate(['/setup']);
    });
  }
}
