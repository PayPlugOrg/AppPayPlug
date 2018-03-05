import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ViewController } from 'ionic-angular/navigation/view-controller';
import { AuthServiceProvider } from '../../providers/auth-service/auth-service';
import { AlertServiceProvider } from '../../providers/alert-service/alert-service';
import { HomePage } from '../home/home';
import { SocialSharing } from '@ionic-native/social-sharing';
import domtoimage from 'dom-to-image';

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
    Authentication: '',
    ClientCard: '',
    ClientCardFlag: '',
    ClientCardType: '',
    ClientName: '',
    CurrencyValueReal: '',
    CurrencyValueUser: '',
    Description: '',
    Situation: '',
    Store: '',
    SymbolCurrencyReal: '',
    SymbolCurrencyUser: '',
    TransactionDate: ''
  }

  constructor(
    public navCtrl: NavController,
    public viewCtrl: ViewController,
    public navParams: NavParams,
    public authService: AuthServiceProvider,
    public alertProvider: AlertServiceProvider,
    private socialSharing: SocialSharing
  ) {
    this.identifier = navParams.get('identifier');
  }

  ionViewWillEnter() {
    this.authService.getReceipt(this.identifier).then((result) => {
      if (result['Success'] == false) {
        let alert = '';
      } else {
        for (let o in result) {
          this.receipt[o] = result[o];
        }
        this.createQR(result['Authentication']);
      }
      this.alertProvider.loading.dismiss();
    }, (err) => {
      this.alertProvider.presentToast(err);
    });
  }

  createQR(numeroCartao: String) {
    this.createdCode = numeroCartao;
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

  send(share) {

    if (share == 'sms') {
      console.log(share);
      this.socialSharing.share(`Transacao PayPlug \n Autenticacao: ` +
        this.receipt.Authentication + `\nUsuario: `
        + this.receipt.ClientName + `\nValor: `
        + this.receipt.CurrencyValueUser + `\nData: `
        + this.receipt.TransactionDate
      );
      //this.socialSharing.shareViaSMS("PAYPLUG Test", "");


    } else if (share == 'wpp') {
      console.log(share);
      this.socialSharing.canShareVia('com.whatsapp').then((res) => {
        console.log(res);
        this.socialSharing.shareViaWhatsApp("PAYPLUG Test");
      }).catch((err) => {

        console.error(err);
      });
    } else if (share == 'mail') {
      console.log(share);
      this.socialSharing.canShareViaEmail().then(() => {
        // Sharing via email is possible
        this.socialSharing.shareViaEmail('Body', 'Subject', ['recipient@example.org']).then(() => {
          // Success!
        }).catch((err) => {
          // Error!
          console.error(err);
        });
      }).catch(() => {
        // Sharing via email is not possible
      });
    } else if (share == 'face') {
      // console.log(share);
      // this.socialSharing.canShareVia('com.facebook.facebook').then((res) => {
      //   console.log(res);
      //   this.socialSharing.shareViaFacebook("PAYPLUG Test");
      // }).catch((err) => {
      //   console.error(err);

      // });

      var node = document.getElementById('my-node');
      var img: any;
      domtoimage.toPng(node)
        .then(function (dataUrl) {
          img = new Image();
          console.log(dataUrl);
          img.src = dataUrl;
          document.body.appendChild(img);
        })
        .catch(function (error) {
          console.error('oops, something went wrong!', error);
        });
        console.log(img.src);
        this.socialSharing.share(img.src);
    }
  }

}
