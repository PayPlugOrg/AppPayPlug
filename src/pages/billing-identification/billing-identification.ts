import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ViewController } from 'ionic-angular/navigation/view-controller';
import { AlertController } from 'ionic-angular/components/alert/alert-controller';
import { AuthServiceProvider } from '../../providers/auth-service/auth-service';
import StringMask from 'string-mask';
import { ModalController } from 'ionic-angular/components/modal/modal-controller';
import { KeyboardPage } from '../keyboard/keyboard';

/**
 * Generated class for the BillingIdentificationPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-billing-identification',
  templateUrl: 'billing-identification.html',
})
export class BillingIdentificationPage {

  private identification: string = "";
  private showBillingValue: string = "";
  private parcela: number = 1;
  private testRadioOpen: boolean;
  private testRadioResult: any;
  private rawBillingValue:string = "";
  private formatter = new StringMask('#.##0,00', {reverse: true});
  public is: boolean = false;
  public information = {identification:"", success:false,name:"", bloqueado:false};
  public operation: string = "";
  
  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    private viewCtrl: ViewController,
    private alertCtrl: AlertController,
    public authService: AuthServiceProvider,
    public modalCtrl: ModalController
  ) {
    this.showBillingValue = navParams.get('billingValue');
    this.operation = this.navParams.get('operation');
    
    if(this.navParams.get('operation') == 'Transferência') {
      this.is = true;
      this.displayKeyboard(this.rawBillingValue);
    }
  }

  displayKeyboard(rawBillingValue) {
    let keyboardModal = this.modalCtrl.create(KeyboardPage, {billingValue: rawBillingValue, operation: this.navParams.get('operation')});
    keyboardModal.onDidDismiss(data => {
      if(data){ 
        this.rawBillingValue = data;
        this.showBillingValue = this.formatter.apply(data);
      } else {
        this.navCtrl.pop();
      }
    });
    keyboardModal.present();
  }

  async transferAuthorization(page) {
    await this.getUserInfo();
    this.navCtrl.push(page, {billingValue: this.showBillingValue, rawBillingValue: this.rawBillingValue, userInfo: this.information, operation: this.navParams.get('operation')});
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad BillingIdentificationPage');
  }

  async dismiss() {
    await this.getUserInfo();
    console.log(this.information);
    this.viewCtrl.dismiss(this.information);
  }

  async getUserInfo() {
    console.log("identification: " + this.identification);
    return await this.authService.getUserInfo(this.identification).then((result) => {
      this.information.success = result['Success'];
      this.information.name = result['Nome'];
      this.information.bloqueado = result['IsBloqueado'];
      this.information.identification = this.identification;
      console.log(this.information);
    });
  }

  cancel() {
    var information = {success: false, cancel: true};
    this.viewCtrl.dismiss(information);
  }

  canGoBack() {
    return this.navCtrl.canGoBack();
  }

  showRadio() {
    let alert = this.alertCtrl.create();
    alert.setTitle('Parcelamento');

    alert.addInput({
      type: 'radio',
      label: '1',
      value: '1',
      checked: true
    });
    let i;
    for(i=2 ; i < 10 ; i++) {
      alert.addInput({
        type: 'radio',
        label: i,
        value: i
      });
    }

    alert.addButton('Cancelar');
    alert.addButton({
      text: 'OK',
      handler: data => {
        this.testRadioOpen = false;
        this.testRadioResult = data;
      }
    });
    alert.present();
  }

}
