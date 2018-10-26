import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class RentalService {
  constructor(private http: HttpClient) {}

  // = возвращаем 1 вариант по id
  public getRentalById(rentalId: string): Observable<any> {
    // = use Proxy
    return this.http.get('/api/v1/rentals/' + rentalId);
  }

  // = возвращаем все варианты
  public getRentals(): Observable<any> {
    // = USE PROXY
    return this.http.get('/api/v1/rentals');
  }
}
