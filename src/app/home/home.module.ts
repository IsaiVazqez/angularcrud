import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomePageComponent } from './pages/home-page/home-page.component';
import { CrudComponent } from './components/crud/crud.component';
import { ModalComponent } from './components/modal/modal.component';
import { ProfileComponent } from './components/profile/profile.component';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from '../app-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { UserService } from './services/user.service';

@NgModule({
  declarations: [
    HomePageComponent,
    CrudComponent,
    ModalComponent,
    ProfileComponent,

  ],
  exports: [
    HomePageComponent,
    CrudComponent,
    ModalComponent,
    ProfileComponent,

  ],
  imports: [
    CommonModule,
    AppRoutingModule,
    FormsModule,
    NgbModule,
    ReactiveFormsModule,
    HttpClientModule,
    BrowserAnimationsModule,

  ]
})
export class HomeModule { }
