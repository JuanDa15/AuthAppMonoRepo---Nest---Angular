import { Route } from "@angular/router";

export const AuthRoutes: Route[] = [
  {
    path: 'login',
    loadComponent: () => import('src/app/auth/login/login.component').then(c => c.LoginComponent)
  },
  {
    path: '**',
    redirectTo: 'login'
  }
]
