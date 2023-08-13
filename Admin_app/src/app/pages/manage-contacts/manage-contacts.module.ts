/*
  Authors : Anupam Mallick
  Website : 
  App Name : Agro App
  Created : 10-Sep-2021
  
*/
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ManageContactsRoutingModule } from './manage-contacts-routing.module';
import { ManageContactsComponent } from './manage-contacts.component';


@NgModule({
  declarations: [ManageContactsComponent],
  imports: [
    CommonModule,
    ManageContactsRoutingModule
  ]
})
export class ManageContactsModule { }
