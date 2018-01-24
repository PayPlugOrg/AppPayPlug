import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PaymentCardAuthorizationPage } from './payment-card-authorization';

@NgModule({
  declarations: [
    PaymentCardAuthorizationPage,
  ],
  imports: [
    IonicPageModule.forChild(PaymentCardAuthorizationPage),
  ],
})
export class PaymentCardAuthorizationPageModule {}
