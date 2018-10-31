import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Rental } from './rental.model';

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

  // = get filtered rentals by city-name
  public getRentalsByCity(city: string): Observable<any> {
    return this.http.get(`/api/v1/rentals?city=${city}`);
  }

  // = creating new Rental
  public createRental(rental: Rental): Observable<any> {
    return this.http.post('/api/v1/rentals', rental);
  }

  // = getting User Rentals
  public getUserRentals(): Observable<any> {
    return this.http.get('/api/v1/rentals/manage');
  }

  // = deleting rental
  public deleteRental(rentalId: string): Observable<any> {
    return this.http.delete(`/api/v1/rentals/${rentalId}`);
  }
}
