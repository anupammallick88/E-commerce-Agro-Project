/*
Authors : Anupam Mallick
Website : 
App Name : Agro Web App
Created : 20-Nov-2021
*/
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';
import { forkJoin } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class ApiService {
  baseUrl: any = '';
  mediaURL: any = '';
  constructor(
    private http: HttpClient,
  ) {
    this.baseUrl = environment.baseURL;
    this.mediaURL = environment.mediaURL;
  }


  alerts(title, message, type) {
    Swal.fire(
      title,
      message,
      type
    );
  }

  uploadFile(files: File[]) {
    const formData = new FormData();
    Array.from(files).forEach(f => formData.append('userfile', f));
    return this.http.post(this.baseUrl + 'users/upload_image', formData);
  }

  getCurrencyCode() {
    return environment.general.code;
  }

  getCurrecySymbol() {
    return environment.general.symbol;
  }

  createOrderNotification(stores) {
    const ids = [...new Set(stores.map(item => item.token))];
    const apiCalls = [];
    ids.forEach(element => {
      apiCalls.push(this.sendNotification('You have received new order', 'New Order Received', element));
    });
    forkJoin(apiCalls).subscribe((data) => {
      console.log('fork result', data);
    }, error => {
      console.log('fork error', error);
    });

  }

  sendNotification(msg, title, id) {
    const body = {
      app_id: environment.onesignal.appId,
      include_player_ids: [id],
      headings: { en: title },
      contents: { en: msg },
      data: { task: msg }
    };
    const header = {
      headers: new HttpHeaders()
        .set('Content-Type', 'application/json')
        .set('Authorization', `Basic ${environment.onesignal.restKey}`)
    };
    return this.http.post('https://onesignal.com/api/v1/notifications', body, header);
  }

  JSON_to_URLEncoded(element, key?, list?) {
    let new_list = list || [];
    if (typeof element === 'object') {
      for (let idx in element) {
        this.JSON_to_URLEncoded(
          element[idx],
          key ? key + '[' + idx + ']' : idx,
          new_list
        );
      }
    } else {
      new_list.push(key + '=' + encodeURIComponent(element));
    }
    return new_list.join('&');
  }


  post(url, body) {
    const header = {
      headers: new HttpHeaders()
        .set('Content-Type', 'application/x-www-form-urlencoded')
        .set('Basic', `${environment.authToken}`)
    };
    const param = this.JSON_to_URLEncoded(body);
    console.log(param);
    return this.http.post(this.baseUrl + url, param, header);
  }

  externalPost(url, body, key) {
    const header = {
      headers: new HttpHeaders()
        .set('Content-Type', 'application/x-www-form-urlencoded')
        .set('X-Api-Key', `Bearer ${key}`)
    };
    const order = this.JSON_to_URLEncoded(body);
    console.log(order);
    return this.http.post(url, order, header);
  }

  externalPost2(url, body) {
    const header = {
      headers: new HttpHeaders()
        .set('Content-Type', 'application/x-www-form-urlencoded')
    };
    const order = this.JSON_to_URLEncoded(body);
    console.log(order);
    return this.http.post(url, order, header);
  }

  instaPay(url, body, key, token) {
    const header = {
      headers: new HttpHeaders()
        .set('Content-Type', 'application/x-www-form-urlencoded')
        .set('X-Api-Key', key)
        .set('X-Auth-Token', token)
    };
    const order = this.JSON_to_URLEncoded(body);
    console.log(order);
    return this.http.post(url, order, header);
  }
  get(url) {
    const header = {
      headers: new HttpHeaders()
        .set('Content-Type', 'application/x-www-form-urlencoded')
        .set('Basic', `${environment.authToken}`)
    };
    return this.http.get(this.baseUrl + url, header);
  }

  externalGet(url) {
    return this.http.get(url);
  }

  httpGet(url, key) {
    const header = {
      headers: new HttpHeaders()
        .set('Content-Type', 'application/x-www-form-urlencoded')
        .set('Authorization', `Bearer ${key}`)
    };

    return this.http.get(url, header);
  }
}
