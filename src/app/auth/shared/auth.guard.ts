import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router
} from '@angular/router';

import { AuthService } from './auth.service';

@Injectable()
export class AuthGuard implements CanActivate {
  private url: string;

  constructor(private auth: AuthService, private router: Router) {}

  private handleAuthState(): boolean {
    if (this.isLoginOrRegister()) {
      this.router.navigate(['/rentals']);
      return false;
    }
    return true;
  }

  private handleNotAuthState(): boolean {
    if (this.isLoginOrRegister()) {
      return true;
    }

    this.router.navigate(['/login']);
    return false;
  }

  // check if this page is /login or /register
  private isLoginOrRegister(): boolean {
    if (this.url.includes('login') || this.url.includes('register')) {
      return true;
    }
    return false;
  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    this.url = state.url;

    // если user зареган - перенаправляем на /rentals
    if (this.auth.isAuthenticated()) {
      return this.handleAuthState();
    }

    // если нет - на страницу /login
    return this.handleNotAuthState();
  }
}
