import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ModalController } from 'ionic-angular/components/modal/modal-controller';
import { BillingIdentificationPage } from '../billing-identification/billing-identification';
import { AuthServiceProvider } from '../../providers/auth-service/auth-service';
import { AlertServiceProvider } from '../../providers/alert-service/alert-service';
import { AlertController } from 'ionic-angular/components/alert/alert-controller';

/**
 * Generated class for the BillingAuthorizationPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-billing-authorization',
  templateUrl: 'billing-authorization.html',
})
export class BillingAuthorizationPage {

  private showBillingValue: any;
  private identification: string = "";
  private name: string = "";
  private numbers: Array<{value:number}>;
  private password: string = "";
  private testRadioOpen: boolean;
  private testRadioResult: any;
  private parcela:number = 1;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public modalCtrl: ModalController,
    public authProvider: AuthServiceProvider,
    public alertProv: AlertServiceProvider,
    public alertCtrl: AlertController
  ) {
    this.showBillingValue = navParams.get('billingValue');
    this.displayIdentificationModal();

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
    this.clearPasswordInput();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad BillingAuthorizationPage');
  }

  private displayIdentificationModal() {
    let identificationModal = this.modalCtrl.create(BillingIdentificationPage, {billingValue: this.showBillingValue});
    console.log("user: " + this.authProvider.user);
    identificationModal.onDidDismiss(data => {
      if(data['success'] == false) {
        this.alertProv.presentToast('Nenhum usuário encontrado com ' + data['identification']);
        this.identification = data['identification'];
        this.name = "";
        this.password = "";
      } else {
        this.identification = data['identification'];
        this.name = data['name'];
        this.password = "";
      }
      console.log("data: " + data);
      console.log("identification: " + data['identification']);
      console.log("name: " + data['name']);
    });
    identificationModal.present();
  }

  clearPasswordInput() {
    this.password = "";
    this.numbers.sort(() => Math.random() * 2 - 1);
  }

  pressedButton(buttonValue: string) {
    this.password = this.password.concat(buttonValue);
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
