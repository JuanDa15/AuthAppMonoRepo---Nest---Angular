import { Component, importProvidersFrom, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  providers: [],
  styles: [
  ]
})
export class LoginComponent {
  public fb = inject(FormBuilder)
  public authService = inject(AuthService)
  public router = inject(Router)

  public form = signal(this.fb.group({
    email: ['rodriguez23@cosa.co', [Validators.required]],
    password: ['aA12345678', [Validators.required]]
  }))

  public logIn() {
    const { email = '', password = ''} = {...this.form().value}

    if(!email || !password) {
      return;
    }

    this.authService.login({email,password}).subscribe({
      next: (val) => {
        console.log(val)
        this.router.navigateByUrl('/dashboard/home')
      },
      error: (err) => {
        console.log(err)
      }
    })
  }
}
