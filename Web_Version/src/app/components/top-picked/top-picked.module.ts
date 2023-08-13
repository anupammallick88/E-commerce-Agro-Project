/*
Authors : Anupam Mallick
Website : 
App Name : Agro Web App
Created : 20-Nov-2021
*/
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TopPickedRoutingModule } from './top-picked-routing.module';
import { TopPickedComponent } from './top-picked.component';
import { SharedModule } from 'src/app/shared/shared.module';

import { MDBBootstrapModule } from 'angular-bootstrap-md';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { SwiperModule } from 'ngx-swiper-wrapper';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
@NgModule({
  declarations: [TopPickedComponent],
  imports: [
    CommonModule,
    TopPickedRoutingModule,
    SharedModule,
    MDBBootstrapModule.forRoot(),
    NgxSkeletonLoaderModule,
    SwiperModule,
    FormsModule,
    NgbModule,
  ]
})
export class TopPickedModule { }
