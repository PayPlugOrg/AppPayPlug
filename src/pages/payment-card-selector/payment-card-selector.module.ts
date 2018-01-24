import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PaymentCardSelectorPage } from './payment-card-selector';

@NgModule({
  declarations: [
    PaymentCardSelectorPage,
  ],
  imports: [
    IonicPageModule.forChild(PaymentCardSelectorPage),
  ],
})
export class PaymentCardSelectorPageModule {}
