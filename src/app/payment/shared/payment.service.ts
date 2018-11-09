import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class PaymentService {
  constructor(private http: HttpClient) {}

  // getting pending payments from DB through server
  public getPendingPayments(): Observable<any> {
    return this.http.get('/api/v1/payments');
  }
}
