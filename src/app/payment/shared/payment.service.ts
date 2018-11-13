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

  // accepting Payment
  public acceptPayment(payment): Observable<any> {
    return this.http.post('/api/v1/payments/accept', payment);
  }

  // accepting Payment
  public declinePayment(payment): Observable<any> {
    return this.http.post('/api/v1/payments/decline', payment);
  }
}
