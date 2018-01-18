import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CardNewPage } from './card-new';

@NgModule({
  declarations: [
    CardNewPage,
  ],
  imports: [
    IonicPageModule.forChild(CardNewPage),
  ],
})
export class CardNewPageModule {}
