/*
Authors : Anupam Mallick
Website : 
App Name : Agro Web App
Created : 20-Nov-2021
*/
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FlutterwavecallbackRoutingModule } from './flutterwavecallback-routing.module';
import { FlutterwavecallbackComponent } from './flutterwavecallback.component';


@NgModule({
  declarations: [FlutterwavecallbackComponent],
  imports: [
    CommonModule,
    FlutterwavecallbackRoutingModule
  ]
})
export class FlutterwavecallbackModule { }
