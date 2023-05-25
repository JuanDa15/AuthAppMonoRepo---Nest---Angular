import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { AuthStatus } from '../interfaces/AuthStatus.interface';
import { catchError, map, of } from 'rxjs';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router)

  return authService.checkToken(localStorage.getItem('TOKEN') || '').pipe(
    map(resp => {
      return authService.authStatus() === AuthStatus.authenticated
    }),
    catchError(() => {
      router.navigateByUrl('/auth/login')
      return of(false)
    })
  )
};
