import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import * as jwt from 'jsonwebtoken';
import * as moment from 'moment';
import 'rxjs/Rx';

// class for token decoded
class DecodedToken {
  exp: number = 0;
  username: string = '';
}

@Injectable()
export class AuthService {
  private decodedToken;

  constructor(private http: HttpClient, private router: Router) {
    // if there is no data in localStorage, get default data from the object by creating its instance
    this.decodedToken =
      JSON.parse(localStorage.getItem('bwm_meta')) || new DecodedToken();
  }

  private saveToken(token: string): string {
    this.decodedToken = jwt.decode(token);
    // save TOKEN to localStorage and pass it further
    localStorage.setItem('bwm_auth', token);
    // save metaData to localStorage after making it a string
    localStorage.setItem('bwm_meta', JSON.stringify(this.decodedToken));

    return token;
  }

  private getMilliseconds() {
    return moment.unix(this.decodedToken.exp);
  }

  public register(userData): Observable<any> {
    return this.http.post('/api/v1/users/register', userData);
  }

  public login(userData): Observable<any> {
    // map is like a middlewear between post and subscribe
    return this.http
      .post('/api/v1/users/auth', userData)
      .map((token: string) => {
        this.saveToken(token);
      });
  }

  public logout() {
    localStorage.removeItem('bwm_auth');
    localStorage.removeItem('bwm_meta');
    this.decodedToken = new DecodedToken();
    this.router.navigate(['/login', { login: 'again' }]);
  }

  public isAuthenticated(): boolean {
    // check if current time is less then expiration time of the TOKEN
    return moment().isBefore(this.getMilliseconds());
  }

  public getUserName(): string {
    return this.decodedToken.username;
  }

  public getAuthToken(): string {
    return localStorage.getItem('bwm_auth');
  }
}
