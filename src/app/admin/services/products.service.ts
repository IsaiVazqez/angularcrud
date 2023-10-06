import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { Product } from '../interfaces/product.interface';
import { CreateProductDTO } from '../interfaces/createProductDTO.interface';
import { API_URL } from 'src/app/constants/api';
import { UpdateProductDTO } from '../interfaces/updateProductDTO.interface';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {

  constructor(private http: HttpClient) { }

  getProducts(): Observable<Product[]>{
    return this.http.get<Product[]>(`${API_URL}/products`);
  }

  createProduct(productDto: CreateProductDTO) {
    const formData: FormData = new FormData();
    formData.append('nombre', productDto.nombre);
    formData.append('precio', productDto.precio.toString());
    formData.append('imageFile', productDto.imageFile, productDto.imageFile.name);
    return this.http.post<Product>(`${API_URL}/products`, formData);
  }

  updateProduct(id: number, productDto: UpdateProductDTO) {
    const formData: FormData = new FormData();
    formData.append('nombre', productDto.nombre);
    formData.append('precio', productDto.precio.toString());
    if (productDto.imageFile !== undefined && productDto.imageFile !== null) {
      formData.append('imageFile', productDto.imageFile, productDto.imageFile.name);
  }

    return this.http.put<Product>(`${API_URL}/products/${id}`, formData);
}


  deleteProduct(id: number) {
    return this.http.delete(`${API_URL}/products/${id}`);
  }

}
