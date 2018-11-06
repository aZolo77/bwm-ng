import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  Router,
  RouterStateSnapshot
} from '@angular/router';

import { RentalService } from './rental.service';
import { Observable } from 'rxjs';

@Injectable()
export class RentalGuard implements CanActivate {
  constructor(private rentalService: RentalService, private router: Router) {}

  // guard for Rental edit
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> {
    // getting rentalId from RentalModule routes-object
    const rentalId: string = route.params.rentalId;

    return this.rentalService
      .verifyRentalUser(rentalId)
      .map(() => {
        return true;
      })
      .catch(() => {
        this.router.navigate(['/rentals']);
        return Observable.of(false);
      });
  }
}
