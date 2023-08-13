/*
  Authors : Anupam Mallick
  Website : 
  App Name : Agro App
  Created : 10-Sep-2021
  
*/
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ManageProductsRoutingModule } from './manage-products-routing.module';
import { ManageProductsComponent } from './manage-products.component';
import { SharedModule } from 'src/app/shared/shared.module';


@NgModule({
  declarations: [ManageProductsComponent],
  imports: [
    CommonModule,
    ManageProductsRoutingModule,
    SharedModule
  ]
})
export class ManageProductsModule { }
