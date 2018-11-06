import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { NgPipesModule, UcWordsPipe } from 'ngx-pipes';
import { MapModule } from '../common/map/map.module';
import { EditableModule } from '../common/components/editable/editable.module';
import { Daterangepicker } from 'ng2-daterangepicker';

import { RentalComponent } from './rental.component';
import { RentalListComponent } from './rental-list/rental-list.component';
import { RentalListItemComponent } from './rental-list-item/rental-list-item.component';
import { RentalDetailComponent } from './rental-detail/rental-detail.component';
import { RentalDetailBookingComponent } from './rental-detail/rental-detail-booking/rental-detail-booking.component';
import { RentalSearchComponent } from './rental-search/rental-search.component';
import { RentalCreateComponent } from './rental-create/rental-create.component';
import { RentalUpdateComponent } from './rental-update/rental-update.component';

import { RentalService } from './shared/rental.service';
import { HelperService } from '../common/service/helper.service';
import { BookingService } from '../booking/shared/booking.service';
import { UppercasePipe } from '../common/pipes/uppercase.pipe';

import { AuthGuard } from '../auth/shared/auth.guard';
import { RentalGuard } from './shared/rental.guard';

// AuthGuard protection
const routes: Routes = [
  {
    path: 'rentals',
    component: RentalComponent,
    children: [
      {
        path: '',
        component: RentalListComponent
      },
      {
        path: 'new',
        component: RentalCreateComponent,
        canActivate: [AuthGuard]
      },
      {
        path: ':rentalId',
        component: RentalDetailComponent
      },
      {
        path: ':rentalId/edit',
        component: RentalUpdateComponent,
        canActivate: [AuthGuard, RentalGuard]
      },
      {
        path: ':city/homes',
        component: RentalSearchComponent
      }
    ]
  }
];

@NgModule({
  declarations: [
    RentalListComponent,
    RentalListItemComponent,
    RentalComponent,
    RentalDetailComponent,
    UppercasePipe,
    RentalDetailBookingComponent,
    RentalSearchComponent,
    RentalCreateComponent,
    RentalUpdateComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    HttpClientModule,
    NgPipesModule,
    MapModule,
    Daterangepicker,
    FormsModule,
    EditableModule
  ],
  providers: [
    RentalService,
    AuthGuard,
    RentalGuard,
    HelperService,
    BookingService,
    UcWordsPipe
  ]
})
export class RentalModule {}
