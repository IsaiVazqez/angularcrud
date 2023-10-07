import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Product } from '../interfaces/product.interface';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartItemsSubject: BehaviorSubject<Product[]> = new BehaviorSubject<Product[]>([]);

  constructor() {}

  getCartItems(): Observable<Product[]> {
    return this.cartItemsSubject.asObservable();
  }

  addToCart(product: Product): void {
    const currentItems = this.cartItemsSubject.getValue();
    const foundProduct = currentItems.find(p => p.id === product.id);

    if (foundProduct) {
      foundProduct.quantity = (foundProduct.quantity || 0) + 1;
    } else {
      product.quantity = 1;
      currentItems.push(product);
    }
    this.cartItemsSubject.next(currentItems);
  }


  removeFromCart(index: number): void {
    const currentItems = this.cartItemsSubject.getValue();
    currentItems.splice(index, 1);
    this.cartItemsSubject.next(currentItems);
  }

  clearCart(): void {
    this.cartItemsSubject.next([]);
  }
}
