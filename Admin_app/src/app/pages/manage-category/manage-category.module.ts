/*
  Authors : Anupam Mallick
  Website : 
  App Name : Agro App
  Created : 10-Sep-2021
  
*/
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ManageCategoryRoutingModule } from './manage-category-routing.module';
import { ManageCategoryComponent } from './manage-category.component';
import { SharedModule } from 'src/app/shared/shared.module';


@NgModule({
  declarations: [ManageCategoryComponent],
  imports: [
    CommonModule,
    ManageCategoryRoutingModule,
    SharedModule
  ]
})
export class ManageCategoryModule { }
