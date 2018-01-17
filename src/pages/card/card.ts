import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AuthServiceProvider } from '../../providers/auth-service/auth-service';
import { ViewController } from 'ionic-angular/navigation/view-controller';

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
  userName : String;

  user: any;
  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    private authService:AuthServiceProvider,
    private viewCtrl: ViewController
  ) {
    this.authService.getUserInfo();
    this.user = this.authService.userInfo;
    this.createQR(this.user['NumeroCartao']);
    this.userName = this.user['Nome'];
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CardPage');
  }

  createQR(numeroCartao: String) {
    console.log("Numero cartao: " + numeroCartao);
    this.createdCode = numeroCartao;
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

}
