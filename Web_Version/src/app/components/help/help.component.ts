/*
Authors : Anupam Mallick
Website : 
App Name : Agro Web App
Created : 20-Nov-2021
*/
import { Component, OnInit } from '@angular/core';
import { UtilService } from 'src/app/services/util.service';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-help',
  templateUrl: './help.component.html',
  styleUrls: ['./help.component.scss']
})
export class HelpComponent implements OnInit {
  content: any;
  loaded: boolean;
  constructor(
    private api: ApiService,
    public util: UtilService
  ) {
    const param = {
      id: 5
    };
    this.loaded = false;
    this.api.post('pages/getById', param).subscribe((data: any) => {
      console.log(data);
      this.loaded = true;
      if (data && data.status === 200 && data.data.length > 0) {
        const info = data.data[0];
        this.content = info.content;
      }
    }, error => {
      console.log(error);
      this.loaded = true;
      this.util.toast('error', this.util.getString('Error'), this.util.getString('Something went wrong'));
    });
  }

  ngOnInit(): void {
  }


  getContent() {
    return this.content;
  }

}
