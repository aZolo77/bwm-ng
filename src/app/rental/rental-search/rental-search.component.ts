import { Component, OnInit } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { RentalService } from '../shared/rental.service';
import { Rental } from '../shared/rental.model';

@Component({
  selector: 'bwm-rental-search',
  templateUrl: './rental-search.component.html',
  styleUrls: ['./rental-search.component.scss']
})
export class RentalSearchComponent implements OnInit {
  city: string;
  rentals: Rental[] = [];
  errors: any[] = [];

  constructor(
    private route: ActivatedRoute,
    private rentalService: RentalService
  ) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      // get params from url
      this.city = params.city;
      this.getRentals();
    });
  }

  // = get rentals by city-name from params
  public getRentals() {
    this.errors = [];
    this.rentals = [];

    this.rentalService.getRentalsByCity(this.city).subscribe(
      (rentals: Rental[]) => {
        this.rentals = rentals;
      },
      (err: HttpErrorResponse) => {
        this.errors = err.error.errors;
      }
    );
  }
}
