import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { RentalService } from '../../rental/shared/rental.service';
import { Rental } from '../../rental/shared/rental.model';
import { ToastsManager } from 'ng2-toastr';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'bwm-manage-rental',
  templateUrl: './manage-rental.component.html',
  styleUrls: ['./manage-rental.component.scss']
})
export class ManageRentalComponent implements OnInit {
  rentals: Rental[];
  // var for deleting rental
  rentalDeleteIndex: number;

  constructor(
    private rentalService: RentalService,
    private toastr: ToastsManager,
    vcr: ViewContainerRef
  ) {
    this.toastr.setRootViewContainerRef(vcr);
  }

  ngOnInit() {
    this.rentalService.getUserRentals().subscribe(
      (rentals: Rental[]) => {
        this.rentals = rentals;
      },
      err => console.log(err)
    );
  }

  // = deleting rental
  deleteRental(rentalId: string) {
    // delete rental from the DB
    this.rentalService.deleteRental(rentalId).subscribe(
      deletedRental => {
        // delete this rental from local array of rentals
        this.rentals.splice(this.rentalDeleteIndex, 1);
        this.rentalDeleteIndex = undefined;
        this.toastr.success(`This rental was successfuly deleted!`);
      },
      (err: HttpErrorResponse) => {
        this.rentalDeleteIndex = undefined;
        this.toastr.error(err.error.errors[0].detail, 'Failed!');
      }
    );
  }
}
