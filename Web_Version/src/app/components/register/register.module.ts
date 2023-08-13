import { FormsModule } from '@angular/forms';
/*
Authors : Anupam Mallick
Website : 
App Name : Agro Web App
Created : 20-Nov-2021
*/
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RegisterRoutingModule } from './register-routing.module';
import { RegisterComponent } from './register.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { NgOtpInputModule } from 'ng-otp-input';
import { MDBBootstrapModule } from 'angular-bootstrap-md';


@NgModule({
  declarations: [RegisterComponent],
  imports: [
    CommonModule,
    RegisterRoutingModule,
    SharedModule,
    NgOtpInputModule,
    MDBBootstrapModule.forRoot(),
    FormsModule,
  ]
})
export class RegisterModule { }
