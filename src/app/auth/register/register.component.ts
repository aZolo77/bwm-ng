import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../shared/auth.service';

@Component({
  selector: 'bwm-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  formData: any = {};
  errors: any[] = [];

  constructor(private auth: AuthService, private router: Router) {}

  ngOnInit() {}

  register() {
    this.auth.register(this.formData).subscribe(
      data => {
        // = 1 parametr: where, 2 parametr: additional data
        this.router.navigate(['/login', { registered: 'success' }]);
      },
      err => {
        this.errors = err.error.errors;
      }
    );
  }
}
