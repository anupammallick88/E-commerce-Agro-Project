/*
Authors : Anupam Mallick
Website : 
App Name : Agro Web App
Created : 20-Nov-2021
*/
import { Component, OnInit, ViewChild, ChangeDetectorRef, ElementRef } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { UtilService } from 'src/app/services/util.service';
import { CartService } from 'src/app/services/cart.service';
import { ModalDirective } from 'angular-bootstrap-md';
import { SwiperConfigInterface } from 'ngx-swiper-wrapper';
import * as moment from 'moment';
import { sortBy } from 'lodash';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  @ViewChild('frameTop') public frameTop: ModalDirective;
  @ViewChild('basicModal') public basicModal: ModalDirective;
  @ViewChild('content', { read: ElementRef }) public content: ElementRef<any>;
  @ViewChild('topContent', { read: ElementRef }) public topContent: ElementRef<any>;
  @ViewChild('topStores', { read: ElementRef }) public topStores: ElementRef<any>;
  @ViewChild('topOffers', { read: ElementRef }) public topOffers: ElementRef<any>;

  dummyCates = Array(30);
  categories: any[] = [];

  config: SwiperConfigInterface = {
    a11y: true,
    direction: 'horizontal',
    slidesPerView: 9,
    slideToClickedSlide: true,
    mousewheel: true,
    scrollbar: false,
    watchSlidesProgress: true,
    navigation: true,
    keyboard: true,
    pagination: false,
    centeredSlides: true,
    loop: true,
    roundLengths: true,
    // slidesOffsetBefore: 100,
    // slidesOffsetAfter: 100,
    spaceBetween: 300,
    // breakpoints: {
    //   // when window width is >= 320px
    //   320: {
    //     slidesPerView: 1
    //   }
    // }
  };

  dummyBanners: any[] = [];
  banners: any[] = [];

  bottomDummy: any[] = [];
  bottomBanners: any[] = [];

  betweenDummy: any[] = [];
  betweenBanners: any[] = [];

  dummyTopProducts: any[] = [];
  topProducts: any[] = [];

  products: any[] = [];
  dummyProducts: any[] = [];

  haveStores: boolean;

  dummyStores: any[] = [];
  stores: any[] = [];

  dummyOffers: any[] = [];
  offers: any[] = [];

  bottomcategory: any[] = [];
  dummyBottomCates = Array(2);
  haveCity: boolean;
  constructor(
    private router: Router,
    public api: ApiService,
    public util: UtilService,
    public cart: CartService,
    private chMod: ChangeDetectorRef
  ) {
    setTimeout(() => {
      const acceptedCookies = localStorage.getItem('acceptedCookies');
      if (acceptedCookies && acceptedCookies != null && acceptedCookies !== 'null') {
      } else {
        this.basicModal.show();
      }
    }, 1000);


    this.dummyCates = Array(30);
    this.dummyBanners = Array(30);
    this.bottomDummy = Array(30);
    this.betweenDummy = Array(30);
    this.dummyTopProducts = Array(30);
    this.dummyOffers = Array(30);
    this.offers = [];
    this.categories = [];
    this.banners = [];
    this.bottomBanners = [];
    this.betweenBanners = [];
    this.topProducts = [];
    this.products = [];
    this.bottomcategory = [];
    this.dummyBottomCates = Array(2);
    const city = localStorage.getItem('city');
    console.log('city', localStorage.getItem('city'));
    if (city && city != null && city !== 'null') {
      this.haveCity = true;
      this.getInit();
    } else {
      console.log('no city found...');
    }
    this.util.subscribeCity().subscribe((data: any) => {
      this.dummyCates = Array(30);
      this.dummyBanners = Array(30);
      this.bottomDummy = Array(30);
      this.betweenDummy = Array(30);
      this.dummyTopProducts = Array(30);
      this.dummyOffers = Array(30);
      this.offers = [];
      this.categories = [];
      this.banners = [];
      this.bottomBanners = [];
      this.betweenBanners = [];
      this.topProducts = [];
      this.products = [];
      this.bottomcategory = [];
      this.dummyBottomCates = Array(2);
      this.getInit();
    });
  }

  acceptcookies() {
    localStorage.setItem('acceptedCookies', 'true');
    this.basicModal.hide();
  }
  ngOnInit(): void {
    this.util.getPopup().subscribe(() => {
      console.log('------------------- open popp');
      setTimeout(() => {
        this.frameTop.show();
      }, 1000);
    });
  }

  getInit() {
    this.dummyCates = Array(30);
    this.dummyBanners = Array(30);
    this.bottomDummy = Array(30);
    this.betweenDummy = Array(30);
    this.dummyTopProducts = Array(30);
    this.categories = [];
    this.banners = [];
    this.bottomBanners = [];
    this.betweenBanners = [];
    this.topProducts = [];
    this.products = [];
    const param = {
      id: localStorage.getItem('city')
    };
    this.api.post('stores/getByCity', param).subscribe((stores: any) => {
      console.log('stores by city', stores);
      this.stores = [];
      if (stores && stores.status === 200 && stores.data && stores.data.length) {
        console.log('city found');
        this.stores = stores.data;

        this.stores.forEach(async (element) => {
          element['isOpen'] = await this.isOpen(element.open_time, element.close_time);
        });
        console.log('store====>>>', this.stores);
        this.haveStores = true;
        this.getCategorys();
        this.getBanners();

        this.topProducts = [];
        this.dummyTopProducts = Array(30);
        this.api.post('products/getTopRated', param).subscribe((data: any) => {
          console.log('top products', data);
          this.dummyTopProducts = [];
          if (data && data.status === 200 && data.data && data.data.length) {
            data.data.forEach(element => {
              if (element.variations && element.size === '1' && element.variations !== '') {
                if (((x) => { try { JSON.parse(x); return true; } catch (e) { return false } })(element.status)) {
                  element.variations = JSON.parse(element.variations);
                  element['variant'] = 0;
                } else {
                  element.variations = [];
                  element['variant'] = 1;
                }
              } else {
                element.variations = [];
                element['variant'] = 1;
              }
              if (this.cart.itemId.includes(element.id)) {
                const index = this.cart.cart.filter(x => x.id === element.id);
                element['quantiy'] = index[0].quantiy;
              } else {
                element['quantiy'] = 0;
              }
              this.topProducts.push(element);

            });
          }
        }, error => {
          console.log(error);
          this.dummyTopProducts = [];
        });

        this.api.post('products/getHome', param).subscribe((data: any) => {
          console.log('home products', data);
          this.dummyTopProducts = [];
          if (data && data.status === 200 && data.data && data.data.length) {
            data.data.forEach(element => {
              if (element.variations && element.size === '1' && element.variations !== '') {
                if (((x) => { try { JSON.parse(x); return true; } catch (e) { return false } })(element.status)) {
                  element.variations = JSON.parse(element.variations);
                  element['variant'] = 0;
                } else {
                  element.variations = [];
                  element['variant'] = 1;
                }
              } else {
                element.variations = [];
                element['variant'] = 1;
              }
              if (this.cart.itemId.includes(element.id)) {
                const index = this.cart.cart.filter(x => x.id === element.id);
                element['quantiy'] = index[0].quantiy;
              } else {
                element['quantiy'] = 0;
              }
              this.topProducts.push(element);

            });
          }

        }, error => {
          this.dummyTopProducts = [];
          console.log(error);
        });
        console.log('top products-->>>>>>>>>>>>>>>>--->>', this.topProducts);
        this.api.post('products/inOffers', param).subscribe((data: any) => {
          console.log('inOffersinOffers', data);
          this.dummyOffers = [];
          if (data && data.status === 200 && data.data && data.data.length) {
            // this.util.dummyProducts = data.data;

            // const topOffers = this.util.dummyProducts.filter(x => x.in_offer === '1');
            this.offers = [];
            data.data.filter(element => {
              if (element.variations && element.size === '1' && element.variations !== '') {
                if (((x) => { try { JSON.parse(x); return true; } catch (e) { return false } })(element.status)) {
                  element.variations = JSON.parse(element.variations);
                  element['variant'] = 0;
                } else {
                  element.variations = [];
                  element['variant'] = 1;
                }
              } else {
                element.variations = [];
                element['variant'] = 1;
              }
              if (this.cart.itemId.includes(element.id)) {
                const index = this.cart.cart.filter(x => x.id === element.id);
                element['quantiy'] = index[0].quantiy;
              } else {
                element['quantiy'] = 0;
              }
              this.offers.push(element);
            });
            this.offers = sortBy(this.offers, ['discount'], ['desc']);
            console.log('----------------------------->', this.offers);

          } else {
            this.util.dummyProducts = [];
          }
        }, error => {
          console.log(error);
          this.util.dummyProducts = [];
          this.dummyOffers = [];
        });
      } else {
        this.haveStores = false;
        this.stores = [];
        console.log('no city found');
        this.dummyCates = [];
        this.dummyBanners = [];
        this.bottomDummy = [];
        this.betweenDummy = [];
        this.dummyTopProducts = [];
        this.dummyProducts = [];
        this.categories = [];
        this.banners = [];
        this.bottomBanners = [];
        this.betweenBanners = [];
        this.topProducts = [];
        this.products = [];
        this.chMod.detectChanges();
      }
    }, error => {
      console.log('error in get store by city', error);
      this.stores = [];
      this.haveStores = false;
      this.dummyCates = [];
      this.dummyBanners = [];
      this.bottomDummy = [];
      this.betweenDummy = [];
      this.dummyTopProducts = [];
      this.dummyProducts = [];
      this.categories = [];
      this.banners = [];
      this.bottomBanners = [];
      this.betweenBanners = [];
      this.topProducts = [];
      this.products = [];
      this.util.toast('error', this.util.getString('Error'), this.util.getString('Something went wrong'));
      this.chMod.detectChanges();
    });
  }

  isOpen(start, end) {
    const format = 'H:mm:ss';
    const ctime = moment().format('HH:mm:ss');
    const time = moment(ctime, format);
    const beforeTime = moment(start, format);
    const afterTime = moment(end, format);

    if (time.isBetween(beforeTime, afterTime)) {
      return true;
    }
    return false;
  }

  getBanners() {
    this.dummyBanners = Array(30);
    this.api.get('banners').subscribe((data: any) => {
      console.log(data);
      this.dummyBanners = [];
      this.betweenDummy = [];
      this.bottomDummy = [];
      this.bottomBanners = [];
      this.betweenBanners = [];
      this.banners = [];
      if (data && data.status === 200 && data.data && data.data.length) {
        data.data.forEach(element => {
          if (element && element.status === '1') {
            if (element.position === '0') {
              this.banners.push(element);
            } else if (element.position === '1') {
              this.bottomBanners.push(element);
            } else {
              this.betweenBanners.push(element);
            }
          }
        });
        console.log('top', this.banners);
        console.log('bottom', this.bottomBanners);
        console.log('between', this.betweenBanners);
      }
    }, error => {
      console.log(error);
      this.dummyBanners = [];
    });
  }

  getQuanity(id) {
    const data = this.cart.cart.filter(x => x.id === id);
    return data[0].quantiy;
  }

  getCategorys() {
    this.dummyCates = Array(30);
    this.api.get('categories').subscribe((datas: any) => {
      console.log('categories', datas);
      this.dummyCates = [];
      const cates = [];
      if (datas && datas.data && datas.data.length) {
        datas.data.forEach(element => {
          if (element.status === '1') {
            const info = {
              id: element.id,
              name: element.name,
              cover: element.cover,
            };
            const data = {
              id: element.id,
              name: element.name,
              cover: element.cover,
              subCates: []
            };
            cates.push(data);
            this.categories.push(info);
          }
        });

        this.api.get('subcate').subscribe((subCates: any) => {
          console.log('sub cates', subCates);
          if (subCates && subCates.status === 200 && subCates.data && subCates.data.length) {
            cates.forEach((element, i) => {
              subCates.data.forEach(sub => {
                if (sub.status === '1' && element.id === sub.cate_id) {
                  cates[i].subCates.push(sub);
                }
              });
            });
            // console.log('=>>', this.categories);
            this.dummyBottomCates = [];
            this.bottomcategory = cates;
            console.log('bottomcategory cates==========>', this.bottomcategory);
          } else {
            this.dummyBottomCates = [];
          }
        }, error => {
          console.log(error);
          this.util.toast('error', this.util.getString('Error'), this.util.getString('Something went wrong'));
          this.dummyBottomCates = [];
        });
      } else {
        this.dummyCates = [];
        this.dummyBottomCates = [];
      }
    }, error => {
      console.log(error);
      this.util.toast('error', this.util.getString('Error'), this.util.getString('Something went wrong'));
      this.dummyCates = [];
      this.dummyBottomCates = [];
    });
  }

  open() {
    // modal.show();
    this.basicModal.show();
  }

  openPage(item) {
    console.log(item);
    if (item === 'picked') {
      this.router.navigate(['top-picked']);
    } else if (item === 'stores') {
      this.router.navigate(['top-stores']);
    } else if (item === 'offers') {
      this.router.navigate(['top-offers']);
    }
  }

  goToProductDetail(item) {

    console.log(item);
    const param: NavigationExtras = {
      queryParams: {
        val: JSON.stringify(item)
      }
    };
    this.router.navigate(['/product-detail'], param);
  }

  subCate(item) {
    console.log(item);
    const param: NavigationExtras = {
      queryParams: {
        cid: item.id,
        cname: item.name
      }
    };
    this.router.navigate(['sub-categoris'], param);
  }

  subItems(item, sub) {
    console.log(item, sub);
    const param: NavigationExtras = {
      queryParams: {
        cid: item.id,
        cname: item.name,
        subid: sub.id,
        sname: sub.name
      }
    };
    this.router.navigate(['sub-categoris'], param);
  }

  scrollRight() {
    this.content.nativeElement.scrollLeft += 250;
  }

  scrollLeft() {
    this.content.nativeElement.scrollLeft -= 250;
  }

  scrollRighttopOffers() {
    this.topOffers.nativeElement.scrollLeft += 450;
  }

  scrollLefttopOffers() {
    this.topOffers.nativeElement.scrollLeft -= 450;
  }

  scrollRighttopContent() {
    this.topContent.nativeElement.scrollLeft += 450;
  }

  scrollLefttopContent() {
    this.topContent.nativeElement.scrollLeft -= 450;
  }

  scrollRighttopStores() {
    this.topStores.nativeElement.scrollLeft += 450;
  }

  scrollLefttopStores() {
    this.topStores.nativeElement.scrollLeft -= 450;
  }

  topLeft() {
    this.topContent.nativeElement.scrollLeft -= 250;
  }

  topRight() {
    this.topContent.nativeElement.scrollLeft += 250;
  }

  openLink(item) {
    console.log(item);

    if (item.type === '0') {
      // Category
      console.log('open category');
      const name = this.categories.filter(x => x.id === item.link);
      let cateName: any = '';
      if (name && name.length) {
        cateName = name[0].name;
      }
      const param: NavigationExtras = {
        queryParams: {
          cid: item.link,
          cname: cateName
        }
      };
      this.router.navigate(['sub-categoris'], param);
    } else if (item.type === '1') {
      // product
      console.log('open product');
      const param: NavigationExtras = {
        queryParams: {
          id: item.link
        }
      };

      this.router.navigate(['product-detail'], param);
    } else {
      // link
      console.log('open link');
    }
  }

  goToSingleProduct(product) {
    console.log('-->', product);
    const param: NavigationExtras = {
      queryParams: {
        id: product.id
      }
    };
    this.router.navigate(['product-detail'], param);
  }

  addToCart(item, index) {
    console.log(item);
    this.topProducts[index].quantiy = 1;
    this.cart.addItem(item);
  }

  addOffersToCart(item, index) {
    console.log(item);
    this.offers[index].quantiy = 1;
    this.cart.addItem(item);
  }

  add(product, index) {
    console.log(product);
    this.topProducts[index].quantiy = this.getQuanity(product.id);
    if (this.topProducts[index].quantiy > 0) {
      this.topProducts[index].quantiy = this.topProducts[index].quantiy + 1;
      this.cart.addQuantity(this.topProducts[index].quantiy, product.id);
    }
  }

  remove(product, index) {
    console.log(product, index);
    this.topProducts[index].quantiy = this.getQuanity(product.id);
    if (this.topProducts[index].quantiy === 1) {
      this.topProducts[index].quantiy = 0;
      this.cart.removeItem(product.id);
    } else {
      this.topProducts[index].quantiy = this.topProducts[index].quantiy - 1;
      this.cart.addQuantity(this.topProducts[index].quantiy, product.id);
    }
  }

  addOffers(product, index) {
    console.log(product);
    this.offers[index].quantiy = this.getQuanity(product.id);
    if (this.offers[index].quantiy > 0) {
      this.offers[index].quantiy = this.offers[index].quantiy + 1;
      this.cart.addQuantity(this.offers[index].quantiy, product.id);
    }
  }

  removeOffers(product, index) {
    console.log(product, index);
    this.offers[index].quantiy = this.getQuanity(product.id);
    if (this.offers[index].quantiy === 1) {
      this.offers[index].quantiy = 0;
      this.cart.removeItem(product.id);
    } else {
      this.offers[index].quantiy = this.offers[index].quantiy - 1;
      this.cart.addQuantity(this.offers[index].quantiy, product.id);
    }
  }

  openStore(item) {
    console.log('open store', item);

    const param: NavigationExtras = {
      queryParams: {
        id: item.uid,
        name: item.name
      }
    };
    this.router.navigate(['stores-products'], param);
  }

  getTime(time) {
    return moment(time, ['h:mm A']).format('hh:mm A');
  }

  goToProductList(val) {
    const navData: NavigationExtras = {
      queryParams: {
        id: val.id,
        name: val.name
      }
    }
    this.router.navigate(['/tabs/categories/products'], navData);
  }

}
