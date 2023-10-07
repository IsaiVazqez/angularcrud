import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminPageComponent } from './pages/admin-page/admin-page.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ProductCrudComponent } from './components/product-crud/product-crud.component';
import { AdminRoutingModule } from './routes/admin-routing/admin-routing.module';
import { OrderCrudComponent } from './components/order-crud/order-crud.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CartComponent } from './components/cart/cart.component';

@NgModule({
  declarations: [
    AdminPageComponent,
    SidebarComponent,
    ProductCrudComponent,
    OrderCrudComponent,
    CartComponent
  ],
  exports: [
    AdminPageComponent,
    SidebarComponent
  ],
  imports: [
    CommonModule,
    FontAwesomeModule,
    AdminRoutingModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class AdminModule { }
