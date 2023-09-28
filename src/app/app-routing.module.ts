import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserprofileComponent } from './components/userprofile/userprofile.component';
import { CrudComponent } from './components/crud/crud.component';

const routes: Routes = [
  { path: '', component: CrudComponent },
  { path: 'userprofile/:id', component: UserprofileComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
