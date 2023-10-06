import { Component, OnInit } from '@angular/core';
import { Order } from '../../interfaces/order';
import { OrderService } from '../../services/order.service';
import { API_URL } from 'src/app/constants/api';

@Component({
  selector: 'app-order-crud',
  templateUrl: './order-crud.component.html',
  styleUrls: ['./order-crud.component.css']
})
export class OrderCrudComponent implements OnInit{

  orders: Order[] = [];
  defaultImageUrl = 'path_to_default_image'; // Reemplaza con la ruta de tu imagen predeterminada

  constructor(private orderService: OrderService) { }

  ngOnInit(): void {
    this.getOrders();
  }

  getOrders(): void {
    this.orderService.getOrders().subscribe(data => {
      this.orders = data;
    });
  }

  getProductImageUrl(relativePath: string | null): string {
    if (relativePath) {
        return API_URL + relativePath;
    } else {
        return 'path_to_default_image'; // Proporciona una imagen predeterminada si el producto no tiene una imagen.
    }
}



  openAddProductModal(): void {}
}
