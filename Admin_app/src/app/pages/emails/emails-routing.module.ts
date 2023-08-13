/*
  Authors : Anupam Mallick
  Website : 
  App Name : Agro App
  Created : 10-Sep-2021
  
*/
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EmailsComponent } from './emails.component';


const routes: Routes = [
  {
    path: '',
    component: EmailsComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EmailsRoutingModule { }
