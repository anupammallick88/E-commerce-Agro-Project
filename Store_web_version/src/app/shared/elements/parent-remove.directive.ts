/*
   Authors : Anupam Mallick
  Website : 
  App Name : Agro Store Web App
  Created : 10-Dec-2021
  
*/
import { ElementRef, Directive, HostListener } from "@angular/core";
@Directive({
    selector: '[parentRemove]'
})
export class ParentRemoveDirective {
    alert_parent: any;
    constructor(private elements: ElementRef) { }

    @HostListener('click', ['$event'])
    onToggle($event: any) {
        $event.preventDefault();
        this.alert_parent = (this.elements).nativeElement.parentElement;
        this.alert_parent.remove();
    }
}