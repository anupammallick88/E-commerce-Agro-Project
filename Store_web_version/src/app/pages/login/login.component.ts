import { Router } from '@angular/router';
/*
   Authors : Anupam Mallick
  Website : 
  App Name : Agro Store Web App
  Created : 10-Dec-2021
  
*/
import { Component, OnInit } from '@angular/core';
import { ToastData, ToastOptions, ToastyService } from 'ng2-toasty';
import { NgxSpinnerService } from 'ngx-spinner';
import { ApisService } from 'src/app/services/apis.service';
import { UtilService } from 'src/app/services/util.service';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  email: any = '';
  password: any = '';
  selected: any;
  langs: any[] = [];
  constructor(
    private router: Router,
    public api: ApisService,
    private toastyService: ToastyService,
    private spinner: NgxSpinnerService,
    public util: UtilService
  ) {
    this.selected = localStorage.getItem('language');
  }



  ngOnInit(): void {
  }
  login() {

    if (!this.email || this.email === '' || !this.password || this.password === '') {
      this.error(this.util.getString('All Fields are required'));
      return false;
    }

    const emailfilter = /^[\w._-]+[+]?[\w._-]+@[\w.-]+\.[a-zA-Z]{2,6}$/;
    if (!emailfilter.test(this.email)) {
      this.error(this.util.getString('Please enter valid email'));
      return false;
    }
    const param = {
      email: this.email,
      password: this.password
    };
    this.spinner.show();
    this.api.post('users/login', param).then((data: any) => {
      console.log('datas', data);

      if (data && data.status === 200) {
        if (data && data.data && data.data.type && data.data.type === 'store') {
          localStorage.setItem('uid', data.data.id);
          const store = {
            id: data.data.id
          };
          this.api.post('stores/getByUid', store).then((data: any) => {
            this.spinner.hide();
            console.log('*******************', data);
            if (data && data.status === 200 && data.data && data.data.length) {
              this.util.storeInfo = data.data[0];
              this.router.navigate(['']);
            }
          }, error => {
            this.spinner.hide();
            this.error(this.util.getString('Something went wrong'));
            console.log(error);
          }).catch(error => {
            this.spinner.hide();
            console.log(error);
          });
        } else {
          this.spinner.hide();
          this.error(this.util.getString('access denied'));
          return false;
        }
      } else if (data && data.status === 500) {
        this.spinner.hide();
        if (data.data && data.data.message) {
          this.error(data.data.message);
        } else {
          this.error(this.util.getString('Something went wrong'));
        }
      } else {
        this.error(this.util.getString('Something went wrong'));
      }

    }).catch(error => {
      this.spinner.hide();
      console.log('errror', error);
      this.error(this.util.getString('Something went wrong'));
    });
    // localStorage.setItem('uid', 'admin');
    // localStorage.setItem('type', 'admin');
    // this.router.navigate(['admin']);
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

  reset() {
    this.router.navigate(['reset']);
  }

  changeLng(item) {
    console.log(item);
    localStorage.setItem('language', item.file);
    window.location.reload();
  }
}
