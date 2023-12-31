/*
Authors : Anupam Mallick
Website : 
App Name : Agro Web App
Created : 20-Nov-2021
*/
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HelpRoutingModule } from './help-routing.module';
import { HelpComponent } from './help.component';
import { SharedModule } from 'src/app/shared/shared.module';


@NgModule({
  declarations: [HelpComponent],
  imports: [
    CommonModule,
    HelpRoutingModule,
    SharedModule
  ]
})
export class HelpModule { }
