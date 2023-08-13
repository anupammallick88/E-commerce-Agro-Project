/*
Authors : Anupam Mallick
Website : 
App Name : Agro Web App
Created : 20-Nov-2021
*/
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TopStoreRoutingModule } from './top-store-routing.module';
import { TopStoreComponent } from './top-store.component';
import { SharedModule } from 'src/app/shared/shared.module';


@NgModule({
  declarations: [TopStoreComponent],
  imports: [
    CommonModule,
    TopStoreRoutingModule,
    SharedModule
  ]
})
export class TopStoreModule { }
