/*
  Authors : Anupam Mallick
  Website : 
  App Name : Agro App
  Created : 10-Sep-2021
  
*/
import { Component, OnInit } from '@angular/core';
import { Router, NavigationExtras } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import Swal from 'sweetalert2';
import { ApisService } from 'src/app/services/apis.service';
import { ToastData, ToastOptions, ToastyService } from 'ng2-toasty';
import { UtilService } from 'src/app/services/util.service';
import * as moment from 'moment';
@Component({
  selector: 'app-driver-stats',
  templateUrl: './driver-stats.component.html',
  styleUrls: ['./driver-stats.component.css']
})
export class DriverStatsComponent implements OnInit {
  did: any;
  from: any;
  to: any;
  dname: any;
  storeOrders: any[] = [];
  commisionAmount: any = 0;
  toPay: any = 0;
  drivers: any[] = [];

  statType: any = 'flat';
  statValue: any;
  apiCalled: boolean;
  constructor(
    public api: ApisService,
    private router: Router,
    private spinner: NgxSpinnerService,
    private toastyService: ToastyService,
    private util: UtilService
  ) {
    this.getDrivers();
  }

  getDrivers() {
    this.spinner.show();
    this.api.get('drivers').then((data: any) => {
      this.spinner.hide();
      console.log(data);
      if (data && data.status === 200 && data.data.length) {
        this.drivers = data.data.filter(x => x.status === '1');
      }
    }, error => {
      this.spinner.hide();
      console.log(error);
      this.error('Something went wrong');
    }).catch(error => {
      console.log(error);
      this.spinner.hide();
      this.error('Something went wrong');
    });
  }

  ngOnInit(): void {
  }
  getName() {
    return this.dname + '_' + moment(this.from).format('DDMMYYYY') + '_' + moment(this.to).format('DDMMYYYY');
  }

  getDate(date) {
    return moment(date).format('LL');
  }
  getCurrency() {

  }
  today() {
    return moment().format('LLL');
  }
  getCommisions(total) {

  }

  getStats() {
    console.log('did', this.did);
    console.log('from', this.from);
    console.log('to', this.to);
    if (this.did && this.from && this.to && this.statValue && this.statType) {
      const driver = this.drivers.filter(x => x.id === this.did);
      console.log('driver------------>>', driver);
      if (driver && driver.length) {
        this.dname = driver[0].first_name + ' ' + driver[0].last_name;
      }
      console.log('ok');
      const param = {
        did: this.did,
        start: this.from + ' 00:00:00',
        end: this.to + ' 23:59:59'
      };
      console.log(param);
      this.spinner.show();
      this.apiCalled = false;
      this.api.post('orders/driverStats', param).then((data: any) => {
        this.apiCalled = true;
        this.spinner.hide();
        console.log(data);
        if (data && data.status === 200 && data.data.length) {
          this.storeOrders = data.data;
          console.log('total Orders', this.storeOrders);
          const orders = data.data;
          if (this.statType === 'flat') {
            const perOrder = parseFloat(this.statValue);
            this.commisionAmount = orders.length * perOrder;
            console.log('commisionAmount', this.commisionAmount);
            this.toPay = this.commisionAmount;
          } else {
            let total = 0;
            orders.forEach(element => {
              console.log(element.grand_total);
              total = total + parseFloat(element.grand_total);
            });
            console.log('grand total========>>', total);
            function percentage(num, per) {
              return (num / 100) * per;
            }
            const totalPrice = percentage(total, parseFloat(this.statValue));
            console.log('commistion=====>>>>>', totalPrice);
            this.commisionAmount = totalPrice;
            this.toPay = this.commisionAmount;
          }

        }
      }, error => {
        this.spinner.hide();
        console.log(error);
        this.apiCalled = true;
        this.error('Something went wrong');
      }).catch((error) => {
        this.spinner.hide();
        console.log(error);
        this.apiCalled = true;
        this.error('Something went wrong');
      });
    } else {
      console.log('not valid');
      this.error('All Fields are required');
      return false;
    }
  }

  error(message) {
    const toastOptions: ToastOptions = {
      title: 'Error',
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
      title: 'Success',
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
}
