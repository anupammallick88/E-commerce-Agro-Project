/*
Authors : Anupam Mallick
Website : 
App Name : Agro Web App
Created : 20-Nov-2021
*/
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { InstamojocallbackRoutingModule } from './instamojocallback-routing.module';
import { InstamojocallbackComponent } from './instamojocallback.component';


@NgModule({
  declarations: [InstamojocallbackComponent],
  imports: [
    CommonModule,
    InstamojocallbackRoutingModule
  ]
})
export class InstamojocallbackModule { }
