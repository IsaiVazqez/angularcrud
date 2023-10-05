import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomePageComponent } from './home/pages/home-page/home-page.component';
import { ProfileComponent } from './home/components/profile/profile.component';

const routes: Routes = [
  { path: '', component: HomePageComponent },
  { path: 'userprofile/:id', component: ProfileComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
