import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AuthServiceProvider } from '../../providers/auth-service/auth-service';
import { BillingAuthorizationPageModule } from '../billing-authorization/billing-authorization.module';
import { BillingAuthorizationPage } from '../billing-authorization/billing-authorization';
import { CardServiceProvider } from '../../providers/card/card-service';
import {CardModule} from 'ngx-card/ngx-card';
import { CardPage } from '../card/card';


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

  private cards: any;

  messages: any = {validDate: 'valid\ndate', monthYear: 'mm/yyyy'};
  placeholders: any = {number: '•••• •••• •••• ••••', name: 'Full Name', expiry: '••/••', cvc: '•••'};
  masks: any;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public authService: AuthServiceProvider,
    public cardProvider: CardServiceProvider

  ) {
    this.cardProvider.getCards(this.authService.userInfo['CpfCnpj']).then((result) =>{
      console.log(result);
      this.cards = result;
      
    });
    
  }

  openCard(card) {
    console.log(card);
    this.navCtrl.push(CardPage, {card: card});
  }

}
