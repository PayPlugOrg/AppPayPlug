import { Component } from '@angular/core';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AlertServiceProvider } from '../../providers/alert-service/alert-service';
import { ModalController } from 'ionic-angular/components/modal/modal-controller';
import { CardPage } from '../../pages/card/card';

/**
 * Generated class for the PaymentPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-payment',
  templateUrl: 'payment.html',
})
export class PaymentPage {

  numbers: Array<{value:number}>;
  constructor(
    public navCtrl: NavController,
    public modalCtrl: ModalController, 
    public navParams: NavParams,
    public alertService: AlertServiceProvider,
    private barcodeScanner: BarcodeScanner
  ) {
    this.numbers = [
      {value:0},
      {value:1},
      {value:2},
      {value:3},
      {value:4},
      {value:5},
      {value:6},
      {value:7},
      {value:8},
      {value:9}
    ];
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PaymentPage');
  }

  scan() {

    this.barcodeScanner.scan().then((barcodeData) => {
      this.alertService.presentToast(barcodeData);
    });
    
  }

  presentCardModal() {
    let cardModal = this.modalCtrl.create(CardPage);
    cardModal.present();
  }

}
