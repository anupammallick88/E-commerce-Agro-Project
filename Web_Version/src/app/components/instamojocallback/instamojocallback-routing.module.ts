/*
Authors : Anupam Mallick
Website : 
App Name : Agro Web App
Created : 20-Nov-2021
*/
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { InstamojocallbackComponent } from './instamojocallback.component';


const routes: Routes = [
  {
    path: '',
    component: InstamojocallbackComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InstamojocallbackRoutingModule { }
