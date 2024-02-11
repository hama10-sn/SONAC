import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProductionProjectRoutingModule } from './production-project-routing.module';
import { AcceuilComponent } from './acceuil/acceuil.component';


@NgModule({
  declarations: [AcceuilComponent],
  imports: [
    CommonModule,
    ProductionProjectRoutingModule
  ]
})
export class ProductionProjectModule { }
