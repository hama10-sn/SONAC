import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { NgxAuthRoutingModule } from './auth-routing.module';
import { NbAuthModule } from '@nebular/auth';
import {
  NbAlertModule,
  NbButtonModule,
  NbCheckboxModule,
  NbInputModule,
} from '@nebular/theme';

import { NgxLoginComponent } from './login/login.component';
import { ForgetPwdComponent } from './login/forget-pwd/forget-pwd.component';
import { ResetPwdComponent } from './login/reset-pwd/reset-pwd.component';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    NbAlertModule,
    NbInputModule,
    NbButtonModule,
    NbCheckboxModule,
    NgxAuthRoutingModule,

    NbAuthModule,
  ],
  declarations: [
    // ... here goes our new components
    NgxLoginComponent,
    ForgetPwdComponent,
    ResetPwdComponent,
  ],
})
export class NgxAuthModule {
}
