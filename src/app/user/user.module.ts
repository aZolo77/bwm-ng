import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { UserComponent } from './user.component';
import { UserDetailComponent } from './user-detail/user-detail.component';
import { UserService } from './shared/user.service';
import { AuthGuard } from '../auth/shared/auth.guard';
import { HttpClientModule } from '@angular/common/http';
import { AuthService } from '../auth/shared/auth.service';

// AuthGuard protection
const routes: Routes = [
  {
    path: 'users',
    component: UserComponent,
    children: [
      {
        path: 'profile',
        canActivate: [AuthGuard],
        component: UserDetailComponent
      }
    ]
  }
];

@NgModule({
  declarations: [UserComponent, UserDetailComponent],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forRoot(routes),
    HttpClientModule
  ],
  providers: [UserService, AuthService]
})
export class UserModule {}
