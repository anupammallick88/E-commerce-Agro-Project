/*
Authors : Anupam Mallick
Website : 
App Name : Agro Web App
Created : 20-Nov-2021
*/
import { Component, OnInit } from '@angular/core';
import { Router, NavigationExtras, ActivatedRoute } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { UtilService } from 'src/app/services/util.service';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.scss']
})
export class CategoriesComponent implements OnInit {

  bottomcategory: any[] = [];
  dummyBottomCates = Array(2);
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    public api: ApiService,
    public util: UtilService) {
    this.getCategorys();
  }

  ngOnInit(): void {

  }

  getCategorys() {
    this.api.get('categories').subscribe((datas: any) => {
      console.log('categories', datas);
      const cates = [];
      if (datas && datas.data && datas.data.length) {
        datas.data.forEach(element => {
          if (element.status === '1') {

            const data = {
              id: element.id,
              name: element.name,
              cover: element.cover,
              subCates: []
            };
            cates.push(data);
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
        this.dummyBottomCates = [];
      }
    }, error => {
      console.log(error);
      this.util.toast('error', this.util.getString('Error'), this.util.getString('Something went wrong'));
      this.dummyBottomCates = [];
    });
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
}
