/*
Authors : Anupam Mallick
Website : 
App Name : Agro Web App
Created : 20-Nov-2021
*/
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RefundPolicyRoutingModule } from './refund-policy-routing.module';
import { RefundPolicyComponent } from './refund-policy.component';
import { MDBBootstrapModule } from 'angular-bootstrap-md';
import { SharedModule } from 'src/app/shared/shared.module';


@NgModule({
  declarations: [RefundPolicyComponent],
  imports: [
    CommonModule,
    RefundPolicyRoutingModule,
    MDBBootstrapModule.forRoot(),
    SharedModule
  ]
})
export class RefundPolicyModule { }
