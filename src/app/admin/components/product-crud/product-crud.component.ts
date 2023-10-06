import { Component, OnInit } from '@angular/core';
import { Product } from '../../interfaces/product.interface';
import { ProductsService } from '../../services/products.service';
import { API_URL } from 'src/app/constants/api';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-product-crud',
  templateUrl: './product-crud.component.html',
  styleUrls: ['./product-crud.component.css']
})
export class ProductCrudComponent implements OnInit {
  products: Product[] = [];
  isModalOpen = false;
  newProductPrice = 0;
  newProductName = '';
  newProductImage: any;


  public productForm = new FormGroup({
    productName: new FormControl('', [Validators.required, Validators.minLength(3)]),
    productPrice: new FormControl('', [Validators.required, Validators.min(1)]),
    productImage: new FormControl('', [Validators.required]),

});




  constructor(private productService: ProductsService) {
    this.newProductName = '';
  }

  ngOnInit(): void {
    this.getProducts();
  }

  hasError(controlName: string, errorName: string): boolean {
    return this.productForm.get(controlName)?.touched &&
           this.productForm.get(controlName)?.hasError(errorName) || false;
  }


  getProducts(): void {
    this.productService.getProducts().subscribe(data => {
      this.products = data;
    });
  }

  getProductImageUrl(relativePath: string): string {
    return API_URL + relativePath;
  }

  onImageSelected(event: any): void {
    if (event.target.files && event.target.files.length) {
        this.newProductImage = event.target.files[0];
        this.productForm.patchValue({ productImage: 'selected' });
    } else {
        this.newProductImage = null;
        this.productForm.patchValue({ productImage: null });
    }
}
saveProduct(): void {
  if (this.productForm.invalid) {
      this.productForm.markAllAsTouched();
      return;
  }
  // Aquí irá la lógica para guardar el producto cuando estés listo para implementarla.
}

  openAddProductModal() {
    console.log('openAddProductModal');
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
  }
}
