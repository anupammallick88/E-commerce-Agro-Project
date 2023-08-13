/*
Authors : Anupam Mallick
Website : 
App Name : Agro Web App
Created : 20-Nov-2021
*/
import { ApiService } from 'src/app/services/api.service';
import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import * as moment from 'moment';
import { CartService } from 'src/app/services/cart.service';
import { UtilService } from 'src/app/services/util.service';
import { Location } from '@angular/common';
import Swal from 'sweetalert2';
import {
  IPayPalConfig,
  ICreateOrderRequest
} from 'ngx-paypal';
import { Router, ActivatedRoute } from '@angular/router';
import { ModalDirective } from 'angular-bootstrap-md';
import { RazorPayService } from 'src/app/services/razorPay';
declare var google;
declare let Razorpay: any;
declare let PaystackPop: any;
declare let FlutterwaveCheckout: any;
@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss']
})
export class CheckoutComponent implements OnInit {
  @ViewChild('frame') public frame: ModalDirective;
  @ViewChild('newAddress') public newAddress: ModalDirective;
  @ViewChild('paytabs') public paytabs: ModalDirective;
  @ViewChild('offersModal') public offersModal: ModalDirective;
  selected: any = 1;
  deliveryOption: any = 'home';

  storeAddress: any[] = [];
  time: any;
  datetime: any;

  today: any;
  nextDay: any;
  myaddress: any[] = [];
  selectedAddress: any;

  public payPalConfig?: IPayPalConfig;

  payId: any;

  payMethods: any;
  cards: any[] = [];
  token: any;

  addCard: boolean;

  cnumber: any = '';
  cname: any = '';
  cvc: any = '';
  date: any = '';
  email: any = '';

  lat: any;
  lng: any;
  address: any = '';
  house: any = '';
  landmark: any = '';
  title: any = 'home';
  pincode: any = '';
  id: any;
  from: any;

  RAZORPAY_OPTIONS = {
    'key': '',
    'amount': 0,
    'name': 'Sabuj Sathi Agro',
    'order_id': '',
    'description': 'Sabuj Sathi Agro Payment',
    'image': this.api.mediaURL + this.util.logo,
    'prefill': {
      'name': '',
      'email': '',
      'contact': '',
      'method': ''
    },
    'modal': {},
    'theme': {
      'color': '#45C261'
    }
  };

