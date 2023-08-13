/*
  Authors : Anupam Mallick
  Website : 
  App Name : Agro App
  Created : 10-Sep-2021
  
*/
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AppWebRoutingModule } from './app-web-routing.module';
import { AppWebComponent } from './app-web.component';
import { SharedModule } from 'src/app/shared/shared.module';


@NgModule({
  declarations: [AppWebComponent],
  imports: [
    CommonModule,
    AppWebRoutingModule,
    SharedModule
  ]
})
export class AppWebModule { }
