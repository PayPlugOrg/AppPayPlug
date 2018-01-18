import { AlertServiceProvider } from '../../providers/alert-service/alert-service';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';
import { KeyboardPage } from '../keyboard/keyboard'
import StringMask from 'string-mask';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import { BillingSmsPage } from '../billing-sms/billing-sms';

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
    public alertProvider: AlertServiceProvider
  ) {
    this.displayKeyboard(this.rawBillingValue);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad BillingPage');
  }

  createQR(numeroCartao: String) {
    this.createdCode = numeroCartao;
  }

  displayKeyboard(rawBillingValue) {
    let keyboardModal = this.modalCtrl.create(KeyboardPage, {billingValue: rawBillingValue});
    keyboardModal.onDidDismiss(data => {
      if(data){ 
        this.rawBillingValue = data;
        this.showBillingValue = this.formatter.apply(data);
        this.createQR(data);
      } else {
        this.navCtrl.pop();
      }
    });
    keyboardModal.present();
  }

  scan(page) {
    this.barcodeScanner.scan().then((barcodeData) => {
      //this.alertProvider.presentToast(barcodeData.text);
      if(barcodeData.text.length == 16) {
        this.navCtrl.push(page, {openModalIdentification: false, payplugCard:barcodeData.text, billingValue: this.showBillingValue});
      } else {
        this.alertProvider.presentToast('Leitura inválida. Por favor, apresente um Cartão PayPlug!');
      }
    });
  }

  presentSmsModal() {
    let smsModal = this.modalCtrl.create(BillingSmsPage);
    smsModal.onDidDismiss(data => {
      console.log("Celular: " + data);
    });
    smsModal.present();
  }

  openPage(page) {
    this.navCtrl.push(page, {openModalIdentification: true, billingValue: this.showBillingValue, rawBillingValue: this.rawBillingValue});
  }

}
