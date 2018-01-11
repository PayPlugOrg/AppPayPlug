import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { BillingAuthorizationPage } from './billing-authorization';

@NgModule({
  declarations: [
    BillingAuthorizationPage,
  ],
  imports: [
    IonicPageModule.forChild(BillingAuthorizationPage),
  ],
})
export class BillingAuthorizationPageModule {}
