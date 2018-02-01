import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { AuthServiceProvider } from '../../providers/auth-service/auth-service';
import { HomePage } from '../home/home';
import { RegisterPage } from '../register/register';
import { AlertServiceProvider } from '../../providers/alert-service/alert-service';
import { ActivationPage } from '../activation/activation';
/**
 * Generated class for the LoginPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
  loading: any;
  user = { nome: '', senha: ''};
  data: any;
  isLoggedIn: boolean = false;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public authService: AuthServiceProvider,
    private alertService: AlertServiceProvider
  ) {
    this.user['nome'] = localStorage.getItem("login");
    //Se há token de sessão direciona para o Home do usuário
    if(localStorage.getItem("token")) {
      navCtrl.setRoot(HomePage);
      this.alertService.enableMenu(true, 'authenticated');
      this.alertService.enableMenu(false, 'unauthenticated');
    } else {
      this.alertService.enableMenu(true, 'anauthenticated');
      this.alertService.enableMenu(false, 'authenticated');
      this.isLoggedIn = true;
    }
  }

  ionViewDidLoad() {
    this.user.nome = localStorage.getItem("login");
    console.log('ionViewDidLoad LoginPage');
  }

  doLogin() {
    this.alertService.showLoader('Validando acesso...');
    this.authService.login(this.user).then((result) => {
      this.alertService.loading.dismiss();
      this.data = result;
      if(this.data) {
        localStorage.setItem('token', this.data.Token);
        localStorage.setItem('login', this.user['nome']);
        this.authService.getUserData();
        this.navCtrl.setRoot(HomePage);
      }
    }, (err) => {
      this.alertService.loading.dismiss();
      this.alertService.presentToast(err);
    });
  }

  register() {
    this.navCtrl.push(RegisterPage);
  }

  activation() {
    this.navCtrl.push(ActivationPage);
  }

}
