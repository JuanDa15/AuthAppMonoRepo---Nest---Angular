import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styles: [
  ]
})
export class HomeComponent {
  public authService = inject(AuthService)

  public checkAuth = this.authService.finishAuthCheck();
}
