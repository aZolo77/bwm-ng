import { Component, OnInit } from '@angular/core';
import { RentalService } from '../shared/rental.service';
import { Rental } from '../shared/rental.model';

@Component({
  selector: 'bwm-rental-list',
  templateUrl: './rental-list.component.html',
  styleUrls: ['./rental-list.component.scss']
})
export class RentalListComponent implements OnInit {
  rentals: Rental[] = [];

  constructor(private rentalService: RentalService) {}

  ngOnInit() {
    const rentalObserver = this.rentalService.getRentals();
    rentalObserver.subscribe(
      (data: Rental[]) => {
        this.rentals = data;
      },
      err => {},
      () => {}
    );
  }
}
