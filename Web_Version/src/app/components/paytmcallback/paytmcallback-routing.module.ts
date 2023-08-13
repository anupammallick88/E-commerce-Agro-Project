/*
Authors : Anupam Mallick
Website : 
App Name : Agro Web App
Created : 20-Nov-2021
*/
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PaytmcallbackComponent } from './paytmcallback.component';


const routes: Routes = [
  {
    path: '',
    component: PaytmcallbackComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PaytmcallbackRoutingModule { }
