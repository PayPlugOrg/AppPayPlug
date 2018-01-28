import { Component } from '@angular/core';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import { QRScanner, QRScannerStatus } from '@ionic-native/qr-scanner';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';
import { AlertServiceProvider } from '../../providers/alert-service/alert-service';
import { CardPage } from '../../pages/card/card';
import { AuthServiceProvider } from '../../providers/auth-service/auth-service';
import { CardListPage } from '../card-list/card-list';

/**
 * Generated class for the PaymentPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-payment',
  templateUrl: 'payment.html',
})
export class PaymentPage {

  private password: string = "";
  private errorCount: number = 0;
  private numbers: Array<{value:number}>;
  constructor(
    public navCtrl: NavController,
    public modalCtrl: ModalController, 
    public navParams: NavParams,
    public alertService: AlertServiceProvider,
    private barcodeScanner: BarcodeScanner,
    public qrScanner: QRScanner,
    public authService: AuthServiceProvider
  ) {
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
    console.log('ionViewDidLoad PaymentPage');
  }

  qrscanner() {
    // Optionally request the permission early
    this.qrScanner.prepare()
      .then((status: QRScannerStatus) => {
        if (status.authorized) {
          // camera permission was granted
          //alert('authorized');

          // start scanning
          let scanSub = this.qrScanner.scan().subscribe((text: string) => {
            console.log('Scanned something', text);
          // alert(text);
            this.qrScanner.hide(); // hide camera preview
            scanSub.unsubscribe(); // stop scanning
            this.navCtrl.pop();
          });

          this.qrScanner.resumePreview();

          // show camera preview
          this.qrScanner.show()
          .then((data : QRScannerStatus)=> { 
            console.log('datashowing', data.showing);
            //alert(data.showing);
          },err => {
            //alert(err);

          });

          // wait for user to scan something, then the observable callback will be called

        } else if (status.denied) {
          alert('denied');
          // camera permission was permanently denied
          // you must use QRScanner.openSettings() method to guide the user to the settings page
          // then they can grant the permission from there
        } else {
          // permission was denied, but not permanently. You can ask for permission again at a later time.
          alert('else');
        }
      })
      .catch((e: any) => {
        alert('Error is' + e);
      });
  }

  scan() {

    this.barcodeScanner.scan().then((barcodeData) => {
      this.alertService.presentToast(barcodeData);
    });
    
  }

  presentCardModal() {
    let cardModal = this.modalCtrl.create(CardPage);
    cardModal.present();
  }

  pressedButton(buttonValue: string) {
    this.password = this.password.concat(buttonValue);
  }

  clearPasswordInput() {
    this.password = "";
    this.numbers.sort(() => Math.random() * 2 - 1);
  }

  private authenticate() {
    this.authService.paymentAuthenticate(this.password).then((result) => {
      console.log(result);
      if(result['Success']) {
        this.navCtrl.push(CardListPage);
      } else {
        
        this.errorCount = this.errorCount++;

        this.clearPasswordInput();
        let invalidSessionMessage = 'Sessão inválida.';
        let countErrorMessage = 'Senha incorreta. ' + this.errorCount + ' tentativas erradas de 4';

        let alert = this.alertService.alertCtrl.create({
          title:'Falha na autenticação!',
          subTitle: countErrorMessage,
          buttons:['Ok']
        });


        if(this.errorCount <= 4) {

          alert.setSubTitle('');

          if(result['Message']) {
            alert.setSubTitle('');
          }
          
        } else {
          alert.setSubTitle('Você errou sua senha 4 vezes. Todas as informações suas informações serão apagadas do celular.');
          localStorage.clear();
          this.authService.logout();
        }

        //Exibe o alerta de erro
        alert.present();
      }
    },(err) => {
      console.error(err);
    })
  }

}
