export interface CreateOrderDTO {
  userId: number;
  products: { productId: number, quantity: number }[];
}
