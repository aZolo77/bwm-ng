import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { ManageComponent } from './manage.component';
import { ManageRentalComponent } from './manage-rental/manage-rental.component';
import { ManageBookingComponent } from './manage-booking/manage-booking.component';
import { ManageRentalBookingComponent } from './manage-rental/manage-rental-booking/manage-rental-booking.component';

import { AuthGuard } from '../auth/shared/auth.guard';
import { RentalService } from '../rental/shared/rental.service';
import { BookingService } from '../booking/shared/booking.service';
import { NgPipesModule } from 'ngx-pipes';
import { FormatDatePipe } from '../common/pipes/format-date.pipe';

const routes: Routes = [
  {
    path: 'manage',
    component: ManageComponent,
    children: [
      {
        path: 'rentals',
        component: ManageRentalComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'bookings',
        component: ManageBookingComponent,
        canActivate: [AuthGuard]
      }
    ]
  }
];

@NgModule({
  declarations: [
    ManageComponent,
    ManageRentalComponent,
    ManageBookingComponent,
    FormatDatePipe,
    ManageRentalBookingComponent
  ],
  imports: [CommonModule, RouterModule.forChild(routes), NgPipesModule],
  exports: [],
  providers: [AuthGuard, RentalService, BookingService]
})
export class ManageModule {}
