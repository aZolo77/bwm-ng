import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { PaymentComponent } from './payment.component';
import { PaymentService } from './shared/payment.service';

@NgModule({
  declarations: [PaymentComponent],
  imports: [CommonModule, FormsModule],
  exports: [PaymentComponent],
  providers: [PaymentService]
})
export class PaymentModule {}
