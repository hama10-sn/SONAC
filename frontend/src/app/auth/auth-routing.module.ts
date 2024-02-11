import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NbAuthComponent } from '@nebular/auth';
import { ForgetPwdComponent } from './login/forget-pwd/forget-pwd.component';
import { NgxLoginComponent } from './login/login.component';
import { ResetPwdComponent } from './login/reset-pwd/reset-pwd.component';

export const routes: Routes = [
  // .. here goes our components routes
  {
    path: '',
    component: NbAuthComponent,
    children: [
        {
          path: 'login',
          component: NgxLoginComponent, // <---
        },
        {
          path: 'request-password',
          component: ForgetPwdComponent, // <---
        },

        {
          path: 'reset-password',
          component: ResetPwdComponent, // <---
        },
      ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NgxAuthRoutingModule {
}
