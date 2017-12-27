import { AlertServiceProvider } from '../../providers/alert-service/alert-service';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';
import { KeyboardPage } from '../keyboard/keyboard'
import StringMask from 'string-mask';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';

/**
 * Generated class for the BillingPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-billing',
  templateUrl: 'billing.html',
})
export class BillingPage {

  private formatter = new StringMask('#.##0,00', {reverse: true});
  private showBillingValue:string = "";
  private rawBillingValue:string = "";
  private createdCode = null;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public modalCtrl: ModalController,
    private barcodeScanner: BarcodeScanner,
    public alertService: AlertServiceProvider
  ) {
    this.displayKeyboard(this.rawBillingValue);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad BillingPage');
  }

  createQR(numeroCartao: String) {
    console.log("Numero cartao: " + numeroCartao);
    this.createdCode = numeroCartao;
  }

  displayKeyboard(rawBillingValue) {
    let keyboardModal = this.modalCtrl.create(KeyboardPage, {billingValue: rawBillingValue});
    keyboardModal.onDidDismiss(data => {
      this.rawBillingValue = data;
      this.showBillingValue = this.formatter.apply(data);
      this.createQR(data);
    });
    keyboardModal.present();
  }

  scan() {
    this.barcodeScanner.scan().then((barcodeData) => {
      this.alertService.presentToast(barcodeData);
    });
  }

}
