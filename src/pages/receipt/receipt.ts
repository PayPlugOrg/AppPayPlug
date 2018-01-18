import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ViewController } from 'ionic-angular/navigation/view-controller';

/**
 * Generated class for the ReceiptPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-receipt',
  templateUrl: 'receipt.html',
})
export class ReceiptPage {

  private identifier: any;

  constructor(
    public navCtrl: NavController,
    public viewCtrl: ViewController,
    public navParams: NavParams
  ) {
    this.identifier = navParams.get('identifier');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ReceiptPage');
  }

  private dismiss() {
    this.viewCtrl.dismiss();
  }

}
