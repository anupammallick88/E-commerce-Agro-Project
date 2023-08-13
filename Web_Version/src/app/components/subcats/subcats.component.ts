/*
Authors : Anupam Mallick
Website : 
App Name : Agro Web App
Created : 20-Nov-2021
*/
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Location } from '@angular/common';
import { UtilService } from 'src/app/services/util.service';
import { ApiService } from 'src/app/services/api.service';
import { CartService } from 'src/app/services/cart.service';

@Component({
  selector: 'app-subcats',
  templateUrl: './subcats.component.html',
  styleUrls: ['./subcats.component.scss']
})
export class SubcatsComponent implements OnInit {
  @ViewChild('content', { static: false }) private content: any;
  dummyCates: any[] = [];
  cates: any[] = [];

  dummyProducts: any[] = [];
  products: any[] = [];
  id: any = '';
  cname: any = '';
  subId: any = '';
  subName: any = '';
  tabSelected: any;
  subCates: any[] = [];
  limit: any;
  dummys = Array(20);
  maxLimit: any;
  loaded: boolean;

  filter: any = '1';
  constructor(
    private route: ActivatedRoute,
    private navCtrl: Location,
    public util: UtilService,
    public api: ApiService,
    public cart: CartService,
    private router: Router
  ) {
    this.route.queryParams.subscribe((data) => {
      console.log('prama', data);
      if (data && data.cid && data.cname) {
        this.dummyCates = Array(10);
        this.dummyProducts = Array(16);
        this.cname = data.cname;
        this.id = data.cid;
        this.limit = 1;
        this.loaded = false;
        if (data.subid && data.sname) {
          this.subId = data.subid;
          this.subName = data.sname;
          this.tabSelected = this.subId;
        }
        this.getCategories();
      } else {
        this.util.toast('error', this.util.getString('Error'), this.util.getString('wrong input'));
        this.navCtrl.back();
      }
    });
  }

  getCategories() {
    const param = {
      id: this.id
    };
    this.api.post('subcate/getByCId', param).subscribe((data: any) => {
      if (data && data.status === 200 && data.data && data.data.length) {
        console.log('subcates', data.data);
        this.dummyCates = [];
        this.subCates = data.data.filter(x => x.status === '1');
        if (!this.tabSelected || this.tabSelected === '') {
          this.tabSelected = this.subCates[0].id;
        }
        this.getSubProducts();
      } else {
        this.navCtrl.back();
        this.dummyCates = [];
        this.dummyProducts = [];
      }
      this.getSubProducts();
    }, error => {
      console.log(error);
      this.dummyCates = [];
      this.dummyProducts = [];
      this.util.toast('error', this.util.getString('Error'), this.util.getString('wrong input'));
    });
  }

  getSubProducts() {
    const city = {
      id: this.id,
      cid: localStorage.getItem('city'),
      sid: this.tabSelected,
      limit: this.limit * 12
    };
    console.log('parma', city);

    // this.loaded = false;
    this.api.post('products/getByCSID', city).subscribe((cates: any) => {
      console.log(cates);
      this.dummyProducts = [];
      if (cates && cates.status === 200 && cates.data && cates.data.length) {
        this.maxLimit = (this.limit * 12) - 1;
        console.log('Max Limit0000', this.maxLimit);
        console.log('products', cates.data);
        const products = cates.data;
        this.products = products.filter(x => x.status === '1');
        // this.dummyProducts = this.products;
        // const cart = this.cart.cart;
        console.log('cart===============>>>>>>', this.cart.cart);
        this.products.forEach(info => {
          if (info.variations && info.size === '1' && info.variations !== '') {
            if (((x) => { try { JSON.parse(x); return true; } catch (e) { return false } })(info.status)) {
              info.variations = JSON.parse(info.variations);
              info['variant'] = 0;
            } else {
              info.variations = [];
              info['variant'] = 1;
            }
          } else {
            info.variations = [];
            info['variant'] = 1;
          }
          if (this.cart.itemId.includes(info.id)) {
            const index = this.cart.cart.filter(x => x.id === info.id);
            info['quantiy'] = index[0].quantiy;
          } else {
            info['quantiy'] = 0;
          }
        });
        this.onChange(this.filter);
        this.dummys = [];
      } else {
        this.dummys = [];
      }
      if (this.loaded) {
        this.loaded = false;
      }

    }, error => {
      console.log(error);
      this.dummys = [];
      this.dummyProducts = [];
      this.util.toast('error', this.util.getString('Error'), this.util.getString('wrong input'));
    });
  }

  ngOnInit(): void {
  }

  onMenuClick(cid, name) {
    console.log(cid);
    this.tabSelected = cid;
    this.products = [];
    this.limit = 1;
    this.subName = name;
    this.dummyProducts = Array(20);
    this.getSubProducts();
    this.loaded = false;
  }

  singleProduct(item) {
    console.log('-->', item);
    const param: NavigationExtras = {
      queryParams: {
        id: item.id
      }
    };
    this.router.navigate(['product-detail'], param);
  }

  addToCart(item, index) {
    console.log(item);
    this.products[index].quantiy = 1;
    this.cart.addItem(item);
  }

  add(product, index) {
    console.log(product);
    if (this.products[index].quantiy > 0) {
      this.products[index].quantiy = this.products[index].quantiy + 1;
      this.cart.addQuantity(this.products[index].quantiy, product.id);
    }
  }

  remove(product, index) {
    console.log(product, index);
    if (this.products[index].quantiy === 1) {
      this.products[index].quantiy = 0;
      this.cart.removeItem(product.id)
    } else {
      this.products[index].quantiy = this.products[index].quantiy - 1;
      this.cart.addQuantity(this.products[index].quantiy, product.id);
    }
  }

  loadData() {
    this.limit = this.limit + 1;
    this.loaded = true;
    this.getSubProducts();
  }

  onChange(value) {
    console.log(value, this.filter);
    switch (this.filter) {
      case '1':
        console.log('its rating');
        // this.products = this.products.sort((a, b) => parseInt(b.total_rating) - parseInt(a.total_rating));
        this.products = this.products.sort((a, b) =>
          parseFloat(b.total_rating) < parseFloat(a.total_rating) ? -1
            : (parseFloat(b.total_rating) > parseFloat(a.total_rating) ? 1 : 0));
        break;

      case '2':
        console.log('its low to high');
        this.products = this.products.sort((a, b) =>
          parseFloat(a.original_price) < parseFloat(b.original_price) ? -1
            : (parseFloat(a.original_price) > parseFloat(b.original_price) ? 1 : 0));
        break;

      case '3':
        console.log('its highht to low');
        this.products = this.products.sort((a, b) =>
          parseFloat(b.original_price) < parseFloat(a.original_price) ? -1
            : (parseFloat(b.original_price) > parseFloat(a.original_price) ? 1 : 0));
        break;

      case '4':
        console.log('its a - z');
        this.products = this.products.sort((a, b) => {
          if (a.name < b.name) { return -1; }
          if (a.name > b.name) { return 1; }
          return 0;
        });
        break;

      case '5':
        console.log('its z - a');
        this.products = this.products.sort((a, b) => {
          if (a.name > b.name) { return -1; }
          if (a.name < b.name) { return 1; }
          return 0;
        });
        break;

      case '6':
        console.log('its % off');
        this.products = this.products.sort((a, b) =>
          parseFloat(b.discount) < parseFloat(a.discount) ? -1
            : (parseFloat(b.discount) > parseFloat(a.discount) ? 1 : 0));
        break;

      default:
        break;
    }
  }
}
