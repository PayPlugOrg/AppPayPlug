import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';
import { KeyboardPage } from '../keyboard/keyboard'

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

  private billingValue:string = "0,00";
  private createdCode = null;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public modalCtrl: ModalController
  ) {
    this.displayKeyboard("0,00");
    this.createQR("3");
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad BillingPage');
  }

  createQR(numeroCartao: String) {
    console.log("Numero cartao: " + numeroCartao);
    this.createdCode = numeroCartao;
  }

  displayKeyboard(billingValue) {
    let cardModal = this.modalCtrl.create(KeyboardPage, {billingValue: billingValue});
    cardModal.present();
  }

}
