import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AuthServiceProvider } from '../../providers/auth-service/auth-service';
import { ViewController } from 'ionic-angular/navigation/view-controller';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import { AlertServiceProvider } from '../../providers/alert-service/alert-service';

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

  private createdCode = null;
  private card = {};

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    private authService:AuthServiceProvider,
    private viewCtrl: ViewController,
    private barcodeScanner: BarcodeScanner,
    private alertService: AlertServiceProvider
  ) {
    this.card = this.navParams.get('card');
    let code = Number(this.card['idCartao'].length + this.card['idCartao'] + localStorage.getItem('card-' + this.card['idCartao']));
    console.log(code);
    this.createQR(code.toString(16));
  }

  createQR(numeroCartao: string) {
    console.log("Numero cartao: " + numeroCartao);
    this.createdCode = numeroCartao;
  }

  scan() {
    this.barcodeScanner.scan().then((barcodeData) => {
      this.alertService.presentToast(barcodeData.text);
    },(err) => {
      console.error(err);
      this.alertService.presentToast(err);
    })
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

}
