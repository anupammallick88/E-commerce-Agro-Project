/*
Authors : Anupam Mallick
Website : 
App Name : Agro Web App
Created : 20-Nov-2021
*/
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PaytmcallbackRoutingModule } from './paytmcallback-routing.module';
import { PaytmcallbackComponent } from './paytmcallback.component';


@NgModule({
  declarations: [PaytmcallbackComponent],
  imports: [
    CommonModule,
    PaytmcallbackRoutingModule
  ]
})
export class PaytmcallbackModule { }
