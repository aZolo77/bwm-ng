import { Component, OnInit } from '@angular/core';
import { BookingService } from '../../booking/shared/booking.service';
import { Booking } from '../../booking/shared/booking.model';
import { PaymentService } from '../../payment/shared/payment.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'bwm-manage-booking',
  templateUrl: './manage-booking.component.html',
  styleUrls: ['./manage-booking.component.scss']
})
export class ManageBookingComponent implements OnInit {
  bookings: Booking[];
  payments: any[];

  constructor(
    private bookingService: BookingService,
    private paymentService: PaymentService
  ) {}

  ngOnInit() {
    this.bookingService.getUserBookings().subscribe(
      (bookings: Booking[]) => {
        this.bookings = bookings;
      },
      err => console.log(err)
    );
    this.getPendingPayments();
  }

  // get pending payments from service
  getPendingPayments() {
    this.paymentService.getPendingPayments().subscribe(
      (payments: any) => {
        this.payments = payments;
      },
      (err: HttpErrorResponse) => {
        //
      }
    );
  }

  // accept Payment
  acceptPayment(payment) {
    this.paymentService.acceptPayment(payment).subscribe(
      json => {
        payment.status = 'paid';
      },
      err => {
        console.log(err);
      }
    );
  }

  // decline Payment
  declinePayment(payment) {
    this.paymentService.declinePayment(payment).subscribe(
      json => {
        payment.status = 'declined';
      },
      err => {
        console.log(err);
      }
    );
  }
}
