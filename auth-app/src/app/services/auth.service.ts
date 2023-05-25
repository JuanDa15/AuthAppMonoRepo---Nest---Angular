import { HttpClient, HttpErrorResponse} from '@angular/common/http'
import { Injectable, computed, inject, signal } from '@angular/core';
import { Observable, catchError, map, of, tap, throwError } from 'rxjs';
import { environment } from 'src/environments/environment.development';
import { ServerResponse } from '../interfaces/ServerResponse.interface';
import { User } from '../interfaces/User.interface';
import { LoginDTO } from '../interfaces/LoginDTO.interface';
import { AuthStatus } from '../interfaces/AuthStatus.interface';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  public http = inject(HttpClient)
  private readonly URL = environment.BaseURL;
  private _user = signal<User | null>(null);
  private _authStatus = signal<AuthStatus>(AuthStatus.notAuthenticated)
  private _token = signal<string | null>(null);


  public user = computed(() => this._user())
  public token = computed(() => this._token())
  public authStatus = computed(() => this._authStatus())

  public finishAuthCheck = computed(() => {
    if (this.authStatus() === AuthStatus.checking) {
      return false;
    }
    return true;
  })

  public login({email, password}: LoginDTO): Observable<boolean> {
    return this.http.post<ServerResponse<User>>(`${this.URL}/auth/login`, {
      email, password
    }).pipe(
      tap(resp => this._setAuthentication(resp)),
      map( () => true),
      catchError((err: HttpErrorResponse) => {
        return throwError(() => err.error.message)
      })
    )
  }

  public checkToken(token: string): Observable<boolean> {
    this._authStatus.set(AuthStatus.checking);
    return this.http.get<ServerResponse<User>>(`${this.URL}/auth/check-token`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }).pipe(
      tap(resp => this._setAuthentication(resp)),
      map( () => true),
      catchError((err: HttpErrorResponse) => {
        this._authStatus.set(AuthStatus.notAuthenticated);
        return throwError(() => err.error.message)
      })
    )
  }

  private _setAuthentication(resp: ServerResponse<User>) {
    this._user.update((user) => resp.data);
    this._token.update((token) => {
      localStorage.setItem('TOKEN',resp.token || '');
      return resp.token || null
    })
    this._authStatus.update((curr) => AuthStatus.authenticated)
  }
}