  offers: any[] = [];
  constructor(
    public api: ApiService,
    public cart: CartService,
    public util: UtilService,
    private navCtrl: Location,
    private router: Router,
    private razorpayService: RazorPayService,
    private cd: ChangeDetectorRef,
    private route: ActivatedRoute,
  ) {
    this.route.queryParams.subscribe((data: any) => {
      console.log(data);
      if (data && data.method && data.key) {
        console.log('-------------<><<<<<', data);
        // if()
      } else {
        this.getPayments();
        this.addCard = false;
        if (this.cart.cart.length > 0) {
          this.getStoreList();
        }
        this.getAddress();
        this.getOffers();
        this.datetime = 'today';
        this.time = this.util.getString('Today - ') + moment().format('dddd, MMMM Do YYYY');

        this.today = moment().format('dddd, MMMM Do YYYY');
        this.nextDay = moment().add(1, 'days').format('dddd, MMMM Do YYYY');
      }
    });

  }
  getPayments() {
    this.api.get('payments').subscribe((data: any) => {
      console.log(data);
      if (data && data.status === 200 && data.data) {
        const info = data.data.filter(x => x.status === '1');
        console.log('total payments', info);
        if (info && info.length > 0) {
          console.log('---->>', info);
          this.cart.havePayment = true;
          const stripe = info.filter(x => x.id === '1');
          const cod = info.filter(x => x.id === '2');
          const paypal = info.filter(x => x.id === '3');
          const razor = info.filter(x => x.id === '4');
          const paytm = info.filter(x => x.id === '5');
          const insta = info.filter(x => x.id === '6');
          const paystack = info.filter(x => x.id === '7');
          const flutterwave = info.filter(x => x.id === '8');
          this.cart.havePayTM = paytm && paytm.length > 0 ? true : false;
          this.cart.havePayPal = paypal && paypal.length > 0 ? true : false;
          this.cart.haveStripe = stripe && stripe.length > 0 ? true : false;
          this.cart.haveRazor = razor && razor.length > 0 ? true : false;
          this.cart.haveCOD = cod && cod.length > 0 ? true : false;
          this.cart.haveInstamojo = insta && insta.length > 0 ? true : false;
          this.cart.havePayStack = paystack && paystack.length > 0 ? true : false;
          this.cart.haveFlutterwave = flutterwave && flutterwave.length > 0 ? true : false;
          if (this.cart.haveStripe) {
            // this.util.stripe = stripe;
            if (stripe) {
              const creds = JSON.parse(stripe[0].creds);
              if (stripe[0].env === '1') {
                this.util.stripe = creds.live;
              } else {
                this.util.stripe = creds.test;
              }
              if (this.util.userInfo && this.util.userInfo.stripe_key) {
                this.getCards();
              }
              this.util.stripeCode = creds && creds.code ? creds.code : 'USD';
            }
            console.log('============>>', this.util.stripe);
          }


          if (this.cart.haveInstamojo) {
            const datas = info.filter(x => x.id === '6');
            this.cart.instaENV = datas[0].env;
            if (insta) {
              const instaPay = JSON.parse(datas[0].creds);
              this.cart.instamojo = instaPay;
              console.log('instaMOJO', this.cart.instamojo);
            }
          }

          if (this.cart.havePayPal) {
            if (paypal) {
              const creds = JSON.parse(paypal[0].creds);
              if (paypal[0].env === '1') {
                this.util.paypal = creds.live;
              } else {
                this.util.paypal = creds.test;
              }
              if (this.cart.havePayPal) {
                this.initConfig();
              }
              this.util.paypalCode = creds && creds.code ? creds.code : 'USD';
            }
          }

          if (this.cart.haveRazor) {
            if (razor) {
              const creds = JSON.parse(razor[0].creds);
              if (razor[0].env === '1') {
                this.util.razor = creds.live;
              } else {
                this.util.razor = creds.test;
              }
              if (this.cart.haveRazor) {
                this.initRazor();
              }
              this.util.razorCode = creds && creds.code ? creds.code : 'INR';
            }
          }

          if (this.cart.havePayTM) {
            if (paytm) {
              const creds = JSON.parse(paytm[0].creds);
              this.cart.paytmENV = paytm[0].env;
              this.cart.paytmCreds = creds;
              console.log('creds=============>>>>>>>PAYRMMMMM', creds);
            }
          }

          if (this.cart.havePayStack) {
            if (paystack) {
              const creds = JSON.parse(paystack[0].creds);
              this.cart.paystack = creds;
              console.log('paystack creds=======>>>>>', this.cart.paystack);
            }
          }

          if (this.cart.haveFlutterwave) {
            if (flutterwave) {
              const creds = JSON.parse(flutterwave[0].creds);
              this.cart.flutterwave = creds;
              console.log('fluterwave creds=>>', this.cart.flutterwave);
            }
          }
        } else {
          this.cart.havePayment = false;
          this.util.toast('error', this.util.getString('Error'), this.util.getString('Something went wrong'));
        }
      } else {
        this.cart.havePayment = false;
        this.util.toast('error', this.util.getString('Error'), this.util.getString('Something went wrong'));
      }
    }, error => {
      console.log(error);
      this.cart.havePayment = false;
      this.util.toast('error', this.util.getString('Error'), this.util.getString('Something went wrong'));
    });
  }
  paystackPay() {
    const handler = PaystackPop.setup({
      key: this.cart.paystack.pk,
      email: this.util.userInfo.email,
      amount: this.cart.grandTotal * 100,
      firstname: this.util.userInfo.first_name,
      lastname: this.util.userInfo.last_name,
      ref: '' + Math.floor((Math.random() * 1000000000) + 1),
      onClose: () => {
        console.log('closed');
      },
      callback: (response) => {
        console.log(response);
        // response.reference
        this.createOrder('paystack', response.reference);
      }
    });
    handler.openIframe();
  }



  ngOnInit(): void {


  }
  initRazor() {
    this.razorpayService
      .lazyLoadLibrary('https://checkout.razorpay.com/v1/checkout.js')
      .subscribe();
  }

  handleChange(event) {
    console.log(event);
    this.deliveryOption = event;
  }

  getName() {
    return this.util.userInfo && this.util.userInfo.first_name ? this.util.userInfo.first_name + ' ' +
      this.util.userInfo.last_name : 'Groceryee';
  }

  getEmail() {
    return this.util.userInfo && this.util.userInfo.email ? this.util.userInfo.email : 'info@groceryee.com';
  }

