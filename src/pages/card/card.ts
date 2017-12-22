import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AuthServiceProvider } from '../../providers/auth-service/auth-service';

/**
 * Generated class for the CardPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-card',
  templateUrl: 'card.html',
})
export class CardPage {

  createdCode = null;

  user: any;
  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    private authService:AuthServiceProvider
  ) {
    this.user = this.authService.getUserInfo();
    this.createQR(this.user['NumeroCartao']);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CardPage');
  }

  createQR(numeroCartao: String) {
    console.log("NUmero cartao: " + numeroCartao);
    this.createdCode = numeroCartao;
  }

}
