/*
  Authors : Anupam Mallick
  Website : 
  App Name : Agro App
  Created : 10-Sep-2021
  
*/
import { trigger, state, style, AUTO_STYLE, transition, animate } from "@angular/animations";

export const cardToggle = trigger('cardToggle', [
    state('collapsed, void',
        style({
            overflow: 'hidden',
            height: '0px',
        })
    ),
    state('expanded',
        style({
            height: AUTO_STYLE,
        })
    ),
    transition('collapsed <=> expanded', [
        animate('400ms ease-in-out')
    ])
]);

export const cardClose = trigger("cardClose", [
    state("open", style({
        opacity: 1
    })),
    state("closed", style({
        opacity: 0,
        display: 'none'
    })),
    transition("open <=> closed", animate("400ms")),
])