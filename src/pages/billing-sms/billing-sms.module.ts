import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { BillingSmsPage } from './billing-sms';

@NgModule({
  declarations: [
    BillingSmsPage,
  ],
  imports: [
    IonicPageModule.forChild(BillingSmsPage),
  ],
})
export class BillingSmsPageModule {}
