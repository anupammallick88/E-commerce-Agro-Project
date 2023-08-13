/*
Authors : Anupam Mallick
Website : 
App Name : Agro Web App
Created : 20-Nov-2021
*/
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SubcatsRoutingModule } from './subcats-routing.module';
import { SubcatsComponent } from './subcats.component';
import { MDBBootstrapModule } from 'angular-bootstrap-md';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { SharedModule } from 'src/app/shared/shared.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
@NgModule({
  declarations: [SubcatsComponent],
  imports: [
    CommonModule,
    SubcatsRoutingModule,
    NgxSkeletonLoaderModule,
    MDBBootstrapModule.forRoot(),
    SharedModule,
    NgbModule
  ]
})
export class SubcatsModule { }
