import {
  Component,
  OnInit,
  Input,
  ViewContainerRef,
  ViewChild,
  ElementRef,
  ViewEncapsulation
} from '@angular/core';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { DaterangePickerComponent } from 'ng2-daterangepicker';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Booking } from '../../../booking/shared/booking.model';
import { Rental } from '../../shared/rental.model';
import { HelperService } from '../../../common/service/helper.service';
import { BookingService } from '../../../booking/shared/booking.service';
import { AuthService } from '../../../auth/shared/auth.service';
import * as moment from 'moment';

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'bwm-rental-detail-booking',
  templateUrl: './rental-detail-booking.component.html',
  styleUrls: ['./rental-detail-booking.component.scss']
})

// {Allows you to change styles}
// encapsulation: ViewEncapsulation.None
export class RentalDetailBookingComponent implements OnInit {
  @Input()
  rental: Rental;
  // for reseting Date Picker (geting access to a DOM-element)
  @ViewChild(DaterangePickerComponent)
  private picker: DaterangePickerComponent;

  // way to get access to a Dom-element through TS-file
  // @ViewChild('bookingNoteTitle')
  // private SomePTag: ElementRef;

  newBooking: Booking;
  modalRef: any;
  errors: any[] = [];

  public daterange: any = {};
  public bookedOutDates: any[] = [];

  // options for Date Picker used in HTML-file
  public options: any = {
    locale: { format: Booking.DATE_FORMAT },
    alwaysShowCalendars: false,
    opens: 'left',
    autoUpdateInput: false,
    isInvalidDate: this.checkForInvalidDates.bind(this)
  };

  constructor(
    private helper: HelperService,
    private modalService: NgbModal,
    private bookingService: BookingService,
    private toastr: ToastsManager,
    public auth: AuthService,
    vcr: ViewContainerRef
  ) {
    this.toastr.setRootViewContainerRef(vcr);
  }

  ngOnInit() {
    this.newBooking = new Booking();
    this.getBookedOutDates();

    // this.SomePTag.nativeElement.style.color = 'red';
  }

  // invalid Dates
  private checkForInvalidDates(date) {
    // dates from the range and all dates untill today
    return (
      this.bookedOutDates.includes(this.helper.formatBookingDate(date)) ||
      date.diff(moment(), 'days') < 0
    );
  }

  // = getting range of booked dates
  private getBookedOutDates() {
    const bookings: any = this.rental.bookings;

    if (bookings && bookings.length > 0) {
      bookings.forEach(booking => {
        this.addNewBookedOutDates(booking);
      });
    }
  }

  private addNewBookedOutDates(bookingData) {
    const dateRange = this.helper.getBookingRangeOfDates(
      bookingData.startAt,
      bookingData.endAt
    );
    // destructurize array
    this.bookedOutDates.push(...dateRange);
  }

  private resetDatePicker() {
    this.picker.datePicker.setStartDate(moment());
    this.picker.datePicker.setEndDate(moment());
    this.picker.datePicker.element.val('');
  }

  public openConfirmModal(content) {
    this.errors = [];
    // open modal window and assign it to a variable
    this.modalRef = this.modalService.open(content);
  }

  // getting token from payment component(Stripe)
  onPaymentConfirm(paymentToken: any) {
    this.newBooking.paymentToken = paymentToken;
  }

  // creating a booking with BookingService
  public createBooking() {
    // console.log(this.newBooking);
    this.newBooking.rental = this.rental;
    this.bookingService.createBooking(this.newBooking).subscribe(
      (bookingData: any) => {
        // adding booked dates to an array
        this.addNewBookedOutDates(bookingData);
        // refresh newBooking with empty data
        this.newBooking = new Booking();
        // close modal
        this.modalRef.close();
        // reseting Dates in Date Picker
        this.resetDatePicker();
        this.toastr.success(
          'Booking has been succesfuly created! Check your booking detail in manage section.'
        );
      },
      (errorResponse: any) => {
        this.errors = errorResponse.error.errors;
      }
    );
  }

  public selectedDate(value: any, datepicker?: any) {
    this.options.autoUpdateInput = true;
    // initializing new Booking
    this.newBooking.startAt = this.helper.formatBookingDate(value.start);
    this.newBooking.endAt = this.helper.formatBookingDate(value.end);
    this.newBooking.days = -value.start.diff(value.end, 'days');
    this.newBooking.totalPrice = this.newBooking.days * this.rental.dailyRate;
  }
}
