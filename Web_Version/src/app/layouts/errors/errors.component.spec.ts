/*
Authors : Anupam Mallick
Website : 
App Name : Agro Web App
Created : 20-Nov-2021
*/
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ErrorsComponent } from './errors.component';

describe('ErrorsComponent', () => {
  let component: ErrorsComponent;
  let fixture: ComponentFixture<ErrorsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ErrorsComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ErrorsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
