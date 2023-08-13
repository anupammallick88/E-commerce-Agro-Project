/*
  Authors : Anupam Mallick
  Website : 
  App Name : Agro App
  Created : 10-Sep-2021
  
*/
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SendEmailRoutingModule } from './send-email-routing.module';
import { SendEmailComponent } from './send-email.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { CKEditorModule } from 'ng2-ckeditor';

@NgModule({
  declarations: [SendEmailComponent],
  imports: [
    CommonModule,
    SendEmailRoutingModule,
    SharedModule,
    CKEditorModule
  ]
})
export class SendEmailModule { }
