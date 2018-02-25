import { Component } from '@angular/core';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import { QRScanner, QRScannerStatus } from '@ionic-native/qr-scanner';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';
import { AlertServiceProvider } from '../../providers/alert-service/alert-service';
import { CardPage } from '../../pages/card/card';
import { AuthServiceProvider } from '../../providers/auth-service/auth-service';
import { LoginPage } from '../login/login';

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
  private message: string = "";
  private label: string = "";
  constructor(
    public navCtrl: NavController,
    public modalCtrl: ModalController, 
    public navParams: NavParams,
    public alertService: AlertServiceProvider,
    private barcodeScanner: BarcodeScanner,
    public qrScanner: QRScanner,
    public authService: AuthServiceProvider
  ) {
    this.message = navParams.get('message');
    this.label = navParams.get('label');
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

    //Se o usuário reinicia a tela de pagamento após errar, o aplicativo verifica o histórico de erro.
    if(localStorage.getItem('password-error-count')) {
      
      //Se três minutos se passaram desde a última vez que ele errou, o histórico de erro é apagado
      if(!this.checkErrorHistory()) { //Diferença em milisegundos
        this.errorCount = Number(localStorage.getItem('password-error-count'));
      }
    }

  }

  private qrscanner() {
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

  private scan() {

    this.barcodeScanner.scan().then((barcodeData) => {
      this.alertService.presentToast(barcodeData);
    });
    
  }

  private presentCardModal(page, param) {
    let cardModal = this.modalCtrl.create(page, param);
    cardModal.onDidDismiss(()=>{
      this.navCtrl.pop({animate: false});
    })
    cardModal.present();
  }

  private pressedButton(buttonValue: string) {
    this.password = this.password.concat(buttonValue);
  }

  private clearPasswordInput() {
    this.password = "";
    this.numbers.sort(() => Math.random() * 2 - 1);
  }

  private checkErrorHistory(): boolean {
    let passwordErrorTime: any = localStorage.getItem('password-error-time');
    let currentTime = Date.now();
    
    if(currentTime - passwordErrorTime > 180000) { //180000
      localStorage.removeItem('password-error-count');
      localStorage.removeItem('password-error-time');
      return true;
    }
    return false;
  }

  private authenticate() {
    
    //Verifica para qual página direcionar
    if(this.navParams.get('page') == 'CardListPage') {
      this.authService.paymentAuthenticate(this.password).then((result) => {
        //result['Success'] = true; //DEBUG: comentar quando for para produção
        if(result['Success']) {
          this.clearPasswordInput();
          this.navCtrl.push(this.navParams.get('page'));
        } else {

          //Sem ter reiniciado a tela de pagamento, se três minutos se passaram desde o último erro,
          //então o histórico é apagado também
          if(this.checkErrorHistory()) {
            this.errorCount = 0;
          }
          
          ++this.errorCount;

          this.clearPasswordInput();
          
          let countErrorMessage = 'Senha incorreta. ' + this.errorCount + ' tentativas erradas de 4. Aguarde 3 minutos para apagar o número de tentativas falhas.';

          //Cria um alerta genérico de Falha de autenticação.
          let alert = this.alertService.alertCtrl.create({
            title:'Falha na autenticação!',
            subTitle: '',
            buttons:['Ok']
          });

          //Se vier um campo de 'Message', o token expirou e a sessão é inválida. Deve fazer o logout
          if(result['Message']) {
            alert.setSubTitle('Sua sessão expirou. Faça login novamente.');
            alert.present();
            this.navCtrl.setRoot(LoginPage);
          }

          //Senão, alerta sobre erro de senha e contagem para exclusão de dados
          else if(this.errorCount <= 4) {
            alert.setSubTitle(countErrorMessage);
            localStorage.setItem('password-error-count', this.errorCount.toString());
            localStorage.setItem('password-error-time',Date.now().toString());
          } else {
            alert.setSubTitle('Você errou sua senha 4 vezes. Todas as informações da sua conta PayPlug foram apagadas do celular.');
            alert.present();
            localStorage.clear();
            this.navCtrl.setRoot(LoginPage);
          }

          //Exibe o alerta de erro
          alert.present();
        }
      },(err) => {
        console.error(err);
      })

    } else if(this.navParams.get('page') == 'CardPage') {
      let card = this.navParams.get('card');
      
      let alert = this.alertService.alertCtrl.create({
        title: 'Senha incorreta!',
        subTitle: '',
        buttons: ['Ok']
      });

      if(this.password.length < 6 && card['bandeira'] == 'PayPlug') {
        alert.setSubTitle('A senha liberação PayPlug deve ter 6 dígitos. Verifique e tente novamente.');
        alert.present();
      } else if(this.password.length < 4 && card['bandeira'] == 'Amex') {
        alert.setSubTitle('CVV Amex deve ter 4 dígitos. Verifique e tente novamente.');
        alert.present();
      } else if(this.password.length < 3) {
        alert.setSubTitle('CVV do cartão escolhido deve ter 3 dígitos. Verifique e tente novamente.');
        alert.present();
      } else {
        localStorage.setItem('card-' + card['idCartao'],this.password);

        //this.navCtrl.push(this.navParams.get('page'), {card:card});
        this.presentCardModal(this.navParams.get('page'),{card:card});
        
        this.clearPasswordInput();
      }
    }
    
  }

}
