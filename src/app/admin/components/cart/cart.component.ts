import { Component } from '@angular/core';
import { Product } from '../../interfaces/product.interface';
import { CartService } from '../../services/cart.service';
import { API_URL } from 'src/app/constants/api';
import { UserService } from 'src/app/home/services/user.service';
import { CreateOrderDTO } from '../../interfaces/createOrderDTO.interface';
import { OrderService } from '../../services/order.service';
import { User } from 'src/app/home/interfaces/user.interface';
import { MainDTO } from 'src/app/home/interfaces/paginacionDTO';
import { userDTO } from 'src/app/home/interfaces/userDTO';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent {
  cartItems: Product[] = [];
  users: userDTO[] = [];
  selectedUserId: number | null = null;
  orderCompleted: boolean = false;

  constructor(private cartService: CartService, private userService: UserService, private orderService: OrderService) { }

  ngOnInit(): void {
    this.loadUsers();
    this.cartService.getCartItems().subscribe(products => {
      this.cartItems = products;
    });
  }

  loadUsers() {
    this.userService.getUsers(50, 1, 'asc').subscribe(response => {
      this.users = response.data;
    });
  }

  selectUser(userId: number) {
    this.selectedUserId = userId;
  }

  removeFromCart(index: number): void {
    this.cartService.removeFromCart(index);
  }

  clearCart(): void {
    this.cartService.clearCart();
  }

  getProductImageUrl(relativePath: string): string {
    return API_URL + relativePath;
  }

  increaseQuantity(index: number): void {
    const product = this.cartItems[index];
    if (product) {
      product.quantity = (product.quantity || 0) + 1;
    }
  }

  decreaseQuantity(index: number): void {
    const product = this.cartItems[index];
    if (product && product.quantity) {
      if (product.quantity > 1) {
        product.quantity -= 1;
      } else {
        this.removeFromCart(index);
      }
    }
  }

  getTotalToPay(): number {
    return this.cartItems.reduce((total, product) => {
      return total + ((product.precio ?? 0) * (product.quantity ?? 1));
    }, 0);
  }


  placeOrder() {
    if (!this.selectedUserId || this.cartItems.length === 0) {
        console.error('Debes seleccionar un usuario y tener productos en el carrito.');
        return;
    }

    const productsData = this.cartItems.map(item => ({
      productId: item.id,
      quantity: item.quantity ?? 1
  }));

  const orderData: CreateOrderDTO = {
      userId: this.selectedUserId,
      products: productsData
  };

    this.orderService.createOrder(orderData).subscribe(
        response => {
            console.log('Orden creada con éxito:', response);
            this.orderCompleted = true;
            setTimeout(() => this.orderCompleted = false, 5000);
            this.clearCart();
        },
        error => {
            console.error('Error al crear la orden:', error);
            this.orderCompleted = false;
        }
    );
}

}

