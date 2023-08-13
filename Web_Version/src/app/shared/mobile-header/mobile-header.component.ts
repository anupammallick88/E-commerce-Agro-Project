/*
Authors : Anupam Mallick
Website : 
App Name : Agro Web App
Created : 20-Nov-2021
*/
import { Component, OnInit } from '@angular/core';
import { Router, NavigationExtras } from '@angular/router';
import { UtilService } from 'src/app/services/util.service';
import { ApiService } from 'src/app/services/api.service';
import { CartService } from 'src/app/services/cart.service';

@Component({
  selector: 'app-mobile-header',
  templateUrl: './mobile-header.component.html',
  styleUrls: ['./mobile-header.component.scss']
})
export class MobileHeaderComponent implements OnInit {
  cities: any[] = [];
  cityName: any = '';
  dummy = Array(5);
  id: any;
  clicked: boolean;
  lngId: any;
  dummyLang = Array(5);
  langs: any[] = [];
  constructor(
    private router: Router,
    public util: UtilService,
    public api: ApiService,
    public cart: CartService
  ) {
    this.getCities();
    this.getLangs();
    const lng = localStorage.getItem('language');
    if (lng && lng != null && lng !== 'null') {
      this.lngId = lng;
    }
  }

  getLangName() {
    const lng = localStorage.getItem('language');
    if (lng && lng != null && lng !== 'null') {
      const lngs = this.langs.filter(x => x.file === lng);
      return lngs && lngs.length > 0 ? lngs[0].name : 'EN';
    }
    return 'EN';
  }

  getLangFlag() {
    const lng = localStorage.getItem('language');
    if (lng && lng != null && lng !== 'null') {
      const lngs = this.langs.filter(x => x.file === lng);
      return lngs && lngs.length > 0 ? this.api.mediaURL + lngs[0].cover : 'assets/imgs/en.png';
    }
    return 'assets/imgs/en.png';
  }

  changed(value) {
    this.lngId = value;
    console.log(this.lngId);
    const item = this.langs.filter(x => x.file === this.lngId);
    if (item && item.length > 0) {
      this.util.direction = item[0].positions === '1' ? 'ltr' : 'rtl';
      document.documentElement.dir = this.util.direction;
      localStorage.setItem('language', this.lngId);
      window.location.reload();
    }
  }

  getLangs() {
    this.api.get('lang').subscribe((data: any) => {
      console.log('---------------------------------------------------', data);
      this.dummyLang = [];
      if (data && data.status === 200 && data.data && data.data.length) {
        this.langs = data.data.filter(x => x.status === '1');
      }
    }, error => {
      console.log('error', error);
      this.dummyLang = [];
      this.util.toast('error', this.util.getString('Error'), this.util.getString('Something went wrong'));
    });
  }

  ngOnInit(): void {
  }

  getCities() {
    this.api.get('cities').subscribe((data: any) => {
      console.log(data);
      this.dummy = [];
      if (data && data.status === 200 && data.data && data.data.length) {
        this.cities = data.data.filter(x => x.status === '1');
        const id = localStorage.getItem('city');
        if (id && id !== null && id !== 'null') {
          this.id = id;
          const city = this.cities.filter(x => x.id === this.id);
          this.util.city = city[0];
          this.cityName = city[0].name;
        } else {
          this.id = this.cities[0].id;
          localStorage.setItem('city', this.id);
          this.cityName = this.cities[0].name;
        }
      } else {
        this.util.toast('error', this.util.getString('Error'), this.util.getString('No cities found'));
      }
    }, error => {
      console.log('error', error);
      this.dummy = [];
      this.util.toast('error', this.util.getString('Error'), this.util.getString('Something went wrong'));
    });
  }
  selected(item) {
    console.log('id', this.id);
    this.id = item.id;
    this.clicked = true;
    localStorage.setItem('city', this.id);
    const city = this.cities.filter(x => x.id === this.id);
    this.util.city = city[0];
    this.cityName = city[0].name;
    this.util.publishCity(city);
    this.cart.cart = [];
    this.cart.itemId = [];
    this.cart.totalPrice = 0;
    this.cart.grandTotal = 0;
    this.cart.coupon = null;
    this.cart.discount = null;
    this.util.clearKeys('cart');
    this.util.publishCity('data');
  }
}
