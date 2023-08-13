import { DriverStatsComponent } from './driver-stats.component';
/*
  Authors : Anupam Mallick
  Website : 
  App Name : Agro App
  Created : 10-Sep-2021
  
*/
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';


const routes: Routes = [
  {
    path: '',
    component: DriverStatsComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DriverStatsRoutingModule { }
