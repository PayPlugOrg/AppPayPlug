import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AuthServiceProvider } from '../../providers/auth-service/auth-service';
import { BillingAuthorizationPageModule } from '../billing-authorization/billing-authorization.module';
import { BillingAuthorizationPage } from '../billing-authorization/billing-authorization';
import { CardProvider } from '../../providers/card/card';

/**
 * Generated class for the CardListPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-card-list',
  templateUrl: 'card-list.html',
})
export class CardListPage {

  private cards: Array<{}> = new Array;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public authService: AuthServiceProvider,
    public cardProvider: CardProvider
  ) {
    this.cards = this.cardProvider.getCards(this.authService.userInfo['CpfCnpj']);
    console.log(this.cards);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CardListPage');
  }

}
