import { Component, OnInit } from '@angular/core';
import { Product } from '../../interfaces/product.interface';
import { ProductsService } from '../../services/products.service';
import { API_URL } from 'src/app/constants/api';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { CreateProductDTO } from '../../interfaces/createProductDTO.interface';
import { UpdateProductDTO } from '../../interfaces/updateProductDTO.interface';

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
  showDeleteProductModal: boolean = false;
  toDeleteProductIndex: number | null = null;
  deleteOperationSuccess: boolean = false;
  deleteOperationError: boolean = false;
  selectedProductIndex: number | null = null;
  selectedProductImage: string | null = null;
  editOperationSuccess: boolean = false;
  operationSuccess: boolean = false;
  operationError: boolean = false;
  isLoading: boolean = false;
  isEditMode: boolean = false;


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
  getProducts(): void {
    this.productService.getProducts().subscribe(data => {
      this.products = data;
    });
  }

  getProductImageUrl(relativePath: string): string {
    return API_URL + relativePath;
  }

  hasError(controlName: string, errorName: string): boolean {
    return this.productForm.get(controlName)?.touched &&
      this.productForm.get(controlName)?.hasError(errorName) || false;
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
    this.productForm.markAllAsTouched();

    if (!this.productForm.valid) {
      return;
    }

    if (this.selectedProductIndex !== null) {
      const productToUpdate: UpdateProductDTO = {
        nombre: this.productForm.get('productName')?.value!,
        precio: +this.productForm.get('productPrice')?.value!,
        imageFile: this.newProductImage ? this.newProductImage : undefined
      };

      this.productService.updateProduct(this.products[this.selectedProductIndex].id, productToUpdate).subscribe({
        next: (updatedProduct) => {
          this.products[this.selectedProductIndex!] = updatedProduct;

          // Dependiendo del modo, setea la variable correspondiente para el mensaje de éxito
          if (this.isEditMode) {
            this.editOperationSuccess = true;
            setTimeout(() => {
              this.editOperationSuccess = false;
            }, 3000);
          } else {
            this.operationSuccess = true;
            setTimeout(() => {
              this.operationSuccess = false;
            }, 3000);
          }

          this.getProducts();
          this.closeModal();
        },
        error: (error) => {
          console.error('Error:', error);
          this.operationError = true;
          setTimeout(() => {
            this.operationError = false;
          }, 3000);
          this.closeModal();
        }
      });
    }else {

      const productName = this.productForm.get('productName')?.value ?? '';
      const productPrice = +this.productForm.get('productPrice')?.value! ?? 0;

      const productDto: CreateProductDTO = {
        nombre: productName,
        precio: productPrice,
        imageFile: this.newProductImage
      };

      this.isLoading = true;
      this.productService.createProduct(productDto).subscribe(
        (newProduct) => {
          this.getProducts();
          this.closeModal();
          this.finalizeOperation(true); // Llama a finalizeOperation en lugar de cambiar las variables directamente
        },
        (error) => {
          console.error('There was an error while creating the product:', error);
          this.finalizeOperation(false);
        }
      );
    }
  }

  populateProductForm(product: Product): void {
    this.productForm.setValue({
      productName: product.nombre,
      productPrice: product.precio.toString(),
      productImage: null
    });

    this.selectedProductImage = this.getProductImageUrl(product.image.url);
  }

  openEditProductModal(index: number): void {
    if (index >= 0 && index < this.products.length) {
        this.selectedProductIndex = index;
        this.populateProductForm(this.products[index]);
        this.removeProductImageValidator();
        this.isModalOpen = true;
        this.isEditMode = true;
    } else {
        console.error("Índice de producto inválido:", index);
    }
}

  confirmDeleteProduct(): void {
    if (this.toDeleteProductIndex !== null &&
        this.toDeleteProductIndex >= 0 &&
        this.toDeleteProductIndex < this.products.length) {

      const product = this.products[this.toDeleteProductIndex];

      if(product) {
        const productId = product.id;

        this.productService.deleteProduct(productId).subscribe({
          next: () => {
            if (this.toDeleteProductIndex !== null) {
              this.products.splice(this.toDeleteProductIndex, 1);
              this.toDeleteProductIndex = null;
              this.deleteOperationSuccess = true;
              setTimeout(() => {
                this.deleteOperationSuccess = false;
              }, 3000);
            }
            this.closeDeleteProductModal();
          },
          error: (error) => {
            console.error('Error eliminando producto:', error);
            this.deleteOperationError = true;
            setTimeout(() => {
              this.deleteOperationError = false;
            }, 3000);
            this.closeDeleteProductModal();
          },
        });

      } else {
        console.error('Producto no encontrado para el índice:', this.toDeleteProductIndex);
        this.closeDeleteProductModal();
      }

    } else {
      console.error('Índice de producto inválido:', this.toDeleteProductIndex);
      this.closeDeleteProductModal();
    }
  }



  openDeleteProductModal(index: number): void {
    if(index >= 0 && index < this.products.length) { // Verifica que el índice es válido
      this.toDeleteProductIndex = index;
      this.showDeleteProductModal = true;
    } else {
      console.error('Índice de producto inválido:', index);
    }
  }

  setProductImageValidator() {
    const control = this.productForm.get('productImage');
    control?.setValidators([Validators.required]);
    control?.updateValueAndValidity(); // esto es para que la validación sea recalculada
}

removeProductImageValidator() {
    const control = this.productForm.get('productImage');
    control?.clearValidators();
    control?.updateValueAndValidity(); // esto es para que la validación sea recalculada
}



  closeDeleteProductModal(): void {
    this.showDeleteProductModal = false;
    this.toDeleteProductIndex = null;
  }

  openAddProductModal(): void {
    this.isEditMode = false;
    this.productForm.reset();
    this.newProductImage = null;
    this.selectedProductIndex = null;
    this.setProductImageValidator();
    this.isModalOpen = true;
}


closeModal(): void {
  this.isModalOpen = false;
  this.productForm.reset();
  this.newProductImage = null;
  this.selectedProductIndex = null;
  this.selectedProductImage = null;
  this.setProductImageValidator(); // Establecer el validador aquí también
}

  finalizeOperation(success: boolean): void {
    this.isLoading = false;
    this.operationSuccess = success;
    this.operationError = !success;
    this.getProducts();


    setTimeout(() => {
      this.operationSuccess = false;
      this.operationError = false;
    }, 3000);
  }

}
