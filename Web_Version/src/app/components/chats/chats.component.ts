/*
Authors : Anupam Mallick
Website : 
App Name : Agro Web App
Created : 20-Nov-2021
*/
import { NavigationExtras, Router } from '@angular/router';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { UtilService } from 'src/app/services/util.service';
import { ModalDirective } from 'angular-bootstrap-md';
import * as moment from 'moment';
@Component({
  selector: 'app-chats',
  templateUrl: './chats.component.html',
  styleUrls: ['./chats.component.scss']
})
export class ChatsComponent implements OnInit {
  @ViewChild('basicModal') public basicModal: ModalDirective;
  @ViewChild('scrollMe') private scrollMe: ElementRef;

  dummy: any[] = [];
  users: any[] = [];

  id: any;
  name: any;
  msg: any = '';
  messages: any[] = [];
  uid: any;
  loaded: boolean;
  yourMessage: boolean;
  interval: any;

  constructor(
    public api: ApiService,
    public util: UtilService,
    private router: Router
  ) {
    this.uid = localStorage.getItem('uid');
    this.getChats();
  }

  ngOnInit(): void {
  }
  getChats() {
    const param = {
      id: localStorage.getItem('uid')
    };
    this.dummy = Array(10);
    this.api.post('chats/getByGroup', param).subscribe((data: any) => {
      console.log(data);
      if (data && data.status === 200) {
        const info = [];
        data.data.forEach(element => {
          info.push(element.from_id);
          info.push(element.room_id);
        });
        let uniq = [...new Set(info)];
        uniq = uniq.filter(x => x !== localStorage.getItem('uid'));
        console.log('uniq->>', uniq);
        const uid = {
          id: uniq.join()
        };
        this.api.post('stores/getChatsNames', uid).subscribe((uids: any) => {
          this.dummy = [];
          console.log(uids);
          if (uids && uids.status === 200) {
            this.users = uids.data;
          }
        }, error => {
          console.log(error);
          this.users = [];
          this.dummy = [];
          this.util.toast('error', this.util.getString('Error'), this.util.getString('Something went wrong'));
        });
      } else {
        this.dummy = [];
      }
    }, error => {
      console.log(error);
      this.util.toast('error', this.util.getString('Error'), this.util.getString('Something went wrong'));
    });
  }

  onAdmin() {
    this.id = 0;
    this.loaded = false;
    this.name = 'Support';
    this.getInbox();
    this.interval = setInterval(() => {
      console.log('calling in interval');
      this.getInbox();
    }, 12000);
    this.basicModal.show();
  }

  onChat(item) {
    console.log(localStorage.getItem('uid'));

    this.id = item.id;
    this.loaded = false;
    this.name = item.name;
    this.getInbox();
    this.interval = setInterval(() => {
      console.log('calling in interval');
      this.getInbox();
    }, 12000);
    this.basicModal.show();
  }

  getInbox() {
    const param = {
      id: this.id + '_' + this.uid,
      oid: this.id
    };
    this.api.post('chats/getById', param).subscribe((data: any) => {
      console.log(data);
      this.loaded = true;
      this.yourMessage = true;
      if (data && data.status === 200) {
        this.messages = data.data;
        this.scrollToBottom();
      }
    }, error => {
      console.log(error);
      this.loaded = true;
      this.yourMessage = true;
      this.util.toast('error', this.util.getString('Error'), this.util.getString('Something went wrong'));
    });
  }
  scrollToBottom() {
    console.log(this.scrollMe.nativeElement.scrollTop);
    this.scrollMe.nativeElement.scrollTop = this.scrollMe.nativeElement.scrollHeight;
    console.log(this.scrollMe.nativeElement.scrollTop);
    // try {

    // } catch (err) { }
  }
  closeModal() {
    clearInterval(this.interval);
    this.basicModal.hide();
  }

  sendMessage() {
    // store to opponent
    console.log(this.msg);
    if (!this.msg || this.msg === '') {
      return false;
    }
    const msg = this.msg;
    this.msg = '';
    const param = {
      room_id: this.id,
      uid: this.id + '_' + this.uid,
      from_id: this.uid,
      message: msg,
      message_type: 'users',
      status: 1,
      timestamp: moment().format('YYYY-MM-DD HH:mm:ss')
    };
    // this.myContent.scrollToBottom(300);
    this.yourMessage = false;
    this.api.post('chats/save', param).subscribe((data: any) => {
      console.log(data);
      if (data && data.status === 200) {
        this.getInbox();
      } else {
        this.yourMessage = true;
      }
    }, error => {
      console.log(error);
      this.yourMessage = true;
      this.util.toast('error', this.util.getString('Error'), this.util.getString('Something went wrong'));
    });
  }
}
