/*
Authors : Anupam Mallick
Website : 
App Name : Agro Web App
Created : 20-Nov-2021
*/
import { NavigationExtras, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { UtilService } from 'src/app/services/util.service';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {
  terms: any = '';
  products: any[] = [];
  constructor(
    public util: UtilService,
    public api: ApiService,
    private router: Router
  ) { }

  ngOnInit(): void {
  }
  search(event) {
    console.log(event);
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

  openProduct(item) {
    const param: NavigationExtras = {
      queryParams: {
        id: item.id
      }
    };
    this.router.navigate(['product-detail'], param);
  }
}
