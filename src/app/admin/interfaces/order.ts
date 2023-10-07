import { Product } from "./product.interface";

export interface Order {
  id:       number;
  userId:   number;
  userName: string;
  quantity: number;
  products: Product[];
}
