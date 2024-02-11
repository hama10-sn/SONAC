import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from '../home.component';
import { AcceuilComponent } from './acceuil/acceuil.component';

const routes: Routes = [{

  path: '',
  component: HomeComponent,
  children: [{
    path: 'acceuil',
      component: AcceuilComponent,
      pathMatch: 'full',
  }],



}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProductionProjectRoutingModule { }
