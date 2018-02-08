import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ModalController } from 'ionic-angular/components/modal/modal-controller';
import { BillingIdentificationPage } from '../billing-identification/billing-identification';
import { AuthServiceProvider } from '../../providers/auth-service/auth-service';
import { AlertServiceProvider } from '../../providers/alert-service/alert-service';
import { AlertController } from 'ionic-angular/components/alert/alert-controller';
import { Slides } from 'ionic-angular';
import { ReceiptPage } from '../receipt/receipt';
import { CardNewPage } from '../card-new/card-new';
import { CardServiceProvider } from '../../providers/card/card-service';
import { LoginPage } from '../login/login';

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
  public information = {identification:"", success:false,name:"", bloqueado:false};
  private billedId: string = "";
  private name: string = "";
  private numbers: Array<{value:number}>;
  private password: string = "";
  private testRadioOpen: boolean;
  private testRadioResult: any;
  private parcela:number = 1;
  private bloqueado: boolean = false;
  private cards: any;
  private passwordLabel: string = "Senha de Liberação";
  public operation: string = " ";
  
  private slideOptions = {
    pager: true
  }

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public modalCtrl: ModalController,
    public authProvider: AuthServiceProvider,
    public alertProv: AlertServiceProvider,
    public alertCtrl: AlertController,
    public cardProvider: CardServiceProvider
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
    
    this.showBillingValue = navParams.get('billingValue');
    this.rawBillingValue = navParams.get('rawBillingValue');

    //Verifica se procedimento de cobrança vem com a entrada manual da identificação do usuário
    if(navParams.get('openModalIdentification')){
      this.displayIdentificationModal();
      this.operation = this.navParams.get('operation');
    } 
    //Ou se vem da captura de informação do cartão
    else if(navParams.get('payplugCard')) {
      this.getUserInfoByCard(navParams.get('payplugCard'));
    }
    this.clearPasswordInput();
  }

  ionViewWillEnter() {
    console.log('ionViewWillEnter');
    if(this.navParams.get('userInfo')) {
      this.information = this.navParams.get('userInfo');
      this.operation = this.navParams.get('operation');
      //this.getCards();
    }
  }

  private displayIdentificationModal() {
    this.cards = new Array;
    let identificationModal = this.modalCtrl.create(BillingIdentificationPage, {billingValue: this.showBillingValue, operation: this.navParams.get('operation')});
    identificationModal.onDidDismiss(data => {
      if(data['success'] == false) {
        this.alertProv.presentToast('Nenhum usuário encontrado com ' + data['identification']);
        this.identification = data['identification'];
        this.information.name = "";
        this.password = "";

        //Verifica se o usuário clicou botão 'Cancelar'
        if(data['cancel']) {
          this.navCtrl.pop();
        }
      } else {
        this.information = data;
        console.log('Information');
        console.log(this.information);
        this.identification = data['identification'];
        this.bloqueado = data['bloqueado'];
        this.name = data['name'];
        this.password = "";
        this.getCards();
      }
    });
    identificationModal.present();
  }

  private getCards() {
    this.cardProvider.getCards(this.information.identification).then((result) =>{
      
      this.cards = result;
      this.billedId = this.cards[0]['idUsuario'];

      var newCard = {
        mediaUrl : "assets/imgs/credit-card.png",
        numero : "",
        tipoCartao : "Novo Cartão"
      }
      this.cards.push(newCard);
      
    });

    
  }

  private getUserInfoByCard(identification) {
    this.authProvider.getUserInfo(identification).then((result) =>{
      this.information.name = result['Nome'];
      this.information.identification = identification;
      this.information.bloqueado = result['IsBloqueado'];
      this.getCards();
    },(err) => {
      console.log(err);
      if(err == 'Authentication failed.') {
        this.navCtrl.setRoot(LoginPage);
      }
    });
  }

  clearPasswordInput() {
    this.password = "";
    this.numbers.sort(() => Math.random() * 2 - 1);
  }

  pressedButton(buttonValue: string) {
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
    
    let newCard = this.modalCtrl.create(CardNewPage, {billedId:this.billedId});
    newCard.onDidDismiss( data => {
      
      this.getCards();
    });
    newCard.present();
  }

  changePasswordLabel() {
    let currentIndex: number = this.slides.getActiveIndex();
    let cartao = this.cards[currentIndex];
    //console.log('change password label Current index is', currentIndex);
    //console.log('idCartao', cartao['idCartao']);
    
    if(cartao['bandeira'] == "PayPlug") {
      this.passwordLabel = 'Senha de Liberação'
    } else {
      this.passwordLabel = 'CVV do Cartão';
    }
  }

  doTransfer() {
    console.log('Transfer');
    var billingValue = this.showBillingValue.replace('.','');
    billingValue = this.showBillingValue.replace(',','');

    if(this.password.length < 6) {
      this.alert('Senha pequena demais!', 'Informe sua senha de liberação PayPlug para realizar a transação. Ela deverá ter 6 dígitos.');
      this.clearPasswordInput();
    } else {
      this.authProvider.doTransfer(this.information.identification,billingValue,this.password).then((result) => {
        console.log(result);
        if(result['Success']) {
          this.alert('Transferência realizada com Sucesso!', 'Sua transferência foi realizada. Para verificar mais informações, vá até a tela de Extrato.')
          this.navCtrl.pop();
        } else if(result['Message'] == '[FROM] and [TO] user cannot be the same.'){
          this.alert('Transação Inválida!', 'Usuários não podem ser os mesmos. Tente novamente.')
          this.navCtrl.pop();
        } else if(result['Message'] == 'Check the value of field liberationPassword') {
          this.alert('Senha Inválida','Verifique sua senha.');
          this.clearPasswordInput();
        } else if(result['Message'] == '[TO] invalid user.') {
          this.alert('Usuário Inválido','Usuário destino da trânsferência é Terminal de Venda. Não é possível realizar a transferência.');
          this.clearPasswordInput();
          this.navCtrl.pop();
        } else if(result['Message'] == 'Operação não realizada! Para Vendas use a tela de Cobrança.') {
          this.alert('Usuário Inválido','Usuário origem da trânsferência é Terminal de Venda. Não é possível realizar a transferência.');
          this.clearPasswordInput();
          this.navCtrl.pop();
        } 
      },(err) => {
        console.error(err);
      })
    }
  }

  doBilling() {
    var index: number = this.slides.getActiveIndex();
    var cartao = this.cards[index];
    
    var billingValue = this.showBillingValue.replace('.','');
    billingValue = this.showBillingValue.replace(',','');
    
    if(this.password == "") {
      if(cartao['bandeira'] == '') {
        this.alert('Senha em branco!', 'Informe sua senha de liberação PayPlug para realizar a transação.');
      } else {
        this.alert('CVV em branco!', 'Informe o código de verificação do seu cartão para realizar a transação.');
      }
    } else {
      this.authProvider.doBilling(cartao['idCartao'], billingValue, this.password).then((result) => {
        
        //result['Message'] = 'Ok';
        
        if(result['Message'] == 'Ok') {
          //this.navCtrl.push(ReceiptPage, {identifier:result['Identifier']});
          let receiptModal = this.modalCtrl.create(ReceiptPage, {identifier:result['Identifier']}); //result['Identifier'] '5510'
          receiptModal.onDidDismiss(() => {
            this.navCtrl.popToRoot();
          })
          receiptModal.present();
        } else if(result['Message'] == 'usuarios não podem ser os mesmos.'){
          this.alert('Transação Inválida!', 'Usuários não podem ser os mesmos. Tente novamente.')
          this.navCtrl.pop();
        } else if(result['Message'] == 'Senha inválida.') {
          this.alert('Senha Inválida','Verifique sua senha.');
          this.clearPasswordInput();
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
