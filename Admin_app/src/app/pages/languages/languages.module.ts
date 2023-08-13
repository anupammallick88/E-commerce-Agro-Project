/*
  Authors : Anupam Mallick
  Website : 
  App Name : Agro App
  Created : 10-Sep-2021
  
*/
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LanguagesRoutingModule } from './languages-routing.module';
import { LanguagesComponent } from './languages.component';
import { SharedModule } from 'src/app/shared/shared.module';


@NgModule({
  declarations: [LanguagesComponent],
  imports: [
    CommonModule,
    LanguagesRoutingModule,
    SharedModule
  ]
})
export class LanguagesModule { }
