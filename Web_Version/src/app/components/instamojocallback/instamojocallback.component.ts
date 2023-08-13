/*
Authors : Anupam Mallick
Website : 
App Name : Agro Web App
Created : 20-Nov-2021
*/
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { UtilService } from 'src/app/services/util.service';
import { CartService } from 'src/app/services/cart.service';
import * as moment from 'moment';

@Component({
  selector: 'app-instamojocallback',
  templateUrl: './instamojocallback.component.html',
  styleUrls: ['./instamojocallback.component.scss']
})
export class InstamojocallbackComponent implements OnInit {

  status: any;
  constructor(
    private route: ActivatedRoute,
    public api: ApiService,
    public util: UtilService,
    public cart: CartService,
    private router: Router
  ) {
    this.route.queryParams.subscribe((data: any) => {
      console.log('=======================>', data);
      this.status = data.status;
      if (data && data.payment_status && data.payment_id) {
        console.log(localStorage.getItem('payTMOrderID'));
        console.log('deliveryAddress===============', localStorage.getItem('deliveryAddress'));
        this.cart.deliveryAt = localStorage.getItem('deliveryAt');
        this.cart.datetime = localStorage.getItem('datetime');
        console.log('date time->>>', this.cart.datetime);
        console.log('cart--->>>', this.cart.deliveryAt, localStorage.getItem('deliveryAt'));
        if (this.cart.deliveryAt === 'home') {
          this.cart.deliveryAddress = JSON.parse(localStorage.getItem('deliveryAddress'));
        }
        const couponadded = localStorage.getItem('couponadded');
        console.log('couponaddedcouponaddedcouponaddedcouponaddedcouponaddedcouponadded', couponadded);
        if (couponadded && couponadded !== 'undefined' && couponadded !== undefined) {
          this.cart.coupon = JSON.parse(couponadded);
        }
        this.cart.calcuate();
        this.createOrder('instamojo', data.payment_id);
      } else {
        localStorage.removeItem('payTMOrderID');
        localStorage.removeItem('deliveryAt');
        localStorage.removeItem('deliveryAddress');
        localStorage.removeItem('datetime');
        localStorage.removeItem('couponadded');
        this.router.navigate(['']);
      }
    });
  }

  async createOrder(payMethod, payKey) {
    //////////// new
    //////////// new

    const storeId = [...new Set(this.cart.cart.map(item => item.store_id))];
    const orderStatus = [];
    storeId.forEach(element => {
      const info = {
        id: element,
        status: 'created'
      };
      orderStatus.push(info);
    });
    const notes = [
      {
        status: 1,
        value: 'Order Created',
        time: moment().format('lll'),
      }
    ];
    this.cart.deliveryAt = this.cart.deliveryAt ? this.cart.deliveryAt : '';
    const param = {
      uid: localStorage.getItem('uid'),
      store_id: storeId.join(),
      date_time: this.cart.datetime === 'today' ? moment().format('YYYY-MM-DD HH:mm:ss') : moment().add(1, 'days').format('YYYY-MM-DD HH:mm:ss'),
      paid_method: payMethod,
      order_to: this.cart.deliveryAt,
      orders: JSON.stringify(this.cart.cart),
      notes: JSON.stringify(notes),
      address: this.cart.deliveryAt === 'home' ? JSON.stringify(this.cart.deliveryAddress) : '',
      driver_id: '',
      total: this.cart.totalPrice,
      tax: this.cart.orderTax,
      grand_total: this.cart.grandTotal,
      delivery_charge: this.cart.deliveryPrice,
      coupon_code: this.cart.coupon ? JSON.stringify(this.cart.coupon) : '',
      discount: this.cart.discount,
      pay_key: payKey,
      status: JSON.stringify(orderStatus),
      assignee: ''
    };

    console.log('param----->', param);

    this.util.start();
    this.api.post('orders/save', param).subscribe((data: any) => {
      console.log(data);
      this.util.stop();
      localStorage.removeItem('payTMOrderID');
      localStorage.removeItem('deliveryAt');
      localStorage.removeItem('deliveryAddress');
      localStorage.removeItem('datetime');
      localStorage.removeItem('couponadded');
      this.api.createOrderNotification(this.cart.stores);
      this.cart.clearCart();
      this.util.publishNewOrder();
      this.router.navigate(['orders']);
    }, error => {
      console.log(error);
      this.util.stop();
      this.util.toast('error', this.util.getString('Error'), this.util.getString('Something went wrong'));
    });
  }
  ngOnInit(): void {
  }

}
