import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RentalService } from '../shared/rental.service';
import { Rental } from '../shared/rental.model';
import { HttpErrorResponse } from '@angular/common/http';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { UcWordsPipe } from 'ngx-pipes';

// Subject replaces EventEmitter
import { Subject } from 'rxjs';
import { errorHandler } from '@angular/platform-browser/src/browser';

@Component({
  selector: 'bwm-rental-update',
  templateUrl: './rental-update.component.html',
  styleUrls: ['./rental-update.component.scss']
})
export class RentalUpdateComponent implements OnInit {
  rental: Rental;

  rentalCategories: string[] = Rental.CATEGORIES;

  // to update location ufter User pushes Edit {street or city}
  locationSubject: Subject<any> = new Subject();

  constructor(
    private route: ActivatedRoute,
    private rentalService: RentalService,
    private toastr: ToastsManager,
    vcr: ViewContainerRef,
    private upperPipe: UcWordsPipe
  ) {
    this.toastr.setRootViewContainerRef(vcr);
    this.transformLocation = this.transformLocation.bind(this);
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      // вернуть бронирование по id
      this.getRental(params['rentalId']);
    });
  }

  transformLocation(location: string): string {
    return this.upperPipe.transform(location);
  }

  getRental(rentalId: string) {
    this.rentalService.getRentalById(rentalId).subscribe((data: Rental) => {
      this.rental = data;
    });
  }

  // = updating Rental
  updateRental(rentalId: string, rentalData: any) {
    this.rentalService.updateRental(rentalId, rentalData).subscribe(
      (updatedRental: Rental) => {
        this.rental = updatedRental;

        // if User updates city/street - emit this with Subject class to map component
        if (rentalData.city || rentalData.street) {
          this.locationSubject.next(
            this.rental.city + ', ' + this.rental.street
          );
        }
      },
      (err: HttpErrorResponse) => {
        // if string is empty
        this.toastr.error(err.error.errors[0].detail, 'Error');
        this.getRental(rentalId);
      }
    );
  }

  // to change number of guests and beds while editing bedroom number
  countBedroomAssets(assetsNum: number) {
    return parseInt(<any>this.rental.bedrooms || 0, 10) + assetsNum;
  }
}
