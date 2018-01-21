import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CardPage } from './card';
import { NgxQRCodeModule } from 'ngx-qrcode2';

@NgModule({
  declarations: [
    CardPage,
  ],
  imports: [
    IonicPageModule.forChild(CardPage),
    NgxQRCodeModule,
  ],
})
export class CardPageModule {}
