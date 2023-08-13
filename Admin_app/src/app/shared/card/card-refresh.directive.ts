/*
  Authors : Anupam Mallick
  Website : 
  App Name : Agro App
  Created : 10-Sep-2021
  
*/
import { Directive, HostListener, ElementRef } from '@angular/core';

@Directive({
    selector: '[cardRefresh]'
})
export class CardRefreshDirective {

    constructor(private el: ElementRef) { }
    @HostListener('mouseenter') open() {
        this.el.nativeElement.classList.add('rotate-refresh');
    }

    @HostListener('mouseleave') close() {
        this.el.nativeElement.classList.remove('rotate-refresh');
    }
}