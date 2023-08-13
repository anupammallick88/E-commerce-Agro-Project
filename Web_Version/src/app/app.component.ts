/*
Authors : Anupam Mallick
Website : 
App Name : Agro Web App
Created : 20-Nov-2021
*/
import { Component, ViewChild, HostListener, ElementRef, ChangeDetectorRef } from '@angular/core';
import {
  Router,
  Event as RouterEvent,
  NavigationStart,
  NavigationEnd,
  NavigationCancel,
  NavigationError
} from '@angular/router';
import { filter } from 'rxjs/operators';
import { ToasterConfig } from 'angular2-toaster';
import { ApiService } from './services/api.service';
import { UtilService } from './services/util.service';
import { CartService } from './services/cart.service';
import { ModalDirective } from 'angular-bootstrap-md';
import { Title } from '@angular/platform-browser';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  @ViewChild('cartModel') public cartModel: ModalDirective;
  title = 'groceryee';
  loaded: boolean;
  deviceType = 'desktop';
  innerHeight: string;
  windowWidth: number;

  verticalNavType = 'expanded';
  verticalEffect = 'shrink';
  isShow: boolean;
  topPosToStartShowing = 100;


  public config: ToasterConfig =
    new ToasterConfig({
      showCloseButton: true,
      tapToDismiss: true,
      timeout: 2000,
      positionClass: 'toast-bottom-right'
    });

  @HostListener('window:scroll')
  checkScroll() {
    const scrollPosition = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
    if (scrollPosition >= this.topPosToStartShowing) {
      this.isShow = true;
    } else {
      this.isShow = false;
    }
  }
  loading = true;

  constructor(
    private router: Router,
    public api: ApiService,
    public util: UtilService,
    public cart: CartService,
    private chmod: ChangeDetectorRef,
    private titleService: Title
  ) {
    const scrollHeight = window.screen.height - 150;
    this.innerHeight = scrollHeight + 'px';
    this.windowWidth = window.innerWidth;
    this.setMenuAttributs(this.windowWidth);
    this.util.subscribeCartBtn().subscribe((data) => {
      this.cartModel.show();
    });

    this.router.events.pipe(filter(event => event instanceof NavigationEnd)).subscribe((event: any) => {
      window.scrollTo(0, 0);
    });
    this.router.events.subscribe((e: RouterEvent) => {
      this.navigationInterceptor(e);
    });
    this.loaded = false;
    this.initializeApp();
    // this.getPayments();
  }

  navigationInterceptor(event: RouterEvent): void {
    if (event instanceof NavigationStart) {
      this.loading = true;
      this.loaded = false;
    }
    if (event instanceof NavigationEnd) {
      this.loading = false;
      this.loaded = true;
      window.scrollTo(0, 0);
      const data = this.getTitle(this.router.routerState, this.router.routerState.root);
      this.titleService.setTitle(data && data[0] ? this.util.getString(data[0]) + ' | Sabuj Sathi Agro' :
        this.util.getString('Home') + ' | Sabuj Sathi Agro');
    }

    // Set loading state to false in both of the below events to hide the spinner in case a request fails
    if (event instanceof NavigationCancel) {
      this.loading = false;
      this.loaded = true;
    }
    if (event instanceof NavigationError) {
      this.loading = false;
      this.loaded = true;
    }
  }

  getTitle(state, parent) {
    const data = [];
    if (parent && parent.snapshot.data && parent.snapshot.data.title) {
      data.push(parent.snapshot.data.title);
    }

    if (state && parent) {
      data.push(... this.getTitle(state, state.firstChild(parent)));
    }
    return data;
  }

  initializeApp() {
    this.api.get('cities').subscribe((data: any) => {
      console.log(data);
      if (data && data.status === 200 && data.data && data.data.length) {
        const cities = data.data.filter(x => x.status === '1');
        const id = localStorage.getItem('city');
        if (id && id !== null && id !== 'null') {
        } else {
          localStorage.setItem('city', cities[0].id);
          this.util.publishCity('push');
        }
        this.chmod.detectChanges();
        const lng = localStorage.getItem('language');
        if (!lng || lng === null) {
          this.api.get('users/getDefaultSettings').subscribe((data: any) => {
            console.log('----------------- app setting', data);
            if (data && data.status === 200 && data.data) {
              const manage = data.data.manage;
              const language = data.data.lang;
              const popup = data.data.popup;
              if (manage && manage.length > 0) {
                if (manage[0].app_close === 0 || manage[0].app_close === '0') {
                  this.util.appClosed = true;
                  this.util.appClosedMessage = manage[0].message;
                } else {
                  this.util.appClosed = false;
                }
              } else {
                this.util.appClosed = false;
              }
              if (popup && popup.length > 0) {
                if (popup[0].shown === 1 || popup[0].shown === '1') {
                  this.util.havepopup = true;
                  this.util.popupMessage = popup[0].message;
                  this.util.publishPopup();
                } else {
                  this.util.havepopup = false;
                }
              } else {
                this.util.havepopup = false;
              }
              if (language) {
                this.util.translations = language;
                localStorage.setItem('language', data.data.file);
                const trl = this.getTitle(this.router.routerState, this.router.routerState.root);
                this.titleService.setTitle(trl && trl[0] ? this.util.getString(trl[0]) + ' | Sabuj Sathi Agro' :
                  this.util.getString('Home') + ' | Sabuj Sathi Agro');
              }
              const settings = data.data.settings;
              if (settings && settings.length > 0) {
                const info = settings[0];
                this.util.direction = info.appDirection;
                this.util.cside = info.currencySide;
                this.util.currecny = info.currencySymbol;
                this.util.logo = info.logo;
                this.util.twillo = info.twillo;
                this.util.delivery = info.delivery;

                document.documentElement.dir = this.util.direction;
              } else {
                this.util.direction = 'ltr';
                this.util.cside = 'right';
                this.util.currecny = '$';
                document.documentElement.dir = this.util.direction;
              }
              const general = data.data.general;
              console.log('generalllll============================>', general);
              if (general && general.length > 0) {
                const info = general[0];
                this.util.general = info;
                this.cart.minOrderPrice = parseFloat(info.min);
                this.cart.shipping = info.shipping;
                this.cart.shippingPrice = parseFloat(info.shippingPrice);
                this.cart.orderTax = parseFloat(info.tax);
                this.cart.freeShipping = parseFloat(info.free);
              }
              this.getCart();
            } else {
              this.getCart();
            }

          }, error => {
            this.loaded = true;
            console.log('default settings', error);
          });
        } else {
          const param = {
            id: localStorage.getItem('language')
          };
          this.api.post('users/getDefaultSettingsById', param).subscribe((data: any) => {
            console.log('----------------- app setting', data);
            if (data && data.status === 200 && data.data) {
              const manage = data.data.manage;
              const language = data.data.lang;
              const popup = data.data.popup;

              if (manage && manage.length > 0) {
                if (manage[0].app_close === 0 || manage[0].app_close === '0') {
                  this.util.appClosed = true;
                  this.util.appClosedMessage = manage[0].message;
                } else {
                  this.util.appClosed = false;
                }
              } else {
                this.util.appClosed = false;
              }
              console.log('*******************popup', popup);
              if (popup && popup.length > 0) {
                if (popup[0].shown === 1 || popup[0].shown === '1') {
                  this.util.havepopup = true;
                  this.util.popupMessage = popup[0].message;
                  console.log('publish poppupppupppp');
                  this.util.publishPopup();
                } else {
                  this.util.havepopup = false;
                }
              } else {
                this.util.havepopup = false;
              }
              if (language) {
                this.util.translations = language;
                const trl = this.getTitle(this.router.routerState, this.router.routerState.root);
                this.titleService.setTitle(trl && trl[0] ? this.util.getString(trl[0]) + ' | Sabuj Sathi Agro' :
                  this.util.getString('Home') + ' | Sabuj Sathi Agro');
              }
              const settings = data.data.settings;
              if (settings && settings.length > 0) {
                const info = settings[0];
                this.util.direction = info.appDirection;
                this.util.cside = info.currencySide;
                this.util.currecny = info.currencySymbol;
                this.util.logo = info.logo;
                this.util.twillo = info.twillo;
                this.util.delivery = info.delivery;
                document.documentElement.dir = this.util.direction;

              } else {
                this.util.direction = 'ltr';
                this.util.cside = 'right';
                this.util.currecny = '$';
                document.documentElement.dir = this.util.direction;
              }
              const general = data.data.general;
              console.log('generalllll============================>', general)
              if (general && general.length > 0) {
                const info = general[0];
                this.util.general = info;
                this.cart.minOrderPrice = parseFloat(info.min);
                this.cart.shipping = info.shipping;
                this.cart.shippingPrice = parseFloat(info.shippingPrice);
                this.cart.orderTax = parseFloat(info.tax);
                this.cart.freeShipping = parseFloat(info.free);
              }
              this.getCart();
            } else {
              this.getCart();
            }

          }, error => {
            console.log('default settings by id', error);
            this.util.appClosed = false;
            this.util.direction = 'ltr';
            this.util.cside = 'right';
            this.util.currecny = '$';
            document.documentElement.dir = this.util.direction;
            this.loaded = true;
          });
        }
      } else {
        this.util.toast('error', this.util.getString('Error'), 'No cities found');
        this.loaded = true;
      }
    }, error => {
      console.log('error', error);
      this.loaded = true;
      this.util.toast('error', this.util.getString('Error'), this.util.getString('Something went wrong'));
    });


    const uid = localStorage.getItem('uid');
    if (uid && uid !== null && uid !== 'null') {
      const param = {
        id: uid
      };
      this.api.post('users/getById', param).subscribe((data: any) => {
        console.log('user info=>', data);
        if (data && data.status === 200 && data.data && data.data.length) {
          this.util.userInfo = data.data[0];
        }
      }, error => {
        console.log(error);
      });
    }
  }

  getCart() {
    this.loaded = true;
    this.util.getKeys('cart').then((data) => {
      if (data && data !== null && data !== 'null') {
        const cart = JSON.parse(data);
        console.log('cart===>>', cart);
        this.cart.cart = cart;
        this.cart.itemId = [];
        this.cart.cart.forEach(element => {
          this.cart.itemId.push(element.id);
        });
        console.log('cartitemss ----><>>>>', this.cart.cart);
        console.log('subitem=====>>>', this.cart.itemId);
        this.cart.calcuate();
      }
    });

  }

  onResize(event) {
    this.innerHeight = event.target.innerHeight + 'px';
    /* menu responsive */
    this.windowWidth = event.target.innerWidth;
    let reSizeFlag = true;
    if (this.deviceType === 'tablet' && this.windowWidth >= 768 && this.windowWidth <= 1024) {
      reSizeFlag = false;
    } else if (this.deviceType === 'mobile' && this.windowWidth < 768) {
      reSizeFlag = false;
    }
    this.util.deviceType = this.deviceType;
    if (reSizeFlag) {
      this.setMenuAttributs(this.windowWidth);
    }
  }

  setMenuAttributs(windowWidth) {
    if (windowWidth >= 768 && windowWidth <= 1024) {
      this.deviceType = 'mobile';
      this.verticalNavType = 'offcanvas';
      this.verticalEffect = 'push';
    } else if (windowWidth < 768) {
      this.deviceType = 'mobile';
      this.verticalNavType = 'offcanvas';
      this.verticalEffect = 'overlay';
    } else {
      this.deviceType = 'desktop';
      this.verticalNavType = 'expanded';
      this.verticalEffect = 'shrink';
    }
    this.util.deviceType = this.deviceType;
  }

  openLink(link) {
    this.router.navigate([link]);
  }

  add(product, index) {
    if (this.cart.cart[index].quantiy > 0) {
      this.cart.cart[index].quantiy = this.cart.cart[index].quantiy + 1;
      this.cart.addQuantity(this.cart.cart[index].quantiy, product.id);
    }
  }

  remove(product, index) {
    if (this.cart.cart[index].quantiy === 1) {
      this.cart.cart[index].quantiy = 0;
      this.cart.removeItem(product.id);
    } else {
      this.cart.cart[index].quantiy = this.cart.cart[index].quantiy - 1;
      this.cart.addQuantity(this.cart.cart[index].quantiy, product.id);
    }
  }

  gotoTop() {
    window.scroll({
      top: 0,
      left: 0,
      behavior: 'smooth'
    });
  }



  checkout() {
    this.cartModel.hide();
    this.router.navigate(['checkout']);
  }
}
