import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  EventEmitter,
  Output
} from '@angular/core';
import { environment } from '../../environments/environment';
// to get publishable key from env

@Component({
  selector: 'bwm-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.scss']
})
export class PaymentComponent implements OnInit {
  stripe: any;
  elements: any;

  // referencies to html elements
  @ViewChild('cardNumber') cardNumRef: ElementRef;
  @ViewChild('cardExp') cardExpRef: ElementRef;
  @ViewChild('cardCvc') cardCvcRef: ElementRef;

  @Output() paymentConfirmed = new EventEmitter();

  cardNumber: any;
  cardExp: any;
  cardCvc: any;

  token: any;

  // flag 4 spinner
  isValidatingCard: boolean = false;

  error: string = '';

  constructor() {
    this.stripe = Stripe(environment.STRIPE_SK);
    this.elements = this.stripe.elements();

    this.onChange = this.onChange.bind(this);
  }

  ngOnInit() {
    // card number name from Stripe
    this.cardNumber = this.elements.create('cardNumber', { style });
    this.cardNumber.mount(this.cardNumRef.nativeElement);
    // card expiration date name from Stripe
    this.cardExp = this.elements.create('cardExpiry', { style });
    this.cardExp.mount(this.cardExpRef.nativeElement);
    // card cvc code name from Stripe
    this.cardCvc = this.elements.create('cardCvc', { style });
    this.cardCvc.mount(this.cardCvcRef.nativeElement);

    // assigning error event to all elems
    this.cardNumber.addEventListener('change', this.onChange);
    this.cardExp.addEventListener('change', this.onChange);
    this.cardCvc.addEventListener('change', this.onChange);
  }

  ngOnDestroy() {
    this.cardNumber.removeEventListener('change', this.onChange);
    this.cardExp.removeEventListener('change', this.onChange);
    this.cardCvc.removeEventListener('change', this.onChange);

    this.cardNumber.destroy();
    this.cardExp.destroy();
    this.cardCvc.destroy();
  }

  // display error from Stripe
  onChange({ error, brand }) {
    if (error) {
      this.error = error.message;
    } else {
      this.error = '';
    }
  }

  // submitting data to Stripe api
  async onSubmit() {
    // spinner visualize
    this.isValidatingCard = true;

    //sending card number, getting token or an error back
    const { token, error } = await this.stripe.createToken(this.cardNumber);

    this.isValidatingCard = false;

    if (error) {
      console.error(error);
    } else {
      this.token = token;
      this.paymentConfirmed.next(token);
    }
  }

  // checking for all inputs to be filled
  isCardValid(): boolean {
    return (
      this.cardNumber._complete &&
      this.cardExp._complete &&
      this.cardCvc._complete
    );
  }
}

// style for stripe fields
const style = {
  base: {
    iconColor: '#666EE8',
    color: '#31325F',
    lineHeight: '40px',
    fontWeight: 300,
    fontFamily: 'Helvetica Neue',
    fontSize: '15px',

    '::placeholder': {
      color: '#CFD7E0'
    }
  }
};
