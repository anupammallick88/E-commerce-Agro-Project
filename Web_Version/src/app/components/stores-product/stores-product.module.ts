/*
Authors : Anupam Mallick
Website : 
App Name : Agro Web App
Created : 20-Nov-2021
*/
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StoresProductRoutingModule } from './stores-product-routing.module';
import { StoresProductComponent } from './stores-product.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { MDBBootstrapModule } from 'angular-bootstrap-md';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
@NgModule({
  declarations: [StoresProductComponent],
  imports: [
    CommonModule,
    StoresProductRoutingModule,
    SharedModule,
    MDBBootstrapModule.forRoot(),
    NgbModule
  ]
})
export class StoresProductModule { }
