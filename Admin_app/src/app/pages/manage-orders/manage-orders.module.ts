/*
  Authors : Anupam Mallick
  Website : 
  App Name : Agro App
  Created : 10-Sep-2021
  
*/
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ManageOrdersRoutingModule } from './manage-orders-routing.module';
import { ManageOrdersComponent } from './manage-orders.component';
import { SharedModule } from 'src/app/shared/shared.module';


@NgModule({
  declarations: [ManageOrdersComponent],
  imports: [
    CommonModule,
    ManageOrdersRoutingModule,
    SharedModule
  ]
})
export class ManageOrdersModule { }
