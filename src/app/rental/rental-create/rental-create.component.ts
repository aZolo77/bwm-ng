import { Component, OnInit } from '@angular/core';
import { Rental } from '../shared/rental.model';
import { RentalService } from '../shared/rental.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'bwm-rental-create',
  templateUrl: './rental-create.component.html',
  styleUrls: ['./rental-create.component.scss']
})
export class RentalCreateComponent implements OnInit {
  public newRental: Rental;
  rentalCategories = Rental.CATEGORIES;
  errors: any[] = [];

  constructor(private rentalService: RentalService, private router: Router) {}

  ngOnInit() {
    this.newRental = new Rental();
    this.newRental.shared = false;
  }

  public createRental() {
    this.rentalService.createRental(this.newRental).subscribe(
      (rental: Rental) => {
        console.log(rental);
        this.router.navigate([`/rentals/${rental._id}`]);
      },
      (err: HttpErrorResponse) => {
        this.errors = err.error.errors;
      }
    );
  }

  public handleImageChange() {
    this.newRental.image = 'http://via.placeholder.com/350x250';
  }
}
