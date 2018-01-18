import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ModalController } from 'ionic-angular/components/modal/modal-controller';
import { BillingIdentificationPage } from '../billing-identification/billing-identification';
import { AuthServiceProvider } from '../../providers/auth-service/auth-service';
import { AlertServiceProvider } from '../../providers/alert-service/alert-service';
import { AlertController } from 'ionic-angular/components/alert/alert-controller';
import { Slides } from 'ionic-angular';
import { ReceiptPage } from '../receipt/receipt';

/**
 * Generated class for the BillingAuthorizationPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-billing-authorization',
  templateUrl: 'billing-authorization.html',
})
export class BillingAuthorizationPage {
  @ViewChild(Slides) slides: Slides;

  private showBillingValue: string = "";
  private rawBillingValue: string = "";
  private identification: string = "";
  private name: string = "";
  private numbers: Array<{value:number}>;
  private password: string = "";
  private testRadioOpen: boolean;
  private testRadioResult: any;
  private parcela:number = 1;
  private bloqueado: boolean = false;
  private cards: Array<{}> = new Array;
  private passwordLabel: string = "Senha de Liberação";
  
  private slideOptions = {
    pager: true
  }

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public modalCtrl: ModalController,
    public authProvider: AuthServiceProvider,
    public alertProv: AlertServiceProvider,
    public alertCtrl: AlertController
  ) {
    this.showBillingValue = navParams.get('billingValue');
    this.rawBillingValue = navParams.get('rawBillingValue');
    if(navParams.get('openModalIdentification')){
      this.displayIdentificationModal();
    } else  {
      this.getUserInfoByCard(navParams.get('payplugCard'));
    }
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

  private displayIdentificationModal() {
    let identificationModal = this.modalCtrl.create(BillingIdentificationPage, {billingValue: this.showBillingValue});
    identificationModal.onDidDismiss(data => {
      if(data['success'] == false) {
        this.alertProv.presentToast('Nenhum usuário encontrado com ' + data['identification']);
        this.identification = data['identification'];
        this.name = "";
        this.password = "";
      } else {
        this.identification = data['identification'];
        this.bloqueado = data['bloqueado'];
        this.name = data['name'];
        this.password = "";
      }
      this.getCards();
    });
    identificationModal.present();
  }

  private getCards() {
    this.cards = new Array;
      this.authProvider.getCards(this.identification).then((result) => {
        let i: number = 0;

        for(i=0; i < Object.keys(result).length ; i++) {
          
          var card = {
            idCartao: result[i]['Id'],
            idUsuario: result[i]['IdUsuario'],
            tipoCartao: result[i]['TipoCartao'],
            numero: result[i]['Numero'],
            bandeira: result[i]['Bandeira'],
            mediaUrl: ''
          }
          
          if(result[i]['Bandeira'] == 'Visa') {
            card.mediaUrl = 'https://banco.payplug.org/Content/img/icon_cards/Visa.png';
          } else if(result[i]['Bandeira'] == 'MasterCard') {
            card.mediaUrl = 'https://banco.payplug.org/Content/img/icon_cards/MasterCard.png';
          } else if(result[i]['Bandeira'] == '') {
            card.mediaUrl = 'https://banco.payplug.org/Content/img/icon_cards/PayPlug.png';
          } else if(result[i]['Bandeira'] == 'Amex') {
            card.mediaUrl = 'https://banco.payplug.org/Content/img/icon_cards/Amex.png';
          } else if(result[i]['Bandeira'] == 'Bitcoin') {
            card.mediaUrl = 'https://banco.payplug.org/Content/img/icon_cards/Bitcoin.png';
          }

          this.cards.push(card);
        }
        var newCard = {
          mediaUrl : "../assets/imgs/credit-card.png",
          numero : "",
          tipoCartao : "Novo Cartão"
        }
        this.cards.push(newCard)
      }, (err) => {
        console.log("erro: " + err);
        //this.alertProv.showLoader(err);
        this.alertProv.presentToast(err);
      });
  }

  private getUserInfoByCard(identification) {
    this.authProvider.getUserInfo(identification).then((result) =>{
      this.name = result['Nome'];
      this.identification = identification;
      this.bloqueado = result['IsBloqueado'];
      this.getCards();
    });
  }

  clearPasswordInput() {
    this.password = "";
    this.numbers.sort(() => Math.random() * 2 - 1);
  }

  private pressedButton(buttonValue: string) {
    this.password = this.password.concat(buttonValue);
  }

  showRadio() {
    let alert = this.alertCtrl.create();
    alert.setTitle('Parcelamento');

    alert.addInput({
      type: 'radio',
      label: '1',
      value: '1',
      checked: true
    });
    let i;
    for(i=2 ; i < 10 ; i++) {
      alert.addInput({
        type: 'radio',
        label: i,
        value: i
      });
    }

    alert.addButton('Cancelar');
    alert.addButton({
      text: 'OK',
      handler: data => {
        this.testRadioOpen = false;
        this.testRadioResult = data;
      }
    });
    alert.present();
  }

  newCardModal() {
    let currentIndex = this.slides.getActiveIndex();
    console.log('Current index is', currentIndex);
  }

  changePasswordLabel() {
    let currentIndex: number = this.slides.getActiveIndex();
    let cartao = this.cards[currentIndex];
    console.log('change password label Current index is', currentIndex);
    console.log('idCartao', cartao['idCartao']);
    
    if(cartao['bandeira'] == "") {
      this.passwordLabel = 'Senha de Liberação'
    } else {
      this.passwordLabel = 'CVV do Cartão';
    }
  }

  doBilling() {
    var index: number = this.slides.getActiveIndex();
    var cartao = this.cards[index];
    console.log(this.showBillingValue);
    var billingValue = this.showBillingValue.replace('.','');
    billingValue = this.showBillingValue.replace(',','');
    console.log(billingValue);
    if(this.password == "") {
      if(cartao['bandeira'] == '') {
        this.alert('Senha em branco!', 'Informe sua senha de liberação PayPlug para realizar a transação.');
      } else {
        this.alert('CVV em branco!', 'Informe o código de verificação do seu cartão para realizar a transação.');
      }
    } else {this.authProvider.doBilling(cartao['idCartao'], billingValue, this.password).then((result) => {
        console.log(result);
        console.log(result['Message']);
        if(result['Message'] == 'Ok') {
          let receiptModal = this.modalCtrl.create(ReceiptPage, {identifier:result['Identifier']});
          receiptModal.present();
        } else if(result['Message'] == 'usuarios não podem ser os mesmos.'){
          this.alert('Transação Inválida!', 'Usuários não podem ser os mesmos. Tente novamente.')
          this.navCtrl.pop();
        }

      }, (err) => {
        console.log(err);
        this.alertProv.presentToast(err);
      });
    }

  }

  private alert(title, subTitle) {
    let alert = this.alertCtrl.create({
      title: title,
      subTitle: subTitle,
      buttons: ['OK']
    });
    alert.present();
  }
}
