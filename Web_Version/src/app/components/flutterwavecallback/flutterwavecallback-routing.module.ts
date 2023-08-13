/*
Authors : Anupam Mallick
Website : 
App Name : Agro Web App
Created : 20-Nov-2021
*/
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FlutterwavecallbackComponent } from './flutterwavecallback.component';


const routes: Routes = [
  {
    path: '',
    component: FlutterwavecallbackComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FlutterwavecallbackRoutingModule { }
