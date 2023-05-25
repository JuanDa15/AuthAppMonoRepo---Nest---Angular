import { Route } from "@angular/router";
import { authGuard } from "./guards/auth.guard";

export const DashboardRoutes: Route[] = [
  {
    path: 'home',
    canActivate: [authGuard],
    loadComponent: () => import('src/app/dashboard/home/home.component').then(c => c.HomeComponent)
  },
  {
    path: '**',
    redirectTo: 'home'
  }
]
