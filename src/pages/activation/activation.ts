import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AuthServiceProvider } from '../../providers/auth-service/auth-service';
import { AlertServiceProvider } from '../../providers/alert-service/alert-service';

/**
 * Generated class for the ActivationPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-activation',
  templateUrl: 'activation.html',
})
export class ActivationPage {

  user = {documento:'', codigo:'', senha:''}

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    private authService: AuthServiceProvider,
    private alertService: AlertServiceProvider
  ) {
    this.authService.getSessionToken();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ActivationPage');
  }

  doActivation() {
    this.alertService.showLoader('Ativando usuário...');
    this.authService.register(this.user, 'ativacao').then((result) => {
      console.log(result);
      this.alertService.loading.dismiss();
      this.alertService.presentToast(result);
      this.navCtrl.popToRoot();
    }, (err) => {
      console.error(err);
      this.alertService.loading.dismiss();
      this.alertService.presentToast(err);
    });
  }

}
