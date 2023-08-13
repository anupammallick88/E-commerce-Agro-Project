/*
Authors : Anupam Mallick
Website : 
App Name : Agro Web App
Created : 20-Nov-2021
*/
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UtilService } from 'src/app/services/util.service';
import { ApiService } from 'src/app/services/api.service';
import Swal from 'sweetalert2';
import { Location } from '@angular/common';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  email: any = '';
  password: any = '';

  constructor(
    private router: Router,
    public util: UtilService,
    private api: ApiService,
    private navCtrl: Location
  ) { }

  ngOnInit(): void {
  }

  goToRegister() {
    this.router.navigate(['/register']);
  }

  goToHome() {

    if (!this.email || !this.password) {
      this.util.toast('error', this.util.getString('Error'), this.util.getString('All Fields are required'));
      return false;
    }
    const emailfilter = /^[\w._-]+[+]?[\w._-]+@[\w.-]+\.[a-zA-Z]{2,6}$/;
    if (!emailfilter.test(this.email)) {
      this.util.toast('error', this.util.getString('Error'), this.util.getString('Please enter valid email'));
      return false;
    }

    const param = {
      email: this.email,
      password: this.password
    };
    this.util.start();
    this.api.post('users/login', param).subscribe((data: any) => {
      this.util.stop();
      console.log(data);
      if (data && data.status === 200) {
        if (data && data.data && data.data.type === 'user') {
          if (data.data.status === '1') {
            localStorage.setItem('uid', data.data.id);
            this.util.userInfo = data.data;
            const Toast = Swal.mixin({
              toast: true,
              position: 'bottom-end',
              showConfirmButton: false,
              timer: 3000,
              timerProgressBar: true,
              onOpen: (toast) => {
                toast.addEventListener('mouseenter', Swal.stopTimer);
                toast.addEventListener('mouseleave', Swal.resumeTimer);
              }
            });

            Toast.fire({
              icon: 'success',
              title: this.util.getString('Signed in successfully')
            });
            // this.router.navigate(['/home']);
            this.navCtrl.back();
          } else {
            console.log('not valid');
            Swal.fire({
              title: this.util.getString('Error'),
              text: this.util.getString('Your are blocked please contact administrator'),
              icon: 'error',
              showConfirmButton: true,
              showCancelButton: true,
              confirmButtonText: this.util.getString('Need Help?'),
              backdrop: false,
              background: 'white'
            }).then(status => {
              if (status && status.value) {
                localStorage.setItem('helpId', data.data.id);
                this.router.navigate(['inbox']);
              }
            });
          }
        } else {

          this.util.toast('error', this.util.getString('Error'), this.util.getString('Not valid user'));
          this.email = '';
          this.password = '';
        }
      } else if (data && data.status === 500) {
        this.util.toast('error', this.util.getString('Error'), data.data.message);

      } else {
        this.util.toast('error', this.util.getString('Error'), this.util.getString('Something went wrong'));

      }
    }, error => {
      console.log(error);
      this.util.stop();
      this.util.toast('error', this.util.getString('Error'), this.util.getString('Something went wrong'));
    });
  }

  reset() {
    console.log('reset password');
    this.router.navigate(['reset']);
  }
}
