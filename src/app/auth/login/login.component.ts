import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../shared/auth.service';

@Component({
  selector: 'bwm-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  // = creating Reactive Form
  loginForm: FormGroup;
  errors: any[] = [];
  notifyMsg: string = '';

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.initForm();

    // подписываемся на событие передачи параметров от других компонент
    this.route.params.subscribe(params => {
      if (params['registered'] === 'success') {
        this.notifyMsg =
          'You have been succesfully registered, now you can login';
      }
      if (params['login'] === 'again') {
        this.notifyMsg = 'Please login';
      }
    });
  }

  private initForm() {
    // creating connection between html and ts files
    this.loginForm = this.fb.group({
      email: [
        '',
        [
          Validators.required,
          Validators.pattern(
            '^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:.[a-zA-Z0-9-]+)*$'
          )
        ]
      ],
      password: ['', Validators.required]
    });
  }

  // проверка на валидность инпута
  private isInvalidForm(input): boolean {
    return (
      this.loginForm.controls[input].invalid &&
      (this.loginForm.controls[input].dirty ||
        this.loginForm.controls[input].touched)
    );
  }

  // инпут required func
  private isRequired(input): boolean {
    return this.loginForm.controls[input].errors.required;
  }

  // submit form
  private login() {
    this.auth.login(this.loginForm.value).subscribe(
      data => {
        this.router.navigate(['/rentals']);
      },
      err => {
        this.errors = err.error.errors;
      }
    );
  }
}
