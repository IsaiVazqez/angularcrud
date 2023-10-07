import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { API_URL } from 'src/app/constants/api';
import { Order } from '../interfaces/order';
import { Observable } from 'rxjs';
import { CreateOrderDTO } from '../interfaces/createOrderDTO.interface';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  constructor(private http: HttpClient) { }

  getOrders(): Observable<Order[]>{
    return this.http.get<Order[]>(`${API_URL}/orders`);
  }

  createOrder(orderData: CreateOrderDTO): Observable<any> {
    return this.http.post(`${API_URL}/orders`, orderData);
  }


}
