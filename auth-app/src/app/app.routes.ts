import { Routes } from '@angular/router';
import { AuthRoutes } from './auth.routes';
import { DashboardRoutes } from './dashboard.routes';
import { LayoutComponent } from './auth/layout/layout.component';

export const routes: Routes = [
  {
    path: 'auth',
    component: LayoutComponent,
    children: [...AuthRoutes]
  },
  {
    path: 'dashboard',
    children:[...DashboardRoutes]
  },
  {
    path: '**',
    redirectTo: 'auth'
  }
];