  instaPay() {
    let curl;
    if (this.cart.instaENV === '0') {
      curl = 'https://test.instamojo.com/api/1.1/payment-requests/';
    } else {
      curl = 'https://www.instamojo.com/api/1.1/payment-requests/';
    }
    const callbackURL = window.location.origin + '/instamojocallback?method=instamojo&';
    const param = {
      allow_repeated_payments: 'False',
      amount: this.cart.grandTotal,
      name: this.getName(),
      purpose: 'Groceryee order',
      redirect_url: callbackURL,
      phone: this.util.userInfo && this.util.userInfo.mobile ? this.util.userInfo.mobile : '',
      send_email: 'True',
      webhook: this.api.baseUrl,
      send_sms: 'True',
      email: this.getEmail(),
      key: this.cart.instamojo.key,
      token: this.cart.instamojo.token,
      url: curl
    };

    this.util.start();
    this.api.post('users/instamojoRequest', param).subscribe((data: any) => {
      console.log(data);
      this.util.stop();
      if (data && data.status === 200) {
        const info = JSON.parse(data.data);
        console.log('info', info);
        if (info && info.success === true) {
          window.open(info.payment_request.longurl, '_self');
        } else {
          this.util.toast('error', this.util.getString('Error'), this.util.getString('Something went wrong'));
        }
      } else {
        this.util.toast('error', this.util.getString('Error'), this.util.getString('Something went wrong'));
      }
    }, error => {
      this.util.stop();
      this.util.toast('error', this.util.getString('Error'), this.util.getString('Something went wrong'));
      console.log(error);
    });
  }

  flutterPay() {
    const callbackURL = window.location.origin + '/flutterwavecallback?method=flutterwave&';
    FlutterwaveCheckout({
      public_key: this.cart.flutterwave.pk,
      tx_ref: '' + Math.floor((Math.random() * 1000000000) + 1),
      amount: this.cart.grandTotal,
      currency: this.cart.flutterwave.code,
      payment_options: 'card, mobilemoneyghana, ussd',
      redirect_url: // specified redirect URL
        callbackURL,
      meta: {
        consumer_id: 23,
        consumer_mac: '92a3-912ba-1192a',
      },
      customer: {
        email: this.getEmail(),
        phone_number: this.util.userInfo.mobile,
        name: this.getName(),
      },
      callback: (data) => {
        console.log(data);
      },
      onclose: () => {
        console.log('closed');
      },
      customizations: {
        title: 'Groceryee',
        description: 'Groceryee order',
        logo: this.api.mediaURL + this.util.logo,
      },
    });
  }

  payTm() {
    // payFromWeb
    const orderId = this.util.makeid(20);
    const callbackURL = window.location.href + '?method=paytm&key=' + orderId;

    const param = {
      ORDER_ID: orderId,
      CUST_ID: localStorage.getItem('uid'),
      INDUSTRY_TYPE_ID: 'Retail',
      CHANNEL_ID: 'WAP',
      TXN_AMOUNT: this.cart.grandTotal ? this.cart.grandTotal : 5,
      callback: callbackURL
    };
    localStorage.setItem('payTMOrderID', orderId);
    localStorage.setItem('deliveryAt', this.deliveryOption);
    localStorage.setItem('deliveryAddress', JSON.stringify(this.cart.deliveryAddress));
    localStorage.setItem('datetime', this.datetime);
    localStorage.setItem('couponadded', JSON.stringify(this.cart.coupon));
    console.log('to url===>', this.api.JSON_to_URLEncoded(param));
    const url = this.api.baseUrl + 'paytm/payFromWeb?' + this.api.JSON_to_URLEncoded(param);
    window.open(url, '_self');
  }

  getOffers() {
    this.api.get('offers').subscribe((data: any) => {
      console.log(data);
      if (data && data.status === 200 && data.data && data.data.length) {
        const info = data.data.filter(x => x.status === '1');
        this.offers = info;
      }
    }, error => {
      console.log(error);
      this.util.toast('error', this.util.getString('Error'), this.util.getString('Something went wrong'));
    });
  }

