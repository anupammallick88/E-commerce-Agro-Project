/*
  Authors : Anupam Mallick
  Website : 
  App Name : Agro App
  Created : 10-Sep-2021
  
*/
import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { NavigationExtras, Router } from '@angular/router';
import { ApisService } from 'src/app/services/apis.service';
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  dummy = Array(5);
  page: number = 1;

  orders: any[] = [];
  stores: any[] = [];
  users: any[] = [];

  allOrders: any[] = [];
  constructor(
    public api: ApisService,
    private router: Router
  ) {
    this.getData();
  }

  getData() {
    this.api.get('users/adminHome').then((data: any) => {
      console.log(data);
      this.dummy = [];
      if (data && data.status === 200) {
        const orders = data.data.orders;
        this.stores = data.data.stores;
        this.users = data.data.users;
        this.allOrders = data.data.allOrders;
        orders.forEach(element => {
          if (((x) => { try { JSON.parse(x); return true; } catch (e) { return false } })(element.orders)) {
            element.orders = JSON.parse(element.orders);
            element.store_id = element.store_id.split(',');
            element.orders.forEach(order => {
              console.log(element.id, '=>', order.variations);
              if (order.variations && order.variations !== '' && typeof order.variations === 'string') {
                console.log('strings', element.id);
                order.variations = JSON.parse(order.variations);
                console.log(order['variant']);
                if (order["variant"] === undefined) {
                  order['variant'] = 0;
                }
              }
            });
          }
        });
        this.orders = orders;
        console.log(this.users);
      }
    }, error => {
      console.log(error);
    }).catch(error => {
      console.log(error);
    });
  }

  ngOnInit(): void {
  }

  getCurrency() {
    // return this.api.getCurrencySymbol();
  }

  getClass(item) {
    if (item === 'created' || item === 'accepted' || item === 'picked') {
      return 'btn btn-primary btn-round';
    } else if (item === 'delivered') {
      return 'btn btn-success btn-round';
    } else if (item === 'rejected' || item === 'cancel') {
      return 'btn btn-danger btn-round';
    }
    return 'btn btn-warning btn-round';
  }

  getDates(date) {
    return moment(date).format('llll');
  }

  openOrder(item) {
    console.log(item);
    const navData: NavigationExtras = {
      queryParams: {
        id: item.id
      }
    };
    this.router.navigate(['manage-orders'], navData);
  }

  openIt(item) {
    this.router.navigate([item]);
  }
}
