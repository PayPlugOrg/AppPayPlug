import { AlertServiceProvider } from '../../providers/alert-service/alert-service';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';
import { KeyboardPage } from '../keyboard/keyboard'
import StringMask from 'string-mask';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import { BillingSmsPage } from '../billing-sms/billing-sms';
import { AuthServiceProvider } from '../../providers/auth-service/auth-service';
import { ReceiptPage } from '../receipt/receipt';
import { SocialSharing } from '@ionic-native/social-sharing';

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
  private linkShare: string = "";

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public modalCtrl: ModalController,
    private barcodeScanner: BarcodeScanner,
    public alertProvider: AlertServiceProvider,
    public authService: AuthServiceProvider,
    private socialSharing: SocialSharing
  ) {
    this.displayKeyboard(this.rawBillingValue);
  }

  ionViewDidLoad() {
  }

  createQR(data: String) {
    this.createdCode = data;
  }

  displayKeyboard(rawBillingValue) {
    let keyboardModal = this.modalCtrl.create(KeyboardPage, {billingValue: rawBillingValue, operation: this.navParams.get('operation')});
    keyboardModal.onDidDismiss(data => {
      if(data){ 
        this.rawBillingValue = data;
        this.showBillingValue = this.formatter.apply(data);
        var origem = localStorage.getItem('cpf').replace(/\./gi,'');
        origem = origem.replace('-','');
        var value = this.showBillingValue.replace(/\./gi,'');
        value = value.replace(/,/gi,'');
        this.linkShare = "https://www.payplug.org:88/Lkn/Ctnr?o=" + origem + "&d=&v=" + value;
        this.createQR(this.linkShare);
      } else {
        this.navCtrl.pop({animate:false});
      }
    });
    keyboardModal.present();
  }

  scan(page) {
    this.barcodeScanner.scan().then((barcodeData) => {
      this.alertProvider.presentToast(barcodeData.text);

      if(barcodeData.text.length == 16) {
        this.navCtrl.push(page, {openModalIdentification: false, payplugCard:barcodeData.text, billingValue: this.showBillingValue, operation: this.navParams.get('operation')});
      } else if (barcodeData.text) {
        let cardInformation = parseInt(barcodeData.text, 16).toString();
        let idLength = Number(cardInformation.substr(0,1));
        let cardId = cardInformation.substr(1,idLength);
        let passwordLength = cardInformation.length - (idLength + 1);
        let password = cardInformation.substr((idLength + 1), passwordLength);
        
        let billingValue = this.showBillingValue.replace('.','');
        billingValue = this.showBillingValue.replace(',','');

        this.authService.doBilling(cardId,billingValue,password).then((result) => {
          let receiptModal = this.modalCtrl.create(ReceiptPage, {identifier:result['Identifier']}); //result['Identifier'] '5510'
          receiptModal.onDidDismiss(() => {
            this.navCtrl.popToRoot();
          })
          receiptModal.present();
        },(err) => {
          console.error(err);
          this.alertProvider.presentToast('Leitura inválida. Por favor, apresente um Cartão PayPlug!' + err);
        });
      }
    });
  }

  presentSmsModal() {
    this.socialSharing.share(this.linkShare);
  }

  openPage(page) {
    var params = {
      openModalIdentification: true, 
      billingValue: this.showBillingValue, 
      rawBillingValue: this.rawBillingValue, 
      operation: this.navParams.get('operation')
    };
    this.navCtrl.push(page, params);
  }

}
