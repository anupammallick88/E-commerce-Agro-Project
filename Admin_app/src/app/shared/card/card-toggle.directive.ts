/*
  Authors : Anupam Mallick
  Website : 
  App Name : Agro App
  Created : 10-Sep-2021
  
*/
import { Directive, ElementRef, HostListener } from "@angular/core";

@Directive({
    selector: '[cardToggleEvent]'
})
export class CardToggleDirective {
    constructor(private el: ElementRef) { }

    @HostListener('click', ['$event'])
    onToggle($event: any) {
        $event.preventDefault();
        this.el.nativeElement.classList.toggle('icon-up');
    }
}