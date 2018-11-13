import { Component, OnInit } from '@angular/core';
import { UserService } from '../shared/user.service';
import { HttpErrorResponse } from '@angular/common/http';
import { AuthService } from '../../auth/shared/auth.service';

@Component({
  selector: 'bwm-user-detail',
  templateUrl: './user-detail.component.html',
  styleUrls: ['./user-detail.component.scss']
})
export class UserDetailComponent implements OnInit {
  user: any;

  constructor(private userService: UserService, private auth: AuthService) {}

  ngOnInit() {
    this.getUser();
  }

  // get User Data
  getUser() {
    const userId = this.auth.getUserId();
    this.userService.getUser(userId).subscribe(
      user => {
        console.log(user);
        this.user = user;
      },
      (err: HttpErrorResponse) => {
        console.log(err);
      }
    );
  }
}
