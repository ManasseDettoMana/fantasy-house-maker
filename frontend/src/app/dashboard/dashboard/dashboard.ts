import { AuthService } from './../../core/services/auth.service';
import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  imports: [],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard {
  private router = inject(Router);
  private readonly authService = inject(AuthService);

  goToCasate(): void{
    if(this.authService.isLoggedIn()){
      this.router.navigate(['/casate']);
    }
  }
}
