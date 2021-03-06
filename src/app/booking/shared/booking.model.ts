import { Rental } from '../../rental/shared/rental.model';

export class Booking {
  // static is a variable just for reading!
  static readonly DATE_FORMAT = 'Y/MM/DD';

  _id: string;
  startAt: string;
  endAt: string;
  totalPrice: number;
  guests: number;
  days: number;
  createdAt: string;
  rental: Rental;
  paymentToken: any;
  length?: any;
}
