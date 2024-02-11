import { ExtraOptions, RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import {
  NbAuthComponent,
  NbLoginComponent,
  NbLogoutComponent,
  NbRegisterComponent,
  NbRequestPasswordComponent,
  NbResetPasswordComponent,
} from '@nebular/auth';

import { AuthGuard } from './services/auth-guard.service';

export const routes: Routes = [

  {
    path: 'home',
    canActivate: [AuthGuard],
    loadChildren: () => import('./home/home.module')
      .then(m => m.HomeModule),
  },

  {
    path: 'production',
    canActivate: [AuthGuard],
    loadChildren: () => import('./home/production-project/production-project.module')
      .then(m => m.ProductionProjectModule),
  },
  {
    path: 'auth',
    loadChildren: './auth/auth.module#NgxAuthModule',
  },
  { path: '', redirectTo: 'home', pathMatch: 'full' },
 /* { path: 'dist', redirectTo: 'home' },*/
];

const config: ExtraOptions = {
  useHash: false,
};

@NgModule({
  imports: [RouterModule.forRoot(routes, config)],
  exports: [RouterModule],
})
export class AppRoutingModule {
}
