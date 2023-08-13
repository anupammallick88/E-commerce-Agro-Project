/*
   Authors : Anupam Mallick
  Website : 
  App Name : Agro Store Web App
  Created : 10-Dec-2021
  
*/
import { Directive, HostListener } from '@angular/core';

import * as screenfull from 'screenfull';

@Directive({
  selector: '[appToggleFullscreen]'
})
export class ToggleFullscreenDirective {

  @HostListener('click') onClick() {
    if (screenfull.enabled) {
      screenfull.toggle();
    }
  }
}
