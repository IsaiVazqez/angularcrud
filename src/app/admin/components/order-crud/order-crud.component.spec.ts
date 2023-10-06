import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderCrudComponent } from './order-crud.component';

describe('OrderCrudComponent', () => {
  let component: OrderCrudComponent;
  let fixture: ComponentFixture<OrderCrudComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [OrderCrudComponent]
    });
    fixture = TestBed.createComponent(OrderCrudComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
