/*
Authors : Anupam Mallick
Website : 
App Name : Agro Web App
Created : 20-Nov-2021
*/
import { Component, OnInit } from '@angular/core';
import { UtilService } from 'src/app/services/util.service';
import { ApiService } from 'src/app/services/api.service';
import Swal from 'sweetalert2';
import * as moment from 'moment';
@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss']
})
export class ContactComponent implements OnInit {
  contact = {
    name: '',
    email: '',
    message: '',
    status: '0',
    date: moment().format('YYYY-MM-DD')
  };
  constructor(
    public util: UtilService,
    public api: ApiService
  ) {
    console.log('general', this.util.general);
  }

  ngOnInit(): void {
  }
  submit() {
    console.log('contact', this.contact);
    if (this.contact.name === '' || this.contact.email === '' || this.contact.message === '') {
      this.util.toast('error', this.util.getString('Error'), this.util.getString('All Fields are required'));
      return false;
    }
    const emailfilter = /^[\w._-]+[+]?[\w._-]+@[\w.-]+\.[a-zA-Z]{2,6}$/;
    if (!emailfilter.test(this.contact.email)) {
      this.util.toast('error', this.util.getString('Error'), this.util.getString('Please enter valid email'));
      return false;
    }

    this.util.start();
    this.api.post('contacts/save', this.contact).subscribe((data: any) => {
      this.util.stop();
      const param = {
        email: this.contact.email
      };
      this.api.post('users/contactResponse', param).subscribe((data: any) => {
        console.log(data);
      }, error => {
        console.log(error);
      });
      this.contact.email = '';
      this.contact.name = '';
      this.contact.message = '';
      if (data && data.status === 200) {

        this.success();
      } else {
        this.util.toast('error', this.util.getString('Error'), this.util.getString('Something went wrong'));
      }
    }, error => {
      console.log(error);
      this.util.stop();
      this.util.toast('error', this.util.getString('Error'), this.util.getString('Something went wrong'));
    });
  }


  success() {
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
      title: this.util.getString('message sent successfully')
    });
  }
}

