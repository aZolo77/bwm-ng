// = service with different help-funcs
import { Injectable } from '@angular/core';
import * as moment from 'moment';
import { Booking } from '../../booking/shared/booking.model';

@Injectable()
export class HelperService {
  // = getting range of dates from booking
  private getRangeOfDates(startAt, endAt, dateFormat) {
    const tempDates = [];
    // getting date of a string
    const mEndAT = moment(endAt);
    let mStartAt = moment(startAt);

    while (mStartAt <= mEndAT) {
      // getting string of a date
      tempDates.push(mStartAt.format(dateFormat));
      mStartAt = mStartAt.add(1, 'day');
    }

    return tempDates;
  }

  private formatDate(date, dateFormat) {
    return moment(date).format(dateFormat);
  }

  public formatBookingDate(date) {
    return this.formatDate(date, Booking.DATE_FORMAT);
  }

  public getBookingRangeOfDates(startAt, endAt) {
    return this.getRangeOfDates(startAt, endAt, Booking.DATE_FORMAT);
  }
}
