/*
  Authors : Anupam Mallick
  Website : 
  App Name : Agro App
  Created : 10-Sep-2021
  
*/
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ManageBannersRoutingModule } from './manage-banners-routing.module';
import { ManageBannersComponent } from './manage-banners.component';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [ManageBannersComponent],
  imports: [
    CommonModule,
    ManageBannersRoutingModule,
    SharedModule,
  ]
})
export class ManageBannersModule { }
