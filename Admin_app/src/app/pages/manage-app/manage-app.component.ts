/*
  Authors : Anupam Mallick
  Website : 
  App Name : Agro App
  Created : 10-Sep-2021
  
*/
import { Component, OnInit } from '@angular/core';
import { ToastyService, ToastData, ToastOptions } from 'ng2-toasty';
import { NgxSpinnerService } from 'ngx-spinner';
import { Location } from '@angular/common';
import { ApisService } from 'src/app/services/apis.service';
import * as moment from 'moment';
@Component({
  selector: 'app-manage-app',
  templateUrl: './manage-app.component.html',
  styleUrls: ['./manage-app.component.css']
})
export class ManageAppComponent implements OnInit {

  name: any;
  status: any;
  haveSave: boolean;
  id: any;
  constructor(
    private api: ApisService,
    private toastyService: ToastyService,
    private spinner: NgxSpinnerService,
    private navCtrl: Location
  ) {
    this.getCurrennt();
  }

  ngOnInit(): void {
  }


  getCurrennt() {
    this.spinner.show();
    this.api.get('manage').then((data: any) => {
      console.log(data);
      this.spinner.hide();
      if (data && data.status === 200) {
        if (data && data.data && data.data.length) {
          this.haveSave = true;
          const info = data.data[0];
          this.id = info.id;
          this.name = info.message;
          this.status = info.app_close;
        }
      } else {
        this.haveSave = false;
      }
    }, error => {
      console.log(error);
      this.spinner.hide();
      this.error(this.api.translate('Something went wrong'));
    }).catch(error => {
      console.log(error);
      this.spinner.hide();
      this.error(this.api.translate('Something went wrong'));
    });
  }

  error(message) {
    const toastOptions: ToastOptions = {
      title: this.api.translate('Error'),
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
      title: this.api.translate('Success'),
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


  submit() {

    if (this.haveSave) {
      console.log('update', this.status);
      if (this.status === 0 || this.status === '0') {
        if (this.name === '' || !this.name) {
          console.log('close but no message foud');
          this.error(this.api.translate('All Fields are required'));
          return false;
        }
      }
      const param = {
        app_close: this.status,
        message: this.name,
        date_time: moment().format('YYYY-MM-DD HH:mm:SS'),
        id: this.id
      };

      console.log('param', param);
      this.spinner.show();
      this.api.post('manage/editList', param).then((data: any) => {
        console.log('data', data);
        this.spinner.hide();
        if (data && data.status === 200) {
          this.success('status updated');
          this.haveSave = true;
        } else {
          this.spinner.hide();
          this.error(this.api.translate('Something went wrong'));
        }
      }, error => {
        console.log(error);
        this.spinner.hide();
        this.error(this.api.translate('Something went wrong'));
      }).catch(error => {
        console.log(error);
        this.spinner.hide();
        this.error(this.api.translate('Something went wrong'));
      });


    } else {
      console.log('create');
      if (this.name && this.status) {
        const param = {
          app_close: 1,
          message: this.name,
          date_time: moment().format('YYYY-MM-DD HH:mm:SS')
        };

        console.log('param', param);
        this.spinner.show();
        this.api.post('manage/save', param).then((data: any) => {
          console.log('data', data);
          this.spinner.hide();
          if (data && data.status === 200) {
            this.success('status updated');
            this.haveSave = true;
            this.id = data.data.id;
          } else {
            this.spinner.hide();
            this.error(this.api.translate('Something went wrong'));
          }
        }, error => {
          console.log(error);
          this.spinner.hide();
          this.error(this.api.translate('Something went wrong'));
        }).catch(error => {
          console.log(error);
          this.spinner.hide();
          this.error(this.api.translate('Something went wrong'));
        });
      } else {
        this.error(this.api.translate('All Fields are required'));
      }
    }

  }
}
