/*
  Authors : Anupam Mallick
  Website : 
  App Name : Agro App
  Created : 10-Sep-2021
  
*/
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ManageCityRoutingModule } from './manage-city-routing.module';
import { ManageCityComponent } from './manage-city.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { GooglePlaceModule } from 'ngx-google-places-autocomplete';

@NgModule({
  declarations: [ManageCityComponent],
  imports: [
    CommonModule,
    ManageCityRoutingModule,
    SharedModule,
    GooglePlaceModule,
  ]
})
export class ManageCityModule { }
