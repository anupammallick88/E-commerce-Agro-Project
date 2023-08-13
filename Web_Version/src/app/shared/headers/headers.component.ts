/*
Authors : Anupam Mallick
Website : 
App Name : Agro Web App
Created : 20-Nov-2021
*/
import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, NavigationExtras } from '@angular/router';
import { UtilService } from 'src/app/services/util.service';
import { ApiService } from 'src/app/services/api.service';
import { CartService } from 'src/app/services/cart.service';
import { ModalDirective } from 'angular-bootstrap-md';

@Component({
  selector: 'app-headers',
  templateUrl: './headers.component.html',
  styleUrls: ['./headers.component.scss']
})
export class HeadersComponent implements OnInit {
  @ViewChild('cityModal') public cityModal: ModalDirective;
  cities: any[] = [];
  cityName: any = '';
  dummy = Array(5);
  id: any;
  clicked: boolean;
  terms: any = '';
  products: any[] = [];
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

  ngOnInit(): void {
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
          if (city && city.length > 0) {
            this.util.city = city[0];
            this.cityName = city[0].name;
          }
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

  selectedCity(item) {
    console.log(item);
    localStorage.setItem('city', item.id);
    window.location.reload();
  }

  goToCart() {
    this.router.navigate(['/cart']);
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }

  openPage(item) {
    const param: NavigationExtras = {
      queryParams: {
        category: item
      }
    };
    this.router.navigate(['categories'], param);
  }

  handleChange(event) {
    console.log(event);
  }

  goToHome(val) {
    this.router.navigate(['home']);
  }

  getAccount() {
    const uid = localStorage.getItem('uid');
    if (uid && uid != null && uid !== 'null') {
      return true;
    }
    return false;
  }

  logout() {
    const city = localStorage.getItem('city');
    localStorage.clear();
    this.util.userInfo = null;
    localStorage.setItem('city', city);
    this.router.navigate(['']);
  }

  help() {
    this.router.navigate(['help']);
  }

  faq() {
    this.router.navigate(['faq']);
  }

  login() {
    console.log('login');
    this.router.navigate(['login']);
  }

  myaccount() {
    this.router.navigate(['account']);
  }

  myOrders() {
    this.router.navigate(['orders']);
  }

  home() {
    this.router.navigate(['']);
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

  inputChange() {
    console.log(this.terms);
    if (this.terms) {
    } else {
      this.products = [];
    }
  }

  openProduct(item) {
    const param: NavigationExtras = {
      queryParams: {
        id: item.id
      }
    };
    this.products = [];
    this.terms = '';
    this.router.navigate(['product-detail'], param);
  }

  search(event) {
    console.log(event);
    if (event && event !== '') {
      const param = {
        id: localStorage.getItem('city'),
        search: event
      };
      this.util.start();
      this.api.post('products/getSearchItems', param).subscribe((data: any) => {
        console.log('search data==>', data);
        this.util.stop();
        if (data && data.status === 200 && data.data) {
          this.products = data.data;
        }
      }, error => {
        console.log('error in searhc filess--->>', error);
        this.util.stop();
        this.util.toast('error', this.util.getString('Error'), this.util.getString('Something went wrong'));
      });
    }
  }

  goChat() {
    this.router.navigate(['chats']);
  }
}
