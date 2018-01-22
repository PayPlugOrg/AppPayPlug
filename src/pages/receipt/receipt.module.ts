import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ReceiptPage } from './receipt';
import { NgxQRCodeModule } from 'ngx-qrcode2';

@NgModule({
  declarations: [
    ReceiptPage,
  ],
  imports: [
    IonicPageModule.forChild(ReceiptPage),
    NgxQRCodeModule,
  ],
})
export class ReceiptPageModule {}