  private initConfig(): void {
    this.payPalConfig = {
      currency: this.util.paypalCode,
      clientId: this.util.paypal,
      createOrderOnClient: (data) => <ICreateOrderRequest>{
        intent: 'CAPTURE',
        purchase_units: [{
          amount: {
            currency_code: this.util.paypalCode,
            value: this.cart.grandTotal,
            breakdown: {
              item_total: {
                currency_code: this.util.paypalCode,
                value: this.cart.grandTotal
              }
            }
          },
        }]
      },
      advanced: {
        commit: 'true'
      },
      style: {
        label: 'paypal',
        layout: 'vertical'
      },
      onApprove: (data, actions) => {
        console.log('onApprove - transaction was approved, but not authorized', data, actions);
        actions.order.get().then(details => {
          console.log('onApprove - you can get full order details inside onApprove: ', details);

        });

      },
      onClientAuthorization: (data) => {
        console.log('onClientAuthorization - you should probably inform your server about completed transaction at this point', data);
        // this.showSuccess = true;
        this.payId = data.id;
        this.createOrder('paypal', this.payId);
      },
      onCancel: (data, actions) => {
        console.log('OnCancel', data, actions);
        // this.showCancel = true;

      },
      onError: err => {
        console.log('OnError', err);
        // this.showError = true;
      },
      onClick: (data, actions) => {
        console.log('onClick', data, actions);
        // this.resetStatus();
      },
    };
  }

  getCards() {
    console.log(this.util.userInfo.stripe_key);
    this.api.httpGet('https://api.stripe.com/v1/customers/' + this.util.userInfo.stripe_key +
      '/sources?object=card', this.util.stripe).subscribe((cards: any) => {
        console.log(cards);
        if (cards && cards.data) {
          this.cards = cards.data;
          this.token = this.cards[0].id;
        }
      }, (error) => {
        console.log(error);
        if (error && error.error && error.error.error && error.error.error.message) {
          this.util.toast('error', this.util.getString('Error'), error.error.error.message);
          return false;
        }
        this.util.toast('error', this.util.getString('Error'), this.util.getString('Something went wrong'));
      });
  }

  public proceed() {
    this.RAZORPAY_OPTIONS.key = this.util.razor;
    this.RAZORPAY_OPTIONS.amount = this.cart.grandTotal * 100;
    this.RAZORPAY_OPTIONS.prefill.email = this.util.userInfo.email;

    this.RAZORPAY_OPTIONS['handler'] = this.razorPaySuccessHandler.bind(this);

    const razorpay = new Razorpay(this.RAZORPAY_OPTIONS);
    razorpay.open();
  }


  public razorPaySuccessHandler(response) {
    console.log('->', response);
    this.payId = response.razorpay_payment_id;
    this.createOrder('razor', this.payId);
    this.cd.detectChanges();
  }

  addNewAddress() {
    this.newAddress.show();
  }

