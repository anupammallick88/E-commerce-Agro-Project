import { Component, OnInit } from '@angular/core';
import { ApisService } from 'src/app/services/apis.service';
import { ToastData, ToastOptions, ToastyService } from 'ng2-toasty';
import { NgxSpinnerService } from 'ngx-spinner';
import { Location } from '@angular/common';
import Swal from 'sweetalert2';
import { UtilService } from 'src/app/services/util.service';
@Component({
  selector: 'app-reset',
  templateUrl: './reset.component.html',
  styleUrls: ['./reset.component.css']
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
    public api: ApisService,
    private toastyService: ToastyService,
    private spinner: NgxSpinnerService,
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


  error(message) {
    const toastOptions: ToastOptions = {
      title: this.util.getString('Error'),
      msg: message,
      showClose: true,
      timeout: 2000,
      theme: 'default',
      onAdd: (toast: ToastData) => {
        console.log('Toast ' + toast.id + ' has been added!');
      },
      onRemove: () => {
        console.log('Toast  has been removed!');
      }
    };
    // Add see all possible types in one shot
    this.toastyService.error(toastOptions);
  }
  success(message) {
    const toastOptions: ToastOptions = {
      title: this.util.getString('Success'),
      msg: message,
      showClose: true,
      timeout: 2000,
      theme: 'default',
      onAdd: (toast: ToastData) => {
        console.log('Toast ' + toast.id + ' has been added!');
      },
      onRemove: () => {
        console.log('Toast  has been removed!');
      }
    };
    // Add see all possible types in one shot
    this.toastyService.success(toastOptions);
  }

  sendOTP() {
    console.log(this.email, ';sendOTPDriver');
    if (!this.email) {
      this.error(this.util.getString('Email is required'));
      return false;
    }
    const emailfilter = /^[\w._-]+[+]?[\w._-]+@[\w.-]+\.[a-zA-Z]{2,6}$/;
    if (!emailfilter.test(this.email)) {
      this.error(this.util.getString('Please enter valid email'));
      return false;
    }
    // this.util.start();
    this.spinner.show();
    const param = {
      email: this.email
    };
    this.api.post('users/sendOTP', param).then((data: any) => {
      console.log(data);
      this.spinner.hide();
      if (data && data.status === 200) {
        this.id = data.data.id;
        this.spinner.hide();
        this.currentDiv = 2;
      } else {
        if (data && data.status === 500 && data.data && data.data.message) {
          // this.util.errorToast(data.data.message);
          this.error(data.data.message);
          return false;
        }
        // this.util.errorToast('Something went wrong');
        this.error(this.util.getString('Something went wrong'));
        return false;
      }
    }, error => {
      console.log(error);
      this.spinner.hide();
      this.error(this.util.getString('Something went wrong'));
    });
  }

  verifyOTP() {
    // this.currentDiv = 3;
    if (!this.otp || this.otp === '') {
      // this.util.showToast('otp is required', 'dark', 'bottom');
      this.error(this.util.getString('otp is required'));
      return false;
    }
    this.spinner.show();
    const param = {
      id: this.id,
      otp: this.otp
    };
    this.api.post('users/verifyOTP', param).then((data: any) => {
      console.log(data);
      this.spinner.hide();
      if (data && data.status === 200) {
        this.spinner.hide();
        this.currentDiv = 3;
      } else {
        if (data && data.status === 500 && data.data && data.data.message) {
          this.error(data.data.message);
          return false;
        }
        this.error(this.util.getString('Something went wrong'));
        return false;
      }
    }, error => {
      console.log(error);
      this.spinner.hide();
      this.error(this.util.getString('Something went wrong'));
    });
  }

  sendEmail() {
    console.log('pwddd0<<<<<<', this.password);
    if (!this.password || !this.repass || this.password === '' || this.repass === '') {
      this.error(this.util.getString('All Field are required'));
      return false;
    }
    const param = {
      email: this.email,
      pwd: this.password
    };
    this.spinner.show();
    this.api.post('users/update_password', param).then((data: any) => {
      console.log(data);
      this.spinner.hide();
      if (data && data.status === 200) {
        this.spinner.hide();
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
          this.error(data.data.message);
          return false;
        }
        this.error(this.util.getString('Something went wrong'));
        return false;
      }
    }, error => {
      console.log(error);
      this.spinner.hide();
      this.error(this.util.getString('Something went wrong'));
    });
  }

  back() {
    this.navCtrl.back();
  }
}
