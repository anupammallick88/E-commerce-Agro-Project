/*
  Authors : Anupam Mallick
  Website : 
  App Name : Agro App
  Created : 10-Sep-2021
  
*/
import { Component, OnInit } from '@angular/core';
import { ToastData, ToastOptions, ToastyService } from 'ng2-toasty';
import { ApisService } from 'src/app/services/apis.service';
@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss']
})
export class NotificationsComponent implements OnInit {

  title: any;
  descriptions: any;
  constructor(
    private api: ApisService,
    private toastyService: ToastyService,
  ) { }

  ngOnInit() {
  }
  send() {
    if (!this.title || !this.descriptions) {
      this.error(this.api.translate('All Fields are required'));
      return false;
    }
    this.api.sendNotification(this.descriptions, this.title).subscribe((data) => {
      console.log(data);
      this.title = '';
      this.descriptions = '';
      this.success(this.api.translate('Notications sent'));
    }, error => {
      console.log(error);
      this.error(this.api.translate('Something went wrong'));
    });

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
