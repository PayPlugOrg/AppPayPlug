import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ViewController } from 'ionic-angular/navigation/view-controller';
import { AuthServiceProvider } from '../../providers/auth-service/auth-service';
import { AlertServiceProvider } from '../../providers/alert-service/alert-service';

/**
 * Generated class for the ReceiptPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-receipt',
  templateUrl: 'receipt.html',
})
export class ReceiptPage {

  private identifier: any;
  createdCode = null;
  receipt = {
    Authentication:'',
    ClientCard:'',
    ClientCardFlag:'',
    ClientCardType:'',
    ClientName:'',
    CurrencyValueReal:'',
    CurrencyValueUser:'',
    Description:'',
    Situation:'',
    Store:'',
    SymbolCurrencyReal:'',
    SymbolCurrencyUser:'',
    TransactionDate:''
  }

  constructor(
    public navCtrl: NavController,
    public viewCtrl: ViewController,
    public navParams: NavParams,
    public authService: AuthServiceProvider,
    public alertProvider: AlertServiceProvider
  ) {
    this.identifier = navParams.get('identifier');
    this.authService.getReceipt(this.identifier).then((result) => {
      console.log(result);
      if(result['Success'] == false) {
          let alert = '';
      } else {
        for(let o in result) {
          this.receipt[o] = result[o];
        }
        console.log(this.receipt);
        this.createQR(result['Authentication']);
      }
    },(err) => {
      console.log(err);
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ReceiptPage');
  }

  createQR(numeroCartao: String) {
    console.log("Numero cartao: " + numeroCartao);
    this.createdCode = numeroCartao;
  }

  private dismiss() {
    this.navCtrl.popToRoot();
  }

}