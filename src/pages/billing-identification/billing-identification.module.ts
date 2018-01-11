import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { BillingIdentificationPage } from './billing-identification';

@NgModule({
  declarations: [
    BillingIdentificationPage,
  ],
  imports: [
    IonicPageModule.forChild(BillingIdentificationPage),
  ],
})
export class BillingIdentificationPageModule {}
