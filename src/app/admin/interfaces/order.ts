import { Product } from "./product.interface";

export interface Order {
  id:       number;
  userId:   number;
  userName: string;
  products: Product[];
}
