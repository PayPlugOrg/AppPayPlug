import { AuthServiceProvider } from '../../providers/auth-service/auth-service';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AlertServiceProvider } from '../../providers/alert-service/alert-service';

/**
 * Generated class for the RegisterPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-register',
  templateUrl: 'register.html',
})
export class RegisterPage {

  loading: any;
  user = {nome:'', nascimento:'', email:'', celular:'', indicacao:'', documento:'', tipo_documento:'CPF'}

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    private authService: AuthServiceProvider,
    private alertService: AlertServiceProvider
  ) {
    this.authService.getSessionToken();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad RegisterPage');
  }

  changeLabel(value) {
    this.user.tipo_documento = value;
  }

  doSignup() {
    this.alertService.showLoader('Registrando usuário...');
    this.authService.register(this.user, 'criacao').then((result) => {
      this.alertService.loading.dismiss();
      this.alertService.presentToast(result);
      this.navCtrl.popToRoot();
    }, (err) => {
      this.alertService.loading.dismiss();
      this.alertService.presentToast(err);
    });
  }

}
