import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { AdminPageComponent } from '../../pages/admin-page/admin-page.component';
import { ProductCrudComponent } from '../../components/product-crud/product-crud.component';
import { ProfileComponent } from 'src/app/home/components/profile/profile.component';
import { HomePageComponent } from 'src/app/home/pages/home-page/home-page.component';
import { OrderCrudComponent } from '../../components/order-crud/order-crud.component';


const routes: Routes = [
  {
    path: '',
    component: AdminPageComponent,
    children: [
      { path: 'products', component: ProductCrudComponent },
      { path: 'orders', component: OrderCrudComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
