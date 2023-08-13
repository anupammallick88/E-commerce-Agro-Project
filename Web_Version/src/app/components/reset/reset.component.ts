/*
Authors : Anupam Mallick
Website : 
App Name : Agro Web App
Created : 20-Nov-2021
*/
import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { ApiService } from 'src/app/services/api.service';
import { UtilService } from 'src/app/services/util.service';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-reset',
  templateUrl: './reset.component.html',
  styleUrls: ['./reset.component.scss']
})
export class ResetComponent implements OnInit {
  currentDiv;
  sent: boolean;
  email: any;
  otp: any;
  myOPT: any;
  verified: any;
  userid: any;
  password: any;
  repass: any;
  id: any;
  constructor(
    private navCtrl: Location,
    public api: ApiService,
    public util: UtilService
  ) {
    this.currentDiv = 1;
    this.sent = false;
    this.email = '';
    this.otp = '';
    this.password = '';
    this.repass = '';
    this.verified = false;
  }

  ngOnInit(): void {
  }

  login() {
    this.back();
  }

  sendOTP() {
    console.log(this.email, ';sendOTPDriver');
    if (!this.email) {
      this.util.toast('error', this.util.getString('Error'), this.util.getString('email is required'));
      return false;
    }
    const emailfilter = /^[\w._-]+[+]?[\w._-]+@[\w.-]+\.[a-zA-Z]{2,6}$/;
    if (!emailfilter.test(this.email)) {
      this.util.toast('error', this.util.getString('Error'), this.util.getString('Please enter valid email'));
      return false;
    }
    // this.util.start();
    this.util.start();
    const param = {
      email: this.email
    };
    this.api.post('users/sendOTP', param).subscribe((data: any) => {
      console.log(data);
      this.util.stop();
      if (data && data.status === 200) {
        this.id = data.data.id;
        this.util.stop();
        this.currentDiv = 2;
      } else {
        if (data && data.status === 500 && data.data && data.data.message) {
          // this.util.errorToast(data.data.message);
          this.util.toast('error', this.util.getString('Error'), data.data.message);
          return false;
        }
        // this.util.errorToast('Something went wrong');
        this.util.toast('error', this.util.getString('Error'), this.util.getString('Something went wrong'));
        return false;
      }
    }, error => {
      console.log(error);
      this.util.stop();
      this.util.toast('error', this.util.getString('Error'), this.util.getString('Something went wrong'));
    });
  }

  verifyOTP() {
    // this.currentDiv = 3;
    if (!this.otp || this.otp === '') {
      // this.util.showToast('otp is required', 'dark', 'bottom');
      this.util.toast('error', this.util.getString('Error'), this.util.getString('otp is required'));
      return false;
    }
    this.util.start();
    const param = {
      id: this.id,
      otp: this.otp
    };
    this.api.post('users/verifyOTP', param).subscribe((data: any) => {
      console.log(data);
      this.util.stop();
      if (data && data.status === 200) {
        this.util.stop();
        this.currentDiv = 3;
      } else {
        if (data && data.status === 500 && data.data && data.data.message) {
          this.util.toast('error', this.util.getString('Error'), data.data.message);
          return false;
        }
        this.util.toast('error', this.util.getString('Error'), this.util.getString('Something went wrong'));
        return false;
      }
    }, error => {
      console.log(error);
      this.util.stop();
      this.util.toast('error', this.util.getString('Error'), this.util.getString('Something went wrong'));
    });
  }

  sendEmail() {
    console.log('pwddd0<<<<<<', this.password);
    if (!this.password || !this.repass || this.password === '' || this.repass === '') {
      this.util.toast('error', this.util.getString('Error'), this.util.getString('All Field are required'));
      return false;
    }
    const param = {
      email: this.email,
      pwd: this.password
    };
    this.util.start();
    this.api.post('users/update_password', param).subscribe((data: any) => {
      console.log(data);
      this.util.stop();
      if (data && data.status === 200) {
        this.util.stop();
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
          title: this.util.getString('Password Updated')
        });
        this.back();
      } else {
        if (data && data.status === 500 && data.data && data.data.message) {
          this.util.toast('error', this.util.getString('Error'), data.data.message);
          return false;
        }
        this.util.toast('error', this.util.getString('Error'), this.util.getString('Something went wrong'));
        return false;
      }
    }, error => {
      console.log(error);
      this.util.stop();
      this.util.toast('error', this.util.getString('Error'), this.util.getString('Something went wrong'));
    });
  }

  back() {
    this.navCtrl.back();
  }

}