  addAddress() {
    if (this.address === '' || this.landmark === '' || this.house === '' || this.pincode === '') {
      this.util.toast('error', this.util.getString('Error'), this.util.getString('All Fields are required'));
      return false;
    }
    if (!this.lat || this.lat === '' || !this.lng || this.lng === '') {
      const geocoder = new google.maps.Geocoder;
      geocoder.geocode({ address: this.house + ' ' + this.landmark + ' ' + this.address + ' ' + this.pincode }, (results, status) => {
        console.log(results, status);
        if (status === 'OK' && results && results.length) {
          this.lat = results[0].geometry.location.lat();
          this.lng = results[0].geometry.location.lng();
          console.log('----->', this.lat, this.lng);
          console.log('call api');
          this.util.start();
          const param = {
            uid: localStorage.getItem('uid'),
            address: this.address,
            lat: this.lat,
            lng: this.lng,
            title: this.title,
            house: this.house,
            landmark: this.landmark,
            pincode: this.pincode
          };
          this.api.post('address/save', param).subscribe((data: any) => {
            this.util.stop();
            this.newAddress.hide();
            if (data && data.status === 200) {
              // this.navCtrl.back();
              this.getAddress();
              // this.util.showToast('Address added', 'success', 'bottom');
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
                title: this.util.getString('Address added')
              });
            } else {
              this.util.toast('error', this.util.getString('Error'), this.util.getString('Something went wrong'));
            }
          }, error => {
            console.log(error);
            this.util.stop();
            this.util.toast('error', this.util.getString('Error'), this.util.getString('Something went wrong'));
          });
        } else {
          this.util.toast('error', this.util.getString('Error'), this.util.getString('Something went wrong'));
          return false;
        }
      });
    }


  }

  payWithCard() {
    console.log(this.token);
    if (this.token) {
      const options = {
        amount: this.cart.grandTotal * 100,
        currency: this.util.stripeCode,
        customer: this.util.userInfo.stripe_key,
        card: this.token,
      };
      console.log('options', options);
      const url = 'https://api.stripe.com/v1/charges';
      this.util.start();
      this.api.externalPost(url, options, this.util.stripe).subscribe((data: any) => {
        console.log('------------------------->', data);
        this.payId = data.id;
        this.util.stop();
        // this.util.showToast('Payment Success', 'success', 'bottom');
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
          title: this.util.getString('Payment Success')
        });
        this.createOrder('stripe', this.payId);
      }, (error) => {
        this.util.stop();
        console.log(error);
        if (error && error.error && error.error.error && error.error.error.message) {
          // this.util.showErrorAlert(error.error.error.message);
          this.util.toast('error', this.util.getString('Error'), error.error.error.message);
          return false;
        }
        this.util.toast('error', this.util.getString('Error'), this.util.getString('Something went wrong'));
      });
    } else {
      this.util.toast('error', this.util.getString('Error'), this.util.getString('Please select card'));
    }
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
    }

    console.log('param----->', param);

    this.util.start();
    this.api.post('orders/save', param).subscribe((data: any) => {
      console.log(data);
      this.util.stop();
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

  getAddress() {
    const param = {
      id: localStorage.getItem('uid')
    };
    this.myaddress = [];
    this.api.post('address/getByUid', param).subscribe((data: any) => {
      console.log('addreess------------', data);
      if (data && data.status === 200 && data.data.length) {
        this.myaddress = data.data;
      }
    }, error => {
      console.log(error);
      this.util.toast('error', this.util.getString('Error'), this.util.getString('Something went wrong'));
    });
  }

  getStoreList() {
    const info = [...new Set(this.cart.cart.map(item => item.store_id))];
    console.log('store iddss==================>>', info);
    // test
    // info.push(10, 17);
    // test
    const param = {
      id: info.join()
    };
    this.api.post('stores/getStoresData', param).subscribe((data: any) => {
      console.log(data);
      if (data && data.status === 200 && data.data.length) {
        this.storeAddress = data.data;
        this.cart.stores = this.storeAddress;
      } else {
        this.util.toast('error', this.util.getString('Error'), this.util.getString('Something went wrong'));
        // this.back();
      }
    }, error => {
      console.log('error', error);
      this.util.toast('error', this.util.getString('Error'), this.util.getString('Something went wrong'));
    });
  }

  back() {
    this.navCtrl.back();
  }

  onSelect(data) {
    if (data === 'today') {
      this.datetime = 'today';
      this.time = this.util.getString('Today - ') + moment().format('dddd, MMMM Do YYYY');
    } else {
      this.datetime = 'tomorrow';
      this.time = this.util.getString('Tomorrow - ') + moment().add(1, 'days').format('dddd, MMMM Do YYYY');
    }
  }

  prev() {
    console.log('prev', this.selected);
    if (this.selected === 2) {
      this.selected = 1;
    } else if (this.selected === 3 && this.deliveryOption === 'home') {
      this.selected = 2;
    } else {
      this.selected = 1;
    }
  }

  next() {
    console.log('next', this.selected, this.deliveryOption);
    console.log('deliveryadddress', this.selectedAddress);
    this.cart.deliveryAt = this.deliveryOption;
    this.cart.datetime = this.datetime;
    if (this.selected === 1 && this.deliveryOption === 'home') {
      this.selected = 2;
    } else if (this.selected === 1 && this.deliveryOption === 'store') {
      this.selected = 3;
    } else if (this.selected === 2 && this.selectedAddress) {
      const selecte = this.myaddress.filter(x => x.id === this.selectedAddress);
      const item = selecte[0];
      console.log('item', item);
      this.cart.deliveryAddress = item;
      this.selected = 3;
    } else if (!this.selectedAddress) {
      this.util.toast('error', this.util.getString('Error'), this.util.getString('Please select address'));
    }
    this.cart.calcuate();
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

  payMethod(method) {
    console.log(method);
    this.payMethods = method;
  }

  submit() {
    if (this.payMethods === 'cod') {
      this.createOrder(this.payMethods, '');
    } else if (this.payMethods === 'stripe') {
      console.log('pay with stripe');
      this.frame.show();
    } else if (this.payMethods === 'razor') {
      this.proceed();
    } else if (this.payMethods === 'paytm') {
      this.payTm();
    } else if (this.payMethods === 'instamojo') {
      this.instaPay();
    } else if (this.payMethods === 'paystacks') {
      this.paystackPay();
    } else if (this.payMethods === 'flutterPay') {
      this.flutterPay();
    }
  }

  addcard() {
    this.date = this.date.replace(/ /g, '');
    this.cnumber = this.cnumber.replace(/ /g, '');
    console.log('date============>', this.date.split('/'));
    console.log('cumner', this.cnumber);
    if (this.email === '' || this.cname === '' || this.cnumber === '' ||
      this.cvc === '' || this.date === '') {
      // this.util.showToast('All Fields are required', 'danger', 'bottom');
      this.util.toast('error', this.util.getString('Error'), this.util.getString('All Fields are required'));
      return false;
    }
    const emailfilter = /^[\w._-]+[+]?[\w._-]+@[\w.-]+\.[a-zA-Z]{2,6}$/;
    if (!(emailfilter.test(this.email))) {
      // this.util.showToast('Please enter valid email', 'danger', 'bottom');
      this.util.toast('error', this.util.getString('Error'), this.util.getString('Please enter valid emai'));
      return false;
    }
    const year = this.date.split('/')[1];
    const month = this.date.split('/')[0];

    const param = {
      'card[number]': this.cnumber,
      'card[exp_month]': month,
      'card[exp_year]': year,
      'card[cvc]': this.cvc
    };
    this.util.start();
    this.api.externalPost('https://api.stripe.com/v1/tokens', param, this.util.stripe).subscribe((data: any) => {
      console.log(data);
      if (data && data.id) {
        // this.token = data.id;
        const customer = {
          description: 'Customer for groceryee app',
          source: data.id,
          email: this.email
        };
        this.api.externalPost('https://api.stripe.com/v1/customers', customer, this.util.stripe).subscribe((customer: any) => {
          console.log(customer);
          this.util.stop();
          if (customer && customer.id) {
            // this.cid = customer.id;
            const cid = {
              id: localStorage.getItem('uid'),
              stripe_key: customer.id
            };

            this.updateUser(cid);
          }
        }, error => {
          this.util.stop();
          console.log();
          if (error && error.error && error.error.error && error.error.error.message) {
            // this.util.showErrorAlert(error.error.error.message);
            this.util.toast('error', this.util.getString('Error'), error.error.error.message);
            return false;
          }
          this.util.toast('error', this.util.getString('Error'), this.util.getString('Something went wrong'));
        });
      } else {
        this.util.stop();
      }
    }, (error: any) => {
      console.log(error);
      this.util.stop();
      console.log();
      if (error && error.error && error.error.error && error.error.error.message) {
        // this.util.showErrorAlert(error.error.error.message);
        this.util.toast('error', this.util.getString('Error'), error.error.error.message);
        return false;
      }
      this.util.toast('error', this.util.getString('Error'), this.util.getString('Something went wrong'));
    });
  }

  updateUser(param) {
    this.util.start();
    this.api.post('users/edit_profile', param).subscribe((data: any) => {
      this.util.stop();
      console.log(data);
      const getParam = {
        id: localStorage.getItem('uid')
      };
      this.api.post('users/getById', getParam).subscribe((data: any) => {
        console.log('user info=>', data);
        if (data && data.status === 200 && data.data && data.data.length) {
          this.util.userInfo = data.data[0];
          // this.navCtrl.back();
        } else {
          // this.navCtrl.back();
        }
        this.addCard = false;
        this.getCards();
      }, error => {
        console.log(error);
      });
    }, error => {
      this.util.stop();
      console.log(error);
      this.util.toast('error', this.util.getString('Error'), this.util.getString('Something went wrong'));
    });
  }

  getTime(time) {
    return moment(time).format('LLLL');
  }

  selectedOffers(item) {
    console.log(item);
    const min = parseFloat(item.min);
    if (this.cart.totalPrice >= min) {
      this.cart.coupon = item;
      // this.util.publishCoupon(item);
      this.cart.calcuate();
      console.log(this.cart.discount);
      this.offersModal.hide();
    } else {
      console.log('not valid with minimum amout', min);
      this.util.toast('error', this.util.getString('Error'), this.util.getString('Sorry') + ' ' + this.util.getString('minimum cart value must be')
        + min + ' ' + this.util.getString('or equal'));
    }
  }
}
