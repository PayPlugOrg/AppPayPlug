import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ViewController } from 'ionic-angular/navigation/view-controller';
import { AlertController } from 'ionic-angular/components/alert/alert-controller';
import { AuthServiceProvider } from '../../providers/auth-service/auth-service';

/**
 * Generated class for the BillingIdentificationPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-billing-identification',
  templateUrl: 'billing-identification.html',
})
export class BillingIdentificationPage {

  private identification: string = "";
  private showBillingValue: string = "";
  private parcela: number = 1;
  private testRadioOpen: boolean;
  private testRadioResult: any;
  
  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    private viewCtrl: ViewController,
    private alertCtrl: AlertController,
    public authService: AuthServiceProvider
  ) {
    this.showBillingValue = navParams.get('billingValue');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad BillingIdentificationPage');
  }

  dismiss() {
    var information = {identification:"", success:false,name:"", bloqueado:false};
    console.log("identification: " + this.identification);
    this.authService.getUserInfo(this.identification).then((result) => {
      information.success = result['Success'];
      information.name = result['Nome'];
      information.bloqueado = result['IsBloqueado'];
      information.identification = this.identification;
    });
    console.log(information);
    this.viewCtrl.dismiss(information);
  }

  cancel() {
    var information = {success: false, cancel: true};
    this.viewCtrl.dismiss(information);
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

}
